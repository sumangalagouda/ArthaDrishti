import React, { useState } from 'react';
import { Download, FileText, CheckCircle2 } from 'lucide-react';

export default function ReportExport({ caseId }) {
  const [downloading, setDownloading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleDownload = () => {
    if (!caseId) return;
    
    setDownloading(true);
    
    // Create a temporary link to trigger download
    const url = `http://localhost:5000/api/report/${caseId}`;
    const a = document.createElement('a');
    a.href = url;
    a.download = `ArthaDrishti_Report_${caseId}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    setTimeout(() => {
      setDownloading(false);
      setSuccess(true);
      
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-gray-900">
      <div className="max-w-xl w-full bg-gray-800 border border-gray-700 rounded-2xl p-10 shadow-2xl text-center">
        
        <div className="mx-auto w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 border border-blue-500/20">
          <FileText className="text-blue-400 w-10 h-10" />
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-4">Export Intelligence Report</h2>
        
        <p className="text-gray-400 mb-8 leading-relaxed">
          Generate a comprehensive PDF report for Case <span className="font-mono text-blue-400 bg-blue-400/10 px-2 py-1 rounded">{caseId}</span>. 
          The report includes executive summaries, detected fraud flags, and investigator recommendations.
        </p>

        <button
          onClick={handleDownload}
          disabled={downloading || success}
          className={`w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-xl font-semibold text-lg transition-all ${
            success 
              ? 'bg-green-600 text-white' 
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25'
          } disabled:opacity-75`}
        >
          {success ? (
            <>
              <CheckCircle2 size={24} />
              <span>Report Downloaded</span>
            </>
          ) : (
            <>
              <Download size={24} className={downloading ? 'animate-bounce' : ''} />
              <span>{downloading ? 'Generating...' : 'Download PDF Report'}</span>
            </>
          )}
        </button>
        
        <div className="mt-6 flex items-center justify-center space-x-2 text-xs text-gray-500">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          <span>Officially formatted for CID Karnataka Police</span>
        </div>
      </div>
    </div>
  );
}
