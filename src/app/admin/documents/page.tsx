'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Download,
  Eye,
  CheckCircle,
  XCircle,
  RefreshCw,
  FileText,
  Upload
} from 'lucide-react';

interface Document {
  id: number;
  order_no: string;
  customer_name: string;
  document_type: string;
  file_name: string;
  status: 'pending' | 'approved' | 'rejected';
  uploaded_at: string;
  reviewed_by?: string;
}

const documentTypes = [
  { value: '', label: '全部类型' },
  { value: 'passport', label: '护照' },
  { value: 'id_card', label: '身份证' },
  { value: 'photo', label: '照片' },
  { value: 'bank_statement', label: '银行流水' },
  { value: 'insurance', label: '保险单' },
  { value: 'other', label: '其他' },
];

const statusOptions = [
  { value: '', label: '全部状态' },
  { value: 'pending', label: '待审核' },
  { value: 'approved', label: '已通过' },
  { value: 'rejected', label: '已拒绝' },
];

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedDocs, setSelectedDocs] = useState<number[]>([]);

  useState(() => {
    // 模拟数据
    const mockDocs: Document[] = Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      order_no: `VD20260316${(i + 1).toString().padStart(4, '0')}`,
      customer_name: ['张三', '李四', '王五', '赵六'][i % 4],
      document_type: ['passport', 'id_card', 'photo', 'bank_statement', 'insurance'][i % 5],
      file_name: ['护照首页.jpg', '身份证正反面.pdf', '白底照片.jpg', '流水账单.pdf', '保险单.pdf'][i % 5],
      status: ['pending', 'approved', 'rejected'][i % 3] as 'pending' | 'approved' | 'rejected',
      uploaded_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      reviewed_by: i % 3 !== 0 ? '审核员' : undefined,
    }));
    setDocuments(mockDocs);
    setLoading(false);
  });

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { label: '待审核', color: 'yellow', icon: Clock },
      approved: { label: '已通过', color: 'green', icon: CheckCircle },
      rejected: { label: '已拒绝', color: 'red', icon: XCircle },
    };
    const { label, color } = config[status as keyof typeof config] || config.pending;
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-${color}-100 text-${color}-700`}>
        {label}
      </span>
    );
  };

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
                placeholder="搜索订单号、客户姓名..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
              />
            </div>
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm"
          >
            {documentTypes.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm"
          >
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <button className="px-4 py-2 border border-slate-200 rounded-lg flex items-center gap-2 text-sm hover:bg-slate-50">
            <Download className="w-4 h-4" />
            导出
          </button>
        </div>
      </div>

      {/* 批量操作栏 */}
      {selectedDocs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 flex items-center justify-between"
        >
          <span className="text-cyan-700">已选择 {selectedDocs.length} 项</span>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600">
              批量通过
            </button>
            <button className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600">
              批量拒绝
            </button>
          </div>
        </motion.div>
      )}

      {/* 资料列表 */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-500">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-500">订单号</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-500">客户姓名</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-500">资料类型</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-500">文件名</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-500">状态</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-500">上传时间</th>
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
              ) : documents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                    暂无数据
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        checked={selectedDocs.includes(doc.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedDocs([...selectedDocs, doc.id]);
                          } else {
                            setSelectedDocs(selectedDocs.filter(id => id !== doc.id));
                          }
                        }}
                        className="rounded" 
                      />
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-slate-700">{doc.order_no}</td>
                    <td className="px-6 py-4 text-slate-700">{doc.customer_name}</td>
                    <td className="px-6 py-4 text-slate-700">
                      {documentTypes.find(t => t.value === doc.document_type)?.label || doc.document_type}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-700">
                        <FileText className="w-4 h-4 text-slate-400" />
                        {doc.file_name}
                      </div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(doc.status)}</td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {new Date(doc.uploaded_at).toLocaleDateString('zh-CN')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-cyan-600" title="查看">
                          <Eye className="w-4 h-4" />
                        </button>
                        {doc.status === 'pending' && (
                          <>
                            <button className="p-1.5 rounded-lg hover:bg-slate-100 text-green-500" title="通过">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 rounded-lg hover:bg-slate-100 text-red-500" title="拒绝">
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
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

function Clock({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}
