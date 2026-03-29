import React, { useState, useRef, useCallback } from "react";
import {
  IconUpload,
  IconX,
  IconFileTypeDocx,
  IconCircleCheck,
} from "@tabler/icons-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface UploadContractModalProps {
  open: boolean;
  onClose: () => void;
  onUpload: (file: File, description: string) => void;
  onView?: () => void;
}

type ModalState = "upload" | "success";

export function UploadContractModal({
  open,
  onClose,
  onUpload,
  onView,
}: UploadContractModalProps) {
  const [modalState, setModalState] = useState<ModalState>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setFile(null);
    setDescription("");
    setIsDraggingOver(false);
    setModalState("upload");
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      reset();
      onClose();
    }
  };

  const handleFile = (f: File) => setFile(f);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDraggingOver(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
    e.target.value = "";
  };

  const handleUpload = () => {
    if (!file) return;
    onUpload(file, description);
    setModalState("success");
  };

  const handleView = () => {
    reset();
    onClose();
    onView?.();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl p-0 gap-0 overflow-hidden rounded-2xl">
        <div className="px-6 pt-6 pb-5">
          {/* ── Upload state ── */}
          {modalState === "upload" && (
            <>
              <DialogHeader className="mb-5">
                <DialogTitle className="text-lg font-semibold">
                  {file ? "Review a Contract" : "Upload a Contract"}
                </DialogTitle>
              </DialogHeader>

              {/* Drop zone */}
              {!file && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl py-10 px-6 cursor-pointer transition-colors mb-5 ${
                    isDraggingOver
                      ? "border-gray-400 bg-gray-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <IconUpload
                    size={24}
                    className="text-gray-400"
                    strokeWidth={1.5}
                  />
                  <p className="text-sm text-gray-500">
                    <span className="underline font-medium text-gray-700 cursor-pointer">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleInputChange}
                  />
                </div>
              )}

              {/* File preview */}
              {file && (
                <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 mb-5">
                  <div className="w-9 h-9 rounded-lg bg-gray-900 flex items-center justify-center flex-shrink-0">
                    <IconFileTypeDocx size={18} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </div>
                    <div className="text-xs text-gray-400 uppercase tracking-wide mt-0.5">
                      {file.name.split(".").pop()}
                    </div>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer"
                  >
                    <IconX
                      size={11}
                      strokeWidth={2.5}
                      className="text-gray-600"
                    />
                  </button>
                </div>
              )}

              {/* Description */}
              <div className="mb-5">
                <label className="block text-sm text-gray-600 mb-1.5">
                  Description for General Legal attorneys (optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-gray-200 transition"
                />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!file}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    file
                      ? "bg-gray-900 text-white hover:bg-gray-700 cursor-pointer"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Upload
                </button>
              </div>
            </>
          )}

          {/* ── Success state ── */}
          {modalState === "success" && (
            <>
              <div className="flex flex-col items-center text-center pt-2 pb-4">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-4">
                  <IconCircleCheck
                    size={28}
                    className="text-green-600"
                    strokeWidth={1.75}
                  />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  Your request has been received
                </h2>
              </div>

              <div className="bg-gray-50 rounded-xl px-5 py-4 mb-6">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  What happens next
                </p>
                <ul className="space-y-2.5">
                  {[
                    "Your legal team is notified in Slack",
                    'Your request has been added to the "In review by General Legal" queue',
                    "Our AI reviews your contract instantly",
                    "An attorney will review and respond shortly",
                  ].map((step) => (
                    <li key={step} className="flex items-start gap-2.5">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={handleView}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-900 text-white hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  View details
                </button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UploadContractModal;
