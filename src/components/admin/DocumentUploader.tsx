'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  X, 
  File, 
  FileText, 
  Image, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Trash2
} from 'lucide-react';
import { documentApi } from '@/lib/erp/api-client';

// 文件类型图标映射
const fileIcons: Record<string, React.ReactNode> = {
  'image/jpeg': <Image className="w-8 h-8 text-blue-500" />,
  'image/jpg': <Image className="w-8 h-8 text-blue-500" />,
  'image/png': <Image className="w-8 h-8 text-blue-500" />,
  'image/gif': <Image className="w-8 h-8 text-blue-500" />,
  'image/webp': <Image className="w-8 h-8 text-blue-500" />,
  'application/pdf': <FileText className="w-8 h-8 text-red-500" />,
  'application/msword': <FileText className="w-8 h-8 text-blue-600" />,
  'default': <File className="w-8 h-8 text-slate-400" />,
};

interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  url?: string;
  error?: string;
}

interface DocumentUploaderProps {
  orderId: number;
  requirementId?: number;
  type?: 'requirement' | 'material';
  onUploadSuccess?: (fileUrl: string, fileId?: number) => void;
  onUploadError?: (error: string) => void;
  maxFiles?: number;
  accept?: string;
  maxSize?: number; // MB
  compact?: boolean; // 紧凑模式
}

