#!/usr/bin/env python3
"""
PaddleOCR-VL PDF处理脚本
功能：PDF -> 图片 -> OCR识别 -> JSON输出
依赖：pdf2image, requests, pillow
"""

import os
import sys
import json
import argparse
import base64
import io
from typing import List, Dict, Any, Optional
from pathlib import Path

# 尝试导入依赖
try:
    from pdf2image import convert_from_path
    from PIL import Image
except ImportError as e:
    print(f"Error: Missing dependency - {e}")
    print("Please install: pip install pdf2image pillow")
    sys.exit(1)

# 配置本地poppler路径（Windows）
# 如果你下载了 portable poppler，解压后将bin目录路径添加到这里
LOCAL_POPPLER_PATH = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), 
    "..", "..", "poppler-25.12.0", "Library", "bin"
)

# 将本地poppler添加到PATH（Windows）
if os.path.exists(LOCAL_POPPLER_PATH):
    os.environ["PATH"] = LOCAL_POPPLER_PATH + os.pathsep + os.environ.get("PATH", "")
    print(f"✅ Using local poppler: {LOCAL_POPPLER_PATH}")

# API配置
API_KEY = os.environ.get("SILICONFLOW_API_KEY", "")
MODEL_NAME = "PaddlePaddle/PaddleOCR-VL-1.5"
API_URL = "https://api.siliconflow.cn/v1/chat/completions"


def pdf_to_images(pdf_path: str, dpi: int = 300) -> List[Image.Image]:
    """
    将PDF转换为图片列表
    注意：需要安装poppler-utils并添加到PATH
    Windows: 下载 https://github.com/oschwartz10612/poppler-windows/releases/
    macOS: brew install poppler
    Linux: apt-get install poppler-utils
    """
    print(f"📄 Converting PDF to images (DPI: {dpi})...")
    try:
        images = convert_from_path(pdf_path, dpi=dpi)
        print(f"✅ Converted {len(images)} pages")
        return images
    except Exception as e:
        error_msg = str(e)
        if "poppler" in error_msg.lower() or "pdftoppm" in error_msg.lower():
            print(f"❌ Poppler not found. Please install poppler-utils:")
            print("   Windows: https://github.com/oschwartz10612/poppler-windows/releases/")
            print("   macOS: brew install poppler")
            print("   Linux: sudo apt-get install poppler-utils")
        else:
            print(f"❌ PDF conversion failed: {e}")
        raise


def image_to_base64(image: Image.Image, format: str = "PNG") -> str:
    """
    将PIL图片转换为Base64
    """
    buffer = io.BytesIO()
    image.save(buffer, format=format)
    buffer.seek(0)
    return base64.b64encode(buffer.read()).decode('utf-8')


def image_to_data_uri(image: Image.Image, format: str = "PNG") -> str:
    """
    将图片转换为data URI
    """
    b64 = image_to_base64(image, format)
    return f"data:image/{format.lower()};base64,{b64}"


def upload_to_oss(image: Image.Image, oss_config: Dict = None) -> str:
    """
    上传图片到OSS（需要配置OSS）
    如果未配置OSS，返回data URI
    """
    if oss_config:
        # TODO: 实现OSS上传
        pass
    
    # 默认返回data URI
    return image_to_data_uri(image)


def ocr_image(image_url: str, api_key: str) -> Optional[Dict]:
    """
    调用OCR API识别单张图片
    """
    import requests
    
    prompt = """Analyze this image and extract text. Output ONLY valid JSON array.

Format: [{"type":"text","content":"recognized text","bbox":[x1,y1,x2,y2]}]

Example: [{"type":"text","content":"Hello World","bbox":[10,20,200,40]}]
Output only JSON array, nothing else."""
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    
    payload = {
        "model": MODEL_NAME,
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {"type": "image_url", "image_url": {"url": image_url}}
                ]
            }
        ],
        "temperature": 0.1,
        "max_tokens": 4096,
    }
    
    try:
        response = requests.post(API_URL, headers=headers, json=payload, timeout=120)
        
        if response.status_code == 200:
            result = response.json()
            content = result.get("choices", [{}])[0].get("message", {}).get("content", "")
            
            # 提取JSON
            import re
            json_match = re.search(r'\[[\s\S]*\]', content)
            if json_match:
                try:
                    return json.loads(json_match.group())
                except:
                    return []
            return []
        else:
            print(f"⚠️ OCR API error: {response.status_code}")
            return []
            
    except Exception as e:
        print(f"⚠️ OCR error: {e}")
        return []


def process_pdf(
    pdf_path: str,
    api_key: str,
    dpi: int = 300,
    translate_mode: str = None,
    output_file: str = None
) -> Dict[str, Any]:
    """
    处理PDF文件的主函数
    """
    print("=" * 60)
    print("PaddleOCR-VL PDF处理")
    print("=" * 60)
    
    if not os.path.exists(pdf_path):
        return {"success": False, "error": f"PDF file not found: {pdf_path}"}
    
    if not api_key:
        return {"success": False, "error": "API key is required"}
    
    try:
        # 1. PDF转图片
        images = pdf_to_images(pdf_path, dpi)
        
        if not images:
            return {"success": False, "error": "No pages found in PDF"}
        
        # 2. 处理每一页
        all_results = []
        
        for i, image in enumerate(images):
            print(f"\n📄 Processing page {i+1}/{len(images)}...")
            
            # 转换为data URI
            image_url = image_to_data_uri(image)
            
            # 调用OCR
            result = ocr_image(image_url, api_key)
            
            if result:
                # 添加页码信息
                for item in result:
                    item['page'] = i + 1
                all_results.extend(result)
                print(f"   ✅ Found {len(result)} elements")
            else:
                print(f"   ⚠️ No text found on page {i+1}")
        
        # 3. 构建返回结果
        output = {
            "success": True,
            "total_pages": len(images),
            "total_elements": len(all_results),
            "data": all_results
        }
        
        # 4. 保存结果
        if output_file:
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(output, f, ensure_ascii=False, indent=2)
            print(f"\n✅ Results saved to: {output_file}")
        
        print(f"\n✅ Processing complete!")
        print(f"   Pages: {len(images)}")
        print(f"   Elements: {len(all_results)}")
        
        return output
        
    except Exception as e:
        return {"success": False, "error": str(e)}


def main():
    parser = argparse.ArgumentParser(description="PaddleOCR-VL PDF处理工具")
    parser.add_argument("pdf", help="PDF文件路径")
    parser.add_argument("-o", "--output", help="输出JSON文件路径")
    parser.add_argument("--dpi", type=int, default=300, help="PDF转图片DPI (默认300)")
    parser.add_argument("--api-key", help="SiliconFlow API Key")
    
    args = parser.parse_args()
    
    # 获取API Key
    api_key = args.api_key or API_KEY
    if not api_key:
        print("Error: API key is required. Use --api-key or set SILICONFLOW_API_KEY")
        sys.exit(1)
    
    # 处理PDF
    result = process_pdf(
        pdf_path=args.pdf,
        api_key=api_key,
        dpi=args.dpi,
        output_file=args.output
    )
    
    # 输出结果
    print("\n" + "=" * 60)
    if result["success"]:
        print(f"✅ Success! Processed {result['total_pages']} pages, {result['total_elements']} elements")
    else:
        print(f"❌ Failed: {result.get('error')}")
        sys.exit(1)


if __name__ == "__main__":
    main()
