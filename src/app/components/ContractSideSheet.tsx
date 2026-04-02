import React, { useState, useEffect } from "react";
import type { ClarificationTask } from "../App";
import { ClarificationFields } from "./ClarificationFields";
import {
  IconX,
  IconUser,
  IconFileText,
  IconUpload,
  IconMessageCircle,
  IconDownload,
  IconClock,
  IconCheck,
  IconLoader2,
  IconChevronLeft,
} from "@tabler/icons-react";
import type { SharedContract, VersionEntry } from "../App";

// ─── Progress Stepper ────────────────────────────────────────────────────────

type StepStatus = "complete" | "active" | "pending";

interface Step {
  label: string;
  sublabel?: string;
  status: StepStatus;
}

const mockSteps: Step[] = [
  { label: "Received", status: "complete" },
  { label: "AI Review", sublabel: "~2m", status: "complete" },
  { label: "Queued for Attorney", sublabel: "~2m", status: "complete" },
  { label: "Attorney Review", sublabel: "~42m", status: "active" },
  { label: "Delivered", status: "pending" },
  { label: "Complete", status: "pending" },
];

const mockVersions: VersionEntry[] = [
  {
    version: "V3",
    isLatest: true,
    date: "Mar 23, 2026",
    author: "Sarah Chen",
    summary:
      "Latest revision addressing liability caps and indemnification clauses. Legal team reduced liability exposure from $500K to $250K and clarified IP ownership terms.",
  },
  {
    version: "V2",
    date: "Mar 10, 2026",
    author: "Michael Torres",
    summary:
      "Second draft incorporating counterparty feedback on payment terms. Extended payment window from 30 to 45 days and added milestone-based payment schedule.",
  },
  {
    version: "V1",
    date: "Feb 20, 2026",
    author: "Sarah Chen",
    summary:
      "Initial draft created from MSA template. Standard terms for professional services engagement with quarterly deliverables.",
  },
];

