import React, { useState } from "react";
import { IconX, IconAlertCircle } from "@tabler/icons-react";
import type { ClarificationTask } from "../App";

interface ClarificationModalProps {
  open: boolean;
  contractName: string;
  tasks: ClarificationTask[];
  onClose: () => void;
  onSubmit: (answers: Record<string, string>) => void;
}

function TaskField({
  task,
  value,
  onChange,
}: {
  task: ClarificationTask;
  value: string;
  onChange: (val: string) => void;
}) {
  if (task.type === "yesno") {
    return (
      <div className="flex gap-2">
        {["Yes", "No"].map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${
              value === opt
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    );
  }

  if (task.type === "select" && task.options) {
    return (
      <div className="flex flex-col gap-2">
        {task.options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`w-full text-left px-3 py-2.5 rounded-lg border text-sm transition-colors cursor-pointer ${
              value === opt
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    );
  }

  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={3}
      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-gray-200 transition"
      placeholder="Type your answer..."
    />
  );
}

export function ClarificationModal({
  open,
  contractName,
  tasks,
  onClose,
  onSubmit,
}: ClarificationModalProps) {
  const [answers, setAnswers] = useState<Record<string, string>>(() =>
    Object.fromEntries(tasks.map((t) => [t.id, t.answer ?? ""])),
  );

  if (!open) return null;

  const allAnswered = tasks.every((t) => (answers[t.id] ?? "").trim() !== "");

  const handleSubmit = () => {
    if (!allAnswered) return;
    onSubmit(answers);
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0 mt-0.5">
              <IconAlertCircle size={18} className="text-amber-500" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Action required
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                The AI needs clarification to continue reviewing{" "}
                <span className="font-medium text-gray-700 truncate">
                  {contractName}
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer mt-0.5"
          >
            <IconX size={15} className="text-gray-500" />
          </button>
        </div>

        {/* Tasks */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {tasks.map((task, i) => (
            <div key={task.id}>
              <div className="flex items-start gap-2 mb-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <label className="text-sm font-medium text-gray-800 leading-snug">
                  {task.question}
                </label>
              </div>
              <div className="ml-7">
                <TaskField
                  task={task}
                  value={answers[task.id] ?? ""}
                  onChange={(val) =>
                    setAnswers((prev) => ({ ...prev, [task.id]: val }))
                  }
                />
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            I'll do this later
          </button>
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              allAnswered
                ? "bg-gray-900 text-white hover:bg-gray-700 cursor-pointer"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Submit answers
          </button>
        </div>
      </div>
    </div>
  );
}

export default ClarificationModal;
