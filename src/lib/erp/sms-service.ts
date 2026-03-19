/**
 * 短信服务模块
 * 支持阿里云短信服务
 */
import prisma from '@/lib/erp/prisma';

interface SendSmsParams {
  phone: string;
  content: string;
  templateCode?: string;
  orderId?: number;
  userId?: number;
}

interface SendSmsResult {
  success: boolean;
  data?: {
    messageId: string;
    status: string;
  };
  error?: string;
}

// 短信服务类
class SmsService {
  private apiUrl: string;
  private accessKeyId: string;
  private accessKeySecret: string;
  private signName: string;

  constructor() {
    this.apiUrl = process.env.ALIYUN_SMS_API_URL || '';
    this.accessKeyId = process.env.ALIYUN_ACCESS_KEY_ID || '';
    this.accessKeySecret = process.env.ALIYUN_ACCESS_KEY_SECRET || '';
    this.signName = process.env.ALIYUN_SMS_SIGN_NAME || '沐海旅行';
  }

  /**
   * 发送短信
   */
  async sendSms(params: SendSmsParams): Promise<SendSmsResult> {
    const { phone, content, templateCode, orderId, userId } = params;

    // 生成消息ID
    const messageId = `SMS_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // 创建发送记录
    const smsLog = await prisma.smsLog.create({
      data: {
        phone,
        templateCode,
        content,
        status: 'pending',
        orderId,
        userId,
      },
    });

    try {
      // 如果配置了阿里云短信API，则调用真实发送
      if (this.accessKeyId && this.accessKeySecret && this.apiUrl) {
        const result = await this.sendViaAliyun(phone, content, templateCode);
        
        if (result.success) {
          await prisma.smsLog.update({
            where: { id: smsLog.id },
            data: {
              status: 'sent',
              sentAt: new Date(),
            },
          });
        } else {
          await prisma.smsLog.update({
            where: { id: smsLog.id },
            data: {
              status: 'failed',
              errorMsg: result.error,
            },
          });
          return { success: false, error: result.error };
        }
      } else {
        // 模拟发送（开发环境）
        console.log(`[模拟短信] 发送到 ${phone}: ${content}`);
        
        // 模拟成功
        await prisma.smsLog.update({
          where: { id: smsLog.id },
          data: {
            status: 'sent',
            sentAt: new Date(),
          },
        });
      }

      return {
        success: true,
        data: {
          messageId,
          status: 'sent',
        },
      };
    } catch (error: any) {
      // 记录失败
      await prisma.smsLog.update({
        where: { id: smsLog.id },
        data: {
          status: 'failed',
          errorMsg: error.message,
        },
      });

      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * 通过阿里云短信API发送
   */
  private async sendViaAliyun(
    phone: string,
    content: string,
    templateCode?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // 阿里云短信API调用逻辑
      // 注意：实际生产环境中需要使用阿里云SDK进行签名等安全处理
      
      const timestamp = new Date().toISOString();
      
      // 构建请求参数
      const params: Record<string, string> = {
        AccessKeyId: this.accessKeyId,
        SignatureMethod: 'HMAC-SHA1',
        SignatureVersion: '1.0',
        SignatureNonce: Math.random().toString(36).substr(2),
        Timestamp: timestamp,
        Format: 'JSON',
        Action: 'SendSms',
        Version: '2017-05-25',
        RegionId: 'cn-hangzhou',
        PhoneNumbers: phone,
        SignName: this.signName,
        TemplateCode: templateCode || 'SMS_DEFAULT',
        TemplateParam: JSON.stringify({ content }),
      };

      // 添加签名（简化版，实际需要HMAC-SHA1签名）
      // 此处省略签名过程，实际使用时需要参考阿里云官方文档

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(params).toString(),
      });

      const result = await response.json();

      if (result.Code === 'OK') {
        return { success: true };
      } else {
        return { success: false, error: result.Message || result.Code };
      }
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * 批量发送短信
   */
  async sendBatchSms(
    phones: string[],
    params: Omit<SendSmsParams, 'phone'>
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    const results = [];

    for (const phone of phones) {
      const result = await this.sendSms({
        ...params,
        phone,
      });
      results.push({ phone, ...result });
    }

    const successCount = results.filter((r) => r.success).length;

    return {
      success: true,
      data: {
        total: phones.length,
        successCount,
        failedCount: phones.length - successCount,
        results,
      },
    };
  }

  /**
   * 根据模板发送短信
   */
  async sendWithTemplate(
    phone: string,
    templateCode: string,
    variables: Record<string, string>,
    extras?: { orderId?: number; userId?: number }
  ): Promise<SendSmsResult> {
    // 获取模板
    const template = await prisma.smsTemplate.findUnique({
      where: { code: templateCode },
    });

    if (!template) {
      return { success: false, error: '短信模板不存在' };
    }

    if (!template.isActive) {
      return { success: false, error: '短信模板已禁用' };
    }

    // 渲染模板内容
    let content = template.content;
    for (const [key, value] of Object.entries(variables)) {
      content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }

    return this.sendSms({
      phone,
      content,
      templateCode,
      orderId: extras?.orderId,
      userId: extras?.userId,
    });
  }

  /**
   * 发送订单状态通知短信
   */
  async sendOrderStatusNotification(
    phone: string,
    orderNo: string,
    status: string,
    extras?: { orderId?: number; userId?: number }
  ): Promise<SendSmsResult> {
    // 查找对应的模板
    const templateMap: Record<string, string> = {
      CONNECTED: 'ORDER_ACCEPTED',
      COLLECTING_DOCS: 'DOC_UPLOAD_REMINDER',
      PENDING_REVIEW: 'DOC_SUBMITTED',
      UNDER_REVIEW: 'ORDER_IN_REVIEW',
      MAKING_MATERIALS: 'MATERIAL_IN_PROGRESS',
      PENDING_DELIVERY: 'DOC_READY',
      DELIVERED: 'ORDER_DELIVERED',
      APPROVED: 'ORDER_APPROVED',
      REJECTED: 'ORDER_REJECTED',
    };

    const templateCode = templateMap[status];
    
    if (!templateCode) {
      // 使用通用模板
      return this.sendSms({
        phone,
        content: `尊敬的客户，您的订单${orderNo}状态已更新为：${status}`,
        orderId: extras?.orderId,
        userId: extras?.userId,
      });
    }

    return this.sendWithTemplate(
      phone,
      templateCode,
      { orderNo, status },
      extras
    );
  }
}

// 导出单例
export const smsService = new SmsService();
