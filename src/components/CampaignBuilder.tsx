
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

interface Module {
  id: string;
  type: string;
  x: number;
  y: number;
  config?: any;
}

interface Connection {
  from: string;
  to: string;
}

const CampaignBuilder = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [showPalette, setShowPalette] = useState(false);
  const [campaignName, setCampaignName] = useState('Untitled Campaign');
  const canvasRef = useRef<HTMLDivElement>(null);

  const moduleTypes = [
    { type: 'connection', icon: '🔗', name: 'Connection Request', category: 'LinkedIn' },
    { type: 'message', icon: '✉️', name: 'Send Message', category: 'LinkedIn' },
    { type: 'check', icon: '👀', name: 'Check Connection Status', category: 'LinkedIn' },
    { type: 'wait', icon: '⏰', name: 'Wait/Delay', category: 'Logic' },
    { type: 'condition', icon: '❓', name: 'If/Then Condition', category: 'Logic' },
    { type: 'end', icon: '🏁', name: 'End Campaign', category: 'Logic' },
  ];

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const moduleType = e.dataTransfer.getData('moduleType');
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const newModule: Module = {
        id: Date.now().toString(),
        type: moduleType,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      setModules([...modules, newModule]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const deleteModule = (moduleId: string) => {
    setModules(modules.filter(m => m.id !== moduleId));
    setConnections(connections.filter(c => c.from !== moduleId && c.to !== moduleId));
    if (selectedModule === moduleId) {
      setSelectedModule(null);
    }
  };

  const getModuleTypeData = (type: string) => {
    return moduleTypes.find(m => m.type === type) || { icon: '?', name: 'Unknown' };
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header Bar */}
      <div className="border-b border-black px-4 py-3 flex items-center justify-between">
        <Link to="/campaigns" className="text-sm text-gray-600 hover:text-black transition-colors">
          ← Back to Campaigns
        </Link>
        <input
          type="text"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
          className="text-lg font-semibold text-black bg-transparent border-none outline-none text-center"
        />
        <div className="flex space-x-3">
          <button className="px-4 py-2 border border-black text-black hover:bg-gray-50 transition-colors">
            Save
          </button>
          <button className="px-4 py-2 bg-emerald-500 text-white hover:bg-emerald-600 transition-colors">
            Run Campaign
          </button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Canvas */}
        <div className="flex-1 relative">
          <div
            ref={canvasRef}
            className="w-full h-full dot-grid relative overflow-auto"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {/* START Node */}
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center font-bold">
                START
              </div>
            </div>

            {/* Modules */}
            {modules.map((module) => {
              const moduleData = getModuleTypeData(module.type);
              return (
                <div
                  key={module.id}
                  className={`absolute bg-white border transition-all duration-200 cursor-pointer p-4 w-64 ${
                    selectedModule === module.id
                      ? 'border-emerald-500 border-2'
                      : 'border-black hover:border-2'
                  }`}
                  style={{ left: module.x, top: module.y }}
                  onClick={() => setSelectedModule(module.id)}
                >
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">{moduleData.icon}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-black">{moduleData.name}</div>
                      <div className="text-sm text-gray-500">Click to configure</div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteModule(module.id);
                      }}
                      className="text-gray-400 hover:text-black opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                </div>
              );
            })}

            {modules.length === 0 && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="text-gray-500 text-lg mb-4">Drag modules here to begin</p>
                <p className="text-sm text-gray-400">Build your outreach automation workflow</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        {selectedModule && (
          <div className="w-80 border-l border-black bg-white p-6">
            <h3 className="font-semibold text-black mb-4">Module Configuration</h3>
            <div className="space-y-4">
              {getModuleTypeData(modules.find(m => m.id === selectedModule)?.type || '').type === 'message' && (
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Message Content</label>
                  <textarea
                    className="w-full h-32 p-3 border border-black text-sm"
                    placeholder="Hi {{firstName}}, I noticed..."
                  />
                </div>
              )}
              {getModuleTypeData(modules.find(m => m.id === selectedModule)?.type || '').type === 'wait' && (
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Wait Duration</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      className="flex-1 p-2 border border-black"
                      placeholder="1"
                    />
                    <select className="p-2 border border-black">
                      <option>Days</option>
                      <option>Hours</option>
                      <option>Minutes</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Module Palette */}
      <div className="border-t border-black">
        {!showPalette ? (
          <button
            onClick={() => setShowPalette(true)}
            className="w-full p-4 text-center text-gray-600 hover:text-black transition-colors"
          >
            ↑ Add Modules
          </button>
        ) : (
          <div className="p-4 bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-black">Module Library</h3>
              <button
                onClick={() => setShowPalette(false)}
                className="text-gray-400 hover:text-black"
              >
                ↓
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-black mb-2">LinkedIn</h4>
                <div className="space-y-2">
                  {moduleTypes.filter(m => m.category === 'LinkedIn').map((moduleType) => (
                    <div
                      key={moduleType.type}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData('moduleType', moduleType.type)}
                      className="flex items-center p-2 border border-black cursor-move hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-lg mr-2">{moduleType.icon}</span>
                      <span className="text-sm">{moduleType.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-black mb-2">Logic</h4>
                <div className="space-y-2">
                  {moduleTypes.filter(m => m.category === 'Logic').map((moduleType) => (
                    <div
                      key={moduleType.type}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData('moduleType', moduleType.type)}
                      className="flex items-center p-2 border border-black cursor-move hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-lg mr-2">{moduleType.icon}</span>
                      <span className="text-sm">{moduleType.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignBuilder;
