/**
 * 文件预览弹窗组件
 * 
 * 功能：
 * - 图片预览（支持缩放、拖拽、多图导航）
 * - PDF内嵌预览
 * - Word文档下载预览
 * - 通用文件下载
 * - 文件类型图标显示
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut, 
  RotateCcw, FileText, Image, FileSpreadsheet, File, ExternalLink,
  Maximize2, Minimize2, Loader2
} from 'lucide-react';

// 文件类型判断
export type FileType = 'image' | 'pdf' | 'word' | 'excel' | 'unknown';

export function getFileType(url: string, filename?: string): FileType {
  const ext = (filename || url.split('?')[0].split('.').pop() || '').toLowerCase();
  
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(ext)) {
    return 'image';
  }
  if (ext === 'pdf') {
    return 'pdf';
  }
  if (['doc', 'docx'].includes(ext)) {
    return 'word';
  }
  if (['xls', 'xlsx', 'csv'].includes(ext)) {
    return 'excel';
  }
  return 'unknown';
}

// 获取文件类型图标和颜色
export function getFileTypeConfig(type: FileType) {
  switch (type) {
    case 'image':
      return { icon: Image, color: 'text-emerald-600', bg: 'bg-emerald-100' };
    case 'pdf':
      return { icon: FileText, color: 'text-red-600', bg: 'bg-red-100' };
    case 'word':
      return { icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' };
    case 'excel':
      return { icon: FileSpreadsheet, color: 'text-green-600', bg: 'bg-green-100' };
    default:
      return { icon: File, color: 'text-slate-600', bg: 'bg-slate-100' };
  }
}

// 获取文件名称
export function getFileName(url: string): string {
  try {
    const urlParts = url.split('/');
    const filename = urlParts[urlParts.length - 1];
    // 移除OSS签名参数
    return decodeURIComponent(filename.split('?')[0]);
  } catch {
    return '文件';
  }
}

interface FilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: Array<{
    url: string;
    name?: string;
  }>;
  currentIndex?: number;
  onIndexChange?: (index: number) => void;
  title?: string;
}

// 图片预览组件
function ImagePreview({ 
  src, 
  onZoomIn, 
  onZoomOut, 
  onReset,
  zoom,
  onRotate 
}: { 
  src: string; 
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  zoom: number;
  onRotate: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-slate-900 overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      )}
      {error && (
        <div className="text-center text-white">
          <FileText className="w-12 h-12 mx-auto mb-2 text-slate-400" />
          <p>图片加载失败</p>
        </div>
      )}
      <img
        src={src}
        alt="预览图片"
        className="max-w-full max-h-full object-contain transition-transform duration-200"
        style={{ 
          transform: `scale(${zoom})`,
        }}
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
      />
    </div>
  );
}

// PDF预览组件
function PdfPreview({ url }: { url: string }) {
  return (
    <div className="w-full h-full bg-slate-100 flex flex-col">
      <div className="bg-slate-200 px-4 py-2 flex items-center justify-between">
        <span className="text-sm text-slate-600">PDF预览</span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-cyan-600 hover:underline flex items-center gap-1"
        >
          <ExternalLink className="w-4 h-4" />
          在新窗口打开
        </a>
      </div>
      <iframe
        src={`${url}#toolbar=0&navpanes=0&scrollbar=1`}
        className="flex-1 w-full"
        title="PDF预览"
      />
    </div>
  );
}

// 通用文件预览（不支持预览的文件）
function GenericFilePreview({ url, filename, fileType }: { url: string; filename: string; fileType: FileType }) {
  const config = getFileTypeConfig(fileType);
  const Icon = config.icon;

  return (
    <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center">
      <div className={`w-24 h-24 rounded-2xl ${config.bg} flex items-center justify-center mb-6`}>
        <Icon className={`w-12 h-12 ${config.color}`} />
      </div>
      <h3 className="text-lg font-medium text-slate-800 mb-2">{filename}</h3>
      <p className="text-sm text-slate-500 mb-6">此文件类型不支持在线预览</p>
      <a
        href={url}
        download={filename}
        target="_blank"
        rel="noopener noreferrer"
        className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 flex items-center gap-2 transition-colors"
      >
        <Download className="w-5 h-5" />
        下载文件
      </a>
    </div>
  );
}

// 主组件
export default function FilePreviewModal({
  isOpen,
  onClose,
  files,
  currentIndex = 0,
  onIndexChange,
  title = '文件预览'
}: FilePreviewModalProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [actualIndex, setActualIndex] = useState(currentIndex);

  // 重置缩放和旋转
  const handleReset = useCallback(() => {
    setZoom(1);
    setRotation(0);
  }, []);

  // 同步外部索引
  useEffect(() => {
    setActualIndex(currentIndex);
  }, [currentIndex]);

  // 切换文件时重置
  useEffect(() => {
    handleReset();
  }, [actualIndex, handleReset]);

  // 键盘导航
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (actualIndex > 0) {
            const newIndex = actualIndex - 1;
            setActualIndex(newIndex);
            onIndexChange?.(newIndex);
          }
          break;
        case 'ArrowRight':
          if (actualIndex < files.length - 1) {
            const newIndex = actualIndex + 1;
            setActualIndex(newIndex);
            onIndexChange?.(newIndex);
          }
          break;
        case '+':
        case '=':
          setZoom(z => Math.min(z + 0.25, 3));
          break;
        case '-':
          setZoom(z => Math.max(z - 0.25, 0.5));
          break;
        case 'r':
        case 'R':
          handleReset();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, actualIndex, files.length, onClose, onIndexChange, handleReset]);

  if (!isOpen || files.length === 0) return null;

  const currentFile = files[actualIndex];
  const fileType = getFileType(currentFile.url, currentFile.name);
  const fileName = currentFile.name || getFileName(currentFile.url);
  const hasMultipleFiles = files.length > 1;

  // 缩放控制
  const handleZoomIn = () => setZoom(z => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.25, 0.5));
  const handleRotate = () => setRotation(r => (r + 90) % 360);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 z-50 flex flex-col"
          onClick={onClose}
        >
          {/* 顶部工具栏 */}
          <div 
            className="flex items-center justify-between px-4 py-3 bg-slate-900/80 backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4">
              <h2 className="text-white font-medium">{title}</h2>
              {hasMultipleFiles && (
                <span className="text-slate-400 text-sm">
                  {actualIndex + 1} / {files.length}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {/* 文件信息 */}
              <span className="text-slate-300 text-sm mr-4">{fileName}</span>
              
              {/* 缩放控制 - 仅图片显示 */}
              {fileType === 'image' && (
                <>
                  <button
                    onClick={handleZoomOut}
                    disabled={zoom <= 0.5}
                    className="p-2 text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed rounded-lg hover:bg-white/10 transition-colors"
                    title="缩小 (-)"
                  >
                    <ZoomOut className="w-5 h-5" />
                  </button>
                  <span className="text-white/70 text-sm w-16 text-center">
                    {Math.round(zoom * 100)}%
                  </span>
                  <button
                    onClick={handleZoomIn}
                    disabled={zoom >= 3}
                    className="p-2 text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed rounded-lg hover:bg-white/10 transition-colors"
                    title="放大 (+)"
                  >
                    <ZoomIn className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleReset}
                    className="p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                    title="重置 (R)"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </>
              )}
              
              {/* 下载按钮 */}
              <a
                href={currentFile.url}
                download={fileName}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                title="下载"
                onClick={(e) => e.stopPropagation()}
              >
                <Download className="w-5 h-5" />
              </a>
              
              {/* 关闭按钮 */}
              <button
                onClick={onClose}
                className="p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors ml-2"
                title="关闭 (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 预览区域 */}
          <div 
            className="flex-1 flex items-center justify-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 左侧导航 */}
            {hasMultipleFiles && actualIndex > 0 && (
              <button
                onClick={() => {
                  const newIndex = actualIndex - 1;
                  setActualIndex(newIndex);
                  onIndexChange?.(newIndex);
                }}
                className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* 内容区域 */}
            <div className="w-full h-full max-w-[90vw] max-h-[85vh]">
              {fileType === 'image' ? (
                <div 
                  className="w-full h-full"
                  style={{ 
                    transform: `rotate(${rotation}deg)`,
                    transition: 'transform 0.3s ease'
                  }}
                >
                  <ImagePreview
                    src={currentFile.url}
                    zoom={zoom}
                    onZoomIn={handleZoomIn}
                    onZoomOut={handleZoomOut}
                    onReset={handleReset}
                    onRotate={handleRotate}
                  />
                </div>
              ) : fileType === 'pdf' ? (
                <PdfPreview url={currentFile.url} />
              ) : (
                <GenericFilePreview 
                  url={currentFile.url} 
                  filename={fileName}
                  fileType={fileType}
                />
              )}
            </div>

            {/* 右侧导航 */}
            {hasMultipleFiles && actualIndex < files.length - 1 && (
              <button
                onClick={() => {
                  const newIndex = actualIndex + 1;
                  setActualIndex(newIndex);
                  onIndexChange?.(newIndex);
                }}
                className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* 底部缩略图导航 */}
          {hasMultipleFiles && (
            <div 
              className="flex items-center justify-center gap-2 py-3 bg-slate-900/80 backdrop-blur-sm"
              onClick={(e) => e.stopPropagation()}
            >
              {files.map((file, index) => {
                const thumbType = getFileType(file.url, file.name);
                const thumbConfig = getFileTypeConfig(thumbType);
                const ThumbIcon = thumbConfig.icon;
                const isActive = index === actualIndex;
                
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setActualIndex(index);
                      onIndexChange?.(index);
                    }}
                    className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                      isActive 
                        ? 'border-cyan-500 shadow-lg' 
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    {thumbType === 'image' ? (
                      <img
                        src={file.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className={`w-full h-full ${thumbConfig.bg} flex items-center justify-center`}>
                        <ThumbIcon className={`w-5 h-5 ${thumbConfig.color}`} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
