from datetime import datetime
import pandas as pd

def detect_smurfing(df):
    """
    Detects smurfing: Multiple transactions between 80k-99.9k, 
    3 or more within 7 days, on the same account.
    """
    flags = []
    
    if df.empty: return flags
    
    # Filter relevant amounts
    smurf_txns = df[(df['amount'] >= 80000) & (df['amount'] <= 99999)].copy()
    smurf_txns['date_parsed'] = pd.to_datetime(smurf_txns['date'])
    
    # Group by account
    for account, group in smurf_txns.groupby('account_no'):
        group = group.sort_values('date_parsed')
        
        # Check rolling 7 day window for >= 3 transactions
        for i in range(len(group)):
            start_date = group.iloc[i]['date_parsed']
            end_date = start_date + pd.Timedelta(days=7)
            
            window = group[(group['date_parsed'] >= start_date) & (group['date_parsed'] <= end_date)]
            
            if len(window) >= 3:
                # Flag found!
                txn_ids = window['txn_id'].tolist()
                flags.append({
                    "rule": "Smurfing",
                    "severity": "HIGH",
                    "account_no": account,
                    "description": f"Detected {len(window)} transactions of 80k-99k within 7 days.",
                    "related_txns": txn_ids
                })
                break # Only flag once per account for simplicity in prototype
                
    return flags
