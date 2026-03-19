"""
PaddleOCR-VL API 测试脚本
"""
import requests
import json

# API配置
API_KEY = "sk-icpevgyimcputmrulscwaebswfyzbckuleiiyhqfowucttwy"
MODEL_NAME = "PaddlePaddle/PaddleOCR-VL-1.5"
API_URL = "https://api.siliconflow.cn/v1/chat/completions"

# 测试图片（公开可用）
TEST_IMAGE_URL = "https://sf-maas-uat-prod.oss-cn-shanghai.aliyuncs.com/suggestion/lbygavkzjykewmmpnzfutkvedlowunms.png"

# Prompt
PROMPT = """请作为文档解析专家分析这张图片。
1. 识别所有文本块、标题、表格、图片和数学公式。
2. 对于每个元素，请提供：
   - type: 元素类型 (text, title, table, image, equation, header, footer)
   - bbox: 边界框坐标 [x_min, y_min, x_max, y_max] (相对于图片原始尺寸)
   - content: 识别出的具体内容
3. 【重要】请直接输出一个标准的 JSON 列表。
4. 【重要】不要包含 ```json 标记，不要包含任何解释性文字，只输出纯 JSON 数据。"""

def test_api():
    print("=" * 50)
    print("PaddleOCR-VL API 测试")
    print("=" * 50)
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    }
    
    payload = {
        "model": MODEL_NAME,
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": PROMPT},
                    {"type": "image_url", "image_url": {"url": TEST_IMAGE_URL}}
                ]
            }
        ],
        "temperature": 0.7,
        "max_tokens": 4096,
        "stream": False
    }
    
    print(f"\n📡 正在调用 API...")
    print(f"Model: {MODEL_NAME}")
    print(f"Image: {TEST_IMAGE_URL}")
    
    try:
        response = requests.post(API_URL, headers=headers, json=payload, timeout=120)
        
        print(f"\n📊 响应状态码: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            content = result.get("choices", [{}])[0].get("message", {}).get("content", "")
            
            print("\n✅ API 调用成功!")
            print(f"\n📄 识别结果 (完整):")
            print("-" * 50)
            print(content)
            print("-" * 50)
            
            # 尝试解析JSON
            try:
                # 清理Markdown标记
                clean = content.strip()
                if clean.startswith("```"):
                    clean = clean.replace("```json", "").replace("```", "").strip()
                
                data = json.loads(clean)
                print(f"\n🎉 JSON解析成功! 识别到 {len(data)} 个元素")
                return True
            except json.JSONDecodeError as e:
                print(f"\n⚠️ JSON解析失败: {e}")
                return False
        else:
            print(f"\n❌ API 调用失败!")
            print(f"错误信息: {response.text}")
            return False
            
    except Exception as e:
        print(f"\n❌ 发生异常: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_api()
    print("\n" + "=" * 50)
    print("测试结果:", "✅ 通过" if success else "❌ 失败")
    print("=" * 50)
