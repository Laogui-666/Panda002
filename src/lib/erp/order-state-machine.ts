/**
 * 订单状态机服务
 * 
 * 统一管理订单状态流转逻辑
 * 
 * 工作流:
 * PENDING_CONNECTION (待对接) 
 * → CONNECTED (已对接) 
 * → COLLECTING_DOCS (资料收集中) 
 * → PENDING_REVIEW (待审核) 
 * → UNDER_REVIEW (资料审核中) 
 * → MAKING_MATERIALS (材料制作中) 
 * → PENDING_DELIVERY (待交付) 
 * → DELIVERED (已交付) 
 * → APPROVED/REJECTED (出签/拒签)
 */

import { PrismaClient, OrderStatus, UserRole } from '@prisma/client';
import prisma from './prisma';

const prismaClient = new PrismaClient();

// 状态机配置
export const ORDER_STATUS_CONFIG: Record<OrderStatus, {
  label: string;
  color: string;
  next: OrderStatus[];
  prev?: OrderStatus[];
  roles: UserRole[];
}> = {
  [OrderStatus.PENDING_CONNECTION]: {
    label: '待对接',
    color: 'gray',
    next: [OrderStatus.CONNECTED],
    roles: [UserRole.COMPANY_OWNER, UserRole.DEPT_ADMIN, UserRole.OPERATOR],
  },
  [OrderStatus.CONNECTED]: {
    label: '已对接',
    color: 'blue',
    next: [OrderStatus.COLLECTING_DOCS, OrderStatus.PENDING_REVIEW],
    prev: [OrderStatus.PENDING_CONNECTION],
    roles: [UserRole.COMPANY_OWNER, UserRole.DEPT_ADMIN, UserRole.OPERATOR],
  },
  [OrderStatus.COLLECTING_DOCS]: {
    label: '资料收集中',
    color: 'cyan',
    next: [OrderStatus.PENDING_REVIEW],
    prev: [OrderStatus.CONNECTED],
    roles: [UserRole.COMPANY_OWNER, UserRole.DEPT_ADMIN, UserRole.OPERATOR],
  },
  [OrderStatus.PENDING_REVIEW]: {
    label: '待审核',
    color: 'yellow',
    next: [OrderStatus.UNDER_REVIEW, OrderStatus.COLLECTING_DOCS],
    prev: [OrderStatus.COLLECTING_DOCS, OrderStatus.CONNECTED],
    roles: [UserRole.COMPANY_OWNER, UserRole.DEPT_ADMIN, UserRole.OPERATOR],
  },
  [OrderStatus.UNDER_REVIEW]: {
    label: '资料审核中',
    color: 'orange',
    next: [OrderStatus.MAKING_MATERIALS, OrderStatus.COLLECTING_DOCS],
    prev: [OrderStatus.PENDING_REVIEW],
    roles: [UserRole.COMPANY_OWNER, UserRole.DEPT_ADMIN, UserRole.OPERATOR],
  },
  [OrderStatus.MAKING_MATERIALS]: {
    label: '材料制作中',
    color: 'purple',
    next: [OrderStatus.PENDING_DELIVERY],
    prev: [OrderStatus.UNDER_REVIEW],
    roles: [UserRole.COMPANY_OWNER, UserRole.DEPT_ADMIN, UserRole.OPERATOR],
  },
  [OrderStatus.PENDING_DELIVERY]: {
    label: '待交付',
    color: 'pink',
    next: [OrderStatus.DELIVERED],
    prev: [OrderStatus.MAKING_MATERIALS],
    roles: [UserRole.COMPANY_OWNER, UserRole.DEPT_ADMIN, UserRole.OPERATOR],
  },
  [OrderStatus.DELIVERED]: {
    label: '已交付',
    color: 'indigo',
    next: [OrderStatus.APPROVED, OrderStatus.REJECTED],
    prev: [OrderStatus.PENDING_DELIVERY],
    roles: [UserRole.COMPANY_OWNER, UserRole.DEPT_ADMIN, UserRole.OPERATOR, UserRole.CUSTOMER],
  },
  [OrderStatus.APPROVED]: {
    label: '出签',
    color: 'green',
    next: [],
    prev: [OrderStatus.DELIVERED],
    roles: [UserRole.COMPANY_OWNER, UserRole.DEPT_ADMIN, UserRole.OPERATOR, UserRole.CUSTOMER],
  },
  [OrderStatus.REJECTED]: {
    label: '拒签',
    color: 'red',
    next: [],
    prev: [OrderStatus.DELIVERED],
    roles: [UserRole.COMPANY_OWNER, UserRole.DEPT_ADMIN, UserRole.OPERATOR, UserRole.CUSTOMER],
  },
};

