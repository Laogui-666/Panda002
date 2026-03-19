"""
创建带表单域的意大利签证申请表PDF - 手动创建AcroForm结构
"""

import os
from pypdf import PdfWriter, PdfReader, PageObject
from pypdf.generic import (
    DictionaryObject, ArrayObject, NameObject, TextStringObject, 
    NumberObject, RectangleObject, IndirectObject, NullObject, BooleanObject
)

def create_text_field(writer, page, field_name, x, y, width, height, value=""):
    """创建文本域并返回"""
    # 创建字段字典
    field = DictionaryObject()
    field[NameObject("/Type")] = NameObject("/Annot")
    field[NameObject("/Subtype")] = NameObject("/Widget")
    field[NameObject("/FT")] = NameObject("/Tx")
    field[NameObject("/T")] = TextStringObject(field_name)
    field[NameObject("/V")] = TextStringObject(value)
    field[NameObject("/DV")] = TextStringObject(value)
    field[NameObject("/Rect")] = RectangleObject([x, y, x + width, y + height])
    field[NameObject("/F")] = NumberObject(4)
    field[NameObject("/Q")] = NumberObject(0)
    field[NameObject("/DA")] = TextStringObject("/Helv 10 Tf 0 g")
    
    page[NameObject("/Annots")].append(writer._add_object(field))
    return field

def create_pdf_with_form():
    """创建带表单的PDF"""
    output_path = r"C:\Users\Administrator\Desktop\muhai001\muhai001\public\templates\italy_schengen_visa_form.pdf"
    
    writer = PdfWriter()
    
    # 添加空白页
    page1 = PageObject.create_blank_page(width=612, height=792)
    page2 = PageObject.create_blank_page(width=612, height=792)
    
    # 为每页添加Annots数组
    page1[NameObject("/Annots")] = ArrayObject()
    page2[NameObject("/Annots")] = ArrayObject()
    
    writer.add_page(page1)
    writer.add_page(page2)
    
    # 第1页字段
    create_text_field(writer, page1, "surname", 150, 700, 250, 20)
    create_text_field(writer, page1, "given_names", 420, 700, 150, 20)
    create_text_field(writer, page1, "date_of_birth", 150, 670, 100, 20)
    create_text_field(writer, page1, "place_of_birth", 280, 670, 290, 20)
    create_text_field(writer, page1, "nationality", 150, 640, 150, 20)
    create_text_field(writer, page1, "sex", 350, 640, 50, 20)
    create_text_field(writer, page1, "marital_status", 430, 640, 140, 20)
    create_text_field(writer, page1, "passport_number", 150, 610, 120, 20)
    create_text_field(writer, page1, "passport_type", 300, 610, 80, 20)
    create_text_field(writer, page1, "passport_issuing_authority", 400, 610, 170, 20)
    create_text_field(writer, page1, "passport_issue_date", 150, 580, 100, 20)
    create_text_field(writer, page1, "passport_expiry_date", 280, 580, 120, 20)
    create_text_field(writer, page1, "email", 150, 550, 250, 20)
    create_text_field(writer, page1, "phone", 420, 550, 150, 20)
    create_text_field(writer, page1, "address", 150, 520, 420, 20)
    create_text_field(writer, page1, "destination_country", 150, 490, 150, 20)
    create_text_field(writer, page1, "first_entry_country", 320, 490, 120, 20)
    create_text_field(writer, page1, "arrival_date", 460, 490, 110, 20)
    create_text_field(writer, page1, "departure_date", 150, 460, 120, 20)
    create_text_field(writer, page1, "entry_number", 300, 460, 80, 20)
    create_text_field(writer, page1, "visa_type", 150, 430, 150, 20)
    create_text_field(writer, page1, "visa_category", 320, 430, 80, 20)
    create_text_field(writer, page1, "inviting_name", 150, 400, 200, 20)
    create_text_field(writer, page1, "inviting_address", 150, 370, 420, 20)
    create_text_field(writer, page1, "inviting_phone", 150, 340, 150, 20)
    
    # 第2页字段
    create_text_field(writer, page2, "funds", 150, 700, 250, 20)
    create_text_field(writer, page2, "employer_school", 150, 670, 300, 20)
    create_text_field(writer, page2, "employer_address", 150, 640, 420, 20)
    create_text_field(writer, page2, "employer_phone", 150, 610, 150, 20)
    create_text_field(writer, page2, "occupation", 320, 610, 150, 20)
    create_text_field(writer, page2, "previous_schengen_visa", 150, 580, 100, 20)
    create_text_field(writer, page2, "previous_visa_refusal", 280, 580, 100, 20)
    create_text_field(writer, page2, "fingerprints", 420, 580, 100, 20)
    create_text_field(writer, page2, "travel_companion", 150, 550, 150, 20)
    create_text_field(writer, page2, "submission_date", 150, 100, 120, 20)
    
    # 添加AcroForm到根对象
    root = writer._root_object
    acroform = DictionaryObject()
    acroform[NameObject("/Fields")] = ArrayObject()
    acroform[NameObject("/NeedAppearances")] = BooleanObject(True)
    acroform[NameObject("/DA")] = TextStringObject("/Helv 10 Tf 0 g")
    root[NameObject("/AcroForm")] = writer._add_object(acroform)
    
    # 保存PDF
    with open(output_path, "wb") as f:
        writer.write(f)
    
    print(f"PDF已创建: {output_path}")
    
    # 验证
    reader = PdfReader(output_path)
    if "/AcroForm" in reader.trailer["/Root"]:
        print("✓ PDF包含AcroForm")
        form = reader.trailer["/Root"]["/AcroForm"]
        if "/Fields" in form:
            print(f"✓ 共有 {len(form['/Fields'])} 个表单字段")
    else:
        print("✗ PDF没有AcroForm")
        
    # 列出所有字段
    fields = reader.get_form_text_fields()
    if fields:
        print(f"\n表单字段列表 ({len(fields)}个):")
        for name in list(fields.keys()):
            print(f"  - {name}")

if __name__ == "__main__":
    create_pdf_with_form()
