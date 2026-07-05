import React from 'react';

/**
 * Grid kategori/subtema kompetisi — fleksibel terhadap panjang array.
 * Menampilkan grid 2x2 (atau otomatis menyesuaikan) dengan icon + nama + deskripsi.
 */
const CompetitionCategoryGrid = ({ categories = [] }) => {
  if (categories.length === 0) return null;

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {categories.map((cat, index) => (
          <div
            key={index}
            className="flex items-start gap-3 bg-gray-50 border-[1.5px] border-black p-4"
          >
            {/* Icon */}
            <span className="text-xl shrink-0 text-indigo-700 mt-0.5">{cat.icon}</span>

            {/* Content */}
            <div className="flex flex-col">
              <p className="font-inter font-bold text-[11px] uppercase tracking-wider text-black">{cat.name}</p>
              <p className="font-inter text-[10px] text-gray-600 mt-1 leading-tight">{cat.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompetitionCategoryGrid;
