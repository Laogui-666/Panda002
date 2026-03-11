#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
意大利申根签证申请表 - PDF表单模板生成器
生成带可填写表单域的PDF模板
"""

from pypdf import PdfWriter, PdfReader, PageObject
from pypdf.generic import (
    ArrayObject, BooleanObject, ByteStringObject, DictionaryObject, 
    FloatObject, NameObject, NumberObject, TextStringObject, RectangleObject
)
import io
import os

# 输出路径
OUTPUT_DIR = r"C:\Users\Administrator\Desktop\muhai001\muhai001\public\templates"
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "italy_schengen_visa_form.pdf")

def create_text_field(writer, page_num, name, x, y, width, height):
    """创建文本域"""
    annotation = DictionaryObject()
    annotation[NameObject("/Type")] = NameObject("/Annot")
    annotation[NameObject("/Subtype")] = NameObject("/Widget")
    annotation[NameObject("/T")] = TextStringObject(name)
    annotation[NameObject("/V")] = TextStringObject("")
    annotation[NameObject("/Rect")] = RectangleObject([x, y, x + width, y + height])
    annotation[NameObject("/FT")] = NameObject("/Tx")
    annotation[NameObject("/F")] = NumberObject(4)  # Print flag
    annotation[NameObject("/Q")] = NumberObject(0)  # Left align
    
    # 边框样式
    annotation[NameObject("/Border")] = ArrayObject([NumberObject(0), NumberObject(0), NumberObject(1)])
    annotation[NameObject("/BS")] = DictionaryObject({
        NameObject("/W"): NumberObject(1),
        NameObject("/S"): NameObject("/S")
    })
    
    writer.add_annotation(page_num, annotation)

def create_checkbox(writer, page_num, name, x, y, size=15):
    """创建复选框"""
    annotation = DictionaryObject()
    annotation[NameObject("/Type")] = NameObject("/Annot")
    annotation[NameObject("/Subtype")] = NameObject("/Widget")
    annotation[NameObject("/T")] = TextStringObject(name)
    annotation[NameObject("/Rect")] = RectangleObject([x, y, x + size, y + size])
    annotation[NameObject("/FT")] = NameObject("/Btn")
    annotation[NameObject("/F")] = NumberObject(4)
    annotation[NameObject("/V")] = NameObject("/Off")
    annotation[NameObject("/AS")] = NameObject("/Off")
    
    # 复选框选项
    annotation[NameObject("/Opt")] = ArrayObject([TextStringObject("Yes")])
    
    writer.add_annotation(page_num, annotation)

def create_pdf_with_form_fields():
    """创建带表单域的PDF"""
    
    writer = PdfWriter()
    
    # 创建第一页 (A4: 595 x 842)
    page1 = PageObject.create_blank_page(width=595, height=842)
    writer.add_page(page1)
    
    # 创建第二页
    page2 = PageObject.create_blank_page(width=595, height=842)
    writer.add_page(page2)
    
    # ============ 第1页字段 ============
    
    # 1. 姓
    create_text_field(writer, 0, "surname", 100, 700, 200, 20)
    
    # 2. 出生时姓氏
    create_text_field(writer, 0, "surname_at_birth", 100, 670, 200, 20)
    
    # 3. 名
    create_text_field(writer, 0, "given_names", 100, 640, 200, 20)
    
    # 4. 出生日期
    create_text_field(writer, 0, "date_of_birth", 100, 610, 80, 20)
    
    # 5. 出生地
    create_text_field(writer, 0, "place_of_birth", 200, 610, 150, 20)
    
    # 6. 出生国
    create_text_field(writer, 0, "country_of_birth", 370, 610, 80, 20)
    
    # 7. 现国籍
    create_text_field(writer, 0, "current_nationality", 100, 580, 100, 20)
    
    # 出生时国籍
    create_text_field(writer, 0, "nationality_at_birth", 250, 580, 100, 20)
    
    # 8. 性别
    create_checkbox(writer, 0, "sex_male", 100, 550, 15)
    create_checkbox(writer, 0, "sex_female", 140, 550, 15)
    
    # 9. 婚姻状况
    create_checkbox(writer, 0, "marital_single", 100, 520, 15)
    create_checkbox(writer, 0, "marital_married", 150, 520, 15)
    create_checkbox(writer, 0, "marital_separated", 200, 520, 15)
    create_checkbox(writer, 0, "marital_divorced", 260, 520, 15)
    create_checkbox(writer, 0, "marital_widowed", 320, 520, 15)
    
    # 10. 身份证号码
    create_text_field(writer, 0, "id_number", 100, 490, 200, 20)
    
    # 11. 护照种类
    create_checkbox(writer, 0, "doc_type_passport", 100, 460, 15)
    create_checkbox(writer, 0, "doc_type_diplomatic", 180, 460, 15)
    create_checkbox(writer, 0, "doc_type_service", 260, 460, 15)
    
    # 12. 护照号码
    create_text_field(writer, 0, "passport_number", 100, 430, 200, 20)
    
    # 13. 护照签发日期
    create_text_field(writer, 0, "passport_issue_date", 100, 400, 100, 20)
    
    # 14. 护照有效期
    create_text_field(writer, 0, "passport_expiry_date", 250, 400, 100, 20)
    
    # 15. 签发机关
    create_text_field(writer, 0, "issuing_authority", 100, 370, 300, 20)
    
    # 16. 住址及邮箱
    create_text_field(writer, 0, "home_address", 100, 340, 350, 20)
    create_text_field(writer, 0, "email", 100, 310, 200, 20)
    
    # 17. 电话号码
    create_text_field(writer, 0, "telephone", 100, 280, 150, 20)
    
    # 18. 居留许可
    create_text_field(writer, 0, "residence_permit", 100, 250, 200, 20)
    create_text_field(writer, 0, "residence_expiry", 320, 250, 100, 20)
    
    # 19. 现职业
    create_text_field(writer, 0, "occupation", 100, 220, 250, 20)
    
    # 20. 工作单位信息
    create_text_field(writer, 0, "employer_name", 100, 190, 350, 20)
    create_text_field(writer, 0, "employer_address", 100, 160, 350, 20)
    create_text_field(writer, 0, "employer_phone", 100, 130, 150, 20)
    
    # 21. 旅行目的
    create_checkbox(writer, 0, "purpose_tourism", 100, 100, 15)
    create_checkbox(writer, 0, "purpose_business", 150, 100, 15)
    create_checkbox(writer, 0, "purpose_visit_family", 200, 100, 15)
    create_checkbox(writer, 0, "purpose_medical", 280, 100, 15)
    create_checkbox(writer,0, "purpose_study", 330, 100, 15)
    create_checkbox(writer, 0, "purpose_transit", 380, 100, 15)
    create_checkbox(writer, 0, "purpose_cultural", 430, 100, 15)
    create_checkbox(writer, 0, "purpose_sports", 100, 70, 15)
    create_checkbox(writer, 0, "purpose_official", 150, 70, 15)
    create_checkbox(writer, 0, "purpose_airport_transit", 220, 70, 15)
    
    # ============ 第2页字段 ============
    
    # 22. 目的地国家
    create_text_field(writer, 1, "destination_country", 100, 750, 200, 20)
    
    # 23. 首入申根国
    create_text_field(writer, 1, "first_entry_country", 350, 750, 150, 20)
    
    # 24. 入境次数
    create_checkbox(writer, 1, "entries_single", 100, 720, 15)
    create_checkbox(writer, 1, "entries_two", 150, 720, 15)
    create_checkbox(writer, 1, "entries_multiple", 200, 720, 15)
    
    # 25. 停留天数
    create_text_field(writer, 1, "stay_duration", 100, 690, 80, 20)
    
    # 26. 过去三年申根签证
    create_checkbox(writer, 1, "previous_visa_no", 100, 660, 15)
    create_checkbox(writer, 1, "previous_visa_yes", 150, 660, 15)
    
    # 27. 指纹记录
    create_checkbox(writer, 1, "fingerprints_no", 100, 630, 15)
    create_checkbox(writer, 1, "fingerprints_yes", 150, 630, 15)
    
    # 28. 目的地入境许可
    create_text_field(writer, 1, "entry_permit_issuer", 100, 600, 200, 20)
    create_text_field(writer, 1, "entry_permit_valid_from", 320, 600, 80, 20)
    create_text_field(writer, 1, "entry_permit_valid_to", 420, 600, 80, 20)
    
    # 29. 预定入境日期
    create_text_field(writer, 1, "arrival_date", 100, 570, 100, 20)
    
    # 30. 预定离开日期
    create_text_field(writer, 1, "departure_date", 250, 570, 100, 20)
    
    # 31. 邀请人信息
    create_text_field(writer, 1, "inviting_name", 100, 540, 250, 20)
    create_text_field(writer, 1, "inviting_address", 100, 510, 350, 20)
    create_text_field(writer, 1, "inviting_email", 100, 480, 200, 20)
    create_text_field(writer, 1, "inviting_phone", 320, 480, 130, 20)
    
    # 32. 邀请公司信息
    create_text_field(writer, 1, "company_name", 100, 450, 300, 20)
    create_text_field(writer, 1, "company_address", 100, 420, 350, 20)
    create_text_field(writer, 1, "company_phone", 100, 390, 150, 20)
    create_text_field(writer, 1, "contact_person", 100, 360, 200, 20)
    create_text_field(writer, 1, "contact_email", 320, 360, 130, 20)
    
    # 33. 费用支付
    create_checkbox(writer, 1, "cost_by_applicant", 100, 330, 15)
    create_checkbox(writer, 1, "cost_by_sponsor", 180, 330, 15)
    
    # 支付方式
    create_checkbox(writer, 1, "payment_cash", 100, 300, 15)
    create_checkbox(writer, 1, "payment_credit_card", 160, 300, 15)
    create_checkbox(writer, 1, "payment_prepaid_accommodation", 250, 300, 15)
    create_checkbox(writer, 1, "payment_prepaid_transport", 350, 300, 15)
    create_checkbox(writer, 1, "payment_cheque", 100, 270, 15)
    
    # 签名区域
    create_text_field(writer, 1, "place_date", 100, 100, 200, 20)
    
    # 保存PDF
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    with open(OUTPUT_FILE, "wb") as f:
        writer.write(f)
    
    print(f"PDF模板已生成: {OUTPUT_FILE}")
    print(f"文件大小: {os.path.getsize(OUTPUT_FILE)} bytes")
    return OUTPUT_FILE

if __name__ == "__main__":
    create_pdf_with_form_fields()
