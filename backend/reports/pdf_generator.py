from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
import os

def generate_pdf_report(case_id, transactions, flags, summary_data, output_dir="uploads"):
    """
    Generates a PDF report for the case.
    """
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    filepath = os.path.join(output_dir, f"ArthaDrishti_Report_{case_id}.pdf")
    doc = SimpleDocTemplate(filepath, pagesize=letter)
    
    styles = getSampleStyleSheet()
    title_style = styles['Heading1']
    title_style.alignment = 1 # Center
    
    elements = []
    
    # Title
    elements.append(Paragraph(f"ArthaDrishti Intelligence Report", title_style))
    elements.append(Paragraph(f"Case ID: {case_id}", styles['Heading2']))
    elements.append(Spacer(1, 12))
    
    # Summary
    elements.append(Paragraph("Executive Summary", styles['Heading3']))
    summary_text = f"Total Transactions: {summary_data['total_transactions']} | Total Flags: {summary_data['total_flags']} | Accounts Involved: {summary_data['accounts_involved']}"
    elements.append(Paragraph(summary_text, styles['Normal']))
    elements.append(Spacer(1, 12))
    
    # Flags Table
    elements.append(Paragraph("Detected Anomalies & Flags", styles['Heading3']))
    
    if flags:
        data = [["Rule", "Severity", "Account", "Description"]]
        for f in flags:
            data.append([f['rule'], f['severity'], f['account_no'], f['description']])
            
        t = Table(data, colWidths=[100, 60, 80, 250])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.grey),
            ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
            ('ALIGN', (0,0), (-1,-1), 'LEFT'),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0,0), (-1,0), 12),
            ('BACKGROUND', (0,1), (-1,-1), colors.beige),
            ('GRID', (0,0), (-1,-1), 1, colors.black)
        ]))
        elements.append(t)
    else:
        elements.append(Paragraph("No flags detected.", styles['Normal']))
        
    elements.append(Spacer(1, 20))
    
    # Recommendations
    elements.append(Paragraph("Investigator Recommendations", styles['Heading3']))
    rec_text = "1. Freeze flagged accounts pending manual review.<br/>2. Issue KYC update requests for dormant accounts.<br/>3. Investigate external counter-parties involved in round-tripping."
    elements.append(Paragraph(rec_text, styles['Normal']))
    
    # Build
    doc.build(elements)
    
    return filepath
