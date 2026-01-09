import React, { useEffect, useState } from 'react';

interface Leaf {
  id: number;
  x: number;
  y: number;
  rotation: number;
  duration: number;
  delay: number;
  size: number;
  opacity: number;
}

const LeafBackground: React.FC = () => {
  const [leaves, setLeaves] = useState<Leaf[]>([]);

  useEffect(() => {
    const leafData: Leaf[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      rotation: Math.random() * 360,
      duration: 20 + Math.random() * 15,
      delay: Math.random() * -20,
      size: 80 + Math.random() * 30,
      opacity: 0.2 + Math.random() * 0.2,
    }));
    setLeaves(leafData);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-teal-600 -z-10">
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="absolute"
          style={{
            left: `${leaf.x}%`,
            top: `${leaf.y}%`,
            width: `${leaf.size}px`,
            height: `${leaf.size}px`,
            opacity: leaf.opacity,
            animation: `float ${leaf.duration}s ease-in-out infinite`,
            animationDelay: `${leaf.delay}s`,
          }}
        >
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            style={{
              transform: `rotate(${leaf.rotation}deg)`,
            }}
          >
            <path
              d="M50 10 Q70 30 75 50 Q70 70 50 90 Q40 70 30 50 Q20 40 25 30 Q35 20 50 10 Z"
              fill="rgba(255, 255, 255, 0.4)"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="1"
            />
            <path
              d="M50 10 Q50 50 50 90"
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
        </div>
      ))}
      
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(20px, -30px) rotate(90deg);
          }
          50% {
            transform: translate(-15px, 20px) rotate(180deg);
          }
          75% {
            transform: translate(25px, 15px) rotate(270deg);
          }
        }
      `}</style>
    </div>
  );
};

export default LeafBackground;