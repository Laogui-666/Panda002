'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Plus, 
  User, 
  Mail, 
  Phone, 
  Shield,
  Edit,
  Trash2,
  Key
} from 'lucide-react';

interface User {
  id: number;
  username: string;
  real_name: string;
  email?: string;
  phone?: string;
  role_name: string;
  status: 'active' | 'inactive';
  created_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    // 模拟数据
    const mockUsers: User[] = [
      { id: 1, username: 'admin', real_name: '系统管理员', email: 'admin@panda.com', phone: '13800138000', role_name: '公司负责人', status: 'active', created_at: '2024-01-01' },
      { id: 2, username: 'manager_zhang', real_name: '张经理', email: 'zhang@panda.com', phone: '13800138001', role_name: '业务部管理员', status: 'active', created_at: '2024-02-15' },
      { id: 3, username: 'operator_li', real_name: '李操作员', email: 'li@panda.com', phone: '13800138002', role_name: '业务部门操作员', status: 'active', created_at: '2024-03-10' },
      { id: 4, username: 'operator_wang', real_name: '王操作员', email: 'wang@panda.com', phone: '13800138003', role_name: '业务部门操作员', status: 'active', created_at: '2024-03-15' },
      { id: 5, username: 'outsource_zhao', real_name: '赵外包', email: 'zhao@example.com', phone: '13800138004', role_name: '外包业务员', status: 'inactive', created_at: '2024-04-01' },
    ];
    setUsers(mockUsers);
    setLoading(false);
  }, []);

  const filteredUsers = users.filter(user => {
    if (searchKeyword && !user.username.includes(searchKeyword) && !user.real_name.includes(searchKeyword)) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* 顶部操作栏 */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="搜索用户名、姓名..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
              />
            </div>
          </div>

          <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg flex items-center gap-2 text-sm hover:shadow-md transition-shadow">
            <Plus className="w-4 h-4" />
            新建用户
          </button>
        </div>
      </div>

      {/* 用户列表 */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-500">用户名</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-500">姓名</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-500">邮箱</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-500">电话</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-500">角色</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-500">状态</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-500">创建时间</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-500">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                    加载中...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                    暂无数据
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {user.real_name.charAt(0)}
                        </div>
                        <span className="font-medium text-slate-700">{user.username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700">{user.real_name}</td>
                    <td className="px-6 py-4 text-slate-600">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-400" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-400" />
                        {user.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                        <Shield className="w-3 h-3" />
                        {user.role_name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {user.status === 'active' ? '启用' : '禁用'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {user.created_at}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-cyan-600" title="编辑">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500" title="修改密码">
                          <Key className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-red-600" title="删除">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
