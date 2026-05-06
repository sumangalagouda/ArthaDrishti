import React, { useState } from 'react';
import axios from 'axios';
import { UploadCloud, CheckCircle2, Loader2, File } from 'lucide-react';

export default function Upload({ setCaseId }) {
  const [caseName, setCaseName] = useState('DEMO-CASE-001');
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...droppedFiles]);
    }
  };

  const handleUpload = async () => {
    if (!caseName) {
      setError('Please enter a Case ID');
      return;
    }
    
    setIsUploading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('case_id', caseName);
      // For demo we append a dummy file if empty, or the real ones
      if (files.length > 0) {
        files.forEach(f => formData.append('files', f));
      } else {
        formData.append('demo_mode', 'true');
      }

      const res = await axios.post('https://arthadrishti-b28d.onrender.com/api/upload', formData);
      
      // Artificial delay for effect
      setTimeout(() => {
        setIsUploading(false);
        setCaseId(res.data.case_id);
      }, 1500);
      
    } catch (err) {
      console.error(err);
      setError('Failed to process upload. Ensure backend is running on port 5000.');
      setIsUploading(false);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-gray-900 overflow-y-auto">
      <div className="max-w-2xl w-full">
        
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-2">Initialize Investigation</h2>
          <p className="text-gray-400">Upload bank statements to begin automated fraud detection.</p>
        </div>

        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-xl">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">Case ID / Reference</label>
            <input 
              type="text" 
              value={caseName}
              onChange={(e) => setCaseName(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g. FIR-2026-042"
            />
          </div>

          <div 
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border-2 border-dashed border-gray-600 rounded-xl p-10 text-center hover:bg-gray-750 hover:border-gray-500 transition-colors cursor-pointer mb-6"
            onClick={() => document.getElementById('fileUpload').click()}
          >
            <UploadCloud className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-300 font-medium mb-1">Click or drag bank statements here</p>
            <p className="text-sm text-gray-500">Supports PDF, Excel (.xlsx), CSV</p>
            <input 
              type="file" 
              id="fileUpload" 
              multiple 
              className="hidden" 
              onChange={(e) => setFiles(Array.from(e.target.files))} 
            />
          </div>

          {files.length > 0 && (
            <div className="mb-6 space-y-2">
              {files.map((f, i) => (
                <div key={i} className="flex items-center space-x-3 bg-gray-900 p-3 rounded-lg border border-gray-700">
                  <File size={16} className="text-blue-400" />
                  <span className="text-sm text-gray-300 truncate">{f.name}</span>
                  <span className="text-xs text-gray-500 ml-auto">{(f.size / 1024).toFixed(1)} KB</span>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-800 text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Processing & Analyzing...</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={20} />
                <span>Start Analysis</span>
              </>
            )}
          </button>
          
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              * Note: For the Hackathon Demo, proceeding without files will auto-generate the "Demo Fraud Case" data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
