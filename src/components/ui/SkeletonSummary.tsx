import React from 'react';

export const SkeletonSummary: React.FC = () => {
  return (
    <div className="rounded-xl bg-white shadow p-4 flex flex-col gap-3 animate-pulse">
      <div>
        <div className="h-3 bg-gray-100 rounded w-1/4 mb-1" />
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
        <div className="h-6 bg-gray-200 rounded w-1/2" />
      </div>
      <div className="border-t border-gray-100 pt-2">
        <div className="h-3 bg-gray-100 rounded w-1/5 mb-2" />
        <div className="grid grid-cols-2 gap-y-2 gap-x-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="h-3 bg-gray-100 rounded w-1/3" />
              <div className="h-3 bg-gray-200 rounded w-1/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
