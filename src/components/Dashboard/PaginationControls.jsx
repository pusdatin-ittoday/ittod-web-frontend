import React from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Navigasi halaman daftar"
      className="flex items-center justify-center gap-4 pb-2 pt-1"
    >
      <button
        type="button"
        aria-label="Halaman sebelumnya"
        disabled={currentPage === 0}
        onClick={() => onPageChange(currentPage - 1)}
        className="grid size-11 place-items-center rounded-full border-[3px] border-black bg-white text-2xl text-black shadow-[4px_4px_0_#191b1a] transition-all hover:-translate-y-0.5 hover:bg-[#e8fbef] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0"
      >
        <MdChevronLeft aria-hidden="true" />
      </button>

      <div className="flex min-h-11 items-center gap-2 rounded-full border-[3px] border-black bg-[#263f50] px-5 shadow-[4px_4px_0_#191b1a]">
        {Array.from({ length: totalPages }, (_, pageIndex) => (
          <button
            key={pageIndex}
            type="button"
            aria-label={`Buka halaman ${pageIndex + 1}`}
            aria-current={pageIndex === currentPage ? "page" : undefined}
            onClick={() => onPageChange(pageIndex)}
            className={`size-3 rounded-full border border-black transition-transform hover:scale-125 ${
              pageIndex === currentPage ? "bg-[#ffd400]" : "bg-[#9aaab4]"
            }`}
          />
        ))}
      </div>

      <button
        type="button"
        aria-label="Halaman berikutnya"
        disabled={currentPage === totalPages - 1}
        onClick={() => onPageChange(currentPage + 1)}
        className="grid size-11 place-items-center rounded-full border-[3px] border-black bg-white text-2xl text-black shadow-[4px_4px_0_#191b1a] transition-all hover:-translate-y-0.5 hover:bg-[#e8fbef] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0"
      >
        <MdChevronRight aria-hidden="true" />
      </button>
    </nav>
  );
};

export default PaginationControls;
