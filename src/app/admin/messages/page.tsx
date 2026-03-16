'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  MessageSquare, 
  Calendar, 
  AlertCircle,
  Check,
  Trash2,
  Settings,
  Send
} from 'lucide-react';

interface Message {
  id: number;
  title: string;
  content: string;
  type: 'system' | 'order' | 'appointment' | 'reminder';
  is_read: boolean;
  created_at: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    // 模拟数据
    const mockMessages: Message[] = [
      { id: 1, title: '新订单通知', content: '您有一个新的签证申请订单，请及时处理。', type: 'order', is_read: false, created_at: '2024-03-16 10:30:00' },
      { id: 2, title: '预约提醒', content: '客户张三的预约将于明天上午9:00开始。', type: 'appointment', is_read: false, created_at: '2024-03-16 09:00:00' },
      { id: 3, title: '资料审核通知', content: '客户李四的资料已通过审核。', type: 'system', is_read: true, created_at: '2024-03-15 15:20:00' },
      { id: 4, title: '系统更新公告', content: '系统将于今晚22:00进行维护更新。', type: 'system', is_read: true, created_at: '2024-03-15 14:00:00' },
      { id: 5, title: '订单状态变更', content: '订单VD202603160001状态已变更为"资料收集中"。', type: 'order', is_read: true, created_at: '2024-03-15 11:30:00' },
    ];
    setMessages(mockMessages);
    setLoading(false);
  }, []);

  const filteredMessages = messages.filter(msg => {
    if (filter === 'unread') return !msg.is_read;
    return true;
  });

  const unreadCount = messages.filter(m => !m.is_read).length;

  const getTypeIcon = (type: string) => {
    const config = {
      system: { icon: Settings, color: 'blue' },
      order: { icon: MessageSquare, color: 'green' },
      appointment: { icon: Calendar, color: 'purple' },
      reminder: { icon: Bell, color: 'orange' },
    };
    return config[type as keyof typeof config] || config.system;
  };

  const markAsRead = (id: number) => {
    setMessages(msgs => msgs.map(m => m.id === id ? { ...m, is_read: true } : m));
  };

  const markAllAsRead = () => {
    setMessages(msgs => msgs.map(m => ({ ...m, is_read: true })));
  };

  const deleteMessage = (id: number) => {
    setMessages(msgs => msgs.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* 顶部操作栏 */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-cyan-500 text-white' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              全部消息
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'unread' 
                  ? 'bg-cyan-500 text-white' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              未读消息
              {unreadCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 text-cyan-600 hover:bg-cyan-50 rounded-lg text-sm"
            >
              全部标为已读
            </button>
          )}
        </div>
      </div>

      {/* 消息列表 */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">加载中...</div>
        ) : filteredMessages.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            {filter === 'unread' ? '暂无未读消息' : '暂无消息'}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredMessages.map((message) => {
              const { icon: Icon, color } = getTypeIcon(message.type);
              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`p-4 hover:bg-slate-50 transition-colors ${
                    !message.is_read ? 'bg-cyan-50/50' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg bg-${color}-100`}>
                      <Icon className={`w-5 h-5 text-${color}-600`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-medium ${
                          !message.is_read ? 'text-slate-800' : 'text-slate-600'
                        }`}>
                          {message.title}
                        </h3>
                        {!message.is_read && (
                          <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 mt-1">{message.content}</p>
                      <p className="text-xs text-slate-400 mt-2">{message.created_at}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!message.is_read && (
                        <button
                          onClick={() => markAsRead(message.id)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
                          title="标为已读"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteMessage(message.id)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-red-500"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
