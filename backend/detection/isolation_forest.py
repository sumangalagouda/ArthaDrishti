import pandas as pd
from sklearn.ensemble import IsolationForest

def detect_isolation_forest(df):
    """
    Uses Isolation Forest on amount and frequency features.
    """
    flags = []
    if df.empty or len(df) < 10: return flags # Need some data to train
    
    # Feature engineering for the model
    # For prototype, we'll just use 'amount' and a mock 'time_since_last_txn' per account
    features_df = df.copy()
    features_df['date_parsed'] = pd.to_datetime(features_df['date'])
    features_df = features_df.sort_values(['account_no', 'date_parsed'])
    
    features_df['time_since_last_txn'] = features_df.groupby('account_no')['date_parsed'].diff().dt.total_seconds() / 3600
    features_df['time_since_last_txn'] = features_df['time_since_last_txn'].fillna(0)
    
    X = features_df[['amount', 'time_since_last_txn']].copy()
    
    # Train Isolation Forest
    clf = IsolationForest(contamination=0.05, random_state=42) # Assume 5% anomalies
    clf.fit(X)
    
    features_df['anomaly_score'] = clf.decision_function(X)
    features_df['is_anomaly'] = clf.predict(X) # -1 for anomaly, 1 for normal
    
    anomalies = features_df[features_df['is_anomaly'] == -1]
    
    for _, row in anomalies.iterrows():
        # Determine severity based on score (lower is more anomalous)
        score = row['anomaly_score']
        severity = "LOW"
        if score < -0.15: severity = "HIGH"
        elif score < -0.05: severity = "MEDIUM"
        
        flags.append({
            "rule": "Isolation Forest Anomaly",
            "severity": severity,
            "account_no": row['account_no'],
            "description": f"Anomalous pattern detected (Score: {score:.2f}).",
            "related_txns": [row['txn_id']]
        })
        
    return flags
