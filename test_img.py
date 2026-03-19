"""
PaddleOCR-VL API 测试 - 修复图片问题
"""
import requests
import json

# API配置
API_KEY = "sk-icpevgyimcputmrulscwaebswfyzbckuleiiyhqfowucttwy"
API_URL = "https://api.siliconflow.cn/v1/chat/completions"
MODEL_NAME = "PaddlePaddle/PaddleOCR-VL-1.5"

# 使用有效的公开图片
TEST_IMAGES = [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Example_image.svg/600px-Example_image.svg.png",
    "https://httpbin.org/image/png",
]

PROMPT = "Extract text from this image. Return JSON."

def test_with_image(image_url):
    print(f"\n测试图片: {image_url[:50]}...")
    
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
                    {"type": "image_url", "image_url": {"url": image_url}}
                ]
            }
        ],
        "temperature": 0.1,
        "max_tokens": 1024,
    }
    
    try:
        response = requests.post(API_URL, headers=headers, json=payload, timeout=60)
        print(f"状态码: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            content = result.get("choices", [{}])[0].get("message", {}).get("content", "")
            print(f"✅ 成功!")
            print(f"内容: {content[:300]}...")
            return True
        else:
            print(f"❌ 失败: {response.text[:200]}")
            return False
    except Exception as e:
        print(f"❌ 异常: {e}")
        return False

if __name__ == "__main__":
    for img in TEST_IMAGES:
        test_with_image(img)
