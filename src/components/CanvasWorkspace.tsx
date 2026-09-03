import React, { useEffect, useRef, useState } from 'react';
import {
  ActiveTool,
  AspectRatioOption,
  CropRect,
  FilterType,
  ImageAdjustments,
  SplitDirection,
  TransformState,
} from '../types';
import { getCSSFilterString } from '../utils/canvasUtils';
import { CropOverlay } from './CropOverlay';
import { SplitOverlay } from './SplitOverlay';

interface CanvasWorkspaceProps {
  imageSrc: string;
  originalSrc: string;
  activeTool: ActiveTool;
  adjustments: ImageAdjustments;
  filter: FilterType;
  filterIntensity: number;
  transform: TransformState;
  isComparing: boolean;
  zoom: number;
  // Crop props
  aspectRatio: AspectRatioOption;
  onCropChange: (crop: CropRect) => void;
  // Split props
  splitDirection: SplitDirection;
  splitRatio: number;
  onSplitRatioChange: (ratio: number) => void;
  onSplitDirectionChange: (dir: SplitDirection) => void;
  onPerformSplit: () => void;
  onCancelSplit: () => void;
  // Natural image dimensions callback
  onImageLoaded: (dimensions: { width: number; height: number }) => void;
}

export const CanvasWorkspace: React.FC<CanvasWorkspaceProps> = ({
  imageSrc,
  originalSrc,
  activeTool,
  adjustments,
  filter,
  filterIntensity,
  transform,
  isComparing,
  zoom,
  aspectRatio,
  onCropChange,
  splitDirection,
  splitRatio,
  onSplitRatioChange,
  onSplitDirectionChange,
  onPerformSplit,
  onCancelSplit,
  onImageLoaded,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const [naturalDimensions, setNaturalDimensions] = useState<{ width: number; height: number } | null>(
    null
  );
  const [renderedDimensions, setRenderedDimensions] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    const dims = { width: target.naturalWidth, height: target.naturalHeight };
    setNaturalDimensions(dims);
    onImageLoaded(dims);
    updateRenderedSize();
  };

  const updateRenderedSize = () => {
    if (imgRef.current) {
      setRenderedDimensions({
        width: imgRef.current.clientWidth,
        height: imgRef.current.clientHeight,
      });
    }
  };

  useEffect(() => {
    updateRenderedSize();
    const handleResize = () => updateRenderedSize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [imageSrc, zoom, transform]);

  // CSS Filter string for live hardware-accelerated preview
  const cssFilter = isComparing
    ? 'none'
    : getCSSFilterString(adjustments, filter, filterIntensity);

  // Compute CSS Transform for rotation and flip
  const totalAngle = (transform.rotate + transform.fineRotate) % 360;
  const transformStyle = isComparing
    ? 'none'
    : `rotate(${totalAngle}deg) scale(${transform.flipH ? -1 : 1}, ${transform.flipV ? -1 : 1})`;

  const displaySrc = isComparing ? originalSrc : imageSrc;

  return (
    <main
      ref={containerRef}
      id="canvas-workspace"
      onContextMenu={(e) => e.preventDefault()}
      className="flex-1 bg-[#080808] relative overflow-hidden flex items-center justify-center select-none"
      style={{
        backgroundImage: `
          radial-gradient(circle at 50% 50%, rgba(26, 26, 26, 0.6) 0%, rgba(8, 8, 8, 1) 100%),
          linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 32px 32px, 32px 32px',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none',
      }}
    >
      {/* Zoom Container */}
      <div
        id="image-render-stage"
        className="relative transition-transform duration-100 ease-out flex items-center justify-center max-w-[92%] max-h-[92%]"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'center center',
        }}
      >
        {/* The Display Image with Live Filters */}
        <div className="relative shadow-[0_30px_70px_rgba(0,0,0,0.95)] rounded-sm overflow-hidden bg-[#0F0F0F] border border-white/15">
          {displaySrc ? (
            <img
              ref={imgRef}
              id="workspace-preview-image"
              src={displaySrc}
              alt="Workspace Canvas"
              crossOrigin="anonymous"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              onLoad={handleImageLoad}
              className="max-h-[calc(100dvh-170px)] md:max-h-[calc(100vh-120px)] max-w-[calc(100vw-32px)] md:max-w-[calc(100vw-380px)]"
              style={{
                filter: cssFilter,
                transform: transformStyle,
                objectFit: 'contain',
                display: 'block',
                transition: isComparing ? 'none' : 'filter 0.05s ease-out, transform 0.15s ease-out',
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
                userSelect: 'none',
              }}
            />
          ) : null}

          {/* Vignette Overlay for Live Preview */}
          {!isComparing && adjustments.vignette > 0 && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                boxShadow: `inset 0 0 ${adjustments.vignette * 1.5}px ${adjustments.vignette * 0.8}px rgba(0,0,0,0.85)`,
              }}
            />
          )}

          {/* Comparing Indicator badge */}
          {isComparing && (
            <div className="absolute top-3 left-3 bg-[#E5C378] text-[#0A0A0A] text-xs font-bold px-3 py-1 rounded-md shadow-xl border border-white/30 flex items-center gap-1.5 pointer-events-none font-serif">
              <span>Original Source</span>
            </div>
          )}

          {/* Crop Overlay when Crop tool is active */}
          {activeTool === 'crop' &&
            naturalDimensions &&
            renderedDimensions.width > 0 &&
            renderedDimensions.height > 0 && (
              <CropOverlay
                imageWidth={naturalDimensions.width}
                imageHeight={naturalDimensions.height}
                containerWidth={renderedDimensions.width}
                containerHeight={renderedDimensions.height}
                aspectRatio={aspectRatio}
                onCropChange={onCropChange}
              />
            )}

          {/* Split Overlay when Split tool is active */}
          {activeTool === 'split' &&
            naturalDimensions &&
            renderedDimensions.width > 0 &&
            renderedDimensions.height > 0 && (
              <SplitOverlay
                containerWidth={renderedDimensions.width}
                containerHeight={renderedDimensions.height}
                imageWidth={naturalDimensions.width}
                imageHeight={naturalDimensions.height}
                direction={splitDirection}
                splitRatio={splitRatio}
                onRatioChange={onSplitRatioChange}
                onDirectionChange={onSplitDirectionChange}
                onPerformSplit={onPerformSplit}
                onCancel={onCancelSplit}
              />
            )}
        </div>
      </div>
    </main>
  );
};