// 订单状态流转服务
export class OrderStateMachine {
  private prisma: PrismaClient;

  constructor(prismaInstance?: PrismaClient) {
    this.prisma = prismaInstance || prismaClient;
  }

  /**
   * 检查状态转换是否合法
   */
  canTransition(fromStatus: OrderStatus, toStatus: OrderStatus): boolean {
    const config = ORDER_STATUS_CONFIG[fromStatus];
    return config.next.includes(toStatus);
  }

  /**
   * 检查用户是否有权限执行该操作
   */
  canUserPerformAction(userRole: UserRole, fromStatus: OrderStatus): boolean {
    const config = ORDER_STATUS_CONFIG[fromStatus];
    return config.roles.includes(userRole);
  }

  /**
   * 获取下一步可执行的操作
   */
  getNextActions(currentStatus: OrderStatus): OrderStatus[] {
    return ORDER_STATUS_CONFIG[currentStatus].next;
  }

  /**
   * 执行状态转换
   */
  async transition(
    orderId: number,
    toStatus: OrderStatus,
    userId: number,
    options?: {
      remark?: string;
      rejectReason?: string;
      csId?: number;
      dcId?: number;
      opId?: number;
    }
  ) {
    // 获取当前订单
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error('订单不存在');
    }

    const fromStatus = order.status;

    // 检查状态转换是否合法
    if (!this.canTransition(fromStatus, toStatus)) {
      throw new Error(`不能从 ${ORDER_STATUS_CONFIG[fromStatus].label} 转换到 ${ORDER_STATUS_CONFIG[toStatus].label}`);
    }

    // 构建更新数据
    const updateData: any = {
      status: toStatus,
      updatedAt: new Date(),
    };

    // 设置时间戳
    if (toStatus === OrderStatus.DELIVERED) {
      updateData.deliveryDate = new Date();
    } else if (toStatus === OrderStatus.APPROVED || toStatus === OrderStatus.REJECTED) {
      updateData.resultDate = new Date();
    }

    // 处理拒签原因
    if (toStatus === OrderStatus.REJECTED && options?.rejectReason) {
      updateData.rejectReason = options.rejectReason;
    }

    // 分配人员
    if (options?.csId) updateData.csId = options.csId;
    if (options?.dcId) updateData.dcId = options.dcId;
    if (options?.opId) updateData.opId = options.opId;

    // 开启事务
    const result = await this.prisma.$transaction([
      // 更新订单状态
      this.prisma.order.update({
        where: { id: orderId },
        data: updateData,
      }),
      // 创建订单日志
      this.prisma.orderLog.create({
        data: {
          orderId,
          userId,
          action: 'STATUS_CHANGE',
          content: options?.remark || `状态变更为: ${ORDER_STATUS_CONFIG[toStatus].label}`,
          fromStatus,
          toStatus,
        },
      }),
    ]);

    return result[0];
  }

  /**
   * 创建新订单
   */
  async createOrder(
    data: {
      companyId: number;
      customerId: number;
      visaCountry: string;
      visaType: string;
      csId?: number;
      dcId?: number;
      opId?: number;
      departmentId?: number;
      remark?: string;
      visaFee?: number;
      serviceFee?: number;
    },
    userId: number
  ) {
    // 生成订单号
    const orderNo = await this.generateOrderNo(data.companyId);

    // 开启事务
    const order = await this.prisma.$transaction(async (tx) => {
      // 创建订单
      const newOrder = await tx.order.create({
        data: {
          orderNo,
          companyId: data.companyId,
          customerId: data.customerId,
          visaCountry: data.visaCountry,
          visaType: data.visaType,
          status: OrderStatus.PENDING_CONNECTION,
          csId: data.csId,
          dcId: data.dcId,
          opId: data.opId,
          departmentId: data.departmentId,
          remark: data.remark,
          visaFee: data.visaFee,
          serviceFee: data.serviceFee,
          totalFee: (data.visaFee || 0) + (data.serviceFee || 0),
        },
      });

      // 创建订单日志
      await tx.orderLog.create({
        data: {
          orderId: newOrder.id,
          userId,
          action: 'CREATE_ORDER',
          content: '创建订单',
          fromStatus: null,
          toStatus: OrderStatus.PENDING_CONNECTION,
        },
      });

      return newOrder;
    });

    return order;
  }

  /**
   * 生成订单号
   */
  private async generateOrderNo(companyId: number): Promise<string> {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `VH${dateStr}${random}`;
  }
}

// 导出单例
export const orderStateMachine = new OrderStateMachine();
