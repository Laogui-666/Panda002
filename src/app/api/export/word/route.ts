/**
 * Word导出 API 路由
 * 将HTML保存为.doc格式（Word可以打开）
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { html, filename } = await request.json();

    if (!html) {
      return NextResponse.json(
        { success: false, error: 'Missing HTML content' },
        { status: 400 }
      );
    }

    // 将HTML包装为Word可识别的格式
    // 使用MIME类型为 application/msword，HTML会被Word识别
    const wordContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" 
            xmlns:w="urn:schemas-microsoft-com:office:word" 
            xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <title>${filename || 'Translated Document'}</title>
        <style>
          body { font-family: Arial, sans-serif; font-size: 12pt; }
          table { border-collapse: collapse; width: 100%; }
          td, th { border: 1px solid #000; padding: 8px; }
          img { max-width: 100%; }
        </style>
      </head>
      <body>
        ${html}
      </body>
      </html>
    `;

    // 转换为Buffer
    const buffer = Buffer.from(wordContent, 'utf-8');

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/msword; charset=utf-8',
        'Content-Disposition': `attachment; filename="${encodeURIComponent((filename || 'document').split('.')[0])}_Translated.doc"`
      }
    });

  } catch (error: any) {
    console.error('Word export error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Word export failed' },
      { status: 500 }
    );
  }
}
