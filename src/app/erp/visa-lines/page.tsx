'use client';

import { useState, useEffect, useCallback } from 'react';
import { erpApi } from '@/lib/erp/api-client';
import { Plus, Edit2, Trash2, Search, Globe, Star, Clock, DollarSign, X, FileText } from 'lucide-react';

interface VisaCountry {
  id: number;
  name: string;
  code: string;
  continent?: string;
  isActive?: boolean;
}

interface VisaLine {
  id: number;
  name: string;
  category: string;
  visaType: string;
  entryType?: string;
  validityDays?: number;
  maxStayDays?: number;
  processingDays?: number;
  interview: boolean;
  invitation: boolean;
  visaFee?: number | string;
  serviceFee?: number | string;
  expressFee?: number | string;
  description?: string;
  requirements?: string;
  materials?: string;
  isActive: boolean;
  isPopular: boolean;
  country: VisaCountry;
  _count?: { documentReqs: number };
}

const CATEGORY_LABELS: Record<string, string> = {
  TOURISM: '旅游签证',
  BUSINESS: '商务签证',
  WORK: '工作签证',
  STUDY: '学生签证',
  TRANSIT: '过境签证',
  FAMILY: '探亲访友签证',
  OTHER: '其他签证'
};

const CATEGORY_OPTIONS = [
  { value: 'TOURISM', label: '旅游签证' },
  { value: 'BUSINESS', label: '商务签证' },
  { value: 'WORK', label: '工作签证' },
  { value: 'STUDY', label: '学生签证' },
  { value: 'TRANSIT', label: '过境签证' },
  { value: 'FAMILY', label: '探亲访友签证' },
  { value: 'OTHER', label: '其他签证' }
];

