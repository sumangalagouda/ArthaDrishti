import pandas as pd
import uuid
import pdfplumber

def process_uploaded_files(case_id, files):
    transactions = []
    
    for file in files:
        # Read file into pandas DataFrame
        df = None
        if file.filename.endswith('.csv'):
            df = pd.read_csv(file)
        elif file.filename.endswith(('.xls', '.xlsx')):
            df = pd.read_excel(file)
        elif file.filename.endswith('.pdf'):
            # Extract tables from PDF using pdfplumber
            all_rows = []
            try:
                with pdfplumber.open(file) as pdf:
                    for page in pdf.pages:
                        table = page.extract_table()
                        if table:
                            all_rows.extend(table)
            except Exception as e:
                print(f"Error parsing PDF: {e}")
                
            if len(all_rows) > 1:
                # Clean up None values and newlines
                cleaned = [[str(cell).replace('\n', ' ').strip() if cell else '' for cell in row] for row in all_rows]
                df = pd.DataFrame(cleaned[1:], columns=cleaned[0])
                
        if df is None or df.empty:
            continue # Skip unsupported or empty files

            
        # Lowercase column names for flexible matching
        df.columns = [str(c).strip().lower() for c in df.columns]
        
        for _, row in df.iterrows():
            # Try to find amount in common columns
            withdrawal = pd.to_numeric(row.get('withdrawal', row.get('debit', row.get('dr', 0))), errors='coerce')
            deposit = pd.to_numeric(row.get('deposit', row.get('credit', row.get('cr', 0))), errors='coerce')
            
            amount_val = pd.to_numeric(row.get('amount', 0), errors='coerce')
            
            if pd.notna(withdrawal) and withdrawal > 0:
                amount = float(withdrawal)
                txn_type = 'debit'
            elif pd.notna(deposit) and deposit > 0:
                amount = float(deposit)
                txn_type = 'credit'
            elif pd.notna(amount_val) and amount_val != 0:
                amount = abs(float(amount_val))
                type_str = str(row.get('type', row.get('txn_type', row.get('dr/cr', '')))).lower()
                if 'dr' in type_str or 'debit' in type_str or 'withdrawal' in type_str or amount_val < 0:
                    txn_type = 'debit'
                else:
                    txn_type = 'credit'
            else:
                continue # Skip rows without financial amounts
                
            # Parse Date (fallback to a dummy string if parsing fails)
            try:
                raw_date = row.get('date', row.get('txn_date', ''))
                parsed_date = pd.to_datetime(raw_date).strftime('%Y-%m-%d')
            except Exception:
                parsed_date = '2026-05-01' # Fallback
            
            # Map standard columns
            txn = {
                "txn_id": str(uuid.uuid4()),
                "case_id": case_id,
                "account_no": str(row.get('account number', row.get('account_no', 'UNKNOWN'))),
                "bank_name": "UPLOADED_BANK",
                "date": parsed_date,
                "description": str(row.get('description', row.get('narration', row.get('particulars', '')))),
                "amount": amount,
                "txn_type": txn_type,
                "balance": float(pd.to_numeric(row.get('balance', 0), errors='coerce') or 0.0),
                "source_file": file.filename
            }
            transactions.append(txn)
            
    return transactions
