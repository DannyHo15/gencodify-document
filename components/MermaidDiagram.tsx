import React, { useEffect, useState, useRef } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Maximize, Minimize, X } from 'lucide-react';

interface MermaidDiagramProps {
  chart: string;
}

declare global {
  interface Window {
    mermaid: any;
  }
}

interface MermaidViewerProps {
  svg: string;
  isFullScreen?: boolean;
  onToggleFullScreen?: () => void;
  onClose?: () => void;
}

const MermaidViewer: React.FC<MermaidViewerProps> = ({ svg, isFullScreen, onToggleFullScreen, onClose }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset view when entering/exiting full screen or when svg updates
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [svg, isFullScreen]);

  const handleZoomIn = () => setScale(s => Math.min(s + 0.2, 5));
  const handleZoomOut = () => setScale(s => Math.max(s - 0.2, 0.5));
  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  // Handle wheel zoom (Ctrl + Scroll)
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        setScale(s => Math.max(0.5, Math.min(5, s + delta)));
    }
  }

  // Handle Escape key
  useEffect(() => {
    if (!isFullScreen || !onClose) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreen, onClose]);

  return (
    <div className={`relative overflow-hidden bg-gray-50 select-none group w-full h-full ${isFullScreen ? 'bg-white' : 'rounded-xl border border-gray-200 shadow-sm'}`}>
        {/* Full Screen Close Button */}
        {isFullScreen && onClose && (
            <button 
                onClick={onClose}
                className="absolute top-6 right-6 z-20 p-2 bg-white rounded-full shadow-lg border border-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all"
                title="Close Full Screen"
            >
                <X className="w-6 h-6" />
            </button>
        )}

       <div 
         ref={containerRef}
         className="w-full h-full flex items-center justify-center transition-cursor"
         onMouseDown={handleMouseDown}
         onMouseMove={handleMouseMove}
         onMouseUp={handleMouseUp}
         onMouseLeave={handleMouseLeave}
         onWheel={handleWheel}
         style={{
            cursor: isDragging ? 'grabbing' : 'grab',
            backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)',
            backgroundSize: '20px 20px'
         }}
       >
         <div 
            style={{ 
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transition: isDragging ? 'none' : 'transform 0.1s ease-out',
              transformOrigin: 'center center',
              padding: '2rem'
            }}
            dangerouslySetInnerHTML={{ __html: svg }} 
         />
       </div>
       
       {/* Toolbar */}
       <div 
         className={`
           absolute bottom-6 flex items-center space-x-1 bg-white p-1.5 rounded-lg border border-gray-200 shadow-lg transition-opacity duration-200 z-10
           ${isFullScreen ? 'left-1/2 -translate-x-1/2 opacity-100' : 'right-4 opacity-90 group-hover:opacity-100'}
         `}
       >
          <button 
            onClick={handleZoomOut}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-gray-500 w-12 text-center select-none">
            {Math.round(scale * 100)}%
          </span>
          <button 
            onClick={handleZoomIn}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          
          <div className="w-px h-5 bg-gray-200 mx-1"></div>
          
          <button 
            onClick={handleReset}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          
          {onToggleFullScreen && (
              <>
                <div className="w-px h-5 bg-gray-200 mx-1"></div>
                <button 
                  onClick={onToggleFullScreen}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                  title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
                >
                    {isFullScreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                </button>
              </>
          )}
       </div>
    </div>
  );
};

export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart }) => {
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const id = useRef(`mermaid-${Math.random().toString(36).substr(2, 9)}`).current;
  
  useEffect(() => {
    if (!window.mermaid) {
      setError("Mermaid library not found");
      return;
    }

    try {
      window.mermaid.initialize({
        startOnLoad: false,
        theme: 'neutral',
        securityLevel: 'loose',
        fontFamily: 'Inter, sans-serif',
        logLevel: 'error',
      });
    } catch (e) {
      // Ignore initialization errors if already initialized
    }

    const renderDiagram = async () => {
      try {
        const { svg } = await window.mermaid.render(id, chart);
        setSvg(svg);
        setError(null);
      } catch (e: any) {
        console.error("Mermaid render error", e);
        const message = e instanceof Error ? e.message : "Syntax error in diagram definition";
        setError(message);
      }
    };

    renderDiagram();
  }, [chart, id]);

  if (error) {
    return (
      <div className="my-6 p-4 border border-red-200 bg-red-50 rounded-lg text-sm text-red-700 font-mono">
        <p className="font-bold mb-2">Diagram Rendering Error</p>
        <p className="mb-4">{error}</p>
        <div className="bg-white p-2 border border-red-100 rounded opacity-75 overflow-x-auto">
           <pre>{chart}</pre>
        </div>
      </div>
    );
  }

  if (!svg) {
    return (
        <div className="my-8 h-32 bg-gray-50 animate-pulse rounded-lg flex items-center justify-center text-gray-400 text-sm font-medium border border-gray-100">
            Rendering Diagram...
        </div>
    );
  }

  return (
    <>
      <div className="my-8 h-[500px]">
        <MermaidViewer 
          svg={svg} 
          onToggleFullScreen={() => setIsFullScreen(true)} 
        />
      </div>

      {isFullScreen && (
        <div className="fixed inset-0 z-[100] bg-white animate-in fade-in duration-200">
           <MermaidViewer 
             svg={svg} 
             isFullScreen={true} 
             onClose={() => setIsFullScreen(false)}
             onToggleFullScreen={() => setIsFullScreen(false)}
           />
        </div>
      )}
    </>
  );
};
