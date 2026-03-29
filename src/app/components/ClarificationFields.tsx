import React, { useState } from "react";
import { IconAlertCircle, IconCheck } from "@tabler/icons-react";
import type { ClarificationTask } from "../App";

interface ClarificationFieldsProps {
  tasks: ClarificationTask[];
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
            className={`flex-1 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
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
      <div className="flex flex-col gap-1.5">
        {task.options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`w-full text-left px-3 py-2 rounded-lg border text-xs transition-colors cursor-pointer ${
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
      rows={2}
      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-gray-200 transition"
      placeholder="Type your answer..."
    />
  );
}

export function ClarificationFields({
  tasks,
  onSubmit,
}: ClarificationFieldsProps) {
  const [answers, setAnswers] = useState<Record<string, string>>(() =>
    Object.fromEntries(tasks.map((t) => [t.id, t.answer ?? ""])),
  );
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = tasks.every((t) => (answers[t.id] ?? "").trim() !== "");

  const handleSubmit = () => {
    if (!allAnswered) return;
    onSubmit(answers);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-xl">
        <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
          <IconCheck size={13} strokeWidth={2.5} className="text-white" />
        </div>
        <span className="text-sm text-green-700 font-medium">
          Answers submitted — review will continue shortly.
        </span>
      </div>
    );
  }

  return (
    <div className="border border-amber-200 bg-amber-50 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-amber-200">
        <IconAlertCircle size={16} className="text-amber-500 flex-shrink-0" />
        <span className="text-sm font-semibold text-amber-800">
          Action required
        </span>
        <span className="text-xs text-amber-600 ml-auto">
          {tasks.filter((t) => (answers[t.id] ?? "").trim()).length}/{tasks.length} answered
        </span>
      </div>

      {/* Fields */}
      <div className="px-4 py-4 space-y-5 bg-white">
        {tasks.map((task, i) => (
          <div key={task.id}>
            <div className="flex items-start gap-2 mb-2">
              <span className="flex-shrink-0 w-4 h-4 rounded-full bg-amber-100 text-amber-600 text-[10px] font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <label className="text-xs font-medium text-gray-800 leading-snug">
                {task.question}
              </label>
            </div>
            <div className="ml-6">
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
      <div className="flex justify-end px-4 py-3 border-t border-amber-200 bg-amber-50">
        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            allAnswered
              ? "bg-gray-900 text-white hover:bg-gray-700 cursor-pointer"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Submit answers
        </button>
      </div>
    </div>
  );
}

export default ClarificationFields;
