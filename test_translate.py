# -*- coding: utf-8 -*-
import urllib.request
import urllib.parse
import json

# Test translation API
url = 'http://localhost:3000/api/skills/paddle-ocr'
data = {
    "action": "translate_zh2en",
    "text": "你好世界"
}

req = urllib.request.Request(
    url,
    data=json.dumps(data).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)

try:
    with urllib.request.urlopen(req, timeout=30) as response:
        result = response.read().decode('utf-8')
        print("Response:", result)
except urllib.error.URLError as e:
    print("Error:", e.reason)
except Exception as e:
    print("Exception:", str(e))
