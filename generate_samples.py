import pandas as pd
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle
from reportlab.lib import colors
import os

# Sample Data
data = [
    ["Date", "Account Number", "Description", "Withdrawal", "Deposit", "Balance"],
    ["2026-05-01", "ACC001", "Salary Credit", "", "50000", "50000"],
    ["2026-05-02", "ACC001", "Grocery Store", "2000", "", "48000"],
    ["2026-05-03", "ACC001", "Transfer to ACC002", "45000", "", "3000"],
    ["2026-05-04", "ACC001", "Electricity Bill", "1500", "", "1500"],
    ["2026-05-04", "ACC001", "Cash Deposit", "", "10000", "11500"]
]

# 1. Generate CSV
df = pd.DataFrame(data[1:], columns=data[0])
df.to_csv('dummy_statement.csv', index=False)
print(f"Created CSV: {os.path.abspath('dummy_statement.csv')}")

# 2. Generate PDF
pdf_path = 'dummy_statement.pdf'
pdf = SimpleDocTemplate(pdf_path, pagesize=letter)
table = Table(data)

# Add styling to make it a proper grid table so pdfplumber can extract it
style = TableStyle([
    ('BACKGROUND', (0,0), (-1,0), colors.grey),
    ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
    ('ALIGN', (0,0), (-1,-1), 'CENTER'),
    ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
    ('BOTTOMPADDING', (0,0), (-1,0), 12),
    ('GRID', (0,0), (-1,-1), 1, colors.black) # Important for pdfplumber extraction
])
table.setStyle(style)

pdf.build([table])
print(f"Created PDF: {os.path.abspath(pdf_path)}")
