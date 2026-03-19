"""
填充意大利签证申请表PDF - 使用reportlab精确填充
"""

from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.colors import black
from pypdf import PdfReader

def fill_pdf_with_data():
    """使用reportlab直接填充数据"""
    template_path = r"C:\Users\Administrator\Desktop\muhai001\muhai001\public\templates\italy_schengen_visa_form.pdf"
    output_path = r"C:\Users\Administrator\Desktop\muhai001\muhai001\public\templates\italy_schengen_visa_filled.pdf"
    
    # 客户数据
    data = {
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
    
    # 读取原始PDF
    reader = PdfReader(template_path)
    
    # 使用reportlab创建新PDF
    c = canvas.Canvas(output_path, pagesize=letter)
    width, height = letter
    
    # 获取表单
    form = c.acroForm
    
    # ========== 第1页字段 ==========
    form.textfield(name='surname', tooltip='Surname',
                   x=150, y=height-120, width=200, height=20,
                   borderWidth=1, borderColor=black, fillColor=None,
                   text=data.get('surname', ''))
    
    form.textfield(name='given_names', tooltip='Given Names',
                   x=380, y=height-120, width=180, height=20,
                   borderWidth=1, borderColor=black, fillColor=None)
    
    form.textfield(name='date_of_birth', tooltip='Date of Birth',
                   x=150, y=height-150, width=100, height=20,
                   borderWidth=1, borderColor=black, fillColor=None,
                   text=data.get('date_of_birth', ''))
    
    form.textfield(name='place_of_birth', tooltip='Place of Birth',
                   x=280, y=height-150, width=280, height=20,
                   borderWidth=1, borderColor=black, fillColor=None,
                   text=data.get('place_of_birth', ''))
    
    form.textfield(name='nationality', tooltip='Nationality',
                   x=150, y=height-180, width=150, height=20,
                   borderWidth=1, borderColor=black, fillColor=None,
                   text=data.get('nationality', ''))
    
    form.textfield(name='sex', tooltip='Sex',
                   x=340, y=height-180, width=50, height=20,
                   borderWidth=1, borderColor=black, fillColor=None,
                   text=data.get('sex', ''))
    
    form.textfield(name='marital_status', tooltip='Marital Status',
                   x=420, y=height-180, width=140, height=20,
                   borderWidth=1, borderColor=black, fillColor=None,
                   text=data.get('marital_status', ''))
    
    form.textfield(name='passport_number', tooltip='Passport Number',
                   x=150, y=height-210, width=120, height=20,
                   borderWidth=1, borderColor=black, fillColor=None,
                   text=data.get('passport_number', ''))
    
    form.textfield(name='passport_type', tooltip='Passport Type',
                   x=300, y=height-210, width=80, height=20,
                   borderWidth=1, borderColor=black, fillColor=None,
                   text=data.get('passport_type', ''))
    
    form.textfield(name='passport_issuing_authority', tooltip='Passport Issuing Authority',
                   x=400, y=height-210, width=160, height=20,
                   borderWidth=1, borderColor=black, fillColor=None,
                   text=data.get('passport_issuing_authority', ''))
    
    form.textfield(name='passport_issue_date', tooltip='Passport Issue Date',
                   x=150, y=height-240, width=100, height=20,
                   borderWidth=1, borderColor=black, fillColor=None,
                   text=data.get('passport_issue_date', ''))
    
    form.textfield(name='passport_expiry_date', tooltip='Passport Expiry Date',
                   x=280, y=height-240, width=120, height=20,
                   borderWidth=1, borderColor=black, fillColor=None,
                   text=data.get('passport_expiry_date', ''))
    
    form.textfield(name='email', tooltip='Email',
                   x=150, y=height-270, width=250, height=20,
                   borderWidth=1, borderColor=black, fillColor=None,
                   text=data.get('email', ''))
    
    form.textfield(name='phone', tooltip='Phone',
                   x=420, y=height-270, width=140, height=20,
                   borderWidth=1, borderColor=black, fillColor=None,
                   text=data.get('phone', ''))
    
    form.textfield(name='address', tooltip='Address',
                   x=150, y=height-300, width=410, height=20,
                   borderWidth=1, borderColor=black, fillColor=None,
                   text=data.get('address', ''))
    
    form.textfield(name='destination_country', tooltip='Destination Country',
                   x=150, y=height-330, width=150, height=20,
                   borderWidth=1, borderColor=black, fillColor=None,
                   text=data.get('destination_country', ''))
    
    form.textfield(name='first_entry_country', tooltip='First Entry Country',
                   x=320, y=height-330, width=120, height=20,
                   borderWidth=1, borderColor=black, fillColor=None,
                   text=data.get('first_entry_country', ''))
    
    form.textfield(name='arrival_date', tooltip='Arrival Date',
                   x=460, y=height-330, width=100, height=20,
                   borderWidth=1, borderColor=black, fillColor=None,
                   text=data.get('arrival_date', ''))
    
    form.textfield(name='departure_date', tooltip='Departure Date',
                   x=150, y=height-360, width=120, height=20,
                   borderWidth=1, borderColor=black, fillColor=None,
                   text=data.get('departure_date', ''))
    
    form.textfield(name='entry_number', tooltip='Number of Entries',
                   x=300, y=height-360, width=80, height=20,
                   borderWidth=1, borderColor=black, fillColor=None,
                   text=data.get('entry_number', ''))
    
    form.textfield(name='visa_type', tooltip='Visa Type',
                   x=150, y=height-390, width=150, height=20,
                   borderWidth=1, borderColor=black, fillColor=None,
                   text=data.get('visa_type', ''))
    
    form.textfield(name='visa_category', tooltip='Visa Category',
                   x=320, y=height-390, width=80, height=20,
                   borderWidth=1, borderColor=black, fillColor=None,
                   text=data.get('visa_category', ''))
    
    form.textfield(name='inviting_name', tooltip='Inviting Name',
                   x=150, y=height-420, width=200, height=20,
                   borderWidth=1, borderColor=black, fillColor=None)
    
    form.textfield(name='inviting_address', tooltip='Inviting Address',
                   x=150, y=height-450, width=410, height=20,
                   borderWidth=1, borderColor=black, fillColor=None)
    
    form.textfield(name='inviting_phone', tooltip='Inviting Phone',
                   x=150, y=height-480, width=150, height=20,
                   borderWidth=1, borderColor=black, fillColor=None)
    
    # 标签
    c.setFont("Helvetica", 9)
    c.drawString(150, height-95, "Surname:")
    c.drawString(380, height-95, "Given Names:")
    c.drawString(150, height-125, "Date of Birth:")
    c.drawString(280, height-125, "Place of Birth:")
    c.drawString(150, height-155, "Nationality:")
    c.drawString(340, height-155, "Sex:")
    c.drawString(420, height-155, "Marital Status:")
    c.drawString(150, height-185, "Passport No:")
    c.drawString(300, height-185, "Type:")
    c.drawString(400, height-185, "Issuing Authority:")
    c.drawString(150, height-215, "Issue Date:")
    c.drawString(280, height-215, "Expiry Date:")
    c.drawString(150, height-245, "Email:")
    c.drawString(420, height-245, "Phone:")
    c.drawString(150, height-275, "Address:")
    c.drawString(150, height-305, "Destination:")
    c.drawString(320, height-305, "First Entry:")
    c.drawString(460, height-305, "Arrival:")
    c.drawString(150, height-335, "Departure:")
    c.drawString(300, height-335, "Entries:")
    c.drawString(150, height-365, "Visa Type:")
    c.drawString(320, height-365, "Category:")
    c.drawString(150, height-395, "Inviting Name:")
    c.drawString(150, height-425, "Inviting Address:")
    c.drawString(150, height-455, "Inviting Phone:")
    
    c.showPage()
    
    # ========== 第2页 ==========
    form.textfield(name='funds', tooltip='Funds',
                   x=150, y=height-120, width=250, height=20,
                   borderWidth=1, borderColor=black, fillColor=None,
                   text=data.get('funds', ''))
    
    form.textfield(name='employer_school', tooltip='Employer/School',
                   x=150, y=height-150, width=300, height=20,
                   borderWidth=1, borderColor=black, fillColor=None,
                   text=data.get('employer_school', ''))
    
    form.textfield(name='employer_address', tooltip='Employer Address',
                   x=150, y=height-180, width=410, height=20,
                   borderWidth=1, borderColor=black, fillColor=None,
                   text=data.get('employer_address', ''))
    
    form.textfield(name='employer_phone', tooltip='Employer Phone',
                   x=150, y=height-210, width=150, height=20,
                   borderWidth=1, borderColor=black, fillColor=None)
    
    form.textfield(name='occupation', tooltip='Occupation',
                   x=320, y=height-210, width=150, height=20,
                   borderWidth=1, borderColor=black, fillColor=None,
                   text=data.get('occupation', ''))
    
    form.textfield(name='previous_schengen_visa', tooltip='Prev Schengen Visa',
                   x=150, y=height-240, width=100, height=20,
                   borderWidth=1, borderColor=black, fillColor=None,
                   text=data.get('previous_schengen_visa', ''))
    
    form.textfield(name='previous_visa_refusal', tooltip='Visa Refusal',
                   x=280, y=height-240, width=100, height=20,
                   borderWidth=1, borderColor=black, fillColor=None,
                   text=data.get('previous_visa_refusal', ''))
    
    form.textfield(name='fingerprints', tooltip='Fingerprints',
                   x=420, y=height-240, width=100, height=20,
                   borderWidth=1, borderColor=black, fillColor=None,
                   text=data.get('fingerprints', ''))
    
    form.textfield(name='travel_companion', tooltip='Travel Companion',
                   x=150, y=height-270, width=150, height=20,
                   borderWidth=1, borderColor=black, fillColor=None,
                   text=data.get('travel_companion', ''))
    
    form.textfield(name='submission_date', tooltip='Submission Date',
                   x=150, y=100, width=120, height=20,
                   borderWidth=1, borderColor=black, fillColor=None,
                   text=data.get('submission_date', ''))
    
    # 标签
    c.setFont("Helvetica", 9)
    c.drawString(150, height-95, "Funds:")
    c.drawString(150, height-125, "Employer/School:")
    c.drawString(150, height-155, "Address:")
    c.drawString(150, height-185, "Phone:")
    c.drawString(320, height-185, "Occupation:")
    c.drawString(150, height-215, "Prev Schengen Visa:")
    c.drawString(280, height-215, "Visa Refusal:")
    c.drawString(420, height-215, "Fingerprints:")
    c.drawString(150, height-245, "Travel Companion:")
    c.drawString(150, height-680, "Date:")
    
    c.save()
    
    print(f"PDF已填充并保存: {output_path}")
    
    # 验证
    reader = PdfReader(output_path)
    fields = reader.get_form_text_fields()
    print(f"\n验证 - 字段数: {len(fields)}")
    if fields:
        print("已填充的字段:")
        for name, value in list(fields.items())[:15]:
            if value:
                print(f"  {name}: {value}")

if __name__ == "__main__":
    fill_pdf_with_data()
