import React, { useEffect, useState } from 'react';

interface Props {
  score: number;
  size?: number;
  color?: string;
  bgColor?: string;
}

export default function ScoreCircle({ score, size = 140, color = '#14b8a6', bgColor = '#ccfbf1' }: Props) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  const getColor = (s: number) => {
    if (s >= 80) return '#14b8a6';
    if (s >= 60) return '#F59E0B';
    return '#ef4444';
  };

  const ringColor = color || getColor(score);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={12}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth={12}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="score-ring"
          style={{ transition: 'stroke-dashoffset 1.2s ease-in-out' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold" style={{ color: ringColor }}>{score}</span>
        <span className="text-xs text-gray-500 font-medium">מתוך 100</span>
      </div>
    </div>
  );
}
