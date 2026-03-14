import React from 'react';

interface Props {
  onClick: () => void;
}

export const FloatingAddButton: React.FC<Props> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 rounded-full bg-black text-white w-14 h-14 shadow-lg flex items-center justify-center text-2xl"
      aria-label="Tambah pengeluaran"
    >
      +
    </button>
  );
};

