import pandas as pd
from datetime import timedelta

def detect_velocity_spike(df):
    """
    Detects velocity spike: Transaction frequency doubles within 7 days compared to previous 30-day average.
    """
    flags = []
    if df.empty: return flags
    
    df['date_parsed'] = pd.to_datetime(df['date'])
    
    for account, group in df.groupby('account_no'):
        group = group.sort_values('date_parsed')
        
        if len(group) < 10: continue # Need some baseline
        
        # Simple sliding window over the transactions
        min_date = group['date_parsed'].min()
        max_date = group['date_parsed'].max()
        
        curr_date = min_date + timedelta(days=30)
        
        while curr_date <= max_date:
            baseline_start = curr_date - timedelta(days=30)
            baseline_window = group[(group['date_parsed'] >= baseline_start) & (group['date_parsed'] < curr_date)]
            
            # Baseline avg txns per 7 days (roughly)
            baseline_7d_avg = (len(baseline_window) / 30) * 7 if len(baseline_window) > 0 else 0
            
            spike_end = curr_date + timedelta(days=7)
            spike_window = group[(group['date_parsed'] >= curr_date) & (group['date_parsed'] < spike_end)]
            
            spike_count = len(spike_window)
            
            if baseline_7d_avg > 0 and spike_count >= baseline_7d_avg * 2 and spike_count >= 5:
                txn_ids = spike_window['txn_id'].tolist()
                flags.append({
                    "rule": "Velocity Spike",
                    "severity": "MEDIUM",
                    "account_no": account,
                    "description": f"Frequency spiked: {spike_count} txns in 7 days (baseline {baseline_7d_avg:.1f}).",
                    "related_txns": txn_ids
                })
                break # Flag once per account to avoid spam in prototype
                
            curr_date += timedelta(days=7)
            
    return flags
