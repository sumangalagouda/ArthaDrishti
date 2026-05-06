import React, { useState } from 'react';
import { Upload as UploadIcon, LayoutDashboard, Share2, FileText } from 'lucide-react';
import Upload from './components/Upload';
import Dashboard from './components/Dashboard';
import GraphView from './components/GraphView';
import ReportExport from './components/ReportExport';

function App() {
  const [activeTab, setActiveTab] = useState('upload');
  const [caseId, setCaseId] = useState(null);

  // Nav item component
  const NavItem = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      disabled={id !== 'upload' && !caseId}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        activeTab === id 
          ? 'bg-blue-600 text-white' 
          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
      } ${(id !== 'upload' && !caseId) ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {/* Hackathon Banner */}
      <div className="bg-gradient-to-r from-blue-900/80 via-indigo-900/80 to-purple-900/80 text-center py-2 px-4 text-xs sm:text-sm text-blue-100 font-medium border-b border-blue-800 shadow-md">
        <span className="font-bold text-white mr-2">CIDECODE 2026:</span>
        This is a live functional prototype using synthetic demonstration data. Core algorithms and UI are fully implemented and ready for real data integration.
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-950 border-r border-gray-800 flex flex-col">
          <div className="p-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
              ArthaDrishti
            </h1>
            <p className="text-sm text-gray-500 mt-1">Intelligence Platform</p>
          </div>
          
          <nav className="flex-1 px-4 space-y-2">
            <NavItem id="upload" icon={UploadIcon} label="Data Ingestion" />
            <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
            <NavItem id="graph" icon={Share2} label="Network Graph" />
            <NavItem id="report" icon={FileText} label="Export Report" />
          </nav>
          
          {caseId && (
            <div className="p-4 border-t border-gray-800">
              <div className="text-xs text-gray-500 mb-1">Active Case</div>
              <div className="text-sm font-medium text-blue-400 truncate">{caseId}</div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-full overflow-hidden relative">
          {activeTab === 'upload' && <Upload setCaseId={(id) => { setCaseId(id); setActiveTab('dashboard'); }} />}
          {activeTab === 'dashboard' && <Dashboard caseId={caseId} />}
          {activeTab === 'graph' && <GraphView caseId={caseId} />}
          {activeTab === 'report' && <ReportExport caseId={caseId} />}
        </main>
      </div>
    </div>
  );
}

export default App;
