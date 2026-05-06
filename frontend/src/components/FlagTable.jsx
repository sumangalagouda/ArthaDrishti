import React from 'react';

export default function FlagTable({ flags }) {
  
  if (!flags || flags.length === 0) {
    return (
      <div className="p-8 text-center text-gray-400">
        No suspicious activities detected for this case.
      </div>
    );
  }

  // Sort flags by severity
  const severityOrder = { "HIGH": 1, "MEDIUM": 2, "LOW": 3 };
  const sortedFlags = [...flags].sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'HIGH':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">MEDIUM</span>;
      case 'LOW':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">LOW</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-500/20 text-gray-400 border border-gray-500/30">{severity}</span>;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase font-semibold">
          <tr>
            <th className="px-6 py-4">Rule/Algorithm</th>
            <th className="px-6 py-4">Severity</th>
            <th className="px-6 py-4">Account ID</th>
            <th className="px-6 py-4 w-1/2">Insight / Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {sortedFlags.map((flag) => (
            <tr key={flag.flag_id} className="hover:bg-gray-750 transition-colors group">
              <td className="px-6 py-4 font-medium text-gray-200">
                {flag.rule}
              </td>
              <td className="px-6 py-4">
                {getSeverityBadge(flag.severity)}
              </td>
              <td className="px-6 py-4">
                <span className="font-mono text-blue-400 bg-blue-400/10 px-2 py-1 rounded border border-blue-400/20">
                  {flag.account_no}
                </span>
              </td>
              <td className="px-6 py-4 text-gray-300">
                {flag.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
