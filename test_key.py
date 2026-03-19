"""
PaddleOCR-VL API 测试 - 使用正确的格式
"""
import requests
import json
import re

# API配置
API_KEY = "sk-icpevgyimcputmrulscwaebswfyzbckuleiiyhqfowucttwy"
API_URL = "https://api.siliconflow.cn/v1/chat/completions"

# 尝试不同的模型
MODELS = [
    "PaddlePaddle/PaddleOCR-VL-1.5",
    "PaddlePaddle/paddleocr-vl-1.5",
]

# 测试图片 - 使用更简单的
TEST_IMAGE_URL = "https://hсь/picsum.photos/200/100"

# 简单Prompt
PROMPT = "Extract all text from this image. Return JSON array."

def test_model(model_name):
    print(f"\n{'='*60}")
    print(f"测试模型: {model_name}")
    print(f"{'='*60}")
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    }
    
    payload = {
        "model": model_name,
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
        "max_tokens": 1024,
    }
    
    try:
        response = requests.post(API_URL, headers=headers, json=payload, timeout=60)
        print(f"状态码: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            content = result.get("choices", [{}])[0].get("message", {}).get("content", "")
            print(f"✅ 成功!")
            print(f"内容: {content[:200]}...")
            return True
        else:
            print(f"❌ 失败: {response.text[:200]}")
            return False
    except Exception as e:
        print(f"❌ 异常: {e}")
        return False

# 测试API Key是否有效 - 使用简单文本模型
def test_api_key():
    print("\n" + "="*60)
    print("测试 API Key 是否有效")
    print("="*60)
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    }
    
    # 使用一个简单的文本模型测试
    payload = {
        "model": "Qwen/Qwen2.5-7B-Instruct",
        "messages": [{"role": "user", "content": "Say 'hello' in one word"}],
        "max_tokens": 10,
    }
    
    try:
        response = requests.post(API_URL, headers=headers, json=payload, timeout=30)
        print(f"状态码: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            content = result.get("choices", [{}])[0].get("message", {}).get("content", "")
            print(f"✅ API Key 有效! 响应: {content}")
            return True
        else:
            print(f"❌ API Key 无效: {response.text}")
            return False
    except Exception as e:
        print(f"❌ 异常: {e}")
        return False

if __name__ == "__main__":
    # 先测试API Key
    if test_api_key():
        print("\nAPI Key 有效，测试OCR模型...")
        # 测试OCR模型
        for model in MODELS:
            test_model(model)
