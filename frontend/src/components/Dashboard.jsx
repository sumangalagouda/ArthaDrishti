import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Activity, AlertTriangle, Users, DollarSign, ShieldAlert } from 'lucide-react';
import FlagTable from './FlagTable';

export default function Dashboard({ caseId }) {
  const [summary, setSummary] = useState(null);
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!caseId) return;
    
    const fetchData = async () => {
      try {
        const [sumRes, flagRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/summary/${caseId}`),
          axios.get(`http://localhost:5000/api/results/${caseId}`)
        ]);
        
        setSummary(sumRes.data);
        setFlags(flagRes.data);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [caseId]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-900">
        <div className="animate-pulse flex flex-col items-center">
          <ShieldAlert className="text-blue-500 h-12 w-12 mb-4 animate-bounce" />
          <p className="text-gray-400 font-medium">Analyzing transaction patterns...</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  const highFlags = flags.filter(f => f.severity === 'HIGH').length;

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-gray-900">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-1">Intelligence Dashboard</h2>
          <p className="text-gray-400">Overview of suspicious activities and insights.</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Date Range Analyzed</div>
          <div className="font-medium text-gray-300">{summary?.date_range}</div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 text-blue-500/10">
            <Activity size={100} />
          </div>
          <div className="flex items-center space-x-3 text-gray-400 mb-2">
            <Activity size={20} className="text-blue-400" />
            <span className="font-medium">Total Transactions</span>
          </div>
          <div className="text-3xl font-bold text-white">{summary?.total_transactions}</div>
        </div>

        <div className="bg-gray-800 border border-red-900/50 rounded-xl p-6 relative overflow-hidden shadow-[0_0_15px_rgba(220,38,38,0.1)]">
          <div className="absolute -right-4 -top-4 text-red-500/10">
            <AlertTriangle size={100} />
          </div>
          <div className="flex items-center space-x-3 text-gray-400 mb-2">
            <AlertTriangle size={20} className="text-red-400" />
            <span className="font-medium">Total Flags Detected</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <div className="text-3xl font-bold text-white">{summary?.total_flags}</div>
            {highFlags > 0 && <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded-full">{highFlags} HIGH</span>}
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 text-green-500/10">
            <DollarSign size={100} />
          </div>
          <div className="flex items-center space-x-3 text-gray-400 mb-2">
            <DollarSign size={20} className="text-green-400" />
            <span className="font-medium">Total Volume Analyzed</span>
          </div>
          <div className="text-3xl font-bold text-white">{formatCurrency(summary?.total_amount || 0)}</div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 text-purple-500/10">
            <Users size={100} />
          </div>
          <div className="flex items-center space-x-3 text-gray-400 mb-2">
            <Users size={20} className="text-purple-400" />
            <span className="font-medium">Accounts Involved</span>
          </div>
          <div className="text-3xl font-bold text-white">{summary?.accounts_involved}</div>
        </div>
      </div>

      {/* Flag Table Section */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <ShieldAlert size={18} className="mr-2 text-red-400" />
            Suspicious Activity Log
          </h3>
          <span className="text-xs text-gray-500 font-medium px-2 py-1 bg-gray-900 rounded border border-gray-700">Sorted by Severity</span>
        </div>
        <div className="p-0">
          <FlagTable flags={flags} />
        </div>
      </div>
    </div>
  );
}
