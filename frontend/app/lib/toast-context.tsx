"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  ReactNode,
} from "react";

type ToastType = "success" | "error" | "info";

type Toast = {
  id: number;
  message: string;
  type: ToastType;
};

type ToastContextValue = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Date.now();

    setToasts((prev) => [...prev, { id, message, type }]);

    // auto-hide after 3s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast container */}
      <div className="pointer-events-none fixed top-4 right-4 z-9999 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`
                  pointer-events-auto flex items-center gap-3 rounded-full px-6 py-4 text-base shadow-xl border
                  animate-[toast-in_0.25s_ease-out]
                  ${t.type === "success" && "bg-emerald-600 border-emerald-400 text-white"}
                  ${t.type === "error" && "bg-red-600 border-red-400 text-white"}
                  ${t.type === "info" && "bg-amber-700 border-amber-400 text-white"}`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside <ToastProvider>");
  }
  return ctx;
};
