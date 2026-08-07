import React, { createContext, useContext, useState, useCallback } from "react";
import { FiCheckCircle, FiAlertTriangle, FiInfo, FiXCircle } from "react-icons/fi";

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
  const [alertState, setAlertState] = useState({
    isOpen: false,
    message: "",
    title: null,
    type: "info",
    isConfirm: false,
    confirmText: "OK",
    cancelText: "Batal",
    resolvePromise: null,
  });

  const showAlert = useCallback(
    (args) => {
      let options = {};
      if (typeof args === "string") {
        options = { message: args };
      } else if (typeof args === "object" && args !== null) {
        options = args;
      }

      const {
        message = "",
        title = null,
        type = "info",
        isConfirm = false,
        confirmText = "OK",
        cancelText = "Batal",
      } = options;

      return new Promise((resolve) => {
        setAlertState({
          isOpen: true,
          message,
          title,
          type,
          isConfirm,
          confirmText,
          cancelText,
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

  const getHeaderDetails = () => {
    const { title, type, isConfirm } = alertState;

    if (title) {
      return { text: title, icon: <FiInfo className="text-xl" />, badgeBg: "bg-indigo-100 text-indigo-900 border-indigo-900" };
    }

    if (type === "success") {
      return { text: "Berhasil!", icon: <FiCheckCircle className="text-xl text-emerald-700" />, badgeBg: "bg-emerald-100 text-emerald-900 border-emerald-900" };
    }

    if (type === "error") {
      return { text: "Terjadi Kesalahan", icon: <FiXCircle className="text-xl text-rose-700" />, badgeBg: "bg-rose-100 text-rose-900 border-rose-900" };
    }

    if (type === "warning") {
      return { text: "Perhatian", icon: <FiAlertTriangle className="text-xl text-amber-700" />, badgeBg: "bg-amber-100 text-amber-900 border-amber-900" };
    }

    if (isConfirm) {
      return { text: "Konfirmasi", icon: <FiAlertTriangle className="text-xl text-indigo-700" />, badgeBg: "bg-indigo-100 text-indigo-900 border-indigo-900" };
    }

    return { text: "Pemberitahuan IT TODAY", icon: <FiInfo className="text-xl text-indigo-700" />, badgeBg: "bg-yellow-100 text-gray-900 border-gray-900" };
  };

  const header = alertState.isOpen ? getHeaderDetails() : null;

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alertState.isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md border-[4px] border-[#1A1C1C] bg-white p-6 shadow-[8px_8px_0_#1A1C1C] animate-[wiggle_0.3s_ease-in-out]">
            {/* Header */}
            <div className="mb-4 flex items-center gap-2 border-b-2 border-dashed border-[#1A1C1C] pb-3">
              {header.icon}
              <h2 className="text-lg font-black uppercase tracking-tight text-[#1A1C1C]">
                {header.text}
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
                  {alertState.cancelText || "Batal"}
                </button>
              )}
              <button
                type="button"
                onClick={() => handleClose(true)}
                className="border-[3px] border-[#1A1C1C] bg-[#565bc5] px-6 py-2.5 text-xs font-black uppercase text-white shadow-[4px_4px_0_#1A1C1C] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#1A1C1C] active:translate-x-1 active:translate-y-1 active:shadow-none"
              >
                {alertState.confirmText || "OK"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
};
