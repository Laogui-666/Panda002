/**
 * 文件上传 API
 * 将任意文件上传到阿里云 OSS，返回公网访问 URL
 * 支持 PDF、图片、Word 等文件类型
 */

import { NextRequest, NextResponse } from 'next/server';
import { uploadFile, validateOssConfig } from '@/lib/oss';

export async function POST(request: NextRequest) {
  try {
    // 验证 OSS 配置
    const configCheck = validateOssConfig();
    if (!configCheck.valid) {
      return NextResponse.json({
        success: false,
        error: configCheck.message
      }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'Missing file'
      }, { status: 400 });
    }

    // 上传到 OSS
    const url = await uploadFile(file, 'translation');

    return NextResponse.json({
      success: true,
      url: url,
      fileName: file.name,
      fileType: file.type,
      message: 'File uploaded to OSS successfully'
    });

  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Upload failed'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Use POST to upload files to OSS',
    note: 'This endpoint uploads files (PDF, images, Word) to Aliyun OSS and returns a public URL',
    supportedTypes: ['PDF', 'JPG', 'PNG', 'Word (.docx)']
  });
}
