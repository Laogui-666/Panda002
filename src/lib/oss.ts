/**
 * OSS 上传工具
 * 使用阿里云 OSS 进行图片存储
 * 支持图片自动压缩（最大2048x2048, 300dpi）
 */

import OSS from 'ali-oss';
import sharp from 'sharp';
import { config } from './config';

// 图片压缩配置
const MAX_WIDTH = 2048;
const MAX_HEIGHT = 2048;
const COMPRESSION_QUALITY = 85;

/**
 * 获取 OSS 客户端实例
 */
function getOssClient(): OSS {
  const { region, accessKeyId, accessKeySecret, bucket } = config.oss;
  
  if (!region || !accessKeyId || !accessKeySecret || !bucket) {
    throw new Error('OSS configuration is incomplete. Please check environment variables.');
  }

  return new OSS({
    region,
    accessKeyId,
    accessKeySecret,
    bucket,
    // 使用内部网络以提高上传速度和降低成本
    internal: false,
    // 超时设置
    timeout: 60000,
  });
}

/**
 * 上传 Base64 图片到 OSS
 * @param base64Image Base64 格式的图片数据
 * @param folder 上传目录 (默认: 'translation')
 * @returns OSS 上的访问 URL
 */
export async function uploadBase64Image(
  base64Image: string, 
  folder: string = 'translation'
): Promise<string> {
  try {
    // 解析 Base64 数据
    let imageBuffer: Buffer;
    let mimeType: string;
    let extension: string;

    if (base64Image.startsWith('data:')) {
      const matches = base64Image.match(/^data:([^;]+);base64,(.+)$/);
      if (!matches) {
        throw new Error('Invalid base64 format');
      }
      mimeType = matches[1];
      const base64Data = matches[2];
      imageBuffer = Buffer.from(base64Data, 'base64');
      
      // 根据 MIME 类型确定扩展名
      const mimeToExt: Record<string, string> = {
        'image/jpeg': 'jpg',
        'image/jpg': 'jpg',
        'image/png': 'png',
        'image/gif': 'gif',
        'image/webp': 'webp',
      };
      extension = mimeToExt[mimeType] || 'jpg';
    } else {
      // 纯 Base64 数据
      imageBuffer = Buffer.from(base64Image, 'base64');
      mimeType = 'image/jpeg';
      extension = 'jpg';
    }

    // 生成唯一文件名
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const objectName = `${folder}/${timestamp}_${randomStr}.${extension}`;

    // 上传到 OSS
    const client = getOssClient();
    const result = await client.put(objectName, imageBuffer, {
      mime: mimeType,
    });

    // 返回公网访问 URL
    return result.url;
  } catch (error) {
    console.error('OSS upload error:', error);
    throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * 上传多个 Base64 图片到 OSS
 * @param base64Images Base64 格式的图片数据数组
 * @param folder 上传目录 (默认: 'translation')
 * @returns OSS 上的访问 URL 数组
 */
export async function uploadBase64Images(
  base64Images: string[], 
  folder: string = 'translation'
): Promise<string[]> {
  const results = await Promise.all(
    base64Images.map((img, index) => uploadBase64Image(img, `${folder}/page_${index + 1}`))
  );
  return results;
}

/**
 * 验证 OSS 配置是否完整
 */
export function validateOssConfig(): { valid: boolean; message: string } {
  const { region, accessKeyId, accessKeySecret, bucket } = config.oss;
  
  if (!region) {
    return { valid: false, message: 'OSS_REGION is not configured' };
  }
  if (!accessKeyId) {
    return { valid: false, message: 'OSS_ACCESS_KEY_ID is not configured' };
  }
  if (!accessKeySecret) {
    return { valid: false, message: 'OSS_ACCESS_KEY_SECRET is not configured' };
  }
  if (!bucket) {
    return { valid: false, message: 'OSS_BUCKET is not configured' };
  }
  
  return { valid: true, message: 'OSS configuration is valid' };
}

/**
 * 压缩图片（如果超过最大尺寸）
 * @param buffer 原始图片Buffer
 * @param mimeType 图片MIME类型
 * @returns 压缩后的Buffer
 */
async function compressImage(buffer: Buffer, mimeType: string): Promise<Buffer> {
  try {
    const image = sharp(buffer);
    const metadata = await image.metadata();

    // 检查是否需要压缩
    const needsResize = (metadata.width && metadata.width > MAX_WIDTH) || 
                        (metadata.height && metadata.height > MAX_HEIGHT);

    if (!needsResize) {
      // 如果不需要缩放，只进行质量压缩
      if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
        return await image.jpeg({ quality: COMPRESSION_QUALITY }).toBuffer();
      } else if (mimeType === 'image/png') {
        return await image.png({ quality: COMPRESSION_QUALITY, compressionLevel: 9 }).toBuffer();
      } else if (mimeType === 'image/webp') {
        return await image.webp({ quality: COMPRESSION_QUALITY }).toBuffer();
      }
      return buffer;
    }

    // 计算缩放后的尺寸（保持宽高比）
    let width = metadata.width || MAX_WIDTH;
    let height = metadata.height || MAX_HEIGHT;

    if (width > MAX_WIDTH) {
      height = Math.round((height * MAX_WIDTH) / width);
      width = MAX_WIDTH;
    }
    if (height > MAX_HEIGHT) {
      width = Math.round((width * MAX_HEIGHT) / height);
      height = MAX_HEIGHT;
    }

    // 调整尺寸并设置DPI为300
    let processedImage = image.resize(width, height, {
      fit: 'inside',
      withoutEnlargement: false
    });

    // 转换为适当格式并压缩
    if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
      return await processedImage
        .jpeg({ quality: COMPRESSION_QUALITY })
        .withMetadata({ density: 300 })
        .toBuffer();
    } else if (mimeType === 'image/png') {
      return await processedImage
        .png({ quality: COMPRESSION_QUALITY, compressionLevel: 9 })
        .withMetadata({ density: 300 })
        .toBuffer();
    } else if (mimeType === 'image/webp') {
      return await processedImage
        .webp({ quality: COMPRESSION_QUALITY })
        .withMetadata({ density: 300 })
        .toBuffer();
    } else {
      // 其他格式转为JPEG
      return await processedImage
        .jpeg({ quality: COMPRESSION_QUALITY })
        .withMetadata({ density: 300 })
        .toBuffer();
    }
  } catch (error) {
    console.error('Image compression error:', error);
    // 压缩失败时返回原图
    return buffer;
  }
}

