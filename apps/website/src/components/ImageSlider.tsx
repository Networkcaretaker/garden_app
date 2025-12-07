import React, { useState, type ChangeEvent } from 'react';
import { MoveHorizontal } from 'lucide-react';

/**
 * Reusable Before/After Slider Component
 */
interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  altText?: string;
  className?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ 
  beforeImage, 
  afterImage, 
  altText = "Comparison",
  className = ""
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  return (
    <div className={`relative w-full select-none overflow-hidden group ${className}`} 
         // Maintain aspect ratio or rely on container. 
         // Here we let the content define the height or the parent.
    >
      {/* 1. The "After" Image (Background) 
        This image sets the aspect ratio for the container naturally if not constrained by height.
      */}
      <img
        src={afterImage}
        alt={`After ${altText}`}
        className="w-full h-auto block object-cover pointer-events-none"
        draggable={false}
      />

      {/* 2. The "Before" Image (Foreground) 
        Absolutely positioned on top. We clip it based on the slider state.
      */}
      <img
        src={beforeImage}
        alt={`Before ${altText}`}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        draggable={false}
        style={{
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
        }}
      />

      {/* 3. The Slider Handle (Visual)
        This is the visual line and button. It ignores pointer events so the 
        range input underneath captures the drag.
      */}
      <div
        className="absolute inset-y-0 w-1 bg-white cursor-ew-resize shadow-lg z-20 pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* The Circle Handle */}
        <div className={`
          absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-8 h-8 md:w-10 md:h-10 bg-white rounded-full shadow-xl
          flex items-center justify-center transition-transform duration-100
          text-slate-600
          ${isDragging ? 'scale-110' : 'scale-100'}
        `}>
          <MoveHorizontal size={20} />
        </div>
      </div>

      {/* 4. The Interaction Layer (Range Input) 
        Invisible range input that covers the entire area. 
        This ensures the drag works anywhere on the image, not just the handle.
      */}
      <input
        type="range"
        min="0"
        max="100"
        value={sliderPosition}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        onChange={handleSliderChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30 m-0 p-0 appearance-none focus:outline-none"
        aria-label={`Slider to compare ${altText}`}
      />
      
      {/* Optional: Labels */}
      <div className="absolute top-4 left-4 bg-black/50 text-white text-xs font-bold px-2 py-1 rounded pointer-events-none z-10 uppercase tracking-wider">
        Before
      </div>
      <div className="absolute top-4 right-4 bg-black/50 text-white text-xs font-bold px-2 py-1 rounded pointer-events-none z-10 uppercase tracking-wider">
        After
      </div>
    </div>
  );
};
