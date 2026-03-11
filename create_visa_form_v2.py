"""
创建带表单域的意大利签证申请表PDF - 正确版本
使用pypdf正确创建AcroForm
"""

import os
from pypdf import PdfWriter, PdfReader
from pypdf.generic import (
    DictionaryObject, ArrayObject, NameObject, TextStringObject, 
    NumberObject, RectangleObject, FloatObject, BooleanObject
)

def create_text_field(writer, page_num, field_name, x, y, width, height, default_value=""):
    """创建文本域"""
    annotation = DictionaryObject()
    annotation[NameObject("/Type")] = NameObject("/Annot")
    annotation[NameObject("/Subtype")] = NameObject("/Widget")
    annotation[NameObject("/T")] = TextStringObject(field_name)
    annotation[NameObject("/V")] = TextStringObject(default_value)
    annotation[NameObject("/Rect")] = RectangleObject([x, y, x + width, y + height])
    annotation[NameObject("/FT")] = NameObject("/Tx")
    annotation[NameObject("/F")] = NumberObject(4)
    annotation[NameObject("/Q")] = NumberObject(0)  # 左对齐
    
    # 添加DA (Default Appearance) - 黑色10pt Helvetica
    annotation[NameObject("/DA")] = TextStringObject("/Helv 10 Tf 0 g")
    
    writer.add_annotation(page_num, annotation)
    return annotation

def create_checkbox(writer, page_num, field_name, x, y, size):
    """创建复选框"""
    annotation = DictionaryObject()
    annotation[NameObject("/Type")] = NameObject("/Annot")
    annotation[NameObject("/Subtype")] = NameObject("/Widget")
    annotation[NameObject("/T")] = TextStringObject(field_name)
    annotation[NameObject("/Rect")] = RectangleObject([x, y, x + size, y + size])
    annotation[NameObject("/FT")] = NameObject("/Btn")
    annotation[NameObject("/F")] = NumberObject(4)
    annotation[NameObject("/V")] = TextStringObject("Off")
    annotation[NameObject("/AS")] = TextStringObject("Off")
    
    # 复选框需要设置 Yes 值
    annotation[NameObject("/MK")] = DictionaryObject()
    annotation[NameObject("/MK")][NameObject("/CA")] = TextStringObject("4")
    
    writer.add_annotation(page_num, annotation)
    return annotation

def create_pdf_with_form():
    """创建带表单的PDF"""
    output_path = r"C:\Users\Administrator\Desktop\muhai001\muhai001\public\templates\italy_schengen_visa_form.pdf"
    
    writer = PdfWriter()
    
    # 添加空白页（Letter大小）
    from pypdf import PageObject
    page1 = PageObject.create_blank_page(width=612, height=792)  # Letter size
    page2 = PageObject.create_blank_page(width=612, height=792)
    
    writer.add_page(page1)
    writer.add_page(page2)
    
    # ========== 第1页字段 ==========
    # 姓 (Surname)
    create_text_field(writer, 0, "surname", 150, 700, 250, 20)
    # 名 (Given Names)
    create_text_field(writer, 0, "given_names", 420, 700, 150, 20)
    # 出生日期
    create_text_field(writer, 0, "date_of_birth", 150, 670, 100, 20)
    # 出生地
    create_text_field(writer, 0, "place_of_birth", 280, 670, 290, 20)
    # 国籍
    create_text_field(writer, 0, "nationality", 150, 640, 150, 20)
    # 性别
    create_text_field(writer, 0, "sex", 350, 640, 50, 20)
    # 婚姻状况
    create_text_field(writer, 0, "marital_status", 430, 640, 140, 20)
    
    # 护照信息
    create_text_field(writer, 0, "passport_number", 150, 610, 120, 20)
    create_text_field(writer, 0, "passport_type", 300, 610, 80, 20)
    create_text_field(writer, 0, "passport_issuing_authority", 400, 610, 170, 20)
    create_text_field(writer, 0, "passport_issue_date", 150, 580, 100, 20)
    create_text_field(writer, 0, "passport_expiry_date", 280, 580, 120, 20)
    
    # 联系信息
    create_text_field(writer, 0, "email", 150, 550, 250, 20)
    create_text_field(writer, 0, "phone", 420, 550, 150, 20)
    create_text_field(writer, 0, "address", 150, 520, 420, 20)
    
    # 旅行信息
    create_text_field(writer, 0, "destination_country", 150, 490, 150, 20)
    create_text_field(writer, 0, "first_entry_country", 320, 490, 120, 20)
    create_text_field(writer, 0, "arrival_date", 460, 490, 110, 20)
    create_text_field(writer, 0, "departure_date", 150, 460, 120, 20)
    create_text_field(writer, 0, "entry_number", 300, 460, 80, 20)
    
    # 签证类型
    create_text_field(writer, 0, "visa_type", 150, 430, 150, 20)
    create_text_field(writer, 0, "visa_category", 320, 430, 80, 20)
    
    # 邀请人信息
    create_text_field(writer, 0, "inviting_name", 150, 400, 200, 20)
    create_text_field(writer, 0, "inviting_address", 150, 370, 420, 20)
    create_text_field(writer, 0, "inviting_phone", 150, 340, 150, 20)
    
    # ========== 第2页字段 ==========
    # 费用承担
    create_text_field(writer, 1, "funds", 150, 700, 250, 20)
    
    # 雇主/学校信息
    create_text_field(writer, 1, "employer_school", 150, 670, 300, 20)
    create_text_field(writer, 1, "employer_address", 150, 640, 420, 20)
    create_text_field(writer, 1, "employer_phone", 150, 610, 150, 20)
    create_text_field(writer, 1, "occupation", 320, 610, 150, 20)
    
    # 旅行历史
    create_text_field(writer, 1, "previous_schengen_visa", 150, 580, 100, 20)
    create_text_field(writer, 1, "previous_visa_refusal", 280, 580, 100, 20)
    create_text_field(writer, 1, "fingerprints", 420, 580, 100, 20)
    
    # 同行人
    create_text_field(writer, 1, "travel_companion", 150, 550, 150, 20)
    
    # 签名日期
    create_text_field(writer, 1, "submission_date", 150, 100, 120, 20)
    
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

if __name__ == "__main__":
    create_pdf_with_form()