/**
 * 上传文件到 OSS（支持任意文件类型：PDF、图片等）
 * 图片会自动压缩到最大2048x2048, 300dpi
 * @param file 要上传的文件（File对象）
 * @param folder 上传目录 (默认: 'translation')
 * @returns OSS 上的访问 URL
 */
export async function uploadFile(
  file: File, 
  folder: string = 'translation'
): Promise<string> {
  try {
    // 解析文件类型
    const mimeType = file.type || 'application/octet-stream';
    
    // 根据 MIME类型确定扩展名
    const mimeToExt: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp',
      'application/pdf': 'pdf',
      'application/msword': 'doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    };
    
    const extension = mimeToExt[mimeType] || file.name.split('.').pop() || 'bin';
    
    // 生成唯一文件名
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const objectName = `${folder}/${timestamp}_${randomStr}_${originalName}`;

    // 将 File 转换为 Buffer
    const arrayBuffer = await file.arrayBuffer();
    let buffer = Buffer.from(arrayBuffer) as unknown as Buffer;

    // 对图片进行压缩处理
    if (mimeType.startsWith('image/')) {
      console.log(`Compressing image: ${file.name} (${buffer.length} bytes)`);
      buffer = await compressImage(buffer, mimeType);
      console.log(`Compressed image size: ${buffer.length} bytes`);
    }

    // 上传到 OSS
    const client = getOssClient();
    const result = await client.put(objectName, buffer, {
      mime: mimeType,
    });

    // 返回公网访问 URL
    return result.url;
  } catch (error) {
    console.error('OSS file upload error:', error);
    throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
