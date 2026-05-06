import pandas as pd

def detect_round_trip(df):
    """
    Detects round tripping: Money leaves and returns within 48 hours, amount difference < 2%.
    """
    flags = []
    if df.empty: return flags
    
    df['date_parsed'] = pd.to_datetime(df['date'])
    
    # We need to find pairs of debit and credit on the same account
    for account, group in df.groupby('account_no'):
        debits = group[group['txn_type'] == 'debit']
        credits = group[group['txn_type'] == 'credit']
        
        for _, debit in debits.iterrows():
            for _, credit in credits.iterrows():
                time_diff = credit['date_parsed'] - debit['date_parsed']
                
                # Check if credit happens after debit within 48 hours
                if pd.Timedelta(hours=0) <= time_diff <= pd.Timedelta(hours=48):
                    
                    # Check amount diff < 2%
                    amt_diff = abs(debit['amount'] - credit['amount'])
                    if amt_diff / debit['amount'] < 0.02:
                        flags.append({
                            "rule": "Round Tripping",
                            "severity": "HIGH",
                            "account_no": account,
                            "description": f"Money left ({debit['amount']}) and returned ({credit['amount']}) within {time_diff.total_seconds()/3600:.1f} hours.",
                            "related_txns": [debit['txn_id'], credit['txn_id']]
                        })
                        
    # Deduplicate flags if same transaction pairs are found multiple times
    # (Simple logic for prototype)
    unique_flags = []
    seen = set()
    for f in flags:
        sig = tuple(sorted(f['related_txns']))
        if sig not in seen:
            seen.add(sig)
            unique_flags.append(f)
            
    return unique_flags
