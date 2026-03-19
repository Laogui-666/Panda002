# -*- coding: utf-8 -*-
import urllib.request
import urllib.parse
import json

# Test SiliconFlow API directly
api_key = "sk-icpevgyimcputmrulscwaebswfyzbckuleiiyhqfowucttwy"
url = 'https://api.siliconflow.cn/v1/chat/completions'

data = {
    "model": "deepseek-ai/DeepSeek-Chat",
    "messages": [
        {"role": "user", "content": "请将以下中文翻译成英文：你好世界"}
    ],
    "temperature": 0.3,
    "max_tokens": 4096,
    "stream": False
}

req = urllib.request.Request(
    url,
    data=json.dumps(data).encode('utf-8'),
    headers={
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {api_key}'
    }
)

try:
    with urllib.request.urlopen(req, timeout=30) as response:
        result = response.read().decode('utf-8')
        print("Response:", result)
except urllib.error.URLError as e:
    print("Error:", e.reason)
    if hasattr(e, 'read'):
        print("Detail:", e.read().decode('utf-8'))
except Exception as e:
    print("Exception:", str(e))
