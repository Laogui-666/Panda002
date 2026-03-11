"""
填充意大利签证申请表PDF
使用pypdf填充表单域
"""

from pypdf import PdfReader, PdfWriter
from pypdf.generic import NameObject, TextStringObject
from datetime import datetime

# 客户数据（从DOCX提取）
customer_data = {
    "surname": "XIAO LIJIN",
    "given_names": "",
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
    "inviting_name": "",
    "inviting_address": "",
    "inviting_phone": "",
    "funds": "SELF",
    "employer_school": "ABA TEACHERS UNIVERSITY",
    "employer_address": "WOODSHOU TOWN, WENCHUAN COUNTY, ABA TIBETAN AND QIANG AUTONOMOUS PREFECTURE, SICHUAN, CHINA",
    "employer_phone": "",
    "occupation": "STUDENT",
    "previous_schengen_visa": "NO",
    "previous_visa_refusal": "NO",
    "fingerprints": "NO",
    "travel_companion": "NO",
    "submission_date": datetime.now().strftime("%d/%m/%Y"),
}

def fill_pdf_form():
    """填充PDF表单"""
    template_path = r"C:\Users\Administrator\Desktop\muhai001\muhai001\public\templates\italy_schengen_visa_form.pdf"
    output_path = r"C:\Users\Administrator\Desktop\muhai001\muhai001\public\templates\italy_schengen_visa_filled.pdf"
    
    # 读取PDF模板
    reader = PdfReader(template_path)
    writer = PdfWriter()
    
    # 复制所有页面
    for page in reader.pages:
        writer.add_page(page)
    
    # 获取表单
    writer.add_form_field_text_field = None  # 禁用该方法避免干扰
    
    # 使用writer的字段设置方法
    for field_name, value in customer_data.items():
        try:
            # pypdf的PdfWriter有专门的方法来设置表单字段
            if hasattr(writer, 'update_form_field'):
                writer.update_form_field(field_name, value)
            else:
                # 尝试通过_root_object更新
                pass
        except Exception as e:
            print(f"设置字段失败 {field_name}: {e}")
    
    # 方法2: 直接使用pypdf的赋值方式
    # 获取现有字段并更新值
    if "/AcroForm" in writer._root_object.get_object():
        form = writer._root_object.get_object()["/AcroForm"]
        
        # 遍历所有字段
        for i in range(len(writer.pages)):
            page = writer.pages[i]
            if "/Annots" in page:
                annots = page["/Annots"]
                for annot in annots:
                    annot_obj = annot.get_object()
                    if "/T" in annot_obj:
                        field_name = annot_obj["/T"]
                        if field_name in customer_data:
                            value = customer_data[field_name]
                            annot_obj[NameObject("/V")] = TextStringObject(value)
                            print(f"填充: {field_name} = {value}")
    
    # 保存填充后的PDF
    with open(output_path, "wb") as output_file:
        writer.write(output_file)
    
    print(f"\n===== PDF填充完成 =====")
    print(f"输出文件: {output_path}")
    
    # 验证填充结果
    verify_reader = PdfReader(output_path)
    fields = verify_reader.get_form_text_fields()
    if fields:
        print(f"\n验证 - 已填充的字段数: {len(fields)}")
        print("部分填充值:")
        for name in list(fields.keys())[:10]:
            print(f"  {name}: {fields[name]}")
    
    return output_path

if __name__ == "__main__":
    fill_pdf_form()
