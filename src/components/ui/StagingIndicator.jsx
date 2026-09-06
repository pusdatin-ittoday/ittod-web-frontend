import React, { useState } from "react";

export const isStagingEnvironment = () => {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname.toLowerCase();
  return (
    host.includes("staging") ||
    import.meta.env.VITE_IS_STAGING === "true" ||
    (import.meta.env.VITE_API_BASE_URL && import.meta.env.VITE_API_BASE_URL.includes("staging"))
  );
};

const StagingIndicator = () => {
  const [collapsed, setCollapsed] = useState(false);

  if (!isStagingEnvironment()) {
    return null;
  }

  return (
    <>
      {/* Top Banner */}
      {!collapsed ? (
        <aside
          role="region"
          aria-label="Staging Environment Indicator"
          className="sticky top-0 z-[99999] w-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black px-3 py-1.5 border-b-2 border-black font-mono text-xs md:text-sm font-bold shadow-md flex items-center justify-between"
        >
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap mx-auto">
            <span className="bg-black text-yellow-400 px-2 py-0.5 rounded text-[10px] md:text-xs font-black uppercase tracking-wider animate-pulse">
              STAGING
            </span>
            <span className="hidden sm:inline">
              ⚠️ <strong>LINGKUNGAN PENGUJIAN (STAGING):</strong> Data pada website ini terpisah dari Production.
            </span>
            <span className="inline sm:hidden">
              ⚠️ Staging Environment (Data Terpisah)
            </span>
          </div>
          <button
            onClick={() => setCollapsed(true)}
            className="text-black hover:bg-black hover:text-white px-2 py-0.5 rounded text-xs font-bold transition ml-2 border border-black"
            title="Sembunyikan baris ini"
          >
            ✕
          </button>
        </aside>
      ) : null}

      {/* Floating Bottom-Right Staging Pill Badge */}
      <div
        className="fixed bottom-4 right-4 z-[99998] cursor-pointer select-none"
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? "Tampilkan kembali banner staging" : "Staging Environment"}
      >
        <div className="flex items-center gap-1.5 bg-amber-400 text-black font-mono font-black text-xs px-3 py-1.5 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-amber-300 transition-all">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping inline-block" />
          <span>STAGING</span>
        </div>
      </div>
    </>
  );
};

export default StagingIndicator;
