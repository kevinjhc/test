import React, { useState, useCallback, useEffect } from "react";
import type { SharedContract, ClarificationTask } from "../App";
import { ClarificationModal } from "./ClarificationModal";
import { RequestSideSheet } from "./RequestDetailPage";
import {
  IconUpload,
  IconPlus,
  IconMessageCircle,
  IconLoader2,
  IconAlertCircle,
  IconChevronDown,
  IconChevronRight,
  IconFileTypeDocx,
  IconX,
  IconCheck,
} from "@tabler/icons-react";
import { UploadContractModal } from "./UploadContractModal";

// ─── Quick Action ─────────────────────────────────────────────────────────────

function QuickAction({
  icon,
  iconBg,
  title,
  description,
  onClick,
  className,
}: {
  icon: React.ReactNode;
  iconBg?: string;
  title: string;
  description: string;
  onClick?: () => void;
  className?: string;
}) {
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

// ─── Status types ─────────────────────────────────────────────────────────────

type RequestStatus = "in-progress" | "waiting" | "done";

const STATUS_SECTIONS: { id: RequestStatus; label: string }[] = [
  { id: "waiting", label: "Waiting on you" },
  { id: "in-progress", label: "In progress" },
  { id: "done", label: "Done" },
];

// ─── Local contract type ──────────────────────────────────────────────────────

interface LocalContract extends SharedContract {
  isNew?: boolean;
  isExiting?: boolean;
  requestStatus: RequestStatus;
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: RequestStatus }) {
  if (status === "waiting")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[11px] font-semibold text-amber-700">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
        Waiting on you
      </span>
    );
  if (status === "in-progress")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[11px] font-semibold text-blue-700">
        <IconLoader2 size={10} className="animate-spin" />
        In progress
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 border border-green-200 text-[11px] font-semibold text-green-700">
      <IconCheck size={10} strokeWidth={2.5} />
      Done
    </span>
  );
}

// ─── Request Card ─────────────────────────────────────────────────────────────

