import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import { Network, Maximize2 } from 'lucide-react';

export default function GraphView({ caseId }) {
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(true);
  const cyRef = useRef(null);

  useEffect(() => {
    if (!caseId) return;
    
    const fetchGraph = async () => {
      try {
        const res = await axios.get(`https://arthadrishti-b28d.onrender.com/api/graph/${caseId}`);
        setGraphData(res.data);
      } catch (err) {
        console.error("Error fetching graph", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGraph();
  }, [caseId]);

  const elements = [
    ...graphData.nodes.map(n => ({
      data: {
        id: n.data.id,
        label: n.data.label,
        flagged: n.data.flagged,
        total_amount: n.data.total_amount
      }
    })),
    ...graphData.edges.map(e => ({
      data: {
        source: e.data.source,
        target: e.data.target,
        label: e.data.label
      }
    }))
  ];

  const stylesheet = [
    {
      selector: 'node',
      style: {
        'background-color': (ele) => ele.data('flagged') ? '#ef4444' : '#3b82f6', // Red if flagged, else blue
        'label': 'data(label)',
        'color': '#fff',
        'text-valign': 'bottom',
        'text-halign': 'center',
        'text-margin-y': 5,
        'font-size': '12px',
        'font-family': 'Inter, sans-serif',
        'text-outline-width': 2,
        'text-outline-color': '#111827',
        'width': (ele) => Math.max(30, Math.min(60, 30 + (ele.data('total_amount') || 0) / 10000)), // Scale by volume
        'height': (ele) => Math.max(30, Math.min(60, 30 + (ele.data('total_amount') || 0) / 10000)),
        'border-width': (ele) => ele.data('flagged') ? 4 : 2,
        'border-color': (ele) => ele.data('flagged') ? '#991b1b' : '#1e3a8a',
        'shadow-blur': 10,
        'shadow-color': (ele) => ele.data('flagged') ? '#ef4444' : '#3b82f6',
        'shadow-opacity': 0.5
      }
    },
    {
      selector: 'edge',
      style: {
        'width': 2,
        'line-color': '#4b5563',
        'target-arrow-color': '#4b5563',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier',
        'label': 'data(label)',
        'font-size': '10px',
        'color': '#9ca3af',
        'text-rotation': 'autorotate',
        'text-background-opacity': 1,
        'text-background-color': '#111827',
        'text-background-padding': '2px',
        'text-border-opacity': 0,
        'arrow-scale': 1.2
      }
    }
  ];

  const layout = {
    name: 'cose',
    idealEdgeLength: 100,
    nodeOverlap: 20,
    refresh: 20,
    fit: true,
    padding: 30,
    randomize: false,
    componentSpacing: 100,
    nodeRepulsion: 400000,
    edgeElasticity: 100,
    nestingFactor: 5,
    gravity: 80,
    numIter: 1000,
    initialTemp: 200,
    coolingFactor: 0.95,
    minTemp: 1.0
  };

  const handleFit = () => {
    if (cyRef.current) {
      cyRef.current.fit();
    }
  };

  if (loading) {
    return <div className="flex-1 flex items-center justify-center text-gray-400">Loading graph data...</div>;
  }

  return (
    <div className="flex-1 flex flex-col p-6 bg-gray-950 relative h-full">
      <div className="absolute top-8 left-8 z-10 pointer-events-none">
        <h2 className="text-2xl font-bold text-white flex items-center shadow-black drop-shadow-md">
          <Network className="mr-2 text-blue-400" />
          Financial Network Graph
        </h2>
        <p className="text-sm text-gray-400 drop-shadow-md">Visualizing money flow and suspicious nodes</p>
      </div>
      
      <div className="absolute top-8 right-8 z-10">
        <button 
          onClick={handleFit}
          className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-lg border border-gray-700 shadow-lg transition-colors flex items-center"
          title="Fit Graph to View"
        >
          <Maximize2 size={18} className="mr-2"/> Fit View
        </button>
      </div>

      <div className="flex-1 border border-gray-800 rounded-xl overflow-hidden bg-[#0a0a0a] shadow-[inset_0_0_50px_rgba(0,0,0,0.5)]">
        {elements.length > 0 ? (
          <CytoscapeComponent
            elements={elements}
            stylesheet={stylesheet}
            style={{ width: '100%', height: '100%' }}
            layout={layout}
            cy={(cy) => { cyRef.current = cy; }}
            wheelSensitivity={0.2}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            No graph data available.
          </div>
        )}
      </div>
      
      <div className="absolute bottom-8 left-8 z-10 flex space-x-4">
        <div className="flex items-center space-x-2 bg-gray-900/80 px-3 py-1 rounded border border-gray-800 backdrop-blur-sm">
          <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
          <span className="text-xs text-gray-300 font-medium">Flagged Account</span>
        </div>
        <div className="flex items-center space-x-2 bg-gray-900/80 px-3 py-1 rounded border border-gray-800 backdrop-blur-sm">
          <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
          <span className="text-xs text-gray-300 font-medium">Clean Account</span>
        </div>
      </div>
    </div>
  );
}
