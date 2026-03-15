import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="rounded-xl shadow bg-white p-4 flex flex-col gap-2 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-1/4" />
      </div>
      <div className="h-3 bg-gray-100 rounded w-1/3" />
      <div className="h-3 bg-gray-100 rounded w-2/5" />
    </div>
  );
};
