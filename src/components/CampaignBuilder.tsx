import React, { useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface Module {
  id: string;
  type: string;
  x: number;
  y: number;
  config?: any;
}

interface Connection {
  id: string;
  from: string;
  to: string;
}

interface ModuleType {
  type: string;
  icon: string;
  name: string;
  category: string;
}

const CampaignBuilder = () => {
  const navigate = useNavigate();
  const [modules, setModules] = useState<Module[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [showPalette, setShowPalette] = useState(false);
  const [campaignName, setCampaignName] = useState('Untitled Campaign');
  const [draggedModule, setDraggedModule] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [tempConnection, setTempConnection] = useState<{x: number, y: number} | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [linkedinConnected] = useState(true);
  const canvasRef = useRef<HTMLDivElement>(null);

  const moduleTypes: ModuleType[] = [
    { type: 'connection', icon: '🔗', name: 'Connection Request', category: 'LinkedIn' },
    { type: 'message', icon: '✉️', name: 'Send Message', category: 'LinkedIn' },
    { type: 'check', icon: '👀', name: 'Check Connection Status', category: 'LinkedIn' },
    { type: 'wait', icon: '⏰', name: 'Wait/Delay', category: 'Logic' },
    { type: 'condition', icon: '❓', name: 'If/Then Condition', category: 'Logic' },
    { type: 'end', icon: '🏁', name: 'End Campaign', category: 'Logic' },
  ];

  // Add module from palette
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const moduleType = e.dataTransfer.getData('moduleType');
    if (!moduleType) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const newModule: Module = {
        id: Date.now().toString(),
        type: moduleType,
        x: e.clientX - rect.left - 128, // Center the module
        y: e.clientY - rect.top - 32,
      };
      setModules([...modules, newModule]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Module repositioning
  const handleModuleMouseDown = (e: React.MouseEvent, moduleId: string) => {
    if ((e.target as HTMLElement).closest('.delete-btn') || (e.target as HTMLElement).closest('.connection-point')) {
      return;
    }
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const module = modules.find(m => m.id === moduleId);
      if (module) {
        setDraggedModule(moduleId);
        setDragOffset({
          x: e.clientX - rect.left - module.x,
          y: e.clientY - rect.top - module.y,
        });
      }
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      if (draggedModule) {
        setModules(prev => prev.map(module => 
          module.id === draggedModule
            ? {
                ...module,
                x: e.clientX - rect.left - dragOffset.x,
                y: e.clientY - rect.top - dragOffset.y,
              }
            : module
        ));
      } else if (isConnecting) {
        setTempConnection({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    }
  }, [draggedModule, dragOffset, isConnecting]);

  const handleMouseUp = useCallback(() => {
    setDraggedModule(null);
    setIsConnecting(false);
    setTempConnection(null);
    setConnectingFrom(null);
  }, []);

  React.useEffect(() => {
    if (draggedModule || isConnecting) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggedModule, isConnecting, handleMouseMove, handleMouseUp]);

  // Connection functionality
  const handleConnectionStart = (e: React.MouseEvent, moduleId: string) => {
    e.stopPropagation();
    setConnectingFrom(moduleId);
    setIsConnecting(true);
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setTempConnection({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleConnectionEnd = (e: React.MouseEvent, moduleId: string) => {
    e.stopPropagation();
    if (connectingFrom && connectingFrom !== moduleId) {
      const newConnection: Connection = {
        id: `${connectingFrom}-${moduleId}`,
        from: connectingFrom,
        to: moduleId,
      };
      setConnections(prev => [...prev, newConnection]);
    }
    setConnectingFrom(null);
    setIsConnecting(false);
    setTempConnection(null);
  };

  const deleteModule = (moduleId: string) => {
    setModules(modules.filter(m => m.id !== moduleId));
    setConnections(connections.filter(c => c.from !== moduleId && c.to !== moduleId));
    if (selectedModule === moduleId) {
      setSelectedModule(null);
    }
  };

  const getModuleTypeData = (type: string): ModuleType => {
    return moduleTypes.find(m => m.type === type) || { type: 'unknown', icon: '?', name: 'Unknown', category: 'Unknown' };
  };

  // Draw connection lines
  const renderConnections = () => {
    const lines = [];
    
    // Render permanent connections
    connections.forEach(connection => {
      const fromModule = modules.find(m => m.id === connection.from);
      const toModule = modules.find(m => m.id === connection.to);
      
      if (!fromModule || !toModule) return;

      const fromX = fromModule.x + 128; // Center of module
      const fromY = fromModule.y + 80; // Bottom of module
      const toX = toModule.x + 128; // Center of target module
      const toY = toModule.y; // Top of target module

      // Create smooth curved path
      const midY = fromY + (toY - fromY) / 2;
      const controlPoint1Y = fromY + 50;
      const controlPoint2Y = toY - 50;

      const pathData = `M ${fromX} ${fromY} C ${fromX} ${controlPoint1Y}, ${toX} ${controlPoint2Y}, ${toX} ${toY}`;

      lines.push(
        <svg
          key={connection.id}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{ zIndex: 1 }}
        >
          <defs>
            <marker
              id={`arrowhead-${connection.id}`}
              markerWidth="12"
              markerHeight="8"
              refX="11"
              refY="4"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <polygon points="0 0, 12 4, 0 8" fill="#000" />
            </marker>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.1"/>
            </filter>
          </defs>
          <path
            d={pathData}
            stroke="#000"
            strokeWidth="3"
            fill="none"
            markerEnd={`url(#arrowhead-${connection.id})`}
            filter="url(#shadow)"
            className="transition-all duration-200"
          />
        </svg>
      );
    });

    // Render temporary connection line while dragging
    if (isConnecting && connectingFrom && tempConnection) {
      const fromModule = modules.find(m => m.id === connectingFrom);
      if (fromModule) {
        const fromX = fromModule.x + 128;
        const fromY = fromModule.y + 80;
        
        const controlPointY = fromY + 50;
        const pathData = `M ${fromX} ${fromY} Q ${fromX} ${controlPointY} ${tempConnection.x} ${tempConnection.y}`;

        lines.push(
          <svg
            key="temp-connection"
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ zIndex: 1 }}
          >
            <defs>
              <marker
                id="temp-arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#10B981" />
              </marker>
            </defs>
            <path
              d={pathData}
              stroke="#10B981"
              strokeWidth="3"
              fill="none"
              strokeDasharray="8,4"
              markerEnd="url(#temp-arrowhead)"
              className="animate-pulse"
            />
          </svg>
        );
      }
    }

    return lines;
  };

  const handleNext = () => {
    // Navigate to campaign setup flow
    navigate('/campaigns/1/setup');
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
        <div className="flex items-center space-x-4">
          <div className="text-sm">
            <span className={linkedinConnected ? "text-emerald-500" : "text-red-500"}>
              LinkedIn: {linkedinConnected ? "Connected ✓" : "Not Connected"}
            </span>
            {!linkedinConnected && (
              <Link to="/linkedin-connect" className="ml-2 text-emerald-500 hover:text-emerald-600">
                Connect
              </Link>
            )}
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 border border-black text-black hover:bg-gray-50 transition-colors">
              Save
            </button>
            <button 
              onClick={handleNext}
              className="px-4 py-2 bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
            >
              Next
            </button>
          </div>
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
            style={{ minHeight: '800px' }}
          >
            {/* Connection lines */}
            {renderConnections()}

            {/* Modules */}
            {modules.map((module) => {
              const moduleData = getModuleTypeData(module.type);
              return (
                <div
                  key={module.id}
                  className={`absolute bg-white border transition-all duration-200 cursor-pointer p-4 w-64 group ${
                    selectedModule === module.id
                      ? 'border-emerald-500 border-2'
                      : 'border-black hover:border-2'
                  }`}
                  style={{ left: module.x, top: module.y, zIndex: 2 }}
                  onMouseDown={(e) => handleModuleMouseDown(e, module.id)}
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
                      className="delete-btn text-gray-400 hover:text-black opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                  
                  {/* Enhanced connection point */}
                  <div
                    className="connection-point absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-5 h-5 bg-white border-2 border-black rounded-full cursor-pointer hover:bg-emerald-500 hover:border-emerald-500 hover:scale-110 transition-all duration-200 flex items-center justify-center"
                    onMouseDown={(e) => handleConnectionStart(e, module.id)}
                    onMouseUp={(e) => handleConnectionEnd(e, module.id)}
                  >
                    <div className="w-2 h-2 bg-gray-400 rounded-full group-hover:bg-white"></div>
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
