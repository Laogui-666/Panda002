"""
创建带表单域的意大利签证申请表PDF - 使用reportlab
"""

from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.colors import black
from reportlab.pdfbase import pdfform
from reportlab.lib.units import inch

def create_pdf_with_form():
    """创建带表单的PDF"""
    output_path = r"C:\Users\Administrator\Desktop\muhai001\muhai001\public\templates\italy_schengen_visa_form.pdf"
    
    c = canvas.Canvas(output_path, pagesize=letter)
    width, height = letter  # 612 x 792
    
    # 获取PDF表单对象
    form = c.acroForm
    
    # ========== 第1页字段 ==========
    y_start = height - 100  # 从顶部往下
    
    # 姓 (Surname)
    form.textfield(name='surname', tooltip='Surname',
                   x=150, y=height-120, width=200, height=20,
                   borderWidth=1, borderColor=black, fillColor=None)
    
    # 名 (Given Names)
    form.textfield(name='given_names', tooltip='Given Names',
                   x=380, y=height-120, width=180, height=20,
                   borderWidth=1, borderColor=black, fillColor=None)
    
    # 出生日期
    form.textfield(name='date_of_birth', tooltip='Date of Birth (DD/MM/YYYY)',
                   x=150, y=height-150, width=100, height=20,
                   borderWidth=1, borderColor=black, fillColor=None)
    
    # 出生地
    form.textfield(name='place_of_birth', tooltip='Place of Birth',
                   x=280, y=height-150, width=280, height=20,
                   borderWidth=1, borderColor=black, fillColor=None)
    
    # 国籍
    form.textfield(name='nationality', tooltip='Nationality',
                   x=150, y=height-180, width=150, height=20,
                   borderWidth=1, borderColor=black, fillColor=None)
    
    # 性别
    form.textfield(name='sex', tooltip='Sex (M/F)',
                   x=340, y=height-180, width=50, height=20,
                   borderWidth=1, borderColor=black, fillColor=None)
    
    # 婚姻状况
    form.textfield(name='marital_status', tooltip='Marital Status',
                   x=420, y=height-180, width=140, height=20,
                   borderWidth=1, borderColor=black, fillColor=None)
    
    # 护照信息
    form.textfield(name='passport_number', tooltip='Passport Number',
                   x=150, y=height-210, width=120, height=20,
                   borderWidth=1, borderColor=black, fillColor=None)
    
    form.textfield(name='passport_type', tooltip='Passport Type',
                   x=300, y=height-210, width=80, height=20,
                   borderWidth=1, borderColor=black, fillColor=None)
    
    form.textfield(name='passport_issuing_authority', tooltip='Passport Issuing Authority',
                   x=400, y=height-210, width=160, height=20,
                   borderWidth=1, borderColor=black, fillColor=None)
    
    form.textfield(name='passport_issue_date', tooltip='Passport Issue Date',
                   x=150, y=height-240, width=100, height=20,
                   borderWidth=1, borderColor=black, fillColor=None)
    
    form.textfield(name='passport_expiry_date', tooltip='Passport Expiry Date',
                   x=280, y=height-240, width=120, height=20,
                   borderWidth=1, borderColor=black, fillColor=None)
    
    # 联系信息
    form.textfield(name='email', tooltip='Email',
                   x=150, y=height-270, width=250, height=20,
                   borderWidth=1, borderColor=black, fillColor=None)
    
    form.textfield(name='phone', tooltip='Phone',
                   x=420, y=height-270, width=140, height=20,
                   borderWidth=1, borderColor=black, fillColor=None)
    
    form.textfield(name='address', tooltip='Address',
                   x=150, y=height-300, width=410, height=20,
                   borderWidth=1, borderColor=black, fillColor=None)
    
    # 旅行信息
    form.textfield(name='destination_country', tooltip='Destination Country',
                   x=150, y=height-330, width=150, height=20,
                   borderWidth=1, borderColor=black, fillColor=None)
    
    form.textfield(name='first_entry_country', tooltip='First Entry Country',
                   x=320, y=height-330, width=120, height=20,
                   borderWidth=1, borderColor=black, fillColor=None)
    
    form.textfield(name='arrival_date', tooltip='Arrival Date',
                   x=460, y=height-330, width=100, height=20,
                   borderWidth=1, borderColor=black, fillColor=None)
    
    form.textfield(name='departure_date', tooltip='Departure Date',
                   x=150, y=height-360, width=120, height=20,
                   borderWidth=1, borderColor=black, fillColor=None)
    
    form.textfield(name='entry_number', tooltip='Number of Entries (1/2/Multiple)',
                   x=300, y=height-360, width=80, height=20,
                   borderWidth=1, borderColor=black, fillColor=None)
    
    # 签证类型
    form.textfield(name='visa_type', tooltip='Visa Type (Tourism/Business/etc)',
                   x=150, y=height-390, width=150, height=20,
                   borderWidth=1, borderColor=black, fillColor=None)
    
    form.textfield(name='visa_category', tooltip='Visa Category (A/B/C/D)',
                   x=320, y=height-390, width=80, height=20,
                   borderWidth=1, borderColor=black, fillColor=None)
    
    # 邀请人信息
    form.textfield(name='inviting_name', tooltip='Inviting Person/Company Name',
                   x=150, y=height-420, width=200, height=20,
                   borderWidth=1, borderColor=black, fillColor=None)
    
    form.textfield(name='inviting_address', tooltip='Inviting Address',
                   x=150, y=height-450, width=410, height=20,
                   borderWidth=1, borderColor=black, fillColor=None)
    
    form.textfield(name='inviting_phone', tooltip='Inviting Phone',
                   x=150, y=height-480, width=150, height=20,
                   borderWidth=1, borderColor=black, fillColor=None)
    
    # 添加标签说明
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
    
    c.showPage()  # 第1页结束
    
    # ========== 第2页字段 ==========
    # 费用承担
    form.textfield(name='funds', tooltip='Who bears the costs',
                   x=150, y=height-120, width=250, height=20,
                   borderWidth=1, borderColor=black, fillColor=None)
    
    # 雇主/学校信息
    form.textfield(name='employer_school', tooltip='Employer/School Name',
                   x=150, y=height-150, width=300, height=20,
                   borderWidth=1, borderColor=black, fillColor=None)
    
    form.textfield(name='employer_address', tooltip='Employer/School Address',
                   x=150, y=height-180, width=410, height=20,
                   borderWidth=1, borderColor=black, fillColor=None)
    
    form.textfield(name='employer_phone', tooltip='Employer/School Phone',
                   x=150, y=height-210, width=150, height=20,
                   borderWidth=1, borderColor=black, fillColor=None)
    
    form.textfield(name='occupation', tooltip='Occupation',
                   x=320, y=height-210, width=150, height=20,
                   borderWidth=1, borderColor=black, fillColor=None)
    
    # 旅行历史
    form.textfield(name='previous_schengen_visa', tooltip='Previous Schengen Visa (Yes/No)',
                   x=150, y=height-240, width=100, height=20,
                   borderWidth=1, borderColor=black, fillColor=None)
    
    form.textfield(name='previous_visa_refusal', tooltip='Previous Visa Refusal (Yes/No)',
                   x=280, y=height-240, width=100, height=20,
                   borderWidth=1, borderColor=black, fillColor=None)
    
    form.textfield(name='fingerprints', tooltip='Fingerprints (Yes/No)',
                   x=420, y=height-240, width=100, height=20,
                   borderWidth=1, borderColor=black, fillColor=None)
    
    # 同行人
    form.textfield(name='travel_companion', tooltip='Travel Companion',
                   x=150, y=height-270, width=150, height=20,
                   borderWidth=1, borderColor=black, fillColor=None)
    
    # 签名日期
    form.textfield(name='submission_date', tooltip='Submission Date',
                   x=150, y=100, width=120, height=20,
                   borderWidth=1, borderColor=black, fillColor=None)
    
    # 第2页标签
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
    
    print(f"PDF已创建: {output_path}")
    
    # 验证
    from pypdf import PdfReader
    reader = PdfReader(output_path)
    if "/AcroForm" in reader.trailer["/Root"]:
        print("✓ PDF包含AcroForm")
        fields = reader.get_form_text_fields()
        if fields:
            print(f"✓ 共有 {len(fields)} 个表单字段")
            print(f"\n字段列表:")
            for name in list(fields.keys()):
                print(f"  - {name}")
        else:
            print("✗ 未找到表单字段")
    else:
        print("✗ PDF没有AcroForm")

if __name__ == "__main__":
    create_pdf_with_form()
