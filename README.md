# ArthaDrishti 🕵️‍♂️💸

**ArthaDrishti** is a high-performance, local-first financial fraud detection and investigation platform built for the **CIDECODE 2026 Hackathon**. 

It empowers law enforcement and financial investigators to rapidly ingest multi-bank statements, standardize transactional data, and perform automated fraud pattern analysis to detect illicit financial activities such as money laundering, smurfing, and round-tripping.

![ArthaDrishti Dashboard Concept](https://img.shields.io/badge/Status-Hackathon_Prototype-success?style=for-the-badge)

---

## 🌟 Key Features

* **📄 Intelligent Data Ingestion:** Instantly upload and parse both structured (CSV, Excel) and unstructured (PDF) bank statements using Pandas and `pdfplumber`.
* **🧠 Automated Fraud Detection Engine:** Built-in Python algorithms capable of flagging:
  * **Smurfing (Structuring):** Multiple small deposits aimed at evading reporting thresholds.
  * **Round-Tripping:** Funds leaving and returning to the same entity to artificially inflate turnover.
  * **Velocity Spikes:** Sudden, abnormal bursts of transaction volume compared to historical baselines.
  * **Dormant Account Activation:** Sudden movement in accounts that have been inactive for >6 months.
  * **Isolation Forest Anomalies:** Machine learning-based anomaly detection using `scikit-learn`.
* **🕸️ Network Investigation Graph:** Interactive nodal mapping of fund flows using `Cytoscape.js` to visually trace the money trail across multiple accounts.
* **📊 Professional Reporting:** Automatically generates comprehensive PDF evidence reports for police financial investigations using `reportlab`.

## 🛠️ Technology Stack

**Frontend:**
* React 19 + Vite
* Tailwind CSS v4 (Modern styling)
* Cytoscape.js (Network Visualization)
* Lucide React (Icons)

**Backend:**
* Python 3.10+
* Flask (REST API)
* Pandas & NumPy (Data Processing)
* Scikit-Learn (Anomaly Detection)
* PDFPlumber (Unstructured Data Extraction)

---

## 🚀 Getting Started

Follow these steps to run the complete ArthaDrishti system locally.

### 1. Start the Python Backend

Open a terminal and navigate to the backend folder:
```bash
cd backend

# Create a virtual environment (optional but recommended)
python -m venv venv

# Activate the virtual environment
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the Flask Server
python app.py
```
The backend API will start running at `http://localhost:5000`.

### 2. Start the React Frontend

Open a **new** terminal window and navigate to the frontend folder:
```bash
cd frontend

# Install Node dependencies
npm install

# Start the Vite development server
npm run dev
```
The web dashboard will be available at `http://localhost:5173`.

---

## 🧪 Testing the System

ArthaDrishti includes a **Mock Data Generator** and test scripts to easily demonstrate the system's capabilities:

1. **Quick Demo Mode:** Simply click "Start Analysis" in the UI without uploading any files. The system will automatically generate a highly suspicious "Demo Fraud Case" filled with money mules and round-tripping for you to explore.
2. **Real File Uploads:** A script named `generate_samples.py` is included in the root directory. Run it to generate dummy `dummy_statement.csv` and `dummy_statement.pdf` files. You can drag and drop these directly into the UI to test the live file-parsing pipeline!

---

## 📜 License

Built with ❤️ for the CIDECODE 2026 Hackathon.
