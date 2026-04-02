import {
  IconUpload,
  IconPlus,
  IconFileTypeDocx,
  IconChevronRight,
  IconFile,
  IconCalendar,
  IconArrowBackUp,
  IconProgress,
  IconDownload,
  IconChevronDown,
  IconChevronUp,
  IconUser,
  IconFileText,
  IconMessageCircle,
  IconClock,
  IconCheck,
  IconLoader2,
  IconX,
  IconAlertTriangle,
  IconAlertCircle,
  IconPoint,
  IconPencil,
  IconSend,
  IconCornerDownRight,
} from "@tabler/icons-react";
import { useState, useEffect, useRef } from "react";
import { ClarificationFields } from "./ClarificationFields";
import type { ClarificationTask } from "../App";

// ─── New Contract Modal (chooser) ─────────────────────────────────────────────

function NewContractModal({
  open,
  onClose,
  onUpload,
  onDraft,
}: {
  open: boolean;
  onClose: () => void;
  onUpload: () => void;
  onDraft: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-gray-900">
            New contract
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            <IconX size={15} className="text-gray-500" />
          </button>
        </div>
        <div className="space-y-3">
          <button
            onClick={() => {
              onClose();
              onUpload();
            }}
            className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <IconUpload size={20} className="text-blue-600" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900 mb-0.5">
                Upload a contract
              </div>
              <div className="text-xs text-gray-500">
                Have our attorneys review an existing contract
              </div>
            </div>
          </button>
          <button
            onClick={() => {
              onClose();
              onDraft();
            }}
            className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
              <div className="w-5 h-5 rounded-full border-2 border-green-500 flex items-center justify-center">
                <IconPlus
                  size={12}
                  className="text-green-500"
                  strokeWidth={3}
                />
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900 mb-0.5">
                Draft a new contract
              </div>
              <div className="text-xs text-gray-500">
                Generate a new NDA, MSA, and more from scratch
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Draft Contract Modal ─────────────────────────────────────────────────────

function DraftContractModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [contractType, setContractType] = useState("");
  const [counterparty, setCounterparty] = useState("");
  const [jurisdiction, setJurisdiction] = useState("");
  const [notes, setNotes] = useState("");

  const handleClose = () => {
    setContractType("");
    setCounterparty("");
    setJurisdiction("");
    setNotes("");
    onClose();
  };

  const canSubmit = contractType.trim() && counterparty.trim();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Draft a contract
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              We'll generate a first draft based on your inputs.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            <IconX size={15} className="text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* Contract type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Contract type <span className="text-red-400">*</span>
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {["NDA", "MSA", "SOW", "Employment", "Consulting", "Lease"].map(
                (t) => (
                  <button
                    key={t}
                    onClick={() => setContractType(t)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                      contractType === t
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {t}
                  </button>
                ),
              )}
            </div>
            <input
              value={contractType}
              onChange={(e) => setContractType(e.target.value)}
              placeholder="Or type a custom contract type…"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 transition"
            />
          </div>

          {/* Counterparty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Counterparty name <span className="text-red-400">*</span>
            </label>
            <input
              value={counterparty}
              onChange={(e) => setCounterparty(e.target.value)}
              placeholder="e.g. Acme Corp"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 transition"
            />
          </div>

          {/* Jurisdiction */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Governing law / jurisdiction
            </label>
            <input
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value)}
              placeholder="e.g. Delaware, California"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 transition"
            />
          </div>

          {/* Notes for attorney */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Notes for your attorney
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Any special terms, context, or instructions for your legal team…"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-gray-200 transition"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            disabled={!canSubmit}
            onClick={handleClose}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              canSubmit
                ? "bg-gray-900 text-white hover:bg-gray-700 cursor-pointer"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Submit to attorneys
          </button>
        </div>
      </div>
    </div>
  );
}

interface VersionEntry {
  version: string;
  isLatest?: boolean;
  date: string;
  author: string;
  summary: string;
}

interface Contract {
  id: string;
  name: string;
  version: string;
  status: "In Review" | "Awaiting Review" | "Completed";
  lastUpdated: string;
  submitted: string;
  versions?: VersionEntry[];
  clarificationTasks?: ClarificationTask[];
}

interface ContractsContentProps {
  contracts: Contract[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  scrollToId?: string | null;
  onScrollComplete?: () => void;
  onUpload?: (contractId: string) => void;
  onAskQuestion?: (contractId: string) => void;
  onNewChat?: () => void;
  onSeed?: () => void;
  onClarificationSubmit?: (
    contractId: string,
    answers: Record<string, string>,
  ) => void;
}

const filters = [
  "All",
  "Action required",
  "Ready for review",
  "In progress",
  "Done",
];

type TableStatus = "action-required" | "ready" | "in-progress" | "done";

const STATUS_ORDER: TableStatus[] = [
  "action-required",
  "ready",
  "in-progress",
  "done",
];

function getTableStatus(contract: Contract): TableStatus {
  if (contract.clarificationTasks && contract.clarificationTasks.length > 0)
    return "action-required";
  if (contract.status === "Completed") return "done";
  if (contract.status === "Awaiting Review") return "ready";
  return "in-progress";
}

function TableStatusBadge({ status }: { status: TableStatus }) {
  if (status === "action-required")
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-700 whitespace-nowrap">
        <IconAlertTriangle size={12} className="flex-shrink-0" />
        Action required
      </span>
    );
  if (status === "ready")
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-700 whitespace-nowrap">
        <IconAlertCircle size={12} className="flex-shrink-0" />
        Ready for review
      </span>
    );
  if (status === "in-progress")
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-600 whitespace-nowrap">
        <IconPoint
          size={16}
          className="flex-shrink-0 -mx-1"
          fill="currentColor"
        />
        In progress
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 border border-green-200 text-xs font-semibold text-green-700 whitespace-nowrap">
      <IconCheck size={12} strokeWidth={2.5} className="flex-shrink-0" />
      Done
    </span>
  );
}

