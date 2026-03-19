"""
创建带表单域的意大利签证申请表PDF - 使用writer.add_form_field
"""

import os
from pypdf import PdfWriter, PdfReader, PageObject
from pypdf.generic import (
    DictionaryObject, ArrayObject, NameObject, TextStringObject, 
    NumberObject, RectangleObject
)

def create_pdf_with_form():
    """创建带表单的PDF"""
    output_path = r"C:\Users\Administrator\Desktop\muhai001\muhai001\public\templates\italy_schengen_visa_form.pdf"
    
    writer = PdfWriter()
    
    # 添加空白页（Letter大小）
    page1 = PageObject.create_blank_page(width=612, height=792)
    page2 = PageObject.create_blank_page(width=612, height=792)
    
    writer.add_page(page1)
    writer.add_page(page2)
    
    # ========== 使用add_form_field_text_field ==========
    # 第1页字段 (y坐标从上往下，792是顶部)
    
    # 姓名行
    writer.add_form_field_text_field(
        field_name="surname",
        page=0,
        x=150,
        y=700,
        width=250,
        height=20,
        field_value=""
    )
    writer.add_form_field_text_field(
        field_name="given_names",
        page=0,
        x=420,
        y=700,
        width=150,
        height=20,
        field_value=""
    )
    
    # 出生信息
    writer.add_form_field_text_field(
        field_name="date_of_birth",
        page=0,
        x=150,
        y=670,
        width=100,
        height=20,
        field_value=""
    )
    writer.add_form_field_text_field(
        field_name="place_of_birth",
        page=0,
        x=280,
        y=670,
        width=290,
        height=20,
        field_value=""
    )
    
    # 国籍、性别、婚姻
    writer.add_form_field_text_field(
        field_name="nationality",
        page=0,
        x=150,
        y=640,
        width=150,
        height=20,
        field_value=""
    )
    writer.add_form_field_text_field(
        field_name="sex",
        page=0,
        x=350,
        y=640,
        width=50,
        height=20,
        field_value=""
    )
    writer.add_form_field_text_field(
        field_name="marital_status",
        page=0,
        x=430,
        y=640,
        width=140,
        height=20,
        field_value=""
    )
    
    # 护照信息
    writer.add_form_field_text_field(
        field_name="passport_number",
        page=0,
        x=150,
        y=610,
        width=120,
        height=20,
        field_value=""
    )
    writer.add_form_field_text_field(
        field_name="passport_type",
        page=0,
        x=300,
        y=610,
        width=80,
        height=20,
        field_value=""
    )
    writer.add_form_field_text_field(
        field_name="passport_issuing_authority",
        page=0,
        x=400,
        y=610,
        width=170,
        height=20,
        field_value=""
    )
    writer.add_form_field_text_field(
        field_name="passport_issue_date",
        page=0,
        x=150,
        y=580,
        width=100,
        height=20,
        field_value=""
    )
    writer.add_form_field_text_field(
        field_name="passport_expiry_date",
        page=0,
        x=280,
        y=580,
        width=120,
        height=20,
        field_value=""
    )
    
    # 联系信息
    writer.add_form_field_text_field(
        field_name="email",
        page=0,
        x=150,
        y=550,
        width=250,
        height=20,
        field_value=""
    )
    writer.add_form_field_text_field(
        field_name="phone",
        page=0,
        x=420,
        y=550,
        width=150,
        height=20,
        field_value=""
    )
    writer.add_form_field_text_field(
        field_name="address",
        page=0,
        x=150,
        y=520,
        width=420,
        height=20,
        field_value=""
    )
    
    # 旅行信息
    writer.add_form_field_text_field(
        field_name="destination_country",
        page=0,
        x=150,
        y=490,
        width=150,
        height=20,
        field_value=""
    )
    writer.add_form_field_text_field(
        field_name="first_entry_country",
        page=0,
        x=320,
        y=490,
        width=120,
        height=20,
        field_value=""
    )
    writer.add_form_field_text_field(
        field_name="arrival_date",
        page=0,
        x=460,
        y=490,
        width=110,
        height=20,
        field_value=""
    )
    writer.add_form_field_text_field(
        field_name="departure_date",
        page=0,
        x=150,
        y=460,
        width=120,
        height=20,
        field_value=""
    )
    writer.add_form_field_text_field(
        field_name="entry_number",
        page=0,
        x=300,
        y=460,
        width=80,
        height=20,
        field_value=""
    )
    
    # 签证类型
    writer.add_form_field_text_field(
        field_name="visa_type",
        page=0,
        x=150,
        y=430,
        width=150,
        height=20,
        field_value=""
    )
    writer.add_form_field_text_field(
        field_name="visa_category",
        page=0,
        x=320,
        y=430,
        width=80,
        height=20,
        field_value=""
    )
    
    # 邀请人信息
    writer.add_form_field_text_field(
        field_name="inviting_name",
        page=0,
        x=150,
        y=400,
        width=200,
        height=20,
        field_value=""
    )
    writer.add_form_field_text_field(
        field_name="inviting_address",
        page=0,
        x=150,
        y=370,
        width=420,
        height=20,
        field_value=""
    )
    writer.add_form_field_text_field(
        field_name="inviting_phone",
        page=0,
        x=150,
        y=340,
        width=150,
        height=20,
        field_value=""
    )
    
    # ========== 第2页字段 ==========
    writer.add_form_field_text_field(
        field_name="funds",
        page=1,
        x=150,
        y=700,
        width=250,
        height=20,
        field_value=""
    )
    
    # 雇主/学校信息
    writer.add_form_field_text_field(
        field_name="employer_school",
        page=1,
        x=150,
        y=670,
        width=300,
        height=20,
        field_value=""
    )
    writer.add_form_field_text_field(
        field_name="employer_address",
        page=1,
        x=150,
        y=640,
        width=420,
        height=20,
        field_value=""
    )
    writer.add_form_field_text_field(
        field_name="employer_phone",
        page=1,
        x=150,
        y=610,
        width=150,
        height=20,
        field_value=""
    )
    writer.add_form_field_text_field(
        field_name="occupation",
        page=1,
        x=320,
        y=610,
        width=150,
        height=20,
        field_value=""
    )
    
    # 旅行历史
    writer.add_form_field_text_field(
        field_name="previous_schengen_visa",
        page=1,
        x=150,
        y=580,
        width=100,
        height=20,
        field_value=""
    )
    writer.add_form_field_text_field(
        field_name="previous_visa_refusal",
        page=1,
        x=280,
        y=580,
        width=100,
        height=20,
        field_value=""
    )
    writer.add_form_field_text_field(
        field_name="fingerprints",
        page=1,
        x=420,
        y=580,
        width=100,
        height=20,
        field_value=""
    )
    
    # 同行人
    writer.add_form_field_text_field(
        field_name="travel_companion",
        page=1,
        x=150,
        y=550,
        width=150,
        height=20,
        field_value=""
    )
    
    # 签名日期
    writer.add_form_field_text_field(
        field_name="submission_date",
        page=1,
        x=150,
        y=100,
        width=120,
        height=20,
        field_value=""
    )
    
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
        for name in list(fields.keys())[:20]:
            print(f"  - {name}")

if __name__ == "__main__":
    create_pdf_with_form()
