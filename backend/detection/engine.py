import pandas as pd
from .smurfing import detect_smurfing
from .round_trip import detect_round_trip
from .dormant import detect_dormant_activation
from .velocity import detect_velocity_spike
from .isolation_forest import detect_isolation_forest
import uuid

def run_all_detections(transactions):
    """
    Runs all fraud detection rules against the standardized transactions.
    """
    if not transactions:
        return []
        
    df = pd.DataFrame(transactions)
    all_flags = []
    
    # 1. Smurfing
    all_flags.extend(detect_smurfing(df))
    
    # 2. Round Tripping
    all_flags.extend(detect_round_trip(df))
    
    # 3. Dormant Activation
    all_flags.extend(detect_dormant_activation(df))
    
    # 4. Velocity Spike
    all_flags.extend(detect_velocity_spike(df))
    
    # 5. Isolation Forest
    all_flags.extend(detect_isolation_forest(df))
    
    # Assign unique IDs to flags
    for flag in all_flags:
        flag['flag_id'] = str(uuid.uuid4())
        
    return all_flags
