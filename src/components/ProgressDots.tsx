import React from 'react';

interface Props {
  total: number;
  current: number;
  color?: string;
}

export default function ProgressDots({ total, current, color = 'bg-tenant-500' }: Props) {
  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full transition-all ${
            i === current ? `${color} w-4` : i < current ? color : 'bg-gray-300'
          }`}
        />
      ))}
    </div>
  );
}
