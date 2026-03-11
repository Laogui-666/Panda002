#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""验证PDF表单域"""

from pypdf import PdfReader
import os

PDF_FILE = r"C:\Users\Administrator\Desktop\muhai001\muhai001\public\templates\italy_schengen_visa_form.pdf"

reader = PdfReader(PDF_FILE)

print(f"页数: {len(reader.pages)}")
print(f"\n表单字段:")
print("=" * 50)

if reader.get_form_text_fields():
    fields = reader.get_form_text_fields()
    for name, value in fields.items():
        print(f"  {name}: {value}")
else:
    print("  无文本域")

print("\n\n所有表单域(含空值):")
print("=" * 50)

# 获取所有页面
for page_num, page in enumerate(reader.pages, 1):
    print(f"\n第 {page_num} 页:")
    if "/Annots" in page:
        annots = page["/Annots"]
        for annot in annots:
            obj = annot.get_object()
            if "/T" in obj:
                field_name = obj["/T"]
                print(f"  - {field_name}")
