import { useState, useRef, useCallback, useEffect } from 'react';

const TimelineClip = ({ clip, pixelsPerSecond, onClipUpdate, color }) => {
  const clipRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, offsetX: 0 });

  const handleMouseDown = useCallback((e) => {
    if (e.target.className.includes('resize')) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      offsetX: clipRef.current.offsetLeft
    });
  }, []);

  const handleResizeStart = useCallback((e) => {
    e.stopPropagation();
    setIsResizing(true);
    setDragStart({
      x: e.clientX,
      width: clipRef.current.offsetWidth
    });
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging && !isResizing) return;

    if (isDragging) {
      const deltaX = e.clientX - dragStart.x;
      const newStart = Math.max(0, (dragStart.offsetX + deltaX) / pixelsPerSecond);
      
      onClipUpdate({
        ...clip,
        start: newStart
      }, 'move');
    }

    if (isResizing) {
      const deltaX = e.clientX - dragStart.x;
      const newWidth = Math.max(50, dragStart.width + deltaX);
      const newDuration = newWidth / pixelsPerSecond;
      
      onClipUpdate({
        ...clip,
        duration: newDuration
      }, 'resize');
    }
  }, [isDragging, isResizing, dragStart, clip, onClipUpdate, pixelsPerSecond]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={clipRef}
      className={`absolute rounded-lg cursor-move select-none ${
        isDragging || isResizing ? 'ring-2 ring-blue-500' : ''
      }`}
      style={{
        left: `${clip.start * pixelsPerSecond}px`,
        width: `${clip.duration * pixelsPerSecond}px`,
        height: '80px',
        backgroundColor: color,
        border: '1px solid rgba(0,0,0,0.2)',
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="p-2 text-sm font-medium">{clip.label}</div>
      <div
        className="absolute top-0 right-0 w-4 h-full cursor-col-resize resize-handle hover:bg-black/10"
        onMouseDown={handleResizeStart}
      />
    </div>
  );
};

export default TimelineClip;
