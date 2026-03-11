"""
填充意大利签证申请表PDF - pypdf直接修改字段
"""

from pypdf import PdfReader, PdfWriter
from pypdf.generic import NameObject, TextStringObject, DictionaryObject
import io

# 客户数据
customer_data = {
    "surname": "XIAO LIJIN",
    "date_of_birth": "20/07/2003",
    "place_of_birth": "CHENGDU, SICHUAN, CHINA",
    "nationality": "CHINESE",
    "sex": "M",
    "marital_status": "SINGLE",
    "passport_number": "EM0470730",
    "passport_type": "ORDINARY",
    "passport_issuing_authority": "CHENGDU SICHUAN CHINA",
    "passport_issue_date": "15/03/2024",
    "passport_expiry_date": "14/03/2034",
    "email": "2580048172@qq.com",
    "phone": "18183290363",
    "address": "NO.201, UNIT 3, HANTAN GARDEN, JINTANG COUNTY, CHENGDU, SICHUAN, CHINA",
    "destination_country": "ITALY",
    "first_entry_country": "ITALY",
    "arrival_date": "01/05/2026",
    "departure_date": "20/05/2026",
    "entry_number": "1",
    "visa_type": "TOURISM",
    "visa_category": "C",
    "funds": "SELF",
    "employer_school": "ABA TEACHERS UNIVERSITY",
    "employer_address": "WOODSHOU TOWN, WENCHUAN COUNTY, ABA TIBETAN AND QIANG AUTONOMOUS PREFECTURE, SICHUAN, CHINA",
    "occupation": "STUDENT",
    "previous_schengen_visa": "NO",
    "previous_visa_refusal": "NO",
    "fingerprints": "NO",
    "travel_companion": "NO",
    "submission_date": "25/03/2025",
}

def fill_pdf():
    template_path = r"C:\Users\Administrator\Desktop\muhai001\muhai001\public\templates\italy_schengen_visa_form.pdf"
    output_path = r"C:\Users\Administrator\Desktop\muhai001\muhai001\public\templates\italy_schengen_visa_filled.pdf"
    
    # 读取模板
    reader = PdfReader(template_path)
    writer = PdfWriter()
    
    # 复制页面
    for page in reader.pages:
        writer.add_page(page)
    
    # 直接修改每个页面的注解
    for page in writer.pages:
        if "/Annots" in page:
            annots = page["/Annots"]
            for i, annot in enumerate(annots):
                annot_obj = annot.get_object()
                if "/T" in annot_obj:
                    field_name = annot_obj["/T"]
                    if field_name in customer_data:
                        value = customer_data[field_name]
                        # 设置字段值
                        annot_obj[NameObject("/V")] = TextStringObject(value)
                        # 设置默认显示值
                        if "/DV" in annot_obj:
                            annot_obj[NameObject("/DV")] = TextStringObject(value)
                        print(f"填充: {field_name} = {value}")
    
    # 保存
    with open(output_path, "wb") as f:
        writer.write(f)
    
    print(f"\n===== 保存完成 =====")
    print(f"文件: {output_path}")
    
    # 验证
    verify_reader = PdfReader(output_path)
    fields = verify_reader.get_form_text_fields()
    print(f"\n验证 - 字段数: {len(fields)}")
    if fields:
        filled = sum(1 for v in fields.values() if v)
        print(f"已填充字段数: {filled}")
        print("\n已填充的值:")
        for name, value in fields.items():
            if value:
                print(f"  {name}: {value}")

if __name__ == "__main__":
    fill_pdf()
