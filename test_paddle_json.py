"""
PaddleOCR-VL API 测试脚本 - 强制JSON输出
"""
import requests
import json
import re

# API配置
API_KEY = "sk-icpevgyimcputmrulscwaebswfyzbckuleiiyhqfowucttwy"
MODEL_NAME = "PaddlePaddle/PaddleOCR-VL-1.5"
API_URL = "https://api.siliconflow.cn/v1/chat/completions"

# 测试图片
TEST_IMAGE_URL = "https://sf-maas-uat-prod.oss-cn-shanghai.aliyuncs.com/suggestion/lbygavkzjykewmmpnzfutkvedlowunms.png"

# 强制JSON输出的Prompt - 英文更稳定
PROMPT = """Extract text from this image. Output ONLY valid JSON array. No other text.

Format: [{"type":"text","content":"recognized text","bbox":[x1,y1,x2,y2]}]

Example: [{"type":"text","content":"Hello World","bbox":[10,20,200,40]}]
Output only JSON array, nothing else."""

def test_api_json():
    print("=" * 60)
    print("PaddleOCR-VL API 测试 - 强制JSON输出")
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
        "temperature": 0.1,  # 低温度更确定性输出
        "max_tokens": 4096,
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
            print(f"\n📄 原始返回内容:")
            print("-" * 60)
            print(content)
            print("-" * 60)
            
            # 提取JSON数组
            json_match = re.search(r'\[[\s\S]*\]', content)
            if json_match:
                json_str = json_match.group()
                try:
                    data = json.loads(json_str)
                    print(f"\n🎉 JSON解析成功!")
                    print(f"识别到 {len(data)} 个元素")
                    print("\n📋 解析结果:")
                    for i, item in enumerate(data[:5]):
                        print(f"  {i+1}. {item}")
                    return True
                except json.JSONDecodeError as e:
                    print(f"\n⚠️ JSON解析失败: {e}")
                    return False
            else:
                print("\n⚠️ 未找到JSON数组格式")
                return False
        else:
            print(f"\n❌ API 调用失败!")
            print(f"错误信息: {response.text}")
            return False
            
    except Exception as e:
        print(f"\n❌ 发生异常: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_api_json()
    print("\n" + "=" * 60)
    print("测试结果:", "✅ 通过 - JSON格式正常" if success else "❌ 失败")
    print("=" * 60)
