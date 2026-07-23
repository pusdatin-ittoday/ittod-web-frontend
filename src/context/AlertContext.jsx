import React, { createContext, useContext, useState, useCallback } from "react";

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
  const [alertState, setAlertState] = useState({
    isOpen: false,
    message: "",
    isConfirm: false,
    resolvePromise: null,
  });

  const showAlert = useCallback(
    ({ message, isConfirm = false }) => {
      return new Promise((resolve) => {
        setAlertState({
          isOpen: true,
          message,
          isConfirm,
          resolvePromise: resolve,
        });
      });
    },
    []
  );

  const handleClose = (result) => {
    setAlertState((prev) => {
      if (prev.resolvePromise) {
        prev.resolvePromise(result);
      }
      return { ...prev, isOpen: false };
    });
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alertState.isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md border-[4px] border-[#1A1C1C] bg-white p-6 shadow-[8px_8px_0_#1A1C1C] animate-[wiggle_0.3s_ease-in-out]">
            {/* Header */}
            <div className="mb-4 border-b-2 border-dashed border-[#1A1C1C] pb-3">
              <h2 className="text-lg font-black uppercase tracking-tight text-[#1A1C1C]">
                ittoday.web.id says
              </h2>
            </div>

            {/* Body */}
            <div className="mb-6 whitespace-pre-wrap text-sm font-semibold text-gray-800 leading-relaxed">
              {alertState.message}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-4">
              {alertState.isConfirm && (
                <button
                  type="button"
                  onClick={() => handleClose(false)}
                  className="border-[3px] border-[#1A1C1C] bg-gray-200 px-6 py-2.5 text-xs font-black uppercase text-[#1A1C1C] shadow-[4px_4px_0_#1A1C1C] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#1A1C1C] active:translate-x-1 active:translate-y-1 active:shadow-none"
                >
                  Cancel
                </button>
              )}
              <button
                type="button"
                onClick={() => handleClose(true)}
                className="border-[3px] border-[#1A1C1C] bg-[#565bc5] px-6 py-2.5 text-xs font-black uppercase text-white shadow-[4px_4px_0_#1A1C1C] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#1A1C1C] active:translate-x-1 active:translate-y-1 active:shadow-none"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
};
