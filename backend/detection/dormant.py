import pandas as pd

def detect_dormant_activation(df):
    """
    Detects dormant account activation: No activity for 180+ days, suddenly receives large transaction.
    """
    flags = []
    if df.empty: return flags
    
    df['date_parsed'] = pd.to_datetime(df['date'])
    
    for account, group in df.groupby('account_no'):
        group = group.sort_values('date_parsed')
        
        # Need at least 2 transactions to find a gap
        if len(group) < 2: continue
        
        for i in range(1, len(group)):
            prev_txn = group.iloc[i-1]
            curr_txn = group.iloc[i]
            
            time_diff = curr_txn['date_parsed'] - prev_txn['date_parsed']
            
            if time_diff.days >= 180:
                # Check if it's a large transaction (e.g., > 50,000 for prototype)
                if curr_txn['amount'] > 50000:
                    flags.append({
                        "rule": "Dormant Activation",
                        "severity": "MEDIUM",
                        "account_no": account,
                        "description": f"Account active after {time_diff.days} days with large transaction ({curr_txn['amount']}).",
                        "related_txns": [curr_txn['txn_id']]
                    })
                    
    return flags
