import pandas as pd
import uuid
import random
from datetime import datetime, timedelta

def generate_demo_transactions(case_id):
    """
    Generates a list of standardized transactions representing the 'Demo Fraud Case'.
    """
    transactions = []
    
    # Account Registry
    # ACC001 -> Ravi Kumar -> SBI
    # ACC002 -> Shell Company -> HDFC
    # ACC003 -> Mule Account -> Canara
    # ACC004 -> Victim 1 -> SBI
    # ACC005 -> Victim 2 -> HDFC
    # ACC006 -> Victim 3 -> ICICI
    
    base_date = datetime(2026, 5, 1) # Start of fraud activity
    
    def add_txn(acc_no, bank, date, desc, amount, txn_type):
        transactions.append({
            "txn_id": str(uuid.uuid4()),
            "case_id": case_id,
            "account_no": acc_no,
            "bank_name": bank,
            "date": date.strftime("%Y-%m-%d"),
            "description": desc,
            "amount": float(amount),
            "txn_type": txn_type,
            "balance": 0.0, # Will calculate if needed, though for prototype graph/rules amount is key
            "source_file": "demo_synthetic_data"
        })

    # 1. Normal activity for ACC001 (for Velocity baseline)
    for i in range(5):
        d = base_date - timedelta(days=20 + i*2)
        add_txn("ACC001", "SBI", d, f"Salary/Groceries {i}", random.randint(1000, 5000), "credit")

    # 2. Velocity Spike: Victims send money to ACC001 (May 1 to May 3)
    # 20 transactions in 3 days!
    for i in range(20):
        d = base_date + timedelta(hours=i*3)
        victim = random.choice(["ACC004", "ACC005", "ACC006"])
        amt = random.randint(10000, 50000)
        # Victim side
        add_txn(victim, "VARIOUS", d, f"Transfer to ACC001", amt, "debit")
        # ACC001 side
        add_txn("ACC001", "SBI", d, f"Transfer from {victim}", amt, "credit")
        
    # 3. ACC001 routes to ACC002 (Shell Company)
    route_date = base_date + timedelta(days=4)
    add_txn("ACC001", "SBI", route_date, "Transfer to ACC002", 450000, "debit")
    add_txn("ACC002", "HDFC", route_date, "Transfer from ACC001", 450000, "credit")

    # 4. Round Tripping: Money leaves ACC002 and comes back within 48h (<2% diff)
    rt_out_date = route_date + timedelta(hours=10)
    rt_in_date = rt_out_date + timedelta(hours=36)
    
    add_txn("ACC002", "HDFC", rt_out_date, "Investment Out", 100000, "debit")
    add_txn("EXT001", "UNKNOWN", rt_out_date, "Investment In", 100000, "credit")
    
    add_txn("EXT001", "UNKNOWN", rt_in_date, "Return", 99000, "debit") # 1% diff
    add_txn("ACC002", "HDFC", rt_in_date, "Investment Return", 99000, "credit")

    # 5. Dormant Activation + Smurfing into ACC003 (Mule Account)
    # ACC003 dormant since Aug 2024
    dormant_date = datetime(2024, 8, 15)
    add_txn("ACC003", "Canara", dormant_date, "Last Activity", 500, "debit")
    
    # Smurfing: ACC002 -> ACC003 (Multiple ~90k txn)
    smurf_base = rt_in_date + timedelta(days=1)
    smurf_amounts = [85000, 92000, 98000, 89000]
    
    for i, amt in enumerate(smurf_amounts):
        d = smurf_base + timedelta(hours=i*12)
        add_txn("ACC002", "HDFC", d, f"Transfer to ACC003 Part {i}", amt, "debit")
        add_txn("ACC003", "Canara", d, f"Transfer from ACC002 Part {i}", amt, "credit")
        
    # Calculate running balances roughly
    balances = {}
    transactions.sort(key=lambda x: datetime.strptime(x['date'], "%Y-%m-%d"))
    
    for t in transactions:
        acc = t['account_no']
        if acc not in balances:
            balances[acc] = 10000.0 # Initial
            
        if t['txn_type'] == 'credit':
            balances[acc] += t['amount']
        else:
            balances[acc] -= t['amount']
            
        t['balance'] = round(balances[acc], 2)
        
    return transactions
