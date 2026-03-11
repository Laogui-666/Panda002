"""
PaddleOCR-VL API 测试 - 使用正确的Prompt格式
"""
import requests
import json
import re

# API配置
API_KEY = "sk-icpevgyimcputmrulscwaebswfyzbckuleiiyhqfowucttwy"
MODEL_NAME = "Qwen/Qwen2-VL-72B-Instruct"  # 尝试使用Qwen模型
API_URL = "https://api.siliconflow.cn/v1/chat/completions"

# 测试图片 - 使用简单的英文图片
TEST_IMAGE_URL = "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"

# 使用模型推荐的Prompt
PROMPT = "What text do you see in this image? Return as JSON: [{\"text\": \"recognized text\"}]"

def test_api():
    print("=" * 60)
    print("测试 SiliconFlow API")
    print("=" * 60)
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    }
    
    payload = {
        "model": "Qwen/Qwen2-VL-72B-Instruct",  # 使用更稳定的模型
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "What text is in this image?"},
                    {"type": "image_url", "image_url": {"url": TEST_IMAGE_URL}}
                ]
            }
        ],
        "temperature": 0.1,
        "max_tokens": 1024,
        "stream": False
    }
    
    print(f"\n📡 正在调用 API...")
    
    try:
        response = requests.post(API_URL, headers=headers, json=payload, timeout=120)
        
        print(f"\n📊 响应状态码: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            content = result.get("choices", [{}])[0].get("message", {}).get("content", "")
            
            print("\n✅ API 调用成功!")
            print(f"\n📄 返回内容:")
            print("-" * 60)
            print(content)
            print("-" * 60)
            return True
        else:
            print(f"\n❌ API 调用失败!")
            print(f"错误信息: {response.text}")
            return False
            
    except Exception as e:
        print(f"\n❌ 发生异常: {str(e)}")
        return False

if __name__ == "__main__":
    test_api()
