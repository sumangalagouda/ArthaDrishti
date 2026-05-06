from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os

from ingestion.mock_generator import generate_demo_transactions
from ingestion.file_parser import process_uploaded_files
from detection.engine import run_all_detections
from graph.network_builder import build_graph
from reports.pdf_generator import generate_pdf_report

app = Flask(__name__)
CORS(app)

# In-memory storage for the prototype
# Structure: { case_id: { 'transactions': [], 'flags': [], 'graph': {}, 'summary': {} } }
db = {}

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/api/upload', methods=['POST'])
def upload_files():
    case_id = request.form.get('case_id', 'DEMO-CASE-001')
    demo_mode = request.form.get('demo_mode')
    files = request.files.getlist('files')
    
    if demo_mode == 'true' or not files:
        transactions = generate_demo_transactions(case_id)
    else:
        transactions = process_uploaded_files(case_id, files)
        if not transactions:
            return jsonify({"error": "No valid transactions found in uploaded files. Ensure they contain Date, Description, Withdrawal, and Deposit columns."}), 400

    
    # Run Detection
    flags = run_all_detections(transactions)
    
    # Build Graph
    graph_data = build_graph(transactions, flags)
    
    # Calculate Summary
    total_amount = sum(t['amount'] for t in transactions)
    accounts_involved = len(set(t['account_no'] for t in transactions))
    
    summary = {
        "total_transactions": len(transactions),
        "total_flags": len(flags),
        "total_amount": total_amount,
        "accounts_involved": accounts_involved,
        "date_range": "2026-04-11 to 2026-05-08"
    }
    
    # Save to memory
    db[case_id] = {
        "transactions": transactions,
        "flags": flags,
        "graph": graph_data,
        "summary": summary
    }
    
    return jsonify({
        "case_id": case_id,
        "total_transactions": len(transactions),
        "total_flags": len(flags)
    })

@app.route('/api/results/<case_id>', methods=['GET'])
def get_results(case_id):
    if case_id not in db:
        return jsonify({"error": "Case not found"}), 404
    return jsonify(db[case_id]['flags'])

@app.route('/api/graph/<case_id>', methods=['GET'])
def get_graph(case_id):
    if case_id not in db:
        return jsonify({"error": "Case not found"}), 404
    return jsonify(db[case_id]['graph'])

@app.route('/api/transactions/<case_id>', methods=['GET'])
def get_transactions(case_id):
    if case_id not in db:
        return jsonify({"error": "Case not found"}), 404
    return jsonify(db[case_id]['transactions'])

@app.route('/api/summary/<case_id>', methods=['GET'])
def get_summary(case_id):
    if case_id not in db:
        return jsonify({"error": "Case not found"}), 404
    return jsonify(db[case_id]['summary'])

@app.route('/api/report/<case_id>', methods=['GET'])
def get_report(case_id):
    if case_id not in db:
        return jsonify({"error": "Case not found"}), 404
        
    case_data = db[case_id]
    pdf_path = generate_pdf_report(
        case_id, 
        case_data['transactions'], 
        case_data['flags'], 
        case_data['summary'],
        output_dir=UPLOAD_FOLDER
    )
    
    return send_file(pdf_path, as_attachment=True, download_name=f"ArthaDrishti_Report_{case_id}.pdf")

if __name__ == '__main__':
    app.run(port=5000, debug=True)
