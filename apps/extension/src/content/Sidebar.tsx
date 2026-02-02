import { useEffect } from 'react';
import { useStore } from './store';
import { domInteractive } from './DomInteractive';
import { Play, MousePointer, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
// import '../style.css'; // We need to inject styles into shadow root separately

const Sidebar = () => {
  const { 
    isOpen, toggleSidebar, 
    jsonInput, setJsonInput, parsedData, 
    mappings, setMapping, clearMappings,
    activeKey, startSelecting, stopSelecting, isSelecting 
  } = useStore();

  useEffect(() => {
    if (isSelecting && activeKey) {
      domInteractive.activate((selector) => {
        setMapping(activeKey, selector);
      });
    } else {
      domInteractive.deactivate();
    }
    return () => domInteractive.deactivate();
  }, [isSelecting, activeKey, setMapping]);

  const handleFill = () => {
    if (!parsedData) return;
    // Construct the map of Selector -> Value
    const fillMap: Record<string, any> = {};
    Object.entries(mappings).forEach(([key, selector]) => {
      const value = parsedData[key];
      if (value !== undefined) {
        fillMap[selector] = value;
      }
    });
    domInteractive.fillForm(fillMap);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={toggleSidebar}
        className="fixed top-4 right-4 z-[999999] bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        <ChevronLeft size={24} />
      </button>
    );
  }

  return (
    <div className="fixed top-0 right-0 h-screen w-96 bg-white border-l border-gray-200 shadow-2xl z-[999999] flex flex-col font-sans text-gray-800 box-border">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          InputBridge
        </h1>
        <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* JSON Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Paste JSON Data
          </label>
          <textarea
            className="w-full h-32 p-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none font-mono bg-gray-50"
            placeholder='{"name": "John Doe", "email": "john@example.com"}'
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
          />
        </div>

        {/* Data Mapping */}
        {parsedData && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Map Fields
              </label>
              <button 
                onClick={clearMappings}
                className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
              >
                <Trash2 size={12} /> Clear
              </button>
            </div>
            
            <div className="space-y-2">
              {Object.keys(parsedData).map((key) => (
                <div key={key} className="p-3 bg-gray-50 rounded-lg border border-gray-100 transition-all hover:border-blue-200">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-sm font-medium text-blue-700">{key}</span>
                    <button
                      onClick={() => isSelecting && activeKey === key ? stopSelecting() : startSelecting(key)}
                      className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                        activeKey === key 
                          ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-300' 
                          : mappings[key] 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <MousePointer size={12} />
                      {activeKey === key ? 'Picking...' : mappings[key] ? 'Mapped' : 'Select'}
                    </button>
                  </div>
                  
                  <div className="text-xs text-gray-500 truncate mb-1">
                    Value: <span className="text-gray-900">
                      {typeof parsedData[key] === 'object' 
                        ? JSON.stringify(parsedData[key]) 
                        : String(parsedData[key])}
                    </span>
                  </div>
                  
                  {mappings[key] && (
                    <div className="text-[10px] text-gray-400 font-mono break-all bg-white p-1 rounded border border-gray-100">
                      {mappings[key]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <button
          onClick={handleFill}
          disabled={!parsedData || Object.keys(mappings).length === 0}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg shadow-blue-500/20"
        >
          <Play size={18} />
          Auto-Fill Form
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