export default function DocumentUploader({
  orderId,
  requirementId,
  type = 'requirement',
  onUploadSuccess,
  onUploadError,
  maxFiles = 10,
  accept = 'image/jpeg,image/png,image/webp,application/pdf,.doc,.docx',
  maxSize = 10,
  compact = false,
}: DocumentUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // 格式化文件大小
  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // 获取文件图标
  const getFileIcon = (mimeType: string) => {
    return fileIcons[mimeType] || fileIcons['default'];
  };

  // 验证文件
  const validateFile = useCallback((file: File): string | null => {
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `文件超过${maxSize}MB限制`;
    }
    return null;
  }, [maxSize]);

  // 上传单个文件
  const uploadFile = useCallback(async (uploadedFile: UploadedFile) => {
    try {
      // 更新状态为上传中
      setFiles(prev => prev.map(f => 
        f.id === uploadedFile.id ? { ...f, status: 'uploading' as const, progress: 10 } : f
      ));

      const result = await documentApi.upload(uploadedFile.file, orderId, {
        type,
        requirementId,
        name: uploadedFile.file.name,
      });

      if (result.success) {
        setFiles(prev => prev.map(f => 
          f.id === uploadedFile.id ? { 
            ...f, 
            status: 'success' as const, 
            progress: 100, 
            url: result.data?.fileUrl 
          } : f
        ));
        onUploadSuccess?.(result.data?.fileUrl, result.data?.documentId || result.data?.materialId);
      } else {
        setFiles(prev => prev.map(f => 
          f.id === uploadedFile.id ? { 
            ...f, 
            status: 'error' as const, 
            error: result.message 
          } : f
        ));
        onUploadError?.(result.message);
      }
    } catch (error) {
      setFiles(prev => prev.map(f => 
        f.id === uploadedFile.id ? { 
          ...f, 
          status: 'error' as const, 
          error: '上传失败' 
        } : f
      ));
      onUploadError?.('上传失败');
    }
  }, [orderId, type, requirementId, onUploadSuccess, onUploadError]);

  // 添加文件
  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    const validFiles = fileArray.filter(file => {
      const error = validateFile(file);
      if (error) {
        alert(`${file.name}: ${error}`);
        return false;
      }
      return true;
    });

    if (files.length + validFiles.length > maxFiles) {
      alert(`最多只能上传${maxFiles}个文件`);
      return;
    }

    const uploadedFiles: UploadedFile[] = validFiles.map(file => ({
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      file,
      progress: 0,
      status: 'pending' as const,
    }));

    setFiles(prev => [...prev, ...uploadedFiles]);

    // 自动上传
    uploadedFiles.forEach(uploadFile);
  }, [files.length, maxFiles, validateFile, uploadFile]);

  // 移除文件
  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  // 拖拽处理
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  }, [addFiles]);

  // 文件选择
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
      e.target.value = '';
    }
  };

  // 预览文件
  const previewFile = (url: string, type: string) => {
    if (type.startsWith('image/')) {
      window.open(url, '_blank');
    } else {
      window.open(url, '_blank');
    }
  };

  if (compact) {
    // 紧凑模式
    return (
      <div className="space-y-3">
        <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-cyan-500 hover:bg-cyan-50 transition-colors">
          <Upload className="w-5 h-5 text-slate-400" />
          <span className="text-sm text-slate-600">点击或拖拽上传文件</span>
          <input
            type="file"
            className="hidden"
            accept={accept}
            multiple
            onChange={handleFileSelect}
          />
        </label>

        {files.length > 0 && (
          <div className="space-y-2">
            {files.map(file => (
              <div key={file.id} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                {getFileIcon(file.file.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 truncate">{file.file.name}</p>
                  <p className="text-xs text-slate-400">{formatSize(file.file.size)}</p>
                </div>
                {file.status === 'success' && (
                  <button
                    onClick={() => file.url && previewFile(file.url, file.file.type)}
                    className="p-1 hover:bg-slate-200 rounded"
                  >
                    <FileText className="w-4 h-4 text-cyan-500" />
                  </button>
                )}
                <button
                  onClick={() => removeFile(file.id)}
                  className="p-1 hover:bg-slate-200 rounded"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // 完整模式
  return (
    <div className="space-y-4">
      {/* 上传区域 */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          isDragging 
            ? 'border-cyan-500 bg-cyan-50' 
            : 'border-slate-300 hover:border-cyan-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept={accept}
          multiple
          onChange={handleFileSelect}
        />
        
        <div className="space-y-4">
          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-colors ${
            isDragging ? 'bg-cyan-100' : 'bg-slate-100'
          }`}>
            <Upload className={`w-8 h-8 transition-colors ${isDragging ? 'text-cyan-500' : 'text-slate-400'}`} />
          </div>
          
          <div>
            <p className="text-lg font-medium text-slate-700">
              {isDragging ? '放开以上传文件' : '点击或拖拽文件到此处上传'}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              支持 JPG、PNG、PDF、Word 文档，单文件最大 {maxSize}MB
            </p>
          </div>
        </div>
      </div>

      {/* 文件列表 */}
      <AnimatePresence mode="popLayout">
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            {files.map(file => (
              <motion.div
                key={file.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${
                  file.status === 'success' 
                    ? 'bg-green-50 border-green-200' 
                    : file.status === 'error'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                {/* 文件图标 */}
                <div className="flex-shrink-0">
                  {file.status === 'uploading' ? (
                    <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
                  ) : file.status === 'success' ? (
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  ) : file.status === 'error' ? (
                    <AlertCircle className="w-10 h-10 text-red-500" />
                  ) : (
                    getFileIcon(file.file.type)
                  )}
                </div>

                {/* 文件信息 */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-700 truncate">
                    {file.file.name}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-slate-500">
                      {formatSize(file.file.size)}
                    </span>
                    {file.status === 'uploading' && (
                      <span className="text-sm text-cyan-600">上传中...</span>
                    )}
                    {file.status === 'success' && (
                      <span className="text-sm text-green-600">上传成功</span>
                    )}
                    {file.status === 'error' && (
                      <span className="text-sm text-red-600">{file.error}</span>
                    )}
                  </div>

                  {/* 进度条 */}
                  {file.status === 'uploading' && (
                    <div className="mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-cyan-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 2 }}
                      />
                    </div>
                  )}
                </div>

                {/* 操作按钮 */}
                <div className="flex items-center gap-2">
                  {file.status === 'success' && file.url && (
                    <button
                      onClick={() => previewFile(file.url!, file.file.type)}
                      className="p-2 rounded-lg hover:bg-white/50 text-slate-500 hover:text-cyan-600 transition-colors"
                      title="预览"
                    >
                      <FileText className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-2 rounded-lg hover:bg-white/50 text-slate-500 hover:text-red-500 transition-colors"
                    title="移除"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
