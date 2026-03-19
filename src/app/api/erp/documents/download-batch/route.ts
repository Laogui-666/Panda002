import { NextRequest, NextResponse } from 'next/server';
import JSZip from 'jszip';
import { config } from '@/lib/config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * 批量下载API
 * POST /api/erp/documents/download-batch
 * Body: { urls: string[], filenames?: string[] }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { urls, filenames } = body as { urls: string[]; filenames?: string[] };

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: 'urls 参数是必需的，且必须是非空数组' },
        { status: 400 }
      );
    }

    // 限制批量下载数量
    const MAX_FILES = 50;
    if (urls.length > MAX_FILES) {
      return NextResponse.json(
        { error: `单次最多下载 ${MAX_FILES} 个文件，当前请求 ${urls.length} 个` },
        { status: 400 }
      );
    }

    const zip = new JSZip();
    const failedFiles: { url: string; error: string }[] = [];

    // 批量获取文件内容
    const fetchPromises = urls.map(async (url: string, index: number) => {
      try {
        // 处理相对路径，转换为完整OSS URL
        const ossConfig = config.oss;
        let fullUrl = url;
        if (url.startsWith('/')) {
          // 假设使用bucket域名格式: bucket.region.aliyuncs.com
          fullUrl = `https://${ossConfig.bucket}.${ossConfig.region}.aliyuncs.com${url}`;
        } else if (!url.startsWith('http')) {
          fullUrl = `https://${url}`;
        }

        // 从URL提取文件名
        let filename = filenames?.[index] || url.split('/').pop() || `file_${index + 1}`;
        
        // 确保文件名有扩展名
        const urlPath = new URL(url).pathname;
        const extFromUrl = urlPath.split('.').pop()?.toLowerCase();
        if (!filename.includes('.') && extFromUrl && extFromUrl.length <= 5) {
          filename = `${filename}.${extFromUrl}`;
        }

        // 获取文件内容
        const response = await fetch(fullUrl);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 添加到ZIP
        zip.file(filename, buffer);
        return { success: true, filename };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        failedFiles.push({ url, error: errorMessage });
        return { success: false, url, error: errorMessage };
      }
    });

    const results = await Promise.all(fetchPromises);
    const successfulFiles = results.filter(r => r.success);

    if (successfulFiles.length === 0) {
      return NextResponse.json(
        { error: '所有文件下载失败', failedFiles },
        { status: 500 }
      );
    }

    // 生成ZIP文件
    const zipBuffer = await zip.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    });

    // 转换为Uint8Array以兼容NextResponse
    const zipBytes = new Uint8Array(zipBuffer);

    // 生成下载文件名
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const zipFilename = `documents_${timestamp}_${successfulFiles.length}files.zip`;

    // 返回ZIP文件
    return new NextResponse(zipBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(zipFilename)}"`,
        'Content-Length': zipBytes.length.toString(),
        'X-Download-Info': JSON.stringify({
          total: urls.length,
          successful: successfulFiles.length,
          failed: failedFiles.length
        })
      }
    });
  } catch (error) {
    console.error('批量下载失败:', error);
    return NextResponse.json(
      { error: '批量下载失败', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * 获取批量下载状态（用于大文件异步处理）
 * GET /api/erp/documents/download-batch?taskId=xxx
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const taskId = searchParams.get('taskId');

  if (!taskId) {
    return NextResponse.json(
      { error: 'taskId 参数是必需的' },
      { status: 400 }
    );
  }

  // TODO: 实现异步任务状态查询（可选功能）
  return NextResponse.json(
    { error: '异步任务查询功能开发中' },
    { status: 501 }
  );
}
