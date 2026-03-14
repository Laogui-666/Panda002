# -*- coding: utf-8 -*-
import os
import re

os.chdir(r'C:\Users\Administrator\Desktop\muhai001\muhai001')

with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Find and replace id 5 - 智能工具 with 签证申请
old_pattern = r"\{[\s\n]*id: 5,[\s\n]*name: '智能工具',[\s\n]*icon:.*?description: '一键处理签证材料',[\s\n]*status: 'coming_soon',[\s\n]*color: 'from-morandi-blush to-morandi-ocean',[\s\n]*iconBg: 'bg-morandi-blush',[\s\n]*\},"

new_text = """{
    id: 5,
    name: '签证申请',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    description: '智能填写各国签证申请表',
    href: '/services/visa',
    status: 'new',
    color: 'from-morandi-blush to-morandi-ocean',
    iconBg: 'bg-morandi-blush',
  },"""

content = re.sub(old_pattern, new_text, content, flags=re.DOTALL)

with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
    
print('Done')
