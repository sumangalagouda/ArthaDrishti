import networkx as nx

def build_graph(transactions, flags):
    """
    Builds a NetworkX graph from transactions and flags, and exports to Cytoscape format.
    """
    G = nx.DiGraph()
    
    # Identify flagged accounts
    flagged_accounts = set()
    for flag in flags:
        flagged_accounts.add(flag['account_no'])
        
    account_totals = {}
    
    # Add edges and calculate node totals
    for txn in transactions:
        if txn['txn_type'] == 'debit':
            # For debits, money flows OUT of the account to somewhere else.
            # In our mock data, we sometimes don't have the exact counterparty explicitly linked 
            # as a single transaction row, so we infer it if possible, or just link to a generic 'External' node.
            # Actually, to make a beautiful graph, we need matching pairs or clear routing.
            # The mock generator creates "Transfer to ACCXXX" descriptions.
            desc = txn['description']
            target = "External"
            if "Transfer to " in desc:
                target = desc.split("Transfer to ")[1].split()[0]
                
            source = txn['account_no']
            
            G.add_edge(source, target, amount=txn['amount'], date=txn['date'])
            
            account_totals[source] = account_totals.get(source, 0) + txn['amount']
            account_totals[target] = account_totals.get(target, 0) + txn['amount']
            
        elif txn['txn_type'] == 'credit':
            # For credits, money flows IN from somewhere else.
            # Handled similarly. If we already added the debit side, we might duplicate.
            # In double-entry mock data, we just have to be careful.
            desc = txn['description']
            source = "External"
            if "Transfer from " in desc:
                source = desc.split("Transfer from ")[1].split()[0]
                
            target = txn['account_no']
            
            # Avoid adding the same edge twice if we processed the debit side
            if not G.has_edge(source, target):
                G.add_edge(source, target, amount=txn['amount'], date=txn['date'])
                
            account_totals[source] = account_totals.get(source, 0) + txn['amount']
            account_totals[target] = account_totals.get(target, 0) + txn['amount']

    # Export to Cytoscape JSON format
    cy_nodes = []
    cy_edges = []
    
    for node in G.nodes():
        cy_nodes.append({
            "data": {
                "id": node,
                "label": node,
                "flagged": node in flagged_accounts,
                "total_amount": account_totals.get(node, 0)
            }
        })
        
    for u, v, data in G.edges(data=True):
        cy_edges.append({
            "data": {
                "source": u,
                "target": v,
                "amount": data['amount'],
                "label": f"₹{data['amount']}",
                "date": data['date']
            }
        })
        
    return {
        "nodes": cy_nodes,
        "edges": cy_edges
    }
