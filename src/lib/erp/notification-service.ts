/**
 * 通知服务
 * 
 * 在工作流中发送通知消息
 */

import prisma from './prisma';
import { NotificationType } from '@prisma/client';

// 通知标题和内容模板
const NOTIFICATION_TEMPLATES: Record<NotificationType, { title: string; getContent: (data: any) => string }> = {
  [NotificationType.NEW_ORDER]: {
    title: '新订单通知',
    getContent: (data) => `您有一个新订单，订单号：${data.orderNo}，签证国家：${data.visaCountry}，请及时处理。`,
  },
  [NotificationType.ORDER_ACCEPTED]: {
    title: '订单已接',
    getContent: (data) => `您的订单（${data.orderNo}）已被资料员 ${data.operatorName} 接单，稍后将与您联系。`,
  },
  [NotificationType.DOC_UPLOADED]: {
    title: '资料已上传',
    getContent: (data) => `客户已上传资料「${data.docName}」，请及时审核。`,
  },
  [NotificationType.DOC_APPROVED]: {
    title: '资料已合格',
    getContent: (data) => `您上传的资料「${data.docName}」已审核合格。`,
  },
  [NotificationType.DOC_REJECTED]: {
    title: '资料已打回',
    getContent: (data) => `您上传的资料「${data.docName}」需要修改，原因：${data.reason || '请查看详情'}`,
  },
  [NotificationType.DOC_NEED_MORE]: {
    title: '需要补充资料',
    getContent: (data) => `您的订单（${data.orderNo}）需要补充资料：${data.reason}`,
  },
  [NotificationType.ORDER_SUBMITTED]: {
    title: '已提交审核',
    getContent: (data) => `订单（${data.orderNo}）已提交审核，签证专员将尽快处理。`,
  },
  [NotificationType.ORDER_IN_REVIEW]: {
    title: '审核中',
    getContent: (data) => `您的订单（${data.orderNo}）正在审核中，请耐心等待。`,
  },
  [NotificationType.MATERIAL_READY]: {
    title: '材料已就绪',
    getContent: (data) => `您的签证材料已制作完成，即将交付。`,
  },
  [NotificationType.ORDER_DELIVERED]: {
    title: '已交付',
    getContent: (data) => `您的签证材料（订单${data.orderNo}）已交付，请查收。`,
  },
  [NotificationType.ORDER_APPROVED]: {
    title: '恭喜出签！',
    getContent: (data) => `恭喜！您的签证（订单${data.orderNo}）已通过审核，祝您旅途愉快！`,
  },
  [NotificationType.ORDER_REJECTED]: {
    title: '签证未通过',
    getContent: (data) => `很遗憾，您的签证（订单${data.orderNo}）未通过审核，原因：${data.reason || '请查看详情'}`,
  },
  [NotificationType.APPOINTMENT_REMINDER]: {
    title: '预约提醒',
    getContent: (data) => `您预约的${data.date} ${data.time || ''} ${data.location || '签证中心'}，请提前做好准备。`,
  },
  [NotificationType.SYSTEM_MESSAGE]: {
    title: '系统消息',
    getContent: (data) => data.message || '您有一条系统消息。',
  },
};

/**
 * 发送通知
 */
export async function sendNotification(
  userId: number,
  type: NotificationType,
  data: any,
  orderId?: number
) {
  const template = NOTIFICATION_TEMPLATES[type];
  
  const notification = await prisma.notification.create({
    data: {
      userId,
      type,
      title: template.title,
      content: template.getContent(data),
      link: orderId ? `/erp/orders/${orderId}` : undefined,
      priority: type.includes('REJECTED') ? 'high' : 'normal',
      orderId,
    },
  });

  return notification;
}

/**
 * 批量发送通知给多个用户
 */
export async function sendNotificationsToUsers(
  userIds: number[],
  type: NotificationType,
  data: any,
  orderId?: number
) {
  const template = NOTIFICATION_TEMPLATES[type];
  
  const notifications = await prisma.notification.createMany({
    data: userIds.map(userId => ({
      userId,
      type,
      title: template.title,
      content: template.getContent(data),
      link: orderId ? `/erp/orders/${orderId}` : undefined,
      priority: type.includes('REJECTED') ? 'high' : 'normal',
      orderId,
    })),
  });

  return notifications;
}

/**
 * 根据角色发送通知
 */
export async function sendNotificationByRole(
  role: string,
  companyId: number | null,
  type: NotificationType,
  data: any,
  orderId?: number
) {
  // 查找符合条件的用户
  const users = await prisma.user.findMany({
    where: {
      role: role as any,
      companyId,
      status: 'ACTIVE',
    },
    select: { id: true },
  });

  const userIds = users.map(u => u.id);
  
  if (userIds.length > 0) {
    await sendNotificationsToUsers(userIds, type, data, orderId);
  }

  return userIds.length;
}

/**
 * 订单状态变更时发送通知
 */
export async function notifyOrderStatusChange(
  orderId: number,
  orderNo: string,
  visaCountry: string,
  fromStatus: string,
  toStatus: string,
  relatedUserIds: number[]
) {
  const statusLabels: Record<string, string> = {
    PENDING_CONNECTION: '待对接',
    CONNECTED: '已对接',
    COLLECTING_DOCS: '资料收集中',
    PENDING_REVIEW: '待审核',
    UNDER_REVIEW: '资料审核中',
    MAKING_MATERIALS: '材料制作中',
    PENDING_DELIVERY: '待交付',
    DELIVERED: '已交付',
    APPROVED: '出签',
    REJECTED: '拒签',
  };

  const typeMap: Record<string, NotificationType> = {
    CONNECTED: NotificationType.ORDER_ACCEPTED,
    COLLECTING_DOCS: NotificationType.DOC_NEED_MORE,
    PENDING_REVIEW: NotificationType.ORDER_SUBMITTED,
    UNDER_REVIEW: NotificationType.ORDER_IN_REVIEW,
    MAKING_MATERIALS: NotificationType.MATERIAL_READY,
    PENDING_DELIVERY: NotificationType.MATERIAL_READY,
    DELIVERED: NotificationType.ORDER_DELIVERED,
    APPROVED: NotificationType.ORDER_APPROVED,
    REJECTED: NotificationType.ORDER_REJECTED,
  };

  const type = typeMap[toStatus];
  if (type) {
    await sendNotificationsToUsers(
      relatedUserIds,
      type,
      { orderNo, visaCountry, fromStatus: statusLabels[fromStatus], toStatus: statusLabels[toStatus] },
      orderId
    );
  }
}
