/**
 * 图片上传 API
 * 将图片上传到阿里云 OSS，返回公网访问 URL
 */

import { NextRequest, NextResponse } from 'next/server';
import { uploadBase64Image, validateOssConfig } from '@/lib/oss';

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

    const body = await request.json();
    const { image, fileName } = body;

    if (!image) {
      return NextResponse.json({
        success: false,
        error: 'Missing image data'
      }, { status: 400 });
    }

    // 如果已经是 URL，直接返回
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return NextResponse.json({
        success: true,
        url: image,
        isExternal: true
      });
    }

    // 上传到 OSS
    const url = await uploadBase64Image(image, 'translation');

    return NextResponse.json({
      success: true,
      url: url,
      message: 'Image uploaded to OSS successfully'
    });

  } catch (error: any) {
    console.error('Image upload error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Upload failed'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Use POST to upload images to OSS',
    note: 'This endpoint uploads images to Aliyun OSS and returns a public URL'
  });
}
