'use client';

import { useState } from 'react';
import { 
  Download, 
  FileArchive, 
  CheckCircle, 
  XCircle, 
  Loader2,
  FileText,
  Image,
  FileSpreadsheet
} from 'lucide-react';

interface DownloadItem {
  url: string;
  filename: string;
  fileType?: string;
}

interface BatchDownloadProps {
  /** 下载项列表 */
  items: DownloadItem[];
  /** 按钮文字 */
  label?: string;
  /** 按钮样式 */
  variant?: 'primary' | 'secondary' | 'ghost';
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg';
  /** 自定义类名 */
  className?: string;
  /** 是否显示文件列表 */
  showFileList?: boolean;
  /** 下载前回调 */
  onBeforeDownload?: (items: DownloadItem[]) => void | Promise<void>;
  /** 下载完成回调 */
  onDownloadComplete?: (success: boolean, results: { successful: number; failed: number }) => void;
}

/**
 * 批量打包下载组件
 * 支持多文件ZIP压缩下载，显示下载进度和结果
 */
export default function BatchDownload({
  items,
  label = '批量下载',
  variant = 'primary',
  size = 'md',
  className = '',
  showFileList = false,
  onBeforeDownload,
  onDownloadComplete
}: BatchDownloadProps) {
  const [downloading, setDownloading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [results, setResults] = useState<{
    successful: number;
    failed: number;
    failedFiles: { url: string; error: string }[];
  } | null>(null);

  // 文件类型图标
  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(ext || '')) {
      return <Image className="w-4 h-4" />;
    }
    if (['xlsx', 'xls', 'csv'].includes(ext || '')) {
      return <FileSpreadsheet className="w-4 h-4" />;
    }
    if (['pdf'].includes(ext || '')) {
      return <FileText className="w-4 h-4" />;
    }
    return <FileText className="w-4 h-4" />;
  };

  // 按钮样式
  const buttonClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-600'
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  // 批量下载处理
  const handleBatchDownload = async () => {
    if (items.length === 0) return;

    setDownloading(true);
    setResults(null);

    try {
      // 调用下载前回调
      if (onBeforeDownload) {
        await onBeforeDownload(items);
      }

      // 构建请求
      const urls = items.map(item => item.url);
      const filenames = items.map(item => item.filename);

      const response = await fetch('/api/erp/documents/download-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls, filenames })
      });

      // 解析响应
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `下载失败 (${response.status})`);
      }

      // 获取ZIP文件
      const blob = await response.blob();
      
      // 解析下载信息头
      const downloadInfo = response.headers.get('X-Download-Info');
      let successCount = items.length;
      let failedCount = 0;
      let failedFiles: { url: string; error: string }[] = [];

      if (downloadInfo) {
        try {
          const info = JSON.parse(downloadInfo);
          successCount = info.successful;
          failedCount = info.failed;
        } catch {
          // 解析失败，使用默认值
        }
      }

      // 生成下载
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `documents_${new Date().toISOString().slice(0, 10)}.zip`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match) {
          filename = decodeURIComponent(match[1]);
        }
      }

      // 创建下载链接
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setResults({ successful: successCount, failed: failedCount, failedFiles });

      if (onDownloadComplete) {
        onDownloadComplete(true, { successful: successCount, failed: failedCount });
      }
    } catch (error) {
      console.error('批量下载失败:', error);
      setResults({
        successful: 0,
        failed: items.length,
        failedFiles: [{ url: 'all', error: error instanceof Error ? error.message : '未知错误' }]
      });

      if (onDownloadComplete) {
        onDownloadComplete(false, { successful: 0, failed: items.length });
      }
    } finally {
      setDownloading(false);
    }
  };

  // 确认对话框
  if (showConfirm) {
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 ${className}`}>
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
          <div className="p-4 border-b">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <FileArchive className="w-5 h-5 text-blue-600" />
              确认批量下载
            </h3>
          </div>
          
          <div className="p-4">
            <p className="text-gray-600 mb-4">
              确定要下载 <span className="font-medium">{items.length}</span> 个文件吗？
            </p>
            
            {showFileList && items.length <= 20 && (
              <div className="max-h-60 overflow-y-auto border rounded-lg p-2 space-y-1">
                {items.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    {getFileIcon(item.filename)}
                    <span className="truncate">{item.filename}</span>
                  </div>
                ))}
              </div>
            )}
            
            {items.length > 20 && (
              <p className="text-sm text-gray-500">（文件较多，不显示完整列表）</p>
            )}
          </div>
          
          <div className="p-4 border-t flex justify-end gap-2">
            <button
              onClick={() => setShowConfirm(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
              disabled={downloading}
            >
              取消
            </button>
            <button
              onClick={handleBatchDownload}
              disabled={downloading}
              className={`px-4 py-2 text-sm text-white rounded-lg flex items-center gap-2 ${buttonClasses.primary}`}
            >
              {downloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  下载中...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  确认下载
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 结果提示
  if (results) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm ${
          results.failed === 0 
            ? 'bg-green-100 text-green-700' 
            : 'bg-yellow-100 text-yellow-700'
        }`}>
          {results.failed === 0 ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <XCircle className="w-4 h-4" />
          )}
          <span>成功 {results.successful} 个</span>
          {results.failed > 0 && <span>，失败 {results.failed} 个</span>}
        </div>
        
        {results.failed > 0 && results.failedFiles.length > 0 && (
          <div className="text-xs text-red-500">
            {results.failedFiles[0].error}
          </div>
        )}

        <button
          onClick={() => setResults(null)}
          className="text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>
    );
  }

  // 主按钮
  return (
    <>
      <button
        onClick={() => {
          if (items.length <= 10) {
            handleBatchDownload();
          } else {
            setShowConfirm(true);
          }
        }}
        disabled={downloading || items.length === 0}
        className={`inline-flex items-center gap-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${buttonClasses[variant]} ${sizeClasses[size]} ${className}`}
      >
        {downloading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        {label}
        {items.length > 0 && (
          <span className="bg-white/20 px-1.5 py-0.5 rounded text-xs">
            {items.length}
          </span>
        )}
      </button>
    </>
  );
}
