import { useState, useCallback } from 'react';
import TimelineClip from './TimelineClip';

const getRandomColor = () => {
  const colors = ['#FFB6C1', '#98FB98', '#87CEFA', '#DDA0DD', '#F0E68C'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const Timeline = () => {
  const initialClips = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    start: i * 2,
    duration: 3,
    label: `Clip ${i + 1}`,
    color: getRandomColor()
  }));

  const [clips, setClips] = useState(initialClips);
  const pixelsPerSecond = 100;
  const timelineWidth = Math.max(...clips.map(clip => (clip.start + clip.duration))) * pixelsPerSecond + 200;

  const handleClipUpdate = useCallback((updatedClip, type) => {
    setClips(prevClips => {
      const newClips = prevClips.map(clip =>
        clip.id === updatedClip.id ? updatedClip : clip
      );
      const event = new CustomEvent(
        type === 'move' ? 'clipMoved' : 'clipResized',
        { detail: { clipId: updatedClip.id, ...updatedClip } }
      );
      window.dispatchEvent(event);
      
      return newClips;
    });
  }, []);

  return (
    <div className="w-full h-[400px] bg-gray-100 rounded-lg p-4">
      <div className="relative w-full h-full overflow-x-auto overflow-y-hidden">
        <div 
          className="relative h-full"
          style={{ width: `${timelineWidth}px` }}
        >
          <div className="absolute top-0 left-0 w-full h-8">
            {Array.from({ length: Math.ceil(timelineWidth / pixelsPerSecond) }, (_, i) => (
              <div
                key={i}
                className="absolute top-0 text-xs text-gray-500"
                style={{ left: `${i * pixelsPerSecond}px` }}
              >
                {i}s
              </div>
            ))}
          </div>
          <div className="absolute top-12 left-0 right-0 bottom-0">
            {clips.map(clip => (
              <TimelineClip
                key={clip.id}
                clip={clip}
                pixelsPerSecond={pixelsPerSecond}
                onClipUpdate={handleClipUpdate}
                color={clip.color}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;