type StepStatus = "complete" | "active" | "pending";

interface Step {
  label: string;
  sublabel?: string;
  status: StepStatus;
}

function getSteps(tableStatus: TableStatus): Step[] {
  const all: { label: string; sublabel?: string }[] = [
    { label: "Received" },
    { label: "AI review", sublabel: "~2m" },
    { label: "Queued", sublabel: "~2m" },
    { label: "With Attorney", sublabel: "~42m" },
    { label: "Ready for review" },
    { label: "Done" },
  ];

  // Which step index is active for each table status
  const activeIndex: Record<TableStatus, number> = {
    "action-required": 1, // AI review (needs input)
    "in-progress": 2, // Queued by default; rotates through 1-3
    ready: 4, // Ready for review
    done: -1, // All complete
  };

  const active = activeIndex[tableStatus];

  return all.map((s, i) => ({
    ...s,
    status:
      tableStatus === "done"
        ? "complete"
        : i < active
          ? "complete"
          : i === active
            ? "active"
            : "pending",
  }));
}

interface VersionEntry {
  version: string;
  isLatest?: boolean;
  date: string;
  author: string;
  summary: string;
}

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

function ProgressStepper({ tableStatus }: { tableStatus: TableStatus }) {
  const steps = getSteps(tableStatus);
  const total = steps.length;
  return (
    <div className="flex items-center justify-center w-full">
      {steps.map((step, i) => {
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
              <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-300 rounded-full px-4 py-1 whitespace-nowrap">
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
              <div className="mx-3 h-px w-4 bg-gray-300 flex-shrink-0" />
            )}
          </div>
        );
      })}
    </div>
  );
}

function SlackSetupModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#4A154B] flex items-center justify-center flex-shrink-0">
            {/* Slack hash icon */}
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
            </svg>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            <IconX size={15} className="text-gray-500" />
          </button>
        </div>
        <h2 className="text-base font-semibold text-gray-900 mb-1.5">
          Connect Slack to ask questions
        </h2>
        <p className="text-sm text-gray-500 mb-5 leading-relaxed">
          General Legal uses Slack to communicate with clients. Connect your
          workspace to message your legal team directly from here.
        </p>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-5 space-y-2.5">
          {[
            "Message your attorney in real time",
            "Get notified when your contract is updated",
            "Share files and context directly in Slack",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2.5">
              <IconCheck
                size={14}
                strokeWidth={2.5}
                className="text-green-500 flex-shrink-0"
              />
              <span className="text-sm text-gray-700">{item}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <a
            href="mailto:hello@generallegal.com?subject=Set up Slack integration"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors cursor-pointer"
          >
            Contact us to get set up
          </a>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}

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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-xl mx-4 p-6">
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
          <div className="mt-1">
            <p className="text-sm text-gray-700 mb-1.5">Examples:</p>
            <ul className="space-y-1">
              {[
                "New comments from counterparty",
                "Clauses you want to adjust",
                "Questions about their changes",
              ].map((example) => (
                <li
                  key={example}
                  className="flex items-center gap-2 text-sm text-gray-700"
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

function VersionCard({
  v,
  tableStatus,
  onOpenSlack,
}: {
  v: VersionEntry;
  tableStatus: TableStatus;
  onOpenSlack: () => void;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      {v.isLatest && (
        <div className="mb-4 pb-4 border-b border-gray-100">
          <ProgressStepper tableStatus={tableStatus} />
        </div>
      )}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-base font-semibold text-gray-900 font-mono border border-gray-300 rounded-lg px-2.5 pt-1 pb-0.5">
            {v.version}
          </span>
          {v.isLatest && (
            <span className="inline-flex items-center px-2 py-1 rounded-lg bg-blue-50 text-blue-600 border border-blue-300 text-sm font-medium">
              Latest
            </span>
          )}
          <span className="text-sm text-gray-400">
            Uploaded by {v.author} on {v.date}
          </span>
        </div>
        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-white bg-black transition-colors flex-shrink-0 cursor-pointer">
          <IconDownload size={13} />
          Download
        </button>
      </div>
      <div className="flex items-center gap-1.5 text-sm text-gray-400 italic mt-3 mb-2">
        <IconClock size={12} />
        Summary of changes
      </div>
      <p className="text-base text-gray-700 leading-relaxed">{v.summary}</p>

      {v.isLatest && <VersionActivity onAskQuestion={onOpenSlack} />}
    </div>
  );
}

// ─── Attorney Cover Message ───────────────────────────────────────────────────

const coverMessage = {
  author: "Sarah Chen",
  time: "Today, 1:42 PM",
  markdown: `Please find attached v3 of the Master Services Agreement with our markups.

**Key changes in this version:**
- **§8.2 — Termination:** We reduced the notice period from 90 to 30 days and introduced a mutual termination right. The original clause gave only the counterparty the right to terminate for convenience, which is uncommercial for a deal of this size.
- **§11 — Liability cap:** We narrowed the cap from $500K to $250K, which is more in line with the fees payable under the agreement. If the counterparty pushes back, an alternative framing tied to 12 months of fees would also be acceptable.
- **§14 — Governing law:** We updated the governing law to Delaware to align with your corporate domicile.

**Counterparty's requests on v2:**
- **§8.2 — Termination:** They accepted the 30-day notice period but rejected the mutual termination right. They are insisting termination for convenience remain unilateral in their favour only.
- **§11 — Liability cap:** They rejected the $250K cap and have reinstated their original $500K figure, citing exposure related to data handling obligations under the agreement.
- **§6 — Payment terms:** They have requested extending the payment window from 30 to 45 days, referencing their standard AP cycle.

**Our response:**
- **§8.2 — Termination:** We are not recommending you accept unilateral termination in their favour. We have retained the mutual right in v3. If they push back again, a compromise would be to require cause for termination by either party rather than termination for convenience entirely.
- **§11 — Liability cap:** The data handling argument has some merit. We recommend holding at $250K but offering a carve-out for data breach liability at a higher cap of $500K. This is a common market position.
- **§6 — Payment terms:** 45 days is within normal range. We have accepted this change in v3 as it is unlikely to be a hill worth contesting.

All other provisions have been left unchanged. Please review and let us know if you have any questions.`,
};

function renderMarkdown(text: string) {
  return text.split("\n").map((line, i) => {
    if (line === "") return <br key={i} />;
    // Bold: **text**
    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
      if (part.startsWith("**") && part.endsWith("**"))
        return <strong key={j}>{part.slice(2, -2)}</strong>;
      return part;
    });
    // Bullet
    if (line.startsWith("- "))
      return (
        <div key={i} className="flex gap-2 ml-2">
          <span className="text-gray-400 flex-shrink-0 mt-0.5">•</span>
          <span>{parts.slice(1)}</span>
        </div>
      );
    return (
      <p key={i} className="leading-relaxed">
        {parts}
      </p>
    );
  });
}

function VersionActivity({ onAskQuestion }: { onAskQuestion: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const firstLine = coverMessage.markdown.split("\n")[0];

  return (
    <div className="border-t border-gray-100 mt-4 pt-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-3">
        <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
          SC
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row gap-2 items-center">
            <span className="text-sm font-semibold text-gray-900">
              {coverMessage.author}
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border bg-gray-100 text-gray-600 border-gray-200">
              General Legal Attorney
            </span>
          </div>
          <span className="text-xs text-gray-400">{coverMessage.time}</span>
        </div>
      </div>
      {/* Cover note body */}
      {!expanded ? (
        <div className="flex flex-col items-baseline gap-2">
          <p className="text-base text-gray-700 truncate">{firstLine}</p>
          <button
            onClick={() => setExpanded(true)}
            className="text-md text-blue-500 hover:text-blue-700 transition-colors cursor-pointer whitespace-nowrap flex-shrink-0"
          >
            Show more
            <IconChevronDown size={16} className="inline-block ml-1" />
          </button>
        </div>
      ) : (
        <>
          <div className="text-base text-gray-700 space-y-1.5">
            {renderMarkdown(coverMessage.markdown)}
          </div>
          <button
            onClick={() => setExpanded(false)}
            className="mt-3 text-base text-blue-500 hover:text-blue-700 transition-colors cursor-pointer"
          >
            Hide
            <IconChevronUp size={16} className="inline-block ml-1" />
          </button>
        </>
      )}
    </div>
  );
}

function VersionList({
  versions,
  tableStatus,
  onOpenSlack,
}: {
  versions: VersionEntry[];
  tableStatus: TableStatus;
  onOpenSlack: () => void;
}) {
  const [showOlder, setShowOlder] = useState(false);
  const latest = versions.find((v) => v.isLatest) ?? versions[0];
  const older = versions.filter((v) => !v.isLatest);

  return (
    <div className="space-y-4 mt-4">
      <VersionCard
        v={latest}
        tableStatus={tableStatus}
        onOpenSlack={onOpenSlack}
      />
      {older.length > 0 && (
        <>
          <button
            onClick={() => setShowOlder((s) => !s)}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors cursor-pointer pl-1"
          >
            {showOlder ? "Hide" : "Show"} {older.length} older{" "}
            {older.length === 1 ? "version" : "versions"}
            {showOlder ? (
              <IconChevronDown size={16} />
            ) : (
              <IconChevronRight size={16} />
            )}
          </button>
          {showOlder &&
            older.map((v) => (
              <VersionCard
                key={v.version}
                v={v}
                tableStatus={tableStatus}
                onOpenSlack={onOpenSlack}
              />
            ))}
        </>
      )}
    </div>
  );
}

function ExpandedPanel({
  contract,
  onUpload,
  onAskQuestion,
  onClarificationSubmit,
}: {
  contract: Contract;
  onUpload?: (contractId: string) => void;
  onAskQuestion?: (contractId: string) => void;
  onClarificationSubmit?: (
    contractId: string,
    answers: Record<string, string>,
  ) => void;
}) {
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [slackModalOpen, setSlackModalOpen] = useState(false);

  return (
    <div className="bg-[#F9F8F7] px-4 py-4 rounded-b-2xl">
      <RequestEditsModal
        open={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
      />
      <SlackSetupModal
        open={slackModalOpen}
        onClose={() => setSlackModalOpen(false)}
      />
      {contract.clarificationTasks &&
        contract.clarificationTasks.length > 0 && (
          <div className="mb-6">
            <ClarificationFields
              tasks={contract.clarificationTasks}
              onSubmit={(answers) =>
                onClarificationSubmit?.(contract.id, answers)
              }
            />
          </div>
        )}

      <div className="flex-1 min-w-0">
        <div className="sticky top-0 z-10 bg-[#F9F8F7] grid grid-col grid-cols-3 gap-4">
          <button
            onClick={() => setRequestModalOpen(true)}
            className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
              <IconFileText size={16} className="text-orange-500" />
            </div>
            <span className="text-sm font-medium text-gray-900">
              Request more edits
            </span>
          </button>
          <button
            onClick={() => onUpload?.(contract.id)}
            className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
              <IconUpload size={16} className="text-gray-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">
              Upload a new version
            </span>
          </button>
          <button
            onClick={() => setSlackModalOpen(true)}
            className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <IconMessageCircle size={16} className="text-blue-500" />
            </div>
            <span className="text-sm font-medium text-gray-900">
              Ask a question
            </span>
          </button>
        </div>

        {/* Version cards */}
        <VersionList
          versions={contract.versions ?? mockVersions}
          tableStatus={getTableStatus(contract)}
          onOpenSlack={() => setSlackModalOpen(true)}
        />
      </div>
    </div>
  );
}

export function ContractsContent({
  contracts,
  activeFilter,
  onFilterChange,
  scrollToId,
  onScrollComplete,
  onUpload,
  onAskQuestion,
  onNewChat,
  onSeed,
  onClarificationSubmit,
}: ContractsContentProps) {
  const [openContractId, setOpenContractId] = useState<string | null>(null);
  const [newContractModalOpen, setNewContractModalOpen] = useState(false);
  const [draftModalOpen, setDraftModalOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const toggleOpen = (id: string) => {
    setOpenContractId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    if (!scrollToId) return;
    // Expand the row
    setOpenContractId(scrollToId);
    // Wait a tick for the DOM to update, then scroll
    const timer = setTimeout(() => {
      const row = rowRefs.current[scrollToId];
      const container = scrollContainerRef.current;
      if (row && container) {
        const rowTop = row.offsetTop;
        container.scrollTo({ top: rowTop - 120, behavior: "smooth" });
      }
      onScrollComplete?.();
    }, 50);
    return () => clearTimeout(timer);
  }, [scrollToId]);

  return (
    <div ref={scrollContainerRef} className="h-full overflow-y-scroll pb-8">
      <NewContractModal
        open={newContractModalOpen}
        onClose={() => setNewContractModalOpen(false)}
        onUpload={() => onUpload?.("")}
        onDraft={() => setDraftModalOpen(true)}
      />
      <DraftContractModal
        open={draftModalOpen}
        onClose={() => setDraftModalOpen(false)}
      />

      {/* Hero header */}
      <div className="px-6 pt-10 pb-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between">
            <h1 className="text-3xl font-semibold text-gray-900">Files</h1>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6">
        <div className="max-w-5xl mx-auto pb-6">
          <div className="bg-[#F3EFEB] p-4 rounded-2xl">
            <div className="flex gap-4">
              <button
                onClick={() => setNewContractModalOpen(true)}
                className="flex flex-col lg:flex-row items-center lg:items-center justify-center lg:justify-start gap-2 lg:gap-4 p-3 lg:p-5 bg-white border border-gray-200 rounded-2xl hover:bg-[#EEE8E2] transition-colors text-center lg:text-left flex-1 min-w-0 cursor-pointer"
              >
                <div className="flex w-10 h-10 rounded-xl items-center justify-center flex-shrink-0 bg-blue-50">
                  <IconPlus size={20} className="text-blue-600" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-gray-900 text-sm lg:text-base">
                    New Contract
                  </div>
                  <div className="hidden lg:block text-sm text-gray-500">
                    Upload or draft a contract with General Legal
                  </div>
                </div>
              </button>
              <button
                onClick={onNewChat}
                className="flex flex-col lg:flex-row items-center lg:items-center justify-center lg:justify-start gap-2 lg:gap-4 p-3 lg:p-5 bg-white border border-gray-200 rounded-2xl hover:bg-[#EEE8E2] transition-colors text-center lg:text-left flex-1 min-w-0 cursor-pointer"
              >
                <div className="flex w-10 h-10 rounded-xl items-center justify-center flex-shrink-0 bg-orange-50">
                  <IconMessageCircle size={20} className="text-orange-500" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-gray-900 text-sm lg:text-base">
                    Chat with us
                  </div>
                  <div className="hidden lg:block text-sm text-gray-500">
                    Ask legal questions about your files
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {contracts.length === 0 && (
        <div className="flex flex-col items-center px-8 mt-12">
          <div className="flex flex-col items-center text-center mb-10">
            <IconFile
              size={40}
              strokeWidth={1.25}
              className="text-gray-900 mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Your files will appear here
            </h2>
            <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
              Upload a contract to get started. General Legal's attorneys will
              review it and keep you updated every step of the way.
            </p>
            <button
              onClick={() => setNewContractModalOpen(true)}
              className="mt-6 px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-700 transition-colors cursor-pointer"
            >
              Add your first contract
            </button>
          </div>

          {onSeed && (
            <button
              onClick={onSeed}
              className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors cursor-pointer"
            >
              Seed with dummy contracts
            </button>
          )}
        </div>
      )}

      {/* Table */}
      {contracts.length > 0 && (
        <>
          {/* Filter tabs */}
          <div className="px-6">
            <div className="pb-6 max-w-5xl mx-auto">
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => onFilterChange(filter)}
                    className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors border border-gray-200 cursor-pointer ${
                      activeFilter === filter
                        ? "bg-black text-white border-black"
                        : "text-gray-900 hover:bg-[#F5F2EF]"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="px-6">
            {/* Header */}
            <div className="max-w-5xl mx-auto border border-gray-200 rounded-t-2xl overflow-hidden">
              <div className="grid grid-cols-[160px_1fr_110px_140px_140px_96px] bg-white">
                <div className="flex items-center gap-2 text-sm text-gray-500 px-4 py-3">
                  <IconProgress size={15} />
                  Status
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 px-4 py-3">
                  <IconFile size={15} />
                  File Name
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 px-4 py-3">
                  <IconArrowBackUp size={15} />
                  Version
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 px-4 py-3">
                  <IconCalendar size={15} />
                  Submitted
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 px-4 py-3">
                  <IconCalendar size={15} />
                  <span className="whitespace-nowrap">Last Updated</span>
                </div>
                <div className="px-4 py-3" />
              </div>
            </div>

            {/* Rows — sorted by status order */}
            {[...contracts]
              .sort(
                (a, b) =>
                  STATUS_ORDER.indexOf(getTableStatus(a)) -
                  STATUS_ORDER.indexOf(getTableStatus(b)),
              )
              .map((contract, idx, arr) => {
                const isOpen = openContractId === contract.id;
                const isLast = idx === arr.length - 1;

                return (
                  <div
                    key={contract.id + idx}
                    ref={(el) => {
                      rowRefs.current[contract.id] = el;
                    }}
                  >
                    {/* Main row — narrow */}
                    <div
                      className={`mx-auto border-l border-r border-gray-200 ${isOpen ? " bg-white max-w-6xl border-t -mt-[1px] overflow-hidden rounded-t-2xl" : "max-w-5xl"} ${isLast && !isOpen ? "border-b rounded-b-2xl overflow-hidden" : ""}`}
                    >
                      <div
                        className={`grid grid-cols-[160px_1fr_110px_140px_140px_96px] transition-colors cursor-pointer ${!isLast || isOpen ? "border-b border-gray-200" : ""} ${isLast && !isOpen ? "rounded-b-2xl overflow-hidden" : ""} ${
                          getTableStatus(contract) === "action-required"
                            ? "bg-amber-50/60 hover:bg-amber-50"
                            : getTableStatus(contract) === "ready"
                              ? "bg-blue-50/40 hover:bg-blue-50"
                              : "hover:bg-[#F9F8F7]"
                        }`}
                        onClick={() => toggleOpen(contract.id)}
                      >
                        <div className="flex items-center px-4 py-2">
                          <TableStatusBadge status={getTableStatus(contract)} />
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2">
                          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                            <IconFileTypeDocx
                              size={18}
                              className="text-white"
                            />
                          </div>
                          <span className="text-sm line-clamp-2 text-gray-900">
                            {contract.name}
                          </span>
                        </div>
                        <div className="flex items-center px-4 py-2">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full border border-gray-300 text-xs text-gray-600 whitespace-nowrap font-mono font-bold bg-white">
                            {contract.version}
                          </span>
                        </div>
                        <div className="flex items-center px-4 py-2 text-sm text-gray-600">
                          {contract.submitted}
                        </div>
                        <div className="flex items-center px-4 py-2 text-sm text-gray-600">
                          {contract.lastUpdated}
                        </div>
                        <div className="flex items-center justify-center gap-2 px-4 py-3">
                          <button
                            className="p-1 rounded hover:bg-[#F5F2EF] transition-colors cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            title="Download"
                          >
                            <IconDownload size={17} className="text-gray-400" />
                          </button>
                          <div className="text-gray-400">
                            {isOpen ? (
                              <IconChevronDown size={18} />
                            ) : (
                              <IconChevronRight size={18} />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded panel — wider */}
                    {isOpen && (
                      <div
                        className={`max-w-6xl -mt-[1px] mx-auto rounded-b-3xl overflow-hidden border border-gray-200 ${isLast ? "rounded-b-2xl" : ""}`}
                      >
                        <ExpandedPanel
                          contract={contract}
                          onUpload={onUpload}
                          onAskQuestion={onAskQuestion}
                          onClarificationSubmit={onClarificationSubmit}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </>
      )}
    </div>
  );
}
