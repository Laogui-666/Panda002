'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, CheckCheck, X, ExternalLink, Clock } from 'lucide-react';
import { formatDistanceToNow } from '@/lib/utils';

interface Notification {
  id: number;
  type: string;
  title: string;
  content: string;
  link?: string;
  isRead: boolean;
  priority: string;
  createdAt: string;
  order?: {
    id: number;
    orderNo: string;
    visaCountry: string;
    customer?: { name: string };
  };
}

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // 获取通知列表
  const fetchNotifications = useCallback(async (reset = false) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('erp_token');
      const response = await fetch(
        `/api/erp/notifications?page=${reset ? 1 : page}&pageSize=10`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const result = await response.json();
      
      if (result.success) {
        if (reset) {
          setNotifications(result.data.list);
        } else {
          setNotifications(prev => [...prev, ...result.data.list]);
        }
        setUnreadCount(result.data.unreadCount);
        setHasMore(result.data.pagination.page < result.data.pagination.totalPages);
      }
    } catch (error) {
      console.error('获取通知失败:', error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchNotifications(true);
  }, [fetchNotifications]);

  // 定时刷新通知
  useEffect(() => {
    const interval = setInterval(() => {
      fetchNotifications(true);
    }, 30000);
    
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // 标记单条已读
  const markAsRead = async (id: number) => {
    try {
      const token = localStorage.getItem('erp_token');
      const response = await fetch('/api/erp/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });
      const result = await response.json();
      
      if (result.success) {
        setNotifications(prev =>
          prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('标记已读失败:', error);
    }
  };

  // 全部已读
  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('erp_token');
      const response = await fetch('/api/erp/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: 'readAll' }),
      });
      const result = await response.json();
      
      if (result.success) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('标记全部已读失败:', error);
    }
  };

  // 加载更多
  const loadMore = () => {
    setPage(prev => prev + 1);
    fetchNotifications();
  };

  // 获取通知类型图标
  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      NEW_ORDER: '📋',
      ORDER_ACCEPTED: '✅',
      DOC_UPLOADED: '📤',
      DOC_APPROVED: '✓',
      DOC_REJECTED: '✗',
      DOC_NEED_MORE: '📝',
      ORDER_SUBMITTED: '📨',
      ORDER_IN_REVIEW: '🔍',
      MATERIAL_READY: '📦',
      ORDER_DELIVERED: '📬',
      ORDER_APPROVED: '🎉',
      ORDER_REJECTED: '❌',
      APPOINTMENT_REMINDER: '⏰',
      SYSTEM_MESSAGE: 'ℹ️',
    };
    return icons[type] || '📌';
  };

  // 获取通知类型颜色
  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      NEW_ORDER: 'bg-blue-100 text-blue-600',
      ORDER_ACCEPTED: 'bg-green-100 text-green-600',
      DOC_APPROVED: 'bg-green-100 text-green-600',
      DOC_REJECTED: 'bg-red-100 text-red-600',
      ORDER_APPROVED: 'bg-emerald-100 text-emerald-600',
      ORDER_REJECTED: 'bg-red-100 text-red-600',
      ORDER_DELIVERED: 'bg-indigo-100 text-indigo-600',
    };
    return colors[type] || 'bg-slate-100 text-slate-600';
  };

  return (
    <div className="relative">
      {/* 通知按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* 通知面板 */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 背景遮罩 */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* 面板 */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 top-full mt-2 w-96 max-h-[calc(100vh-200px)] bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden"
            >
              {/* 头部 */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-cyan-600" />
                  <h3 className="font-semibold text-slate-800">通知中心</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-xs font-medium text-white bg-red-500 rounded-full">
                      {unreadCount} 未读
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="flex items-center gap-1 px-2 py-1 text-xs text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                    >
                      <CheckCheck className="w-4 h-4" />
                      全部已读
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* 通知列表 */}
              <div className="overflow-y-auto max-h-[400px]">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                    <Bell className="w-12 h-12 mb-3 opacity-30" />
                    <p>暂无通知</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`relative px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer ${
                          !notification.isRead ? 'bg-cyan-50/50' : ''
                        }`}
                        onClick={() => {
                          markAsRead(notification.id);
                          if (notification.link) {
                            window.location.href = notification.link;
                          }
                        }}
                      >
                        {/* 未读标记 */}
                        {!notification.isRead && (
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-500 rounded-full" />
                        )}
                        
                        <div className="flex items-start gap-3 pl-2">
                          {/* 类型图标 */}
                          <span className="text-xl">{getTypeIcon(notification.type)}</span>
                          
                          {/* 内容 */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className={`text-sm font-medium ${
                                !notification.isRead ? 'text-slate-800' : 'text-slate-600'
                              }`}>
                                {notification.title}
                              </h4>
                              {notification.priority === 'high' && (
                                <span className="px-1.5 py-0.5 text-xs font-medium text-red-600 bg-red-50 rounded">
                                  紧急
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-500 mt-0.5 line-clamp-2">
                              {notification.content}
                            </p>
                            <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400">
                              <Clock className="w-3 h-3" />
                              {formatDistanceToNow(new Date(notification.createdAt))}
                              {notification.order && (
                                <>
                                  <span>•</span>
                                  <span>{notification.order.orderNo}</span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* 操作 */}
                          {!notification.isRead && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              className="p-1 text-slate-400 hover:text-cyan-600 transition-colors"
                              title="标记已读"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 加载更多 */}
                {hasMore && notifications.length > 0 && (
                  <div className="px-4 py-3 border-t border-slate-200">
                    <button
                      onClick={loadMore}
                      disabled={loading}
                      className="w-full py-2 text-sm text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {loading ? '加载中...' : '加载更多'}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
