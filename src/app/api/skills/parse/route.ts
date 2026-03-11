/**
 * 文档解析 API
 * 
 * 用途: 上传文件 -> AI 解析 -> 返回结构化数据
 * 
 * POST /api/skills/parse
 * 
 * 典型场景: 用户上传行程单文件，系统自动提取信息填充表单
 */

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// 允许的文件类型
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/msword', // .doc
  'image/jpeg',
  'image/png',
  'image/jpg'
];

// 最大文件大小 (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const extractType = formData.get('extractType') as string || 'auto';
    
    // 验证文件
    if (!file) {
      return NextResponse.json({
        status: 'error',
        error: {
          code: 'NO_FILE',
          message: 'No file uploaded'
        }
      }, { status: 400 });
    }
    
    // 验证文件类型
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json({
        status: 'error',
        error: {
          code: 'INVALID_FILE_TYPE',
          message: `File type not allowed. Allowed: ${ALLOWED_FILE_TYPES.join(', ')}`
        }
      }, { status: 400 });
    }
    
    // 验证文件大小
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({
        status: 'error',
        error: {
          code: 'FILE_TOO_LARGE',
          message: `File size exceeds limit of ${MAX_FILE_SIZE / 1024 / 1024}MB`
        }
      }, { status: 400 });
    }
    
    // 保存上传的文件
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });
    
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(uploadsDir, fileName);
    
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);
    
    // 解析文件类型并调用相应的处理器
    const fileType = file.name.split('.').pop()?.toLowerCase();
    let extractedData;
    let parseSuccess = true;
    let parseError = '';
    
    try {
      extractedData = await parseDocument(filePath, fileType || '', extractType);
    } catch (parseError_: any) {
      parseSuccess = false;
      parseError = parseError_.message || 'Failed to parse document';
      extractedData = null;
    }
    
    // 清理上传的文件
    try {
      await writeFile(filePath, Buffer.alloc(0)); // 清空文件
    } catch {
      // 忽略清理错误
    }
    
    if (!parseSuccess) {
      return NextResponse.json({
        status: 'error',
        error: {
          code: 'PARSE_FAILED',
          message: parseError
        }
      }, { status: 422 });
    }
    
    // 返回提取的数据
    return NextResponse.json({
      status: 'success',
      result: {
        fileName: file.name,
        fileType: fileType,
        extractedData: extractedData,
        confidence: 0.85 // 模拟置信度，后续可接入 AI 评分
      },
      metadata: {
        processedAt: new Date().toISOString(),
        fileSize: file.size
      }
    });
    
  } catch (error: any) {
    console.error('Document parsing error:', error);
    return NextResponse.json({
      status: 'error',
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || 'Failed to parse document'
      }
    }, { status: 500 });
  }
}

/**
 * 解析文档
 * 
 * 这里先实现基础版本，后续可以接入:
 * - python-docx 解析 .docx 文件
 * - pypdf/pdfplumber 解析 PDF
 * - OCR 服务识别图片
 * - AI 服务进行信息抽取
 */
async function parseDocument(
  filePath: string, 
  fileType: string, 
  extractType: string
): Promise<Record<string, any>> {
  
  // TODO: 实现真正的文档解析逻辑
  
  // 模拟解析结果
  // 实际实现中，这里应该调用 Python 脚本或 AI API
  
  switch (fileType) {
    case 'docx':
      // 后续调用 docx skill 解析
      return {
        type: 'itinerary',
        data: {
          passengerName: '',
          flightNumber: '',
          departureCity: '',
          arrivalCity: '',
          departureDate: '',
          arrivalDate: '',
          hotelName: '',
          hotelAddress: ''
        }
      };
      
    case 'pdf':
      // 后续调用 pdf skill 解析
      return {
        type: 'document',
        data: {
          text: '',
          tables: [],
          images: []
        }
      };
      
    case 'jpg':
    case 'jpeg':
    case 'png':
      // 后续调用 OCR 解析
      return {
        type: 'image',
        data: {
          text: '',
          entities: []
        }
      };
      
    default:
      throw new Error(`Unsupported file type: ${fileType}`);
  }
}

/**
 * GET /api/skills/parse
 * 
 * 获取支持的文档类型
 */
export async function GET() {
  return NextResponse.json({
    status: 'success',
    supportedTypes: {
      documents: ['pdf', 'docx', 'doc'],
      images: ['jpg', 'jpeg', 'png']
    },
    maxFileSize: MAX_FILE_SIZE,
    extractTypes: [
      { value: 'auto', label: '自动识别' },
      { value: 'itinerary', label: '行程单' },
      { value: 'invoice', label: '发票/收据' },
      { value: 'idcard', label: '身份证' },
      { value: 'passport', label: '护照' }
    ]
  });
}