function RequestCard({
  contract,
  onClick,
}: {
  contract: LocalContract;
  onClick: () => void;
}) {
  const status = contract.requestStatus;

  const primaryAction = () => {
    if (status === "waiting")
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-medium hover:bg-gray-700 transition-colors cursor-pointer"
        >
          Review document
        </button>
      );
    if (status === "in-progress") return null;
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
      >
        Open request
      </button>
    );
  };

  const lastUpdateText = contract.needsClarification
    ? "Action required"
    : contract.isLoading
      ? "AI review in progress"
      : `Attorney left comments · ${contract.lastUpdated}`;

  return (
    <div
      onClick={onClick}
      className={`bg-white border rounded-xl px-5 py-4 cursor-pointer hover:shadow-sm transition-all duration-300 ${
        contract.isNew
          ? "animate-in fade-in slide-in-from-top-2 duration-500 border-gray-200"
          : contract.isExiting
            ? "opacity-0 scale-95 pointer-events-none border-gray-200"
            : contract.needsClarification
              ? "border-amber-300"
              : "border-gray-200"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left */}
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
            <IconFileTypeDocx size={18} className="text-white" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-gray-900 truncate mb-0.5">
              {contract.name}
            </div>
            <div className="text-xs text-gray-400 mb-1.5">{contract.type}</div>
            <div
              className={`text-xs ${contract.needsClarification ? "text-amber-600 font-medium" : "text-gray-400"}`}
            >
              {contract.needsClarification && (
                <IconAlertCircle
                  size={11}
                  className="inline mr-1 flex-shrink-0"
                />
              )}
              {lastUpdateText}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <StatusBadge status={status} />
          {primaryAction()}
        </div>
      </div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

function Section({
  section,
  contracts,
  onCardClick,
}: {
  section: { id: RequestStatus; label: string };
  contracts: LocalContract[];
  onCardClick: (c: LocalContract) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div>
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="flex items-center gap-2 mb-3 cursor-pointer w-full text-left"
      >
        <span className="text-sm font-semibold text-gray-900">
          {section.label}
        </span>
        {contracts.length > 0 && (
          <span className="bg-gray-100 text-gray-500 text-xs font-medium px-1.5 py-0.5 rounded-full">
            {contracts.length}
          </span>
        )}
        <span className="text-gray-400 ml-1">
          {collapsed ? (
            <IconChevronRight size={14} />
          ) : (
            <IconChevronDown size={14} />
          )}
        </span>
      </button>

      {!collapsed && (
        <div className="space-y-2">
          {contracts.length === 0 ? (
            <div className="px-4 py-3 text-xs text-gray-400 border border-dashed border-gray-200 rounded-xl text-center">
              Nothing here
            </div>
          ) : (
            contracts.map((c) => (
              <RequestCard
                key={c.id}
                contract={c}
                onClick={() => onCardClick(c)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── New Request Modal ────────────────────────────────────────────────────────

function NewRequestModal({
  open,
  onClose,
  onSelectType,
}: {
  open: boolean;
  onClose: () => void;
  onSelectType: (type: "upload" | "draft" | "question") => void;
}) {
  if (!open) return null;

  const options = [
    {
      id: "upload" as const,
      icon: <IconUpload size={20} className="text-blue-600" />,
      bg: "bg-blue-50",
      title: "Upload a contract",
      description: "Have our attorneys review an existing contract",
    },
    {
      id: "draft" as const,
      icon: (
        <div className="w-5 h-5 rounded-full border-2 border-green-500 flex items-center justify-center">
          <IconPlus size={12} className="text-green-500" strokeWidth={3} />
        </div>
      ),
      bg: "bg-white border border-green-200",
      title: "Draft a contract",
      description: "Generate a new NDA, MSA, and more from scratch",
    },
    {
      id: "question" as const,
      icon: <IconMessageCircle size={20} className="text-orange-500" />,
      bg: "bg-orange-50",
      title: "Ask a legal question",
      description: "Get answers about a contract or any legal matter",
    },
  ];

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            What do you need help with?
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center cursor-pointer transition-colors"
          >
            <IconX size={15} className="text-gray-500" />
          </button>
        </div>
        <div className="space-y-3">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onSelectType(opt.id)}
              className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer text-left"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${opt.bg}`}
              >
                {opt.icon}
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900 mb-0.5">
                  {opt.title}
                </div>
                <div className="text-xs text-gray-500">{opt.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
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

export function AttorneyHomePage({
  contracts: sharedContracts,
  onNewChat,
  onUpload,
  onOpenUpload,
  onAskQuestion,
}: AttorneyHomePageProps) {
  const [localContracts, setLocalContracts] = useState<LocalContract[]>(() =>
    sharedContracts.map((c) => ({
      ...c,
      requestStatus: (c.kanbanStatus === "ready"
        ? "waiting"
        : c.kanbanStatus === "approved" || c.kanbanStatus === "signed"
          ? "done"
          : "in-progress") as RequestStatus,
    })),
  );
  const [newRequestModalOpen, setNewRequestModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [clarificationContractId, setClarificationContractId] = useState<
    string | null
  >(null);
  const [sideSheetOpen, setSideSheetOpen] = useState(false);

  // Sync new contracts from parent
  useEffect(() => {
    setLocalContracts((prev) => {
      const prevIds = new Set(prev.map((c) => c.id));
      const incoming = sharedContracts.filter((c) => !prevIds.has(c.id));
      if (incoming.length === 0) return prev;
      const newEntries: LocalContract[] = incoming.map((c) => ({
        ...c,
        requestStatus: "in-progress" as RequestStatus,
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
    const card = localContracts.find((c) => c.requestStatus === "in-progress");
    if (!card) return;
    setLocalContracts((prev) =>
      prev.map((c) => (c.id === card.id ? { ...c, isExiting: true } : c)),
    );
    setTimeout(() => {
      setLocalContracts((prev) =>
        prev.map((c) =>
          c.id === card.id
            ? { ...c, isExiting: false, requestStatus: "waiting", isNew: true }
            : c,
        ),
      );
      setTimeout(() => {
        setLocalContracts((prev) =>
          prev.map((c) => (c.id === card.id ? { ...c, isNew: false } : c)),
        );
      }, 600);
    }, 350);
  }, [localContracts]);

  const handleSimulateClarification = useCallback(() => {
    const card = localContracts.find((c) => c.requestStatus === "in-progress");
    if (!card) return;
    setLocalContracts((prev) =>
      prev.map((c) =>
        c.id === card.id
          ? {
              ...c,
              needsClarification: true,
              isLoading: false,
              clarificationTasks: mockClarificationTasks,
            }
          : c,
      ),
    );
    setClarificationContractId(card.id);
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

  const handleNewRequestType = (type: "upload" | "draft" | "question") => {
    setNewRequestModalOpen(false);
    if (type === "upload") setUploadModalOpen(true);
    else if (type === "question") onNewChat?.();
  };

  const handleCardClick = () => {
    setSideSheetOpen(true);
  };

  const handleUpload = (file: File) => {
    onUpload?.(file);
  };

  const getSection = (id: RequestStatus) =>
    localContracts.filter((c) => c.requestStatus === id);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-8 py-8">
          {/* Quick Actions */}
          <div className="mb-8 bg-[#F3EFEB] p-4 rounded-2xl">
            <div className="flex gap-4">
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
                className="lg:flex-none lg:w-64"
              />
            </div>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">Requests</h1>
            <button
              onClick={() => setNewRequestModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <IconPlus size={15} />
              New request
            </button>
          </div>

          {/* Sections */}
          <div className="space-y-8">
            {STATUS_SECTIONS.map((section) => (
              <Section
                key={section.id}
                section={section}
                contracts={getSection(section.id)}
                onCardClick={handleCardClick}
              />
            ))}
          </div>

          {/* Demo triggers */}
          {localContracts.some((c) => c.requestStatus === "in-progress") && (
            <div className="flex flex-col items-center gap-2 mt-8 pb-8">
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
      </div>

      {/* Side sheet */}
      <RequestSideSheet
        open={sideSheetOpen}
        onClose={() => setSideSheetOpen(false)}
        onNewRequest={() => {
          setSideSheetOpen(false);
          setNewRequestModalOpen(true);
        }}
      />

      {/* Modals */}
      <NewRequestModal
        open={newRequestModalOpen}
        onClose={() => setNewRequestModalOpen(false)}
        onSelectType={handleNewRequestType}
      />

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
        onView={() => {}}
      />
    </div>
  );
}

export default AttorneyHomePage;
