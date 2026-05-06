import React, { useState } from 'react';
import { Upload as UploadIcon, LayoutDashboard, Share2, FileText, Menu, X } from 'lucide-react';
import Upload from './components/Upload';
import Dashboard from './components/Dashboard';
import GraphView from './components/GraphView';
import ReportExport from './components/ReportExport';

function App() {
  const [activeTab, setActiveTab] = useState('upload');
  const [caseId, setCaseId] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Nav item component
  const NavItem = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => {
        setActiveTab(id);
        setIsMobileMenuOpen(false);
      }}
      disabled={id !== 'upload' && !caseId}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === id
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

      <div className="flex flex-1 overflow-hidden relative">

        {/* Mobile Top Header (Visible only on small screens) */}
        <div className="md:hidden absolute top-0 left-0 right-0 h-16 bg-gray-950 border-b border-gray-800 flex items-center justify-between px-4 z-30">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            ArthaDrishti
          </h1>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-300 hover:text-white p-2"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/60 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`absolute md:relative inset-y-0 left-0 w-64 bg-gray-950 border-r border-gray-800 flex flex-col z-50 transform transition-transform duration-200 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <div className="p-6 hidden md:block">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
              ArthaDrishti
            </h1>
            <p className="text-sm text-gray-500 mt-1">Intelligence Platform</p>
          </div>

          <div className="md:hidden h-16 flex items-center justify-between px-6 border-b border-gray-800">
            <h1 className="text-xl font-bold text-blue-400">Menu</h1>
            <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400">
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-2 mt-4 md:mt-0 overflow-y-auto">
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
        <main className="flex-1 flex flex-col h-full overflow-hidden relative pt-16 md:pt-0">
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
