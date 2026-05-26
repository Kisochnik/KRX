"use client";

import React from "react";
import { useAuth, CyberToastType } from "@/context/AuthContext";
import { X, ShieldAlert, CheckCircle, Info, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CyberToast() {
  const { toasts, removeToast } = useAuth();

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-4 w-full max-w-[420px] pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <CyberToastItem
            key={toast.id}
            toast={toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function CyberToastItem({ toast, onClose }: { toast: CyberToastType; onClose: () => void }) {
  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-white" />;
      case "error":
        return <ShieldAlert className="w-5 h-5 text-zinc-400" />;
      case "security":
        return <ShieldCheck className="w-5 h-5 text-white" />;
      default:
        return <Info className="w-5 h-5 text-zinc-400" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case "success":
        return "border-l-white border-white/20";
      case "error":
        return "border-l-zinc-500 border-white/10";
      case "security":
        return "border-l-white border-white/30 animate-pulse";
      default:
        return "border-l-zinc-600 border-white/15";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.9, transition: { duration: 0.2 } }}
      className={`pointer-events-auto flex gap-4 p-4 rounded-lg glass-panel ${getBorderColor()} border-l-4 shadow-2xl relative overflow-hidden`}
    >
      {/* Decorative cyber grid element in background of toast */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none -z-10" />

      {/* Decorative scanning red-dot or cyber light */}
      {toast.type === "security" && (
        <div className="absolute top-0 right-0 w-[6px] h-[6px] bg-white rounded-full m-2 animate-ping" />
      )}

      <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
      
      <div className="flex-1 flex flex-col gap-1 pr-4">
        <h4 className="font-mono text-xs font-bold tracking-widest uppercase text-white/95">
          {toast.title}
        </h4>
        <p className="text-xs font-medium text-white/60 leading-relaxed select-text font-sans">
          {toast.message}
        </p>
      </div>

      <button
        onClick={onClose}
        className="flex-shrink-0 h-fit p-1 text-white/40 hover:text-white transition-colors duration-150 rounded cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Animated time indicator bar */}
      <motion.div
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: toast.duration / 1000, ease: "linear" }}
        className="absolute bottom-0 left-0 h-[1.5px] bg-white/30"
      />
    </motion.div>
  );
}
