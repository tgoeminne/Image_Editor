import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActiveTool,
  AspectRatioOption,
  CropRect,
  EditorHistoryState,
  FilterType,
  ImageAdjustments,
  SplitDirection,
  SplitResult,
  TransformState,
} from './types';
import {
  DEFAULT_ADJUSTMENTS,
  DEFAULT_TRANSFORM,
  cropCanvas,
  loadImage,
  renderToCanvas,
  splitImage,
} from './utils/canvasUtils';
import { Header } from './components/Header';
import { ToolSidebar } from './components/ToolSidebar';
import { CanvasWorkspace } from './components/CanvasWorkspace';
import { EmptyState } from './components/EmptyState';
import { SplitResultModal } from './components/SplitResultModal';
import { ExportModal } from './components/ExportModal';
import { OffCanvasAppMenu } from './components/OffCanvasAppMenu';
import { MobileBottomDock } from './components/MobileBottomDock';
import { MobileToolDrawer } from './components/MobileToolDrawer';
import { Sliders, Check, X, Scissors, Crop } from 'lucide-react';

export default function App() {
  // Loaded image source
  const [currentImageSrc, setCurrentImageSrc] = useState<string | null>(null);
  const [originalImageSrc, setOriginalImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(
    null
  );

  // Active Tool & Editor States
  const [activeTool, setActiveTool] = useState<ActiveTool>('adjust');
  const [adjustments, setAdjustments] = useState<ImageAdjustments>(DEFAULT_ADJUSTMENTS);
  const [filter, setFilter] = useState<FilterType>('none');
  const [filterIntensity, setFilterIntensity] = useState<number>(100);
  const [transform, setTransform] = useState<TransformState>(DEFAULT_TRANSFORM);

  // Off-Canvas Menus States
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isMobileToolDrawerOpen, setIsMobileToolDrawerOpen] = useState<boolean>(false);

  // Crop State
  const [aspectRatio, setAspectRatio] = useState<AspectRatioOption>('free');
  const [activeCropRect, setActiveCropRect] = useState<CropRect | null>(null);

  // Split State
  const [splitDirection, setSplitDirection] = useState<SplitDirection>('vertical');
  const [splitRatio, setSplitRatio] = useState<number>(0.5); // Defaults to exact half (50%)
  const [splitResult, setSplitResult] = useState<SplitResult | null>(null);

  // View & Export States
  const [isComparing, setIsComparing] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(1);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [exportCanvas, setExportCanvas] = useState<HTMLCanvasElement | null>(null);

  // Undo / Redo History
  const [history, setHistory] = useState<EditorHistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const isHistoryActionRef = useRef<boolean>(false);

  // Initialize or load new image
  const handleLoadImage = (src: string, name: string) => {
    setCurrentImageSrc(src);
    setOriginalImageSrc(src);
    setFileName(name);
    setAdjustments(DEFAULT_ADJUSTMENTS);
    setFilter('none');
    setFilterIntensity(100);
    setTransform(DEFAULT_TRANSFORM);
    setActiveTool('adjust');
    setSplitRatio(0.5); // Exact half by default
    setZoom(1);

    const initialHistoryState: EditorHistoryState = {
      adjustments: DEFAULT_ADJUSTMENTS,
      filter: 'none',
      filterIntensity: 100,
      transform: DEFAULT_TRANSFORM,
      croppedCanvasUrl: null,
    };
    setHistory([initialHistoryState]);
    setHistoryIndex(0);
  };

  // Push state to history on significant changes
  const pushHistory = useCallback(
    (newState: Partial<EditorHistoryState>) => {
      if (isHistoryActionRef.current) return;

      setHistory((prev) => {
        const current = prev[historyIndex] || {
          adjustments: DEFAULT_ADJUSTMENTS,
          filter: 'none',
          filterIntensity: 100,
          transform: DEFAULT_TRANSFORM,
          croppedCanvasUrl: null,
        };

        const updated: EditorHistoryState = {
          adjustments: newState.adjustments ?? adjustments,
          filter: newState.filter ?? filter,
          filterIntensity: newState.filterIntensity ?? filterIntensity,
          transform: newState.transform ?? transform,
          croppedCanvasUrl: newState.croppedCanvasUrl ?? current.croppedCanvasUrl,
        };

        const nextHistory = prev.slice(0, historyIndex + 1);
        nextHistory.push(updated);
        // Limit history to 30 states to maintain memory efficiency
        if (nextHistory.length > 30) nextHistory.shift();
        return nextHistory;
      });
      setHistoryIndex((prev) => Math.min(prev + 1, 29));
    },
    [historyIndex, adjustments, filter, filterIntensity, transform]
  );

  const handleUndo = () => {
    if (historyIndex > 0) {
      isHistoryActionRef.current = true;
      const targetState = history[historyIndex - 1];
      setAdjustments(targetState.adjustments);
      setFilter(targetState.filter);
      setFilterIntensity(targetState.filterIntensity);
      setTransform(targetState.transform);
      if (targetState.croppedCanvasUrl) {
        setCurrentImageSrc(targetState.croppedCanvasUrl);
      } else if (originalImageSrc) {
        setCurrentImageSrc(originalImageSrc);
      }
      setHistoryIndex(historyIndex - 1);
      setTimeout(() => {
        isHistoryActionRef.current = false;
      }, 50);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      isHistoryActionRef.current = true;
      const targetState = history[historyIndex + 1];
      setAdjustments(targetState.adjustments);
      setFilter(targetState.filter);
      setFilterIntensity(targetState.filterIntensity);
      setTransform(targetState.transform);
      if (targetState.croppedCanvasUrl) {
        setCurrentImageSrc(targetState.croppedCanvasUrl);
      } else if (originalImageSrc) {
        setCurrentImageSrc(originalImageSrc);
      }
      setHistoryIndex(historyIndex + 1);
      setTimeout(() => {
        isHistoryActionRef.current = false;
      }, 50);
    }
  };

  const handleReset = () => {
    if (!originalImageSrc) return;
    setCurrentImageSrc(originalImageSrc);
    setAdjustments(DEFAULT_ADJUSTMENTS);
    setFilter('none');
    setFilterIntensity(100);
    setTransform(DEFAULT_TRANSFORM);
    setSplitRatio(0.5);
    setActiveTool('adjust');
    pushHistory({
      adjustments: DEFAULT_ADJUSTMENTS,
      filter: 'none',
      filterIntensity: 100,
      transform: DEFAULT_TRANSFORM,
      croppedCanvasUrl: null,
    });
  };

  // Crop execution
  const handleApplyCrop = async () => {
    if (!currentImageSrc || !activeCropRect) return;
    try {
      // First render current image with current transform
      const intermediateCanvas = await renderToCanvas(
        currentImageSrc,
        adjustments,
        filter,
        filterIntensity,
        transform
      );

      const cropped = cropCanvas(intermediateCanvas, activeCropRect);
      const croppedDataUrl = cropped.toDataURL('image/png');

      // Update current image to cropped version and reset adjustments/transforms that are now baked in
      setCurrentImageSrc(croppedDataUrl);
      setAdjustments(DEFAULT_ADJUSTMENTS);
      setFilter('none');
      setFilterIntensity(100);
      setTransform(DEFAULT_TRANSFORM);
      setActiveTool('adjust');
      setActiveCropRect(null);

      pushHistory({
        adjustments: DEFAULT_ADJUSTMENTS,
        filter: 'none',
        filterIntensity: 100,
        transform: DEFAULT_TRANSFORM,
        croppedCanvasUrl: croppedDataUrl,
      });
    } catch (err) {
      console.error('Failed to crop image', err);
    }
  };

  const handleCancelCrop = () => {
    setActiveTool('adjust');
    setActiveCropRect(null);
  };

  // Split execution
  const handlePerformSplit = async () => {
    if (!currentImageSrc) return;
    try {
      // Render full edited image to high-res canvas first
      const fullRenderCanvas = await renderToCanvas(
        currentImageSrc,
        adjustments,
        filter,
        filterIntensity,
        transform
      );

      // Perform slice at splitRatio
      const result = await splitImage(
        fullRenderCanvas,
        splitDirection,
        splitRatio,
        fileName || 'image'
      );

      setSplitResult(result);
    } catch (err) {
      console.error('Failed to split image', err);
    }
  };

  // Open Export Dialog
  const handleOpenExport = async () => {
    if (!currentImageSrc) return;
    try {
      const fullCanvas = await renderToCanvas(
        currentImageSrc,
        adjustments,
        filter,
        filterIntensity,
        transform
      );
      setExportCanvas(fullCanvas);
      setShowExportModal(true);
    } catch (err) {
      console.error('Failed to render export canvas', err);
    }
  };

  // Switch tool and manage drawer state
  const handleSelectTool = (tool: ActiveTool) => {
    setActiveTool(tool);
    setIsMobileToolDrawerOpen(true);
  };

  // Paste from clipboard handler
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = (event) => {
              if (event.target?.result) {
                handleLoadImage(event.target.result as string, 'pasted_image.png');
              }
            };
            reader.readAsDataURL(blob);
          }
          break;
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleOpenExport();
      } else if (e.key === 'Escape') {
        if (isMenuOpen) setIsMenuOpen(false);
        if (isMobileToolDrawerOpen) setIsMobileToolDrawerOpen(false);
        if (activeTool === 'crop') handleCancelCrop();
        if (activeTool === 'split') setActiveTool('adjust');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history, activeTool, currentImageSrc, isMenuOpen, isMobileToolDrawerOpen]);

  return (
    <div
      id="image-editor-root"
      className="h-[100dvh] w-screen flex flex-col bg-[#0A0A0A] text-[#E0E0E0] overflow-hidden font-sans selection:bg-[#E5C378]/30 selection:text-white"
    >
      {/* Top Navigation Bar */}
      <Header
        fileName={fileName}
        imageDimensions={imageDimensions}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onReset={handleReset}
        isComparing={isComparing}
        onStartCompare={() => setIsComparing(true)}
        onEndCompare={() => setIsComparing(false)}
        zoom={zoom}
        onZoomIn={() => setZoom((z) => Math.min(3, z + 0.25))}
        onZoomOut={() => setZoom((z) => Math.max(0.25, z - 0.25))}
        onZoomFit={() => setZoom(1)}
        onOpenNewImage={() => setCurrentImageSrc(null)}
        onExport={handleOpenExport}
        onToggleMenu={() => setIsMenuOpen((prev) => !prev)}
      />

      {/* Main Workspace or Empty Dropzone */}
      {!currentImageSrc ? (
        <EmptyState onImageSelected={handleLoadImage} />
      ) : (
        <div className="flex-1 flex overflow-hidden relative">
          {/* Desktop Left / Sidebar Controls */}
          <ToolSidebar
            activeTool={activeTool}
            onSelectTool={setActiveTool}
            adjustments={adjustments}
            onChangeAdjustments={(adj) => {
              setAdjustments(adj);
              pushHistory({ adjustments: adj });
            }}
            filter={filter}
            filterIntensity={filterIntensity}
            onSelectFilter={(f) => {
              setFilter(f);
              pushHistory({ filter: f });
            }}
            onChangeFilterIntensity={(intensity) => {
              setFilterIntensity(intensity);
              pushHistory({ filterIntensity: intensity });
            }}
            transform={transform}
            onChangeTransform={(t) => {
              setTransform(t);
              pushHistory({ transform: t });
            }}
            aspectRatio={aspectRatio}
            onChangeAspectRatio={setAspectRatio}
            onApplyCrop={handleApplyCrop}
            onCancelCrop={handleCancelCrop}
            splitDirection={splitDirection}
            splitRatio={splitRatio}
            onChangeSplitDirection={setSplitDirection}
            onChangeSplitRatio={setSplitRatio}
            onPerformSplit={handlePerformSplit}
            imageDimensions={imageDimensions}
          />

          {/* Interactive Center Stage */}
          <div className="flex-1 flex flex-col relative overflow-hidden">
            <CanvasWorkspace
              imageSrc={currentImageSrc}
              originalSrc={originalImageSrc || currentImageSrc}
              activeTool={activeTool}
              adjustments={adjustments}
              filter={filter}
              filterIntensity={filterIntensity}
              transform={transform}
              isComparing={isComparing}
              zoom={zoom}
              aspectRatio={aspectRatio}
              onCropChange={setActiveCropRect}
              splitDirection={splitDirection}
              splitRatio={splitRatio}
              onSplitRatioChange={setSplitRatio}
              onSplitDirectionChange={setSplitDirection}
              onPerformSplit={handlePerformSplit}
              onCancelSplit={() => setActiveTool('adjust')}
              onImageLoaded={setImageDimensions}
            />

            {/* Mobile Floating Controls when Drawer is Minimized */}
            {!isMobileToolDrawerOpen && (
              <div className="md:hidden absolute bottom-18 right-4 z-20 flex flex-col gap-2">
                {activeTool === 'crop' && (
                  <div className="flex items-center gap-2 bg-[#0D0D0D]/90 backdrop-blur-md p-1.5 rounded-2xl border border-white/15 shadow-2xl">
                    <button
                      type="button"
                      onClick={handleCancelCrop}
                      className="p-2 rounded-xl bg-[#1A1A1A] text-[#A1A1AA] hover:text-white"
                      title="Cancel Crop"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleApplyCrop}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-[#E5C378] to-[#C9A050] text-[#0A0A0A] font-bold text-xs"
                    >
                      <Check className="w-4 h-4" />
                      <span>Apply Crop</span>
                    </button>
                  </div>
                )}

                {activeTool === 'split' && (
                  <button
                    type="button"
                    onClick={handlePerformSplit}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#E5C378] to-[#C9A050] text-[#0A0A0A] font-bold text-xs shadow-2xl shadow-[#E5C378]/30"
                  >
                    <Scissors className="w-4 h-4" />
                    <span>Split Image</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsMobileToolDrawerOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#141414]/95 hover:bg-[#1F1F1F] text-[#E5C378] font-semibold text-xs border border-[#E5C378]/40 shadow-2xl shadow-black/80 backdrop-blur-md active:scale-95 transition-all self-end"
                >
                  <Sliders className="w-4 h-4" />
                  <span>Controls & Tools</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Off-Canvas Bottom Tool Drawer */}
          <MobileToolDrawer
            isOpen={isMobileToolDrawerOpen}
            onClose={() => setIsMobileToolDrawerOpen(false)}
            activeTool={activeTool}
            adjustments={adjustments}
            onChangeAdjustments={(adj) => {
              setAdjustments(adj);
              pushHistory({ adjustments: adj });
            }}
            filter={filter}
            filterIntensity={filterIntensity}
            onSelectFilter={(f) => {
              setFilter(f);
              pushHistory({ filter: f });
            }}
            onChangeFilterIntensity={(intensity) => {
              setFilterIntensity(intensity);
              pushHistory({ filterIntensity: intensity });
            }}
            transform={transform}
            onChangeTransform={(t) => {
              setTransform(t);
              pushHistory({ transform: t });
            }}
            aspectRatio={aspectRatio}
            onChangeAspectRatio={setAspectRatio}
            onApplyCrop={handleApplyCrop}
            onCancelCrop={handleCancelCrop}
            splitDirection={splitDirection}
            splitRatio={splitRatio}
            onChangeSplitDirection={setSplitDirection}
            onChangeSplitRatio={setSplitRatio}
            onPerformSplit={handlePerformSplit}
            imageDimensions={imageDimensions}
          />

          {/* Mobile Bottom Dock Bar */}
          <MobileBottomDock
            activeTool={activeTool}
            isDrawerOpen={isMobileToolDrawerOpen}
            onSelectTool={handleSelectTool}
            onToggleDrawer={() => setIsMobileToolDrawerOpen((prev) => !prev)}
            adjustments={adjustments}
            filter={filter}
            transform={transform}
          />
        </div>
      )}

      {/* Off-Canvas Navigation / App Menu Drawer */}
      <OffCanvasAppMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        fileName={fileName}
        imageDimensions={imageDimensions}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        historyIndex={historyIndex}
        historyLength={history.length}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onReset={handleReset}
        isComparing={isComparing}
        onStartCompare={() => setIsComparing(true)}
        onEndCompare={() => setIsComparing(false)}
        zoom={zoom}
        onZoomIn={() => setZoom((z) => Math.min(3, z + 0.25))}
        onZoomOut={() => setZoom((z) => Math.max(0.25, z - 0.25))}
        onZoomFit={() => setZoom(1)}
        onSetZoom={(z) => setZoom(z)}
        activeTool={activeTool}
        onSelectTool={(t) => {
          setActiveTool(t);
          setIsMobileToolDrawerOpen(true);
        }}
        onOpenNewImage={() => setCurrentImageSrc(null)}
        onSelectSampleImage={(url, name) => handleLoadImage(url, name)}
        onExport={handleOpenExport}
      />

      {/* Split Result Dialog */}
      {splitResult && (
        <SplitResultModal
          splitResult={splitResult}
          onClose={() => setSplitResult(null)}
          onLoadPieceToEditor={(dataUrl, pieceName) => {
            handleLoadImage(dataUrl, `${pieceName}.png`);
            setSplitResult(null);
          }}
        />
      )}

      {/* Export & Save Dialog */}
      {showExportModal && exportCanvas && (
        <ExportModal
          canvas={exportCanvas}
          defaultFileName={fileName || 'edited_image'}
          onClose={() => {
            setShowExportModal(false);
            setExportCanvas(null);
          }}
        />
      )}
    </div>
  );
}
