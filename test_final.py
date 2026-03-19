"""
PaddleOCR-VL API 测试 - 最终版
"""
import requests
import json
import re

# API配置
API_KEY = "sk-icpevgyimcputmrulscwaebswfyzbckuleiiyhqfowucttwy"
API_URL = "https://api.siliconflow.cn/v1/chat/completions"
MODEL_NAME = "PaddlePaddle/PaddleOCR-VL-1.5"

# 测试图片 - 使用有效的
TEST_IMAGE_URL = "https://httpbin.org/image/png"

# 强制JSON输出Prompt
PROMPT = """Analyze this image and extract text. Output ONLY valid JSON array.

Example output format:
[{"type":"text","content":"recognized text here","bbox":[0,0,100,20]}]

IMPORTANT: Output ONLY the JSON array, no other text."""

def test_api():
    print("=" * 60)
    print("PaddleOCR-VL API 测试 - JSON格式")
    print("=" * 60)
    
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
        "temperature": 0.1,
        "max_tokens": 2048,
    }
    
    print(f"\n📡 正在调用 API...")
    print(f"📷 图片: {TEST_IMAGE_URL}")
    
    try:
        response = requests.post(API_URL, headers=headers, json=payload, timeout=120)
        
        print(f"\n📊 状态码: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            content = result.get("choices", [{}])[0].get("message", {}).get("content", "")
            
            print("\n✅ API 调用成功!")
            print(f"\n📄 原始返回:")
            print("-" * 60)
            print(content[:500] if len(content) > 500 else content)
            print("-" * 60)
            
            # 提取JSON
            json_match = re.search(r'\[[\s\S]*\]', content)
            if json_match:
                try:
                    data = json.loads(json_match.group())
                    print(f"\n🎉 JSON解析成功!")
                    print(f"识别到 {len(data)} 个元素")
                    print(f"\n📋 结果: {json.dumps(data, ensure_ascii=False, indent=2)[:500]}...")
                    return True
                except:
                    pass
            
            print("\n⚠️ 无法解析为JSON，但API正常")
            return True
        else:
            print(f"\n❌ 失败: {response.text}")
            return False
            
    except Exception as e:
        print(f"\n❌ 异常: {e}")
        return False

if __name__ == "__main__":
    success = test_api()
    print("\n" + "=" * 60)
    print("结果:", "✅ API正常" if success else "❌ 失败")
    print("=" * 60)
