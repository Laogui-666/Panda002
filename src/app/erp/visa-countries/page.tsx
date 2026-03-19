'use client';

import { useState, useEffect } from 'react';
import { erpApi } from '@/lib/erp/api-client';
import { Plus, Edit2, Trash2, Search, Globe, X } from 'lucide-react';

interface VisaCountry {
  id: number;
  name: string;
  code: string;
  flag?: string;
  continent?: string;
  isActive: boolean;
  sortOrder: number;
  _count?: { visaLines: number };
}

export default function VisaCountriesPage() {
  const [countries, setCountries] = useState<VisaCountry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCountry, setEditingCountry] = useState<VisaCountry | null>(null);
  const [formData, setFormData] = useState({ name: '', code: '', flag: '', continent: '' });

  useEffect(() => { fetchCountries(); }, []);

  const fetchCountries = async () => {
    try {
      const data = await erpApi.get('/visa-countries');
      setCountries(data);
    } catch (error) {
      console.error('获取国家列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCountry) {
        await erpApi.put(`/visa-countries/${editingCountry.id}`, formData);
      } else {
        await erpApi.post('/visa-countries', formData);
      }
      setShowModal(false);
      setEditingCountry(null);
      setFormData({ name: '', code: '', flag: '', continent: '' });
      fetchCountries();
    } catch (error: any) {
      alert(error.message || '操作失败');
    }
  };

  const handleEdit = (country: VisaCountry) => {
    setEditingCountry(country);
    setFormData({ name: country.name, code: country.code, flag: country.flag || '', continent: country.continent || '' });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除该国家吗？')) return;
    try {
      await erpApi.delete(`/visa-countries/${id}`);
      fetchCountries();
    } catch (error: any) {
      alert(error.message || '删除失败');
    }
  };

  const handleToggleActive = async (country: VisaCountry) => {
    try {
      await erpApi.put(`/visa-countries/${country.id}`, { isActive: !country.isActive });
      fetchCountries();
    } catch (error) {
      console.error('更新状态失败:', error);
    }
  };

  const filteredCountries = countries.filter(c => c.name.includes(searchTerm) || c.code.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">签证国家管理</h1>
          <p className="text-sm text-slate-500 mt-1">管理可办理签证的国家</p>
        </div>
        <button onClick={() => { setEditingCountry(null); setFormData({ name: '', code: '', flag: '', continent: '' }); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors">
          <Plus className="w-4 h-4" />添加国家
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="搜索国家名称或代码..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">加载中...</div>
        ) : filteredCountries.length === 0 ? (
          <div className="p-8 text-center text-slate-500">{searchTerm ? '未找到匹配的国家' : '暂无国家数据'}</div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">国家信息</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">洲际</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">签证线路</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">状态</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredCountries.map((country) => (
                <tr key={country.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                        <Globe className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{country.name}</p>
                        <p className="text-sm text-slate-500">{country.code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{country.continent || '-'}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800">
                      {country._count?.visaLines || 0} 条线路
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleToggleActive(country)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${country.isActive ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-500'}`}>
                      {country.isActive ? '启用' : '禁用'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(country)} className="p-2 text-slate-400 hover:text-cyan-500 hover:bg-cyan-50 rounded-lg">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(country.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-800">{editingCountry ? '编辑国家' : '添加国家'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">国家名称 <span className="text-red-500">*</span></label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="如：日本" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">国家代码 <span className="text-red-500">*</span></label>
                <input type="text" required value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="如：JP" maxLength={10} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">所属洲</label>
                <select value={formData.continent} onChange={(e) => setFormData({ ...formData, continent: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500">
                  <option value="">请选择</option>
                  <option value="亚洲">亚洲</option>
                  <option value="欧洲">欧洲</option>
                  <option value="北美洲">北美洲</option>
                  <option value="南美洲">南美洲</option>
                  <option value="非洲">非洲</option>
                  <option value="大洋洲">大洋洲</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50">取消</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600">{editingCountry ? '保存' : '添加'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