function ProgressStepper() {
  const total = mockSteps.length;
  return (
    <div className="flex items-center justify-center w-full">
      {mockSteps.map((step, i) => {
        const isLast = i === total - 1;

        const stepEl = (() => {
          if (step.status === "complete") {
            return (
              <div className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <IconCheck
                  size={13}
                  className="text-blue-500"
                  strokeWidth={2.5}
                />
                <span className="text-xs font-medium text-gray-700">
                  {step.label}
                </span>
                {step.sublabel && (
                  <span className="text-xs text-gray-400">{step.sublabel}</span>
                )}
              </div>
            );
          }
          if (step.status === "active") {
            return (
              <div className="inline-flex items-center gap-1.5 bg-blue-50 rounded-full px-2 py-1 whitespace-nowrap">
                <IconLoader2 size={13} className="text-blue-500 animate-spin" />
                <span className="text-xs font-semibold text-blue-600">
                  {step.label}
                </span>
                {step.sublabel && (
                  <span className="text-xs text-blue-400">{step.sublabel}</span>
                )}
              </div>
            );
          }
          return (
            <div className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-xs font-medium text-gray-400">{i + 1}</span>
              <span className="text-xs font-medium text-gray-400">
                {step.label}
              </span>
              {step.sublabel && (
                <span className="text-xs text-gray-400">{step.sublabel}</span>
              )}
            </div>
          );
        })();

        return (
          <div key={i} className="flex items-center min-w-0">
            {stepEl}
            {!isLast && (
              <div className="mx-2 h-px w-4 bg-gray-300 flex-shrink-0" />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Request Edits Modal ─────────────────────────────────────────────────────

function RequestEditsModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [description, setDescription] = useState("");

  const handleClose = () => {
    setDescription("");
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Request more edits
          </h2>
          <button
            onClick={handleClose}
            className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            <IconX size={16} className="text-gray-500" />
          </button>
        </div>
        <div className="mb-5">
          <label className="block text-sm text-gray-600 mb-1.5">
            Describe the edits you'd like made
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            autoFocus
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-gray-200 transition"
            placeholder="e.g. Please revise the liability cap in Section 4 to $100K..."
          />
          <div className="mt-3">
            <p className="text-xs text-gray-400 mb-1.5">Examples:</p>
            <ul className="space-y-1">
              {[
                "New comments from counterparty",
                "Clauses you want to adjust",
                "Questions about their changes",
              ].map((example) => (
                <li
                  key={example}
                  className="flex items-center gap-2 text-xs text-gray-400"
                >
                  <span className="w-1 h-1 rounded-full bg-gray-300 flex-shrink-0" />
                  {example}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            disabled={!description.trim()}
            onClick={handleClose}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              description.trim()
                ? "bg-gray-900 text-white hover:bg-gray-700 cursor-pointer"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Submit request
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Side Sheet ───────────────────────────────────────────────────────────────

interface ContractSideSheetProps {
  contract: SharedContract | null;
  onClose: () => void;
  onUpload?: (contractId: string) => void;
  onAskQuestion?: (contractId: string) => void;
  clarificationTasks?: ClarificationTask[];
  onClarificationSubmit?: (answers: Record<string, string>) => void;
}

// ─── Redline Document Viewer ──────────────────────────────────────────────────

const redlineContent = [
  {
    type: "heading",
    text: "NON-DISCLOSURE AGREEMENT",
  },
  {
    type: "paragraph",
    text: 'This Non-Disclosure Agreement (the "Agreement") is entered into as of March 23, 2026, between General Legal, Inc. ("Company") and Client Name ("Counterparty").',
  },
  {
    type: "section",
    title: "1. Confidential Information",
    content: [
      {
        type: "normal",
        text: 'For purposes of this Agreement, "Confidential Information" means any information disclosed by either party to the other party, either directly or indirectly, in writing, orally or by inspection of tangible objects.',
      },
    ],
  },
  {
    type: "section",
    title: "2. Liability Cap",
    content: [
      {
        type: "deleted",
        text: "The total liability of either party shall not exceed $500,000 (five hundred thousand dollars) in aggregate.",
      },
      {
        type: "inserted",
        text: "The total liability of either party shall not exceed $250,000 (two hundred fifty thousand dollars) in aggregate.",
      },
      {
        type: "normal",
        text: " This limitation applies to all claims arising under or related to this Agreement.",
      },
    ],
  },
  {
    type: "section",
    title: "3. IP Ownership",
    content: [
      {
        type: "normal",
        text: "All intellectual property developed under this Agreement shall be owned by the Company. ",
      },
      {
        type: "deleted",
        text: "Counterparty retains no rights to any derivative works.",
      },
      {
        type: "inserted",
        text: "Counterparty retains no rights to any derivative works, including but not limited to modifications, adaptations, or translations of the Confidential Information.",
      },
    ],
  },
  {
    type: "section",
    title: "4. Term",
    content: [
      {
        type: "normal",
        text: "This Agreement shall remain in effect for a period of ",
      },
      { type: "deleted", text: "two (2) years" },
      { type: "inserted", text: "three (3) years" },
      { type: "normal", text: " from the date of execution." },
    ],
  },
  {
    type: "section",
    title: "5. Governing Law",
    content: [
      {
        type: "normal",
        text: "This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of law provisions.",
      },
    ],
  },
];

interface RedlineChange {
  id: string;
  section: string;
  type: "deletion" | "insertion";
  text: string;
}

const redlineChanges: RedlineChange[] = [
  {
    id: "1",
    section: "§2 Liability Cap",
    type: "deletion",
    text: "$500,000 → $250,000",
  },
  {
    id: "2",
    section: "§3 IP Ownership",
    type: "insertion",
    text: "Extended scope of derivative works clause",
  },
  { id: "3", section: "§4 Term", type: "deletion", text: "2 years → 3 years" },
];

function VersionDocSheet({
  version,
  onClose,
}: {
  version: VersionEntry | null;
  onClose: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (version) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [version]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  if (!version) return null;

  return (
    <>
      {/* Backdrop — only closes this sheet */}
      <div
        className={`fixed inset-0 z-[65] transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleClose}
      />
      <div
        className={`fixed top-0 right-0 h-full z-[70] w-[900px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-center gap-3 px-6 py-5 border-b border-gray-200">
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer"
          >
            <IconChevronLeft size={17} className="text-gray-500" />
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold text-gray-900">
              {version.version} — Redline
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {version.date} · {version.author}
            </p>
          </div>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
            <IconDownload size={13} />
            Download
          </button>
        </div>

        {/* Summary strip */}
        <div className="flex-shrink-0 px-6 py-3 bg-gray-50 border-b border-gray-200">
          <p className="text-xs text-gray-500 italic">{version.summary}</p>
        </div>

        {/* Document body */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-10 py-8 font-serif max-w-none">
            {redlineContent.map((block, i) => {
              if (block.type === "heading") {
                return (
                  <h1
                    key={i}
                    className="text-center text-base font-bold text-gray-900 mb-6 tracking-wide uppercase"
                  >
                    {block.text}
                  </h1>
                );
              }
              if (block.type === "paragraph") {
                return (
                  <p
                    key={i}
                    className="text-sm text-gray-700 leading-relaxed mb-6"
                  >
                    {block.text}
                  </p>
                );
              }
              if (block.type === "section") {
                return (
                  <div key={i} className="mb-6">
                    <h2 className="text-sm font-bold text-gray-900 mb-2">
                      {block.title}
                    </h2>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {block.content?.map((chunk, j) => {
                        if (chunk.type === "deleted") {
                          return (
                            <span
                              key={j}
                              className="line-through text-red-500 bg-red-50"
                            >
                              {chunk.text}
                            </span>
                          );
                        }
                        if (chunk.type === "inserted") {
                          return (
                            <span
                              key={j}
                              className="text-green-700 bg-green-50 underline decoration-green-400"
                            >
                              {chunk.text}
                            </span>
                          );
                        }
                        return <span key={j}>{chunk.text}</span>;
                      })}
                    </p>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Main Side Sheet ──────────────────────────────────────────────────────────

export function ContractSideSheet({
  contract,
  onClose,
  onUpload,
  onAskQuestion,
  clarificationTasks,
  onClarificationSubmit,
}: ContractSideSheetProps) {
  const [visible, setVisible] = useState(false);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<VersionEntry | null>(
    null,
  );

  // Animate in when contract is set
  useEffect(() => {
    if (contract) {
      // Tiny delay so the initial translate is painted first
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [contract]);

  const handleClose = () => {
    setVisible(false);
    // Wait for slide-out transition before unmounting
    setTimeout(onClose, 300);
  };

  if (!contract) return null;

  const versions = contract.versions ?? mockVersions;

  return (
    <>
      <RequestEditsModal
        open={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
      />

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[55] bg-black/20 transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleClose}
      />

      {/* Sheet */}
      <div
        className={`fixed top-0 right-0 h-full z-[60] w-[900px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-start justify-between gap-4 px-6 py-5 border-b border-gray-200">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-gray-900 truncate">
              {contract.name}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-xs font-medium">
                {contract.type}
              </span>
              <span className="text-xs text-gray-400">
                {contract.version} • Updated {contract.lastUpdated}
              </span>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer"
          >
            <IconX size={17} className="text-gray-500" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-6 space-y-6">
            {/* Clarification tasks */}
            {clarificationTasks && clarificationTasks.length > 0 && (
              <ClarificationFields
                tasks={clarificationTasks}
                onSubmit={(answers) => onClarificationSubmit?.(answers)}
              />
            )}

            {/* Quick Actions */}
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Actions
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setRequestModalOpen(true)}
                  className="flex flex-col items-center gap-2 p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer text-center"
                >
                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                    <IconFileText size={15} className="text-orange-500" />
                  </div>
                  <span className="text-xs font-medium text-gray-900 leading-tight">
                    Request more edits
                  </span>
                </button>
                <button
                  onClick={() => onUpload?.(contract.id)}
                  className="flex flex-col items-center gap-2 p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer text-center"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                    <IconUpload size={15} className="text-gray-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-900 leading-tight">
                    Upload new version
                  </span>
                </button>
                <button
                  onClick={() => onAskQuestion?.(contract.id)}
                  className="flex flex-col items-center gap-2 p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer text-center"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <IconMessageCircle size={15} className="text-blue-500" />
                  </div>
                  <span className="text-xs font-medium text-gray-900 leading-tight">
                    Ask a question
                  </span>
                </button>
              </div>
            </div>

            {/* Version History */}
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Version History
              </div>
              <div className="space-y-3">
                {versions.map((v) => (
                  <div
                    key={v.version}
                    onClick={() => setSelectedVersion(v)}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-gray-300 hover:bg-white transition-colors"
                  >
                    {v.isLatest && (
                      <div className="mb-4 pb-4 border-b border-gray-200 overflow-x-auto">
                        <ProgressStepper />
                      </div>
                    )}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-gray-900 font-mono border border-gray-300 rounded px-1.5 py-0.5">
                          {v.version}
                        </span>
                        {v.isLatest && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200 text-xs font-medium">
                            Latest
                          </span>
                        )}
                        <span className="text-xs text-gray-400">
                          {v.date} • {v.author}
                        </span>
                      </div>
                      <button className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-white transition-colors flex-shrink-0 cursor-pointer bg-white">
                        <IconDownload size={12} />
                        Download
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 italic mb-1.5">
                      <IconClock size={11} />
                      Summary of changes from previous version
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {v.summary}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <VersionDocSheet
        version={selectedVersion}
        onClose={() => setSelectedVersion(null)}
      />
    </>
  );
}

export default ContractSideSheet;
