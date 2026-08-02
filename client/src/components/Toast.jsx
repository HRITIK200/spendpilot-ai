import React, { useEffect } from "react";
import { CheckCircle, AlertCircle, X } from "lucide-react";

const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const typeConfig = {
    success: {
      icon: <CheckCircle className="text-emerald-400" size={20} />,
      border: "border-emerald-500/20",
      bg: "bg-emerald-500/10",
    },
    error: {
      icon: <AlertCircle className="text-rose-400" size={20} />,
      border: "border-rose-500/20",
      bg: "bg-rose-500/10",
    },
  };

  const config = typeConfig[type] || typeConfig.success;

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes toast-slide-in {
          from {
            transform: translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-toast-in {
          animation: toast-slide-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />
      <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl border ${config.border} ${config.bg} backdrop-blur-md shadow-2xl animate-toast-in max-w-sm no-print`}>
        {config.icon}
        <p className="text-sm font-medium text-gray-200">{message}</p>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition ml-4">
          <X size={16} />
        </button>
      </div>
    </>
  );
};

export default Toast;