export default function VisaLinesPage() {
  const [visaLines, setVisaLines] = useState<VisaLine[]>([]);
  const [countries, setCountries] = useState<VisaCountry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCountry, setFilterCountry] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [editingLine, setEditingLine] = useState<VisaLine | null>(null);
  const [selectedLine, setSelectedLine] = useState<VisaLine | null>(null);
  const [showDocModal, setShowDocModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    countryId: '',
    category: 'TOURISM',
    visaType: '',
    entryType: '',
    validityDays: '',
    maxStayDays: '',
    processingDays: '',
    interview: false,
    invitation: false,
    visaFee: '',
    serviceFee: '',
    expressFee: '',
    description: '',
    requirements: '',
    materials: '',
    isPopular: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [linesData, countriesData] = await Promise.all([
        erpApi.get('/visa-lines'),
        erpApi.get('/visa-countries')
      ]);
      setVisaLines(linesData);
      setCountries(countriesData.filter((c: VisaCountry) => c.isActive));
    } catch (error) {
      console.error('获取数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        countryId: parseInt(formData.countryId),
        validityDays: formData.validityDays ? parseInt(formData.validityDays) : null,
        maxStayDays: formData.maxStayDays ? parseInt(formData.maxStayDays) : null,
        processingDays: formData.processingDays ? parseInt(formData.processingDays) : null,
        visaFee: formData.visaFee ? parseFloat(formData.visaFee) : null,
        serviceFee: formData.serviceFee ? parseFloat(formData.serviceFee) : null,
        expressFee: formData.expressFee ? parseFloat(formData.expressFee) : null
      };

      if (editingLine) {
        await erpApi.put(`/visa-lines/${editingLine.id}`, data);
      } else {
        await erpApi.post('/visa-lines', data);
      }
      setShowModal(false);
      setEditingLine(null);
      resetForm();
      fetchData();
    } catch (error: any) {
      alert(error.message || '操作失败');
    }
  };

  const handleEdit = (line: VisaLine) => {
    setEditingLine(line);
    setFormData({
      name: line.name,
      countryId: line.country.id.toString(),
      category: line.category,
      visaType: line.visaType,
      entryType: line.entryType || '',
      validityDays: line.validityDays?.toString() || '',
      maxStayDays: line.maxStayDays?.toString() || '',
      processingDays: line.processingDays?.toString() || '',
      interview: line.interview,
      invitation: line.invitation,
      visaFee: line.visaFee?.toString() || '',
      serviceFee: line.serviceFee?.toString() || '',
      expressFee: line.expressFee?.toString() || '',
      description: line.description || '',
      requirements: line.requirements || '',
      materials: line.materials || '',
      isPopular: line.isPopular
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除该签证线路吗？')) return;
    try {
      await erpApi.delete(`/visa-lines/${id}`);
      fetchData();
    } catch (error: any) {
      alert(error.message || '删除失败');
    }
  };

  const handleToggleActive = async (line: VisaLine) => {
    try {
      await erpApi.put(`/visa-lines/${line.id}`, { isActive: !line.isActive });
      fetchData();
    } catch (error) {
      console.error('更新状态失败:', error);
    }
  };

  const handleTogglePopular = async (line: VisaLine) => {
    try {
      await erpApi.put(`/visa-lines/${line.id}`, { isPopular: !line.isPopular });
      fetchData();
    } catch (error) {
      console.error('更新状态失败:', error);
    }
  };

  const openDocManager = (line: VisaLine) => {
    setSelectedLine(line);
    setShowDocModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      countryId: '',
      category: 'TOURISM',
      visaType: '',
      entryType: '',
      validityDays: '',
      maxStayDays: '',
      processingDays: '',
      interview: false,
      invitation: false,
      visaFee: '',
      serviceFee: '',
      expressFee: '',
      description: '',
      requirements: '',
      materials: '',
      isPopular: false
    });
  };

  const filteredLines = visaLines.filter(line => {
    const matchSearch = !searchTerm ||
      line.name.includes(searchTerm) ||
      line.visaType.includes(searchTerm) ||
      line.country.name.includes(searchTerm);
    const matchCountry = !filterCountry || line.country.id.toString() === filterCountry;
    const matchCategory = !filterCategory || line.category === filterCategory;
    return matchSearch && matchCountry && matchCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">签证线路管理</h1>
          <p className="text-sm text-slate-500 mt-1">配置签证类型、费用和所需材料</p>
        </div>
        <button onClick={() => { setEditingLine(null); resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors">
          <Plus className="w-4 h-4" />添加线路
        </button>
      </div>

      {/* 筛选栏 */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="搜索线路名称..." value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          </div>
          <select value={filterCountry} onChange={(e) => setFilterCountry(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500">
            <option value="">全部国家</option>
            {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500">
            <option value="">全部类型</option>
            {CATEGORY_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
      </div>

      {/* 线路列表 */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">加载中...</div>
        ) : filteredLines.length === 0 ? (
          <div className="p-8 text-center text-slate-500">{searchTerm || filterCountry || filterCategory ? '未找到匹配的线路' : '暂无线路数据'}</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredLines.map((line) => (
              <div key={line.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-lg flex items-center justify-center">
                      <Globe className="w-6 h-6 text-cyan-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-slate-800">{line.name}</h3>
                        {line.isPopular && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                        <span>{line.country.name}</span>
                        <span className="text-slate-300">|</span>
                        <span>{CATEGORY_LABELS[line.category] || line.category}</span>
                        <span className="text-slate-300">|</span>
                        <span>{line.visaType}</span>
                        {line.entryType && <><span className="text-slate-300">|</span><span>{line.entryType}</span></>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {/* 费用信息 */}
                    <div className="hidden md:flex items-center gap-4 text-sm">
                      {(line.visaFee || line.serviceFee) && (
                        <div className="flex items-center gap-1 text-slate-600">
                          <DollarSign className="w-4 h-4" />
                          <span>签证费: ¥{line.visaFee || 0}</span>
                        </div>
                      )}
                      {line.processingDays && (
                        <div className="flex items-center gap-1 text-slate-600">
                          <Clock className="w-4 h-4" />
                          <span>{line.processingDays}个工作日</span>
                        </div>
                      )}
                    </div>

                    {/* 标签 */}
                    <div className="flex items-center gap-2">
                      {line.interview && <span className="px-2 py-0.5 text-xs bg-orange-100 text-orange-700 rounded">面试</span>}
                      {line.invitation && <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded">邀请函</span>}
                      <span className={`px-2 py-0.5 text-xs rounded-full ${line.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                        {line.isActive ? '启用' : '禁用'}
                      </span>
                    </div>

                    {/* 操作 */}
                    <div className="flex items-center gap-1">
                      <button onClick={() => openDocManager(line)}
                        className="p-2 text-slate-400 hover:text-cyan-500 hover:bg-cyan-50 rounded-lg" title="资料清单">
                        <FileText className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleTogglePopular(line)}
                        className={`p-2 rounded-lg ${line.isPopular ? 'text-yellow-500 hover:bg-yellow-50' : 'text-slate-400 hover:text-yellow-500 hover:bg-yellow-50'}`}>
                        <Star className={`w-4 h-4 ${line.isPopular ? 'fill-yellow-500' : ''}`} />
                      </button>
                      <button onClick={() => handleEdit(line)}
                        className="p-2 text-slate-400 hover:text-cyan-500 hover:bg-cyan-50 rounded-lg">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(line.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 添加/编辑弹窗 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-8">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6 my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-800">{editingLine ? '编辑签证线路' : '添加签证线路'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">线路名称 <span className="text-red-500">*</span></label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="如：日本单次旅游签证" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">国家 <span className="text-red-500">*</span></label>
                  <select required value={formData.countryId} onChange={(e) => setFormData({ ...formData, countryId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500">
                    <option value="">请选择国家</option>
                    {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">签证类别</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500">
                    {CATEGORY_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">签证类型 <span className="text-red-500">*</span></label>
                  <input type="text" required value={formData.visaType} onChange={(e) => setFormData({ ...formData, visaType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="如：单次旅游/三年多次" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">入境类型</label>
                  <select value={formData.entryType} onChange={(e) => setFormData({ ...formData, entryType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500">
                    <option value="">请选择</option>
                    <option value="单次">单次</option>
                    <option value="两次">两次</option>
                    <option value="多次">多次</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">有效期(天)</label>
                  <input type="number" value={formData.validityDays} onChange={(e) => setFormData({ ...formData, validityDays: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="如：90" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">最长停留(天)</label>
                  <input type="number" value={formData.maxStayDays} onChange={(e) => setFormData({ ...formData, maxStayDays: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="如：15" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">办理天数</label>
                  <input type="number" value={formData.processingDays} onChange={(e) => setFormData({ ...formData, processingDays: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="工作日" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">签证费(¥)</label>
                  <input type="number" step="0.01" value={formData.visaFee} onChange={(e) => setFormData({ ...formData, visaFee: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">服务费(¥)</label>
                  <input type="number" step="0.01" value={formData.serviceFee} onChange={(e) => setFormData({ ...formData, serviceFee: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.interview} onChange={(e) => setFormData({ ...formData, interview: e.target.checked })}
                    className="w-4 h-4 text-cyan-500 border-slate-300 rounded focus:ring-cyan-500" />
                  <span className="text-sm text-slate-700">需要面试</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.invitation} onChange={(e) => setFormData({ ...formData, invitation: e.target.checked })}
                    className="w-4 h-4 text-cyan-500 border-slate-300 rounded focus:ring-cyan-500" />
                  <span className="text-sm text-slate-700">需要邀请函</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.isPopular} onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                    className="w-4 h-4 text-cyan-500 border-slate-300 rounded focus:ring-cyan-500" />
                  <span className="text-sm text-slate-700">设为热门</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">线路描述</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="简要描述..." />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">办理要求</label>
                <textarea value={formData.requirements} onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="适用人群、基本条件..." />
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50">取消</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600">{editingLine ? '保存' : '添加'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 资料清单管理弹窗 */}
      {showDocModal && selectedLine && (
        <VisaLineDocumentsModal line={selectedLine} onClose={() => { setShowDocModal(false); setSelectedLine(null); }} />
      )}
    </div>
  );
}

// 资料清单管理组件
function VisaLineDocumentsModal({ line, onClose }: { line: VisaLine; onClose: () => void }) {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDoc, setEditingDoc] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '身份证明',
    isRequired: true,
    isMultiple: false,
    fileType: ''
  });

  const CATEGORIES = ['身份证明', '资产证明', '工作证明', '行程证明', '其他'];

  const fetchDocuments = useCallback(async () => {
    try {
      const data = await erpApi.get(`/visa-lines/${line.id}/documents`);
      setDocuments(data.documents || []);
    } catch (error) {
      console.error('获取资料清单失败:', error);
    } finally {
      setLoading(false);
    }
  }, [line.id]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleSave = async () => {
    try {
      await erpApi.put(`/visa-lines/${line.id}/documents`, {
        documentId: editingDoc?.id,
        ...formData
      });
      setShowForm(false);
      setEditingDoc(null);
      setFormData({ name: '', description: '', category: '身份证明', isRequired: true, isMultiple: false, fileType: '' });
      fetchDocuments();
    } catch (error: any) {
      alert(error.message || '保存失败');
    }
  };

  const handleEdit = (doc: any) => {
    setEditingDoc(doc);
    setFormData({
      name: doc.name,
      description: doc.description || '',
      category: doc.category || '其他',
      isRequired: doc.isRequired,
      isMultiple: doc.isMultiple,
      fileType: doc.fileType || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (docId: number) => {
    if (!confirm('确定要删除该资料项吗？')) return;
    try {
      await erpApi.delete(`/visa-lines/${line.id}/documents/${docId}`);
      fetchDocuments();
    } catch (error: any) {
      alert(error.message || '删除失败');
    }
  };

  const groupedDocs = documents.reduce((acc, doc) => {
    const cat = (doc as any).category || '其他';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(doc);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-8">
      <div className="bg-white rounded-xl w-full max-w-3xl p-6 my-8 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">资料清单管理</h2>
            <p className="text-sm text-slate-500">{line.name}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {showForm ? (
          <div className="space-y-4 mb-6 p-4 bg-slate-50 rounded-lg">
            <h3 className="font-medium text-slate-800">{editingDoc ? '编辑资料' : '添加资料'}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">资料名称 <span className="text-red-500">*</span></label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="如：护照" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">分类</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">描述说明</label>
              <input type="text" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="资料要求说明..." />
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={formData.isRequired} onChange={(e) => setFormData({ ...formData, isRequired: e.target.checked })}
                  className="w-4 h-4 text-cyan-500 border-slate-300 rounded" />
                <span className="text-sm">必填</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={formData.isMultiple} onChange={(e) => setFormData({ ...formData, isMultiple: e.target.checked })}
                  className="w-4 h-4 text-cyan-500 border-slate-300 rounded" />
                <span className="text-sm">可上传多份</span>
              </label>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setShowForm(false); setEditingDoc(null); setFormData({ name: '', description: '', category: '身份证明', isRequired: true, isMultiple: false, fileType: '' }); }}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100">取消</button>
              <button onClick={handleSave} className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600">保存</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowForm(true)} className="mb-4 flex items-center gap-2 px-4 py-2 bg-cyan-50 text-cyan-600 rounded-lg hover:bg-cyan-100">
            <Plus className="w-4 h-4" />添加资料项
          </button>
        )}

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-slate-500">加载中...</div>
          ) : documents.length === 0 ? (
            <div className="p-8 text-center text-slate-500">暂无资料清单，点击上方按钮添加</div>
          ) : (
            (Object.entries(groupedDocs) as [string, any[]][]).map(([category, docs]) => (
              <div key={category} className="mb-4">
                <h4 className="text-sm font-medium text-slate-600 mb-2">{category}</h4>
                <div className="space-y-2">
                  {docs.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" checked={doc.isRequired} readOnly className="w-4 h-4 text-cyan-500 rounded" />
                        <div>
                          <p className="font-medium text-slate-800">{doc.name}</p>
                          {doc.description && <p className="text-sm text-slate-500">{doc.description}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {doc.isMultiple && <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">多份</span>}
                        <button onClick={() => handleEdit(doc)} className="p-1 text-slate-400 hover:text-cyan-500"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(doc.id)} className="p-1 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-4 border-t flex justify-between items-center">
          <p className="text-sm text-slate-500">共 {documents.length} 项资料</p>
          <button onClick={onClose} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200">关闭</button>
        </div>
      </div>
    </div>
  );
}
