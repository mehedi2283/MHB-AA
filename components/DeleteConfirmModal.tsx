"use client";

import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";

export interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  description?: string;
  itemName?: string;
  itemCount?: number;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
  itemCount,
  confirmText,
  cancelText = "Cancel",
  isLoading = false,
}: DeleteConfirmModalProps) {
  // Handle ESC key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  const isMultiple = (itemCount ?? 1) > 1;
  const modalTitle = title || (isMultiple ? `Delete ${itemCount} Items` : "Confirm Deletion");
  const modalConfirmText =
    confirmText || (isMultiple ? `Delete (${itemCount})` : "Delete Permanently");

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="delete-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isLoading) onClose();
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
        >
          <motion.div
            key="delete-modal-card"
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{
              type: "spring",
              damping: 26,
              stiffness: 340,
              mass: 0.8,
            }}
            className="relative w-full max-w-md bg-[#0c100c] border border-rose-500/30 rounded p-6 shadow-[0_0_50px_rgba(244,63,94,0.18)] overflow-hidden text-left"
          >
            {/* Glow ambient background highlight */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-rose-500/10 blur-3xl pointer-events-none" />

            {/* Header Bar */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 shadow-inner">
                  {isMultiple ? <Trash2 size={22} /> : <AlertTriangle size={22} />}
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-widest text-rose-400 uppercase block">
                    Danger Zone / Irreversible
                  </span>
                  <h2
                    id="delete-modal-title"
                    className="text-base sm:text-lg font-bold text-white font-mono tracking-wide"
                  >
                    {modalTitle}
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="p-1.5 text-[#a4ada0] hover:text-white hover:bg-white/10 rounded transition disabled:opacity-50 cursor-pointer"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Message Content */}
            <div className="space-y-3 mb-6">
              <p className="text-xs sm:text-sm text-[#a4ada0] leading-relaxed">
                {description ||
                  (isMultiple
                    ? `Are you sure you want to delete these ${itemCount} records? This operation is permanent and cannot be reversed.`
                    : "Are you sure you want to delete this record? This operation is permanent and cannot be reversed.")}
              </p>

              {/* Details badge / pill */}
              {itemName && (
                <div className="p-2.5 rounded bg-[#131913] border border-white/10 text-xs font-mono text-[#e8eee2] truncate flex items-center gap-2">
                  <span className="text-rose-400 font-bold">Target:</span>
                  <span className="text-[#c8ff3d] truncate">{itemName}</span>
                </div>
              )}

              {isMultiple && itemCount !== undefined && (
                <div className="p-2.5 rounded bg-rose-950/20 border border-rose-500/20 text-xs font-mono text-rose-300 flex items-center justify-between">
                  <span>Selected for removal:</span>
                  <span className="font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {itemCount} items
                  </span>
                </div>
              )}

              <div className="text-[11px] font-mono text-rose-400/80 flex items-center gap-1.5 pt-1">
                <span className="inline-block w-1.5 h-1.5 rounded-none bg-rose-400 animate-pulse" />
                Associated chat history and database entries will be wiped.
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 text-xs font-mono font-bold text-[#a4ada0] hover:text-white bg-[#141b14] border border-white/10 hover:border-white/20 rounded transition disabled:opacity-50 cursor-pointer"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className="px-4 py-2 text-xs font-mono font-bold text-white bg-rose-600 hover:bg-rose-500 active:bg-rose-700 border border-rose-500 rounded transition flex items-center gap-2 shadow-[0_0_15px_rgba(244,63,94,0.35)] disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    <span>{modalConfirmText}</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
