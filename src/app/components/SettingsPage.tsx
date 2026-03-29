import React, { useState, useCallback, useEffect, useRef } from "react";
import type { SharedContract, ClarificationTask } from "../App";
import { ClarificationModal } from "./ClarificationModal";
import {
  IconUpload,
  IconPlus,
  IconMessageCircle,
  IconBuilding,
  IconLoader2,
  IconAlertCircle,
  IconChevronDown,
  IconChevronRight,
  IconFileTypeDocx,
  IconUser,
  IconFileText,
  IconDownload,
  IconClock,
  IconCheck,
} from "@tabler/icons-react";
import { UploadContractModal } from "./UploadContractModal";
import { ClarificationFields } from "./ClarificationFields";

// ─── Types ────────────────────────────────────────────────────────────────────

type ColumnId = "review" | "ready" | "negotiation" | "approved" | "signed";

const SECTIONS: { id: ColumnId; label: string }[] = [
  { id: "review", label: "In Review by General Legal" },
  { id: "ready", label: "Ready for Review" },
  { id: "negotiation", label: "In Negotiation" },
  { id: "approved", label: "Approved" },
  { id: "signed", label: "Signed" },
];

// ─── Mock version / step data (same as ContractsContent) ─────────────────────

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

function ProgressStepper() {
  const total = mockSteps.length;
  return (
    <div className="flex items-center justify-center w-full">
      {mockSteps.map((step, i) => {
        const isLast = i === total - 1;
        const stepEl = (() => {
          if (step.status === "complete")
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
          if (step.status === "active")
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

// ─── Request Edits Modal ──────────────────────────────────────────────────────

function RequestEditsModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [description, setDescription] = useState("");
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-5">
          Request more edits
        </h2>
        <div className="mb-5">
          <label className="block text-sm text-gray-600 mb-1.5">
            Describe the edits you'd like made
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            autoFocus
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-gray-200 transition"
            placeholder="e.g. Please revise the liability cap in Section 4 to $100K..."
          />
          <div className="mt-3">
            <p className="text-xs text-gray-400 mb-1.5">Examples:</p>
            <ul className="space-y-1">
              {[
                "New comments from counterparty",
                "Clauses you want to adjust",
                "Questions about their changes",
              ].map((ex) => (
                <li
                  key={ex}
                  className="flex items-center gap-2 text-xs text-gray-400"
                >
                  <span className="w-1 h-1 rounded-full bg-gray-300 flex-shrink-0" />
                  {ex}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            disabled={!description.trim()}
            onClick={onClose}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${description.trim() ? "bg-gray-900 text-white hover:bg-gray-700 cursor-pointer" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
          >
            Submit request
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Expanded Row Panel ───────────────────────────────────────────────────────

function ExpandedPanel({
  contract,
  onUpload,
  onAskQuestion,
}: {
  contract: SharedContract;
  onUpload?: (id: string) => void;
  onAskQuestion?: (id: string) => void;
}) {
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const versions = contract.versions ?? mockVersions;

  return (
    <div className="bg-white border-t border-gray-200 px-6 py-6">
      <RequestEditsModal
        open={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
      />

      {contract.clarificationTasks &&
        contract.clarificationTasks.length > 0 && (
          <div className="mb-6">
            <ClarificationFields
              tasks={contract.clarificationTasks}
              onSubmit={() => {}}
            />
          </div>
        )}

      <div>
        <div className="grid grid-cols-3 gap-3 mb-4">
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

        <div className="space-y-3">
          {versions.map((v) => (
            <div
              key={v.version}
              className="bg-white border border-gray-200 rounded-xl p-4"
            >
              {v.isLatest && (
                <div className="mb-4 pb-4 border-b border-gray-100 overflow-x-auto">
                  <ProgressStepper />
                </div>
              )}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 flex-wrap">
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
  );
}

// ─── List Row ─────────────────────────────────────────────────────────────────

function ContractRow({
  contract,
  onUpload,
  onAskQuestion,
}: {
  contract: SharedContract & { isNew?: boolean; isExiting?: boolean };
  onUpload?: (id: string) => void;
  onAskQuestion?: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`border rounded-xl overflow-hidden transition-all duration-300 ${expanded ? "shadow-sm" : ""} ${
        contract.isNew
          ? "animate-in fade-in slide-in-from-top-2 duration-500 border-gray-200"
          : contract.isExiting
            ? "opacity-0 scale-95 pointer-events-none border-gray-200"
            : contract.needsClarification
              ? "border-amber-300"
              : "border-gray-200"
      }`}
    >
      {/* Row header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-4 px-4 py-3.5 bg-white hover:bg-gray-50 transition-colors cursor-pointer text-left"
      >
        <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
          <IconFileTypeDocx size={16} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate">
            {contract.name}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-gray-400">{contract.version}</span>
            <span className="text-xs text-gray-300">·</span>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <IconBuilding size={11} />
              {contract.company}
            </div>
            {contract.isLoading && !contract.needsClarification && (
              <div className="flex items-center gap-1 text-xs text-blue-500">
                <IconLoader2 size={11} className="animate-spin" />
                <span>{contract.loadingText}</span>
              </div>
            )}
            {contract.needsClarification && (
              <div className="flex items-center gap-1 text-xs text-amber-600">
                <IconAlertCircle size={11} />
                <span>Action required</span>
              </div>
            )}
          </div>
        </div>
        <span className="inline-block bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-md flex-shrink-0">
          {contract.type}
        </span>
        <div className="text-gray-400 flex-shrink-0">
          {expanded ? (
            <IconChevronDown size={16} />
          ) : (
            <IconChevronRight size={16} />
          )}
        </div>
      </button>

      {/* Expanded panel */}
      {expanded && (
        <ExpandedPanel
          contract={contract}
          onUpload={onUpload}
          onAskQuestion={onAskQuestion}
        />
      )}
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

function Section({
  section,
  contracts,
  onUpload,
  onAskQuestion,
}: {
  section: { id: ColumnId; label: string };
  contracts: SharedContract[];
  onUpload?: (id: string) => void;
  onAskQuestion?: (id: string) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div>
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="flex items-center gap-2 mb-3 cursor-pointer group w-full text-left"
      >
        <span className="text-sm font-semibold text-gray-900">
          {section.label}
        </span>
        {contracts.length > 0 && (
          <span className="bg-gray-100 text-gray-500 text-xs font-medium px-1.5 py-0.5 rounded-full">
            {contracts.length}
          </span>
        )}
        <div className="text-gray-400 ml-1">
          {collapsed ? (
            <IconChevronRight size={14} />
          ) : (
            <IconChevronDown size={14} />
          )}
        </div>
      </button>

      {!collapsed && (
        <div className="space-y-2">
          {contracts.length === 0 ? (
            <div className="px-4 py-3 text-xs text-gray-400 border border-dashed border-gray-200 rounded-xl text-center">
              No contracts
            </div>
          ) : (
            contracts.map((c) => (
              <ContractRow
                key={c.id}
                contract={c}
                onUpload={onUpload}
                onAskQuestion={onAskQuestion}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── Quick Action ─────────────────────────────────────────────────────────────

interface QuickActionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconBg?: string;
  onClick?: () => void;
  className?: string;
}

function QuickAction({
  icon,
  title,
  description,
  iconBg,
  onClick,
  className,
}: QuickActionProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col lg:flex-row items-center lg:items-center justify-center lg:justify-start gap-2 lg:gap-4 p-3 lg:p-5 bg-white border border-gray-200 rounded-2xl hover:bg-[#EEE8E2] transition-colors text-center lg:text-left flex-1 min-w-0 cursor-pointer ${className ?? ""}`}
    >
      <div
        className={`flex w-10 h-10 rounded-xl items-center justify-center flex-shrink-0 ${iconBg ?? "bg-gray-100"}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <div className="font-semibold text-gray-900 text-sm lg:text-base">
          {title}
        </div>
        <div className="hidden lg:block text-sm text-gray-500">
          {description}
        </div>
      </div>
    </button>
  );
}

// ─── Local contract type with animation flags ─────────────────────────────────

interface LocalContract extends SharedContract {
  isNew?: boolean;
  isExiting?: boolean;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface AttorneyHomePageProps {
  contracts: SharedContract[];
  onNewChat?: () => void;
  onUpload?: (file: File) => void;
  onOpenUpload?: (contractId?: string) => void;
  onView?: (contractId: string) => void;
  onAskQuestion?: (contractId: string) => void;
  onKanbanStatusChange?: (
    id: string,
    status: SharedContract["kanbanStatus"],
  ) => void;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function SettingsPage({
  contracts: sharedContracts,
  onNewChat,
  onUpload,
  onOpenUpload,
  onAskQuestion,
}: AttorneyHomePageProps) {
  const [localContracts, setLocalContracts] = useState<LocalContract[]>(() =>
    sharedContracts.map((c) => ({ ...c })),
  );
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [clarificationContractId, setClarificationContractId] = useState<
    string | null
  >(null);

  // Sync new contracts added from parent (e.g. upload)
  useEffect(() => {
    setLocalContracts((prev) => {
      const prevIds = new Set(prev.map((c) => c.id));
      const incoming = sharedContracts.filter((c) => !prevIds.has(c.id));
      if (incoming.length === 0) return prev;
      const newEntries: LocalContract[] = incoming.map((c) => ({
        ...c,
        isNew: true,
      }));
      setTimeout(() => {
        setLocalContracts((lc) =>
          lc.map((c) => (c.isNew ? { ...c, isNew: false } : c)),
        );
      }, 600);
      return [...newEntries, ...prev];
    });
  }, [sharedContracts]);

  const mockClarificationTasks: ClarificationTask[] = [
    {
      id: "c1",
      question: "Is this NDA mutual or one-sided?",
      type: "select",
      options: [
        "Mutual (both parties)",
        "One-sided (counterparty only)",
        "One-sided (us only)",
      ],
    },
    {
      id: "c2",
      question: "What is the intended term of this agreement?",
      type: "select",
      options: ["1 year", "2 years", "3 years", "Indefinite"],
    },
    {
      id: "c3",
      question: "Does this NDA cover any existing IP or trade secrets?",
      type: "yesno",
    },
    {
      id: "c4",
      question:
        "Any specific jurisdiction or governing law you'd like to apply?",
      type: "text",
    },
  ];

  const handleSimulateReview = useCallback(() => {
    const reviewCard = localContracts.find((c) => c.kanbanStatus === "review");
    if (!reviewCard) return;
    // Phase 1: fade out
    setLocalContracts((prev) =>
      prev.map((c) => (c.id === reviewCard.id ? { ...c, isExiting: true } : c)),
    );
    // Phase 2: move to ready with entrance animation
    setTimeout(() => {
      setLocalContracts((prev) =>
        prev.map((c) =>
          c.id === reviewCard.id
            ? { ...c, isExiting: false, kanbanStatus: "ready", isNew: true }
            : c,
        ),
      );
      setTimeout(() => {
        setLocalContracts((prev) =>
          prev.map((c) =>
            c.id === reviewCard.id ? { ...c, isNew: false } : c,
          ),
        );
      }, 600);
    }, 350);
  }, [localContracts]);

  const handleSimulateClarification = useCallback(() => {
    const reviewCard = localContracts.find((c) => c.kanbanStatus === "review");
    if (!reviewCard) return;
    setLocalContracts((prev) =>
      prev.map((c) =>
        c.id === reviewCard.id
          ? {
              ...c,
              needsClarification: true,
              isLoading: false,
              clarificationTasks: mockClarificationTasks,
            }
          : c,
      ),
    );
    setClarificationContractId(reviewCard.id);
  }, [localContracts]);

  const handleClarificationSubmit = useCallback((contractId: string) => {
    setLocalContracts((prev) =>
      prev.map((c) =>
        c.id === contractId
          ? {
              ...c,
              needsClarification: false,
              clarificationTasks: undefined,
              isLoading: true,
              loadingText: "AI Review • Est. ~2 min",
            }
          : c,
      ),
    );
    setClarificationContractId(null);
  }, []);

  const handleUpload = (file: File) => {
    onUpload?.(file);
  };

  const handleView = () => {};

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#F9F8F7]">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto px-6 py-6">
          <div className="flex gap-6 items-start">
            {/* Left column — contract list */}
            <div className="flex-1 min-w-0">
              <div className="space-y-2">
                {localContracts.length === 0 ? (
                  <div className="px-4 py-8 text-sm text-gray-400 border border-dashed border-gray-200 rounded-xl text-center">
                    No contracts yet. Upload one to get started.
                  </div>
                ) : (
                  localContracts.map((c) => (
                    <ContractRow
                      key={c.id}
                      contract={c}
                      onUpload={onOpenUpload}
                      onAskQuestion={onAskQuestion}
                    />
                  ))
                )}
              </div>

              {/* Demo triggers */}
              {localContracts.some((c) => c.kanbanStatus === "review") && (
                <div className="flex flex-col items-center gap-2 mt-8 pb-4">
                  <button
                    onClick={handleSimulateReview}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors cursor-pointer"
                  >
                    Simulate attorney review complete
                  </button>
                  <button
                    onClick={handleSimulateClarification}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-amber-200 text-sm text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                  >
                    Simulate action required
                  </button>
                </div>
              )}
            </div>

            {/* Right column — quick actions */}
            <div className="w-72 flex-shrink-0 flex flex-col gap-3">
              <QuickAction
                icon={<IconUpload size={20} className="text-blue-600" />}
                iconBg="bg-blue-50"
                title="Upload a contract"
                description="Upload your contract for review by General Legal's attorneys"
                onClick={() => setUploadModalOpen(true)}
              />
              <QuickAction
                icon={
                  <div className="w-5 h-5 rounded-full border-2 border-green-500 flex items-center justify-center">
                    <IconPlus
                      size={12}
                      className="text-green-500"
                      strokeWidth={3}
                    />
                  </div>
                }
                iconBg="bg-green-50"
                title="Draft a Contract"
                description="Generate a new NDA, MSA, and more from scratch"
              />
              <QuickAction
                icon={
                  <IconMessageCircle size={20} className="text-orange-500" />
                }
                iconBg="bg-orange-50"
                title="Chat with us"
                description="Ask legal questions about your files"
                onClick={onNewChat}
              />
            </div>
          </div>
        </div>
      </div>

      {clarificationContractId &&
        (() => {
          const contract = localContracts.find(
            (c) => c.id === clarificationContractId,
          );
          return contract ? (
            <ClarificationModal
              open={true}
              contractName={contract.name}
              tasks={mockClarificationTasks}
              onClose={() => setClarificationContractId(null)}
              onSubmit={() =>
                handleClarificationSubmit(clarificationContractId)
              }
            />
          ) : null;
        })()}

      <UploadContractModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUpload={handleUpload}
        onView={handleView}
      />
    </div>
  );
}

export default SettingsPage;
