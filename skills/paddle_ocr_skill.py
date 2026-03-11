import requests
import json
import re
import os
from typing import List, Dict, Any, Optional

class PaddleOCRVLSkill:
    """
    PaddleOCR-VL-1.5 文档解析技能包
    功能：识别图片/PDF截图中的排版布局，输出结构化 JSON (含坐标、类型、内容)
    """

    def __init__(self, api_key: Optional[str] = None, model_name: str = "PaddlePaddle/PaddleOCR-VL-1.5"):
        """
        初始化技能
        :param api_key: SiliconFlow API Key。如果不传，默认读取环境变量 SILICONFLOW_API_KEY
        :param model_name: 模型名称，默认为 PaddlePaddle/PaddleOCR-VL-1.5
        """
        self.api_key = api_key or os.getenv("SILICONFLOW_API_KEY")
        if not self.api_key:
            raise ValueError("未提供 API Key。请传入 api_key 参数或设置 SILICONFLOW_API_KEY 环境变量。")
        
        self.model_name = model_name
        self.api_url = "https://api.siliconflow.cn/v1/chat/completions"
        
        # 默认配置
        self.default_temp = 0.7
        self.default_max_tokens = 20000
        self.default_timeout = 120  # 文档解析耗时较长，增加超时时间

    def _build_prompt(self, mode: str = "layout_json") -> str:
        """构建针对不同需求的 Prompt"""
        if mode == "layout_json":
            return """
            请作为文档解析专家分析这张图片。
            1. 识别所有文本块、标题、表格、图片和数学公式。
            2. 对于每个元素，请提供：
               - type: 元素类型 (text, title, table, image, equation, header, footer)
               - bbox: 边界框坐标 [x_min, y_min, x_max, y_max] (相对于图片原始尺寸)
               - content: 识别出的具体内容 
                 * 表格：请输出完整的 HTML <table> 字符串
                 * 公式：请输出 LaTeX 字符串 (例如: $E=mc^2$ 或 \\[ ... \\])
                 * 普通文本：直接输出文本内容
            3. 【重要】请直接输出一个标准的 JSON 列表 (List[Dict])。
            4. 【重要】不要包含 ```json 标记，不要包含任何解释性文字，只输出纯 JSON 数据。
            """
        elif mode == "markdown":
            return "请将这张图片的内容完整转换为 Markdown 格式，保留标题层级、表格结构和公式（LaTeX）。"
        else:
            return "请描述这张图片的内容。"

    def analyze_layout(self, image_url: str, mode: str = "layout_json") -> Optional[Any]:
        """
        核心方法：分析图片布局
        :param image_url: 图片的公网 URL 或 Base64 数据 URI
        :param mode: 'layout_json' (结构化数据) 或 'markdown' (纯文本)
        :return: 解析后的 Python 对象 (List 或 Str)，如果失败返回 None
        """
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}"
        }

        payload = {
            "model": self.model_name,
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": self._build_prompt(mode)},
                        {
                            "type": "image_url",
                            "image_url": {"url": image_url}
                        }
                    ]
                }
            ],
            "temperature": self.default_temp,
            "max_tokens": self.default_max_tokens,
            "stream": False
        }

        try:
            response = requests.post(self.api_url, headers=headers, json=payload, timeout=self.default_timeout)
            
            if response.status_code == 200:
                result = response.json()
                raw_content = result["choices"][0]["message"]["content"]
                
                # 后处理：根据模式清洗数据
                return self._post_process(raw_content, mode)
            else:
                print(f"[Error] API 请求失败: {response.status_code}")
                print(f"[Detail] {response.text}")
                return None

        except Exception as e:
            print(f"[Exception] 发生异常: {str(e)}")
            return None

    def _post_process(self, raw_content: str, mode: str) -> Any:
        """清洗模型输出，去除 Markdown 标记"""
        clean_text = raw_content.strip()
        
        # 去除常见的 Markdown 代码块标记
        if clean_text.startswith("```"):
            # 匹配 ```json ... ``` 或 ``` ... ```
            clean_text = re.sub(r'^```\w*\n', '', clean_text)
            clean_text = re.sub(r'\n```$', '', clean_text)
            clean_text = clean_text.strip()

        if mode == "layout_json":
            try:
                return json.loads(clean_text)
            except json.JSONDecodeError as e:
                print(f"[Warning] JSON 解析失败: {e}")
                print(f"[Raw Content Preview]: {clean_text[:200]}...")
                return None
        else:
            return clean_text

    def save_to_html(self, data: List[Dict], output_path: str, page_width: int = 794, page_height: int = 1123):
        """
        (辅助方法) 将 layout_json 数据直接保存为绝对定位的 HTML 文件
        :param data: analyze_layout 返回的 JSON 列表
        :param output_path: 输出文件路径
        :param page_width/height: 画布尺寸 (默认 A4 @ 96DPI)
        """
        if not data:
            print("数据为空，无法生成 HTML")
            return

        html_header = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>PaddleOCR Layout Result</title>
            <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
            <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
            <style>
                body {{ margin: 0; padding: 20px; background: #f0f0f0; }}
                .page {{ 
                    position: relative; 
                    width: {page_width}px; 
                    height: {page_height}px; 
                    background: white; 
                    margin: 0 auto; 
                    box-shadow: 0 0 15px rgba(0,0,0,0.1); 
                    overflow: hidden;
                }}
                .elem {{ position: absolute; box-sizing: border-box; padding: 2px; }}
                .elem-table {{ overflow: auto; }}
                .elem-equation {{ font-style: italic; }}
            </style>
        </head>
        <body>
        <div class="page">
        """
        
        html_body = ""
        for item in data:
            bbox = item.get('bbox', [0,0,0,0])
            x, y, w, h = bbox[0], bbox[1], bbox[2]-bbox[0], bbox[3]-bbox[1]
            content = item.get('content', '')
            elem_type = item.get('type', 'text')
            
            style = f"left: {x}px; top: {y}px; width: {w}px; height: {h}px;"
            
            # 简单的标签映射
            tag = 'div'
            cls = 'elem'
            inner = content
            
            if elem_type == 'table':
                cls += ' elem-table'
                # 确保表格内容被正确包裹
                if not content.strip().startswith('<table'):
                    inner = f"<div>{content}</div>" 
                else:
                    inner = content
            elif elem_type == 'equation':
                cls += ' elem-equation'
                # 自动添加 LaTeX 定界符如果没有的话
                if '$' not in content and '\\[' not in content:
                    inner = f"\\[{content}\\]"
                else:
                    inner = content
            elif elem_type == 'title':
                tag = 'h2'
                style = f"left: {x}px; top: {y}px; width: {w}px;" # 标题高度自适应
                inner = content
            else:
                tag = 'p'
                inner = content.replace('\n', '<br>')

            html_body += f"<{tag} class='{cls}' style='{style}'>{inner}</{tag}>\n"

        html_footer = "</div></body></html>"
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(html_header + html_body + html_footer)
        
        print(f"✅ HTML 已生成: {output_path}")

# ==========================================
# 使用示例 (当直接运行此文件时)
# ==========================================
if __name__ == "__main__":
    # ⚠️ 请替换为你的真实 Key，或者在终端 export SILICONFLOW_API_KEY=sk-...
    MY_API_KEY = "sk-icpevgyimcputmrulscwaebswfyzbckuleiiyhqfowucttwy" 
    
    # 1. 初始化技能
    ocr_skill = PaddleOCRVLSkill(api_key=MY_API_KEY)
    
    # 2. 准备图片
    img_url = "https://sf-maas-uat-prod.oss-cn-shanghai.aliyuncs.com/suggestion/lbygavkzjykewmmpnzfutkvedlowunms.png"
    
    print("🚀 开始执行文档布局分析...")
    
    # 3. 调用分析 (获取结构化 JSON)
    result_data = ocr_skill.analyze_layout(img_url, mode="layout_json")
    
    if result_data:
        print(f"✅ 分析成功！识别到 {len(result_data)} 个元素。")
        # 打印第一个元素看看
        print("样本数据:", result_data[0] if len(result_data) > 0 else "无")
        
        # 4. (可选) 直接生成 HTML 文件
        ocr_skill.save_to_html(result_data, "output_layout.html")
    else:
        print("❌ 分析失败，请检查日志。")