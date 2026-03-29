import {
  IconUpload,
  IconFileTypeDocx,
  IconChevronRight,
  IconFile,
  IconCalendar,
  IconArrowBackUp,
  IconProgress,
  IconDownload,
  IconChevronDown,
  IconUser,
  IconFileText,
  IconMessageCircle,
  IconClock,
  IconCheck,
  IconLoader2,
  IconX,
} from "@tabler/icons-react";
import { useState, useEffect, useRef } from "react";

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
}

interface ContractsContentProps {
  contracts: Contract[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  scrollToId?: string | null;
  onScrollComplete?: () => void;
  onUpload?: (contractId: string) => void;
  onAskQuestion?: (contractId: string) => void;
}

const filters = [
  "All",
  "Awaiting Review",
  "In Review",
  "Completed",
  "Uploaded via Chat",
];

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
              <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-300 rounded-full px-4 py-1 whitespace-nowrap">
                <IconLoader2 size={13} className="text-blue-500 animate-spin" />
                <span className="text-xs font-semibold text-blue-600">
                  {step.label}
                </span>
                {step.sublabel && (
                  <span className="text-sm text-blue-400">{step.sublabel}</span>
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
                <span className="text-sm text-gray-400">{step.sublabel}</span>
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

function ExpandedPanel({
  contract,
  onUpload,
  onAskQuestion,
}: {
  contract: Contract;
  onUpload?: (contractId: string) => void;
  onAskQuestion?: (contractId: string) => void;
}) {
  const [requestModalOpen, setRequestModalOpen] = useState(false);

  return (
    <div className="bg-[#F9F8F7] border-t border-gray-200 px-6 py-6">
      <RequestEditsModal
        open={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
      />
      <div className="flex gap-6">
        {/* Left: Contract Details */}
        <div className="w-56 flex-shrink-0">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
            Contract Details
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <IconUser
                size={15}
                className="text-gray-400 mt-0.5 flex-shrink-0"
              />
              <div>
                <div className="text-xs text-gray-400 mb-0.5">Counterparty</div>
                <div className="text-sm font-semibold text-gray-900">
                  Client Name
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <IconFileText
                size={15}
                className="text-gray-400 mt-0.5 flex-shrink-0"
              />
              <div>
                <div className="text-xs text-gray-400 mb-0.5">
                  Contract Type
                </div>
                <div className="text-sm font-semibold text-gray-900">NDA</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <IconUser
                size={15}
                className="text-gray-400 mt-0.5 flex-shrink-0"
              />
              <div>
                <div className="text-xs text-gray-400 mb-0.5">Owner</div>
                <div className="text-sm font-semibold text-gray-900">
                  Sarah Chen
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Quick Actions */}
        <div className="flex-1 min-w-0">
          <div className="grid grid-col grid-cols-3 gap-3">
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
              onClick={() => onAskQuestion?.(contract.id)}
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
          <div className="space-y-3 mt-4">
            {(contract.versions ?? mockVersions).map((v) => (
              <div
                key={v.version}
                className="bg-white border border-gray-200 rounded-xl p-4"
              >
                {v.isLatest && (
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <ProgressStepper />
                  </div>
                )}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-lg font-semibold text-gray-900 font-mono border border-gray-300 rounded-lg px-2">
                      {v.version}
                    </span>
                    {v.isLatest && (
                      <span className="inline-flex items-center px-2 py-1 rounded-lg bg-blue-50 text-blue-600 border border-blue-300 text-sm font-medium">
                        Latest
                      </span>
                    )}
                    <span className="text-xs text-gray-400">
                      {v.date} • {v.author}
                    </span>
                  </div>
                  <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-[#F5F2EF] transition-colors flex-shrink-0 cursor-pointer">
                    <IconDownload size={13} />
                    Download
                  </button>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-400 italic mt-2 mb-1">
                  <IconClock size={12} />
                  Summary of changes from previous version
                </div>
                <p className="text-base text-gray-700 leading-relaxed">
                  {v.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
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
}: ContractsContentProps) {
  const [openContractId, setOpenContractId] = useState<string | null>(null);
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
      {/* Header */}
      <div className="pt-8 pb-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-3xl font-semibold">Files</h1>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-2 px-4 py-2 border rounded-full hover:bg-gray-50 transition-colors text-sm font-medium cursor-pointer">
              <IconMessageCircle size={16} />
              Ask questions about all files
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-transparent bg-black text-white rounded-full hover:bg-gray-700 transition-colors text-sm font-medium cursor-pointer">
              <IconUpload size={16} />
              Upload file
            </button>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="pb-6 max-w-7xl mx-auto">
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

      {/* Table */}
      <div className="max-w-7xl mx-auto">
        <div className="border border-gray-200 rounded-2xl overflow-hidden">
          {/* Header row */}
          <div className="grid grid-cols-[1fr_110px_150px_140px_140px_96px] bg-white border-b border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-500 px-4 py-3">
              <IconFile size={15} />
              File Name
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 px-4 py-3">
              <IconArrowBackUp size={15} />
              Version
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 px-4 py-3">
              <IconProgress size={15} />
              Status
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

          {/* Rows */}
          {contracts.map((contract, idx) => {
            const isOpen = openContractId === contract.id;
            const isLast = idx === contracts.length - 1;

            return (
              <div
                key={contract.id + idx}
                ref={(el) => {
                  rowRefs.current[contract.id] = el;
                }}
                className={`${!isLast || isOpen ? "border-b border-gray-200" : ""}`}
              >
                {/* Main row */}
                <div
                  className="grid grid-cols-[1fr_110px_150px_140px_140px_96px] hover:bg-[#F9F8F7] transition-colors cursor-pointer"
                  onClick={() => toggleOpen(contract.id)}
                >
                  <div className="flex items-center gap-3 px-4 py-4">
                    <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                      <IconFileTypeDocx size={18} className="text-white" />
                    </div>
                    <span className="text-sm line-clamp-2 text-gray-900">
                      {contract.name}
                    </span>
                  </div>
                  <div className="flex items-center px-4 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full border border-gray-300 text-xs text-gray-600 whitespace-nowrap">
                      Version 1
                    </span>
                  </div>
                  <div className="flex items-center px-4 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 border border-green-200 text-xs text-green-700 whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                      {contract.status}
                    </span>
                  </div>
                  <div className="flex items-center px-4 py-4 text-sm text-gray-600">
                    {contract.submitted}
                  </div>
                  <div className="flex items-center px-4 py-4 text-sm text-gray-600">
                    {contract.lastUpdated}
                  </div>
                  <div className="flex items-center justify-center gap-2 px-4 py-4">
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

                {/* Expanded panel */}
                {isOpen && (
                  <ExpandedPanel
                    contract={contract}
                    onUpload={onUpload}
                    onAskQuestion={onAskQuestion}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
