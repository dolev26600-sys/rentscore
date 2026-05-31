import React, { useEffect, useState } from 'react';

interface Props {
  score: number;
  size?: number;
  color?: string;
  bgColor?: string;
}

export default function ScoreCircle({ score, size = 140, color, bgColor }: Props) {
  const [displayed, setDisplayed] = useState(0);
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayed / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setDisplayed(score), 120);
    return () => clearTimeout(timer);
  }, [score]);

  const autoColor = score >= 80 ? '#14b8a6' : score >= 60 ? '#F59E0B' : '#ef4444';
  const ringColor = color || autoColor;
  const trackColor = bgColor || (score >= 80 ? '#ccfbf1' : score >= 60 ? '#fef3c7' : '#fee2e2');

  const glowColor = score >= 80
    ? 'rgba(20,184,166,0.4)'
    : score >= 60
    ? 'rgba(245,158,11,0.4)'
    : 'rgba(239,68,68,0.4)';

  return (
    <div className="relative inline-flex items-center justify-center" style={{ filter: `drop-shadow(0 0 14px ${glowColor})` }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={13}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth={13}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.22,.68,0,1.2)' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-black leading-none" style={{ fontSize: size * 0.22, color: ringColor }}>
          {displayed}
        </span>
        <span className="text-gray-400 font-medium" style={{ fontSize: size * 0.085 }}>מתוך 100</span>
      </div>
    </div>
  );
}
