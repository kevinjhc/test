import React, { useState, useRef, useCallback, useEffect } from "react";
import type { SharedContract, ClarificationTask } from "../App";
import { ClarificationModal } from "./ClarificationModal";
import {
  IconUpload,
  IconPlus,
  IconMessageCircle,
  IconBuilding,
  IconLoader2,
  IconLayoutColumns,
  IconAlertCircle,
} from "@tabler/icons-react";
import { UploadContractModal } from "./UploadContractModal";
import { ContractSideSheet } from "./ContractSideSheet";

type ColumnId = "review" | "ready" | "negotiation" | "approved" | "signed";

interface Contract {
  id: string;
  type: string;
  name: string;
  company: string;
  status: ColumnId;
  isLoading?: boolean;
  loadingText?: string;
  isNew?: boolean;
  animatingIn?: boolean;
  isPulsing?: boolean;
  isMovingOut?: boolean;
  isGhost?: boolean;
  needsClarification?: boolean;
}

const COLUMNS: { id: ColumnId; label: string }[] = [
  { id: "review", label: "In Review by General Legal" },
  { id: "ready", label: "Ready for Review" },
  { id: "negotiation", label: "In Negotiation" },
  { id: "approved", label: "Approved" },
  { id: "signed", label: "Signed" },
];

interface DragState {
  contractId: string;
  sourceColumn: ColumnId;
}

interface FlyingCard {
  contract: Contract;
  startRect: DOMRect;
  endRect: DOMRect;
}

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

interface KanbanCardProps {
  contract: Contract;
  onDragStart: (
    e: React.DragEvent,
    contractId: string,
    sourceColumn: ColumnId,
  ) => void;
  isDragging: boolean;
  onCardClick?: (contractId: string) => void;
}

function KanbanCard({
  contract,
  onDragStart,
  isDragging,
  onCardClick,
}: KanbanCardProps) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, contract.id, contract.status)}
      onClick={() => onCardClick?.(contract.id)}
      data-card-id={contract.id}
      className={`bg-white border rounded-xl p-4 cursor-pointer select-none transition-all hover:bg-gray-50 hover:shadow-sm ${
        isDragging ? "opacity-40" : "opacity-100"
      } ${contract.isNew ? "animate-in fade-in slide-in-from-top-2 duration-500" : ""} ${
        contract.isMovingOut
          ? "opacity-0 -translate-y-2 scale-95 pointer-events-none"
          : ""
      } ${
        contract.needsClarification
          ? "border-amber-300 shadow-[0_0_0_3px_rgba(251,191,36,0.3)]"
          : contract.isPulsing
            ? "border-blue-300 shadow-[0_0_0_3px_rgba(147,197,253,0.5)]"
            : "border-gray-200"
      }`}
      style={
        contract.needsClarification
          ? { animation: "pulse-ring-amber 1.8s ease-in-out infinite" }
          : contract.isPulsing
            ? { animation: "pulse-ring 1.8s ease-in-out 3" }
            : undefined
      }
    >
      <div className="mb-3">
        <span className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-md">
          {contract.type}
        </span>
      </div>
      <div className="font-semibold text-gray-900 text-sm mb-2 leading-snug line-clamp-2">
        {contract.name}
      </div>
      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
        <IconBuilding size={13} className="flex-shrink-0" />
        <span>{contract.company}</span>
      </div>
      {contract.needsClarification && (
        <div className="flex items-center gap-1.5 text-xs text-amber-600 border-t border-amber-100 pt-3">
          <IconAlertCircle size={13} className="flex-shrink-0" />
          <span>Action required</span>
        </div>
      )}
      {!contract.needsClarification && contract.isLoading && (
        <div className="flex items-center gap-1.5 text-xs text-blue-500 border-t border-gray-100 pt-3">
          <IconLoader2 size={13} className="animate-spin flex-shrink-0" />
          <span>{contract.loadingText}</span>
        </div>
      )}
    </div>
  );
}

interface KanbanColumnProps {
  column: { id: ColumnId; label: string };
  contracts: Contract[];
  dragState: DragState | null;
  isDragOver: boolean;
  onDragStart: (
    e: React.DragEvent,
    contractId: string,
    sourceColumn: ColumnId,
  ) => void;
  onDragOver: (e: React.DragEvent, columnId: ColumnId) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, columnId: ColumnId) => void;
  onDragEnd: () => void;
  onCardClick?: (contractId: string) => void;
}

function KanbanColumn({
  column,
  contracts,
  dragState,
  isDragOver,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  onCardClick,
}: KanbanColumnProps) {
  return (
    <div className="flex flex-col min-w-0 flex-1">
      <div className="flex items-center gap-2 mb-3 ml-3">
        <h3 className="font-semibold text-gray-900 text-base whitespace-nowrap">
          {column.label}
        </h3>
        {contracts.length > 0 && (
          <span className="bg-gray-100 text-gray-600 text-xs font-medium px-1.5 py-0.5 rounded-full ml-auto">
            {contracts.length}
          </span>
        )}
      </div>

      <div
        onDragOver={(e) => onDragOver(e, column.id)}
        onDragLeave={onDragLeave}
        onDrop={(e) => onDrop(e, column.id)}
        onDragEnd={onDragEnd}
        data-column-id={column.id}
        className={`flex-1 min-h-32 rounded-xl transition-colors p-2 ${
          isDragOver
            ? "bg-blue-50 border-2 border-dashed border-blue-300"
            : "border-2 border-dashed border-transparent"
        }`}
      >
        <div className="flex flex-col gap-4">
          {contracts.map((contract) => (
            <KanbanCard
              key={contract.id}
              contract={contract}
              onDragStart={onDragStart}
              isDragging={dragState?.contractId === contract.id}
              onCardClick={onCardClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface HomePageProps {
  contracts: SharedContract[];
  onNewChat?: () => void;
  onCardClick?: (contractId: string) => void;
  onUpload?: (file: File) => void;
  onOpenUpload?: (contractId?: string) => void;
  onView?: (contractId: string) => void;
  onAskQuestion?: (contractId: string) => void;
  onSeed?: () => void;
  onKanbanStatusChange?: (
    id: string,
    status: SharedContract["kanbanStatus"],
  ) => void;
}

function toInternalContract(c: SharedContract, isNew = false): Contract {
  return {
    id: c.id,
    type: c.type,
    name: c.name,
    company: c.company,
    status: c.kanbanStatus,
    isLoading: c.isLoading,
    loadingText: c.loadingText,
    isNew,
  };
}

export function HomePage({
  contracts: sharedContracts,
  onNewChat,
  onCardClick,
  onUpload,
  onOpenUpload,
  onView,
  onAskQuestion,
  onSeed,
  onKanbanStatusChange,
}: HomePageProps) {
  const [localContracts, setLocalContracts] = useState<Contract[]>(() =>
    sharedContracts.map((c) => toInternalContract(c)),
  );
  const [flyingCard, setFlyingCard] = useState<FlyingCard | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [sideSheetContractId, setSideSheetContractId] = useState<string | null>(
    null,
  );
  const [clarificationContractId, setClarificationContractId] = useState<
    string | null
  >(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<ColumnId | null>(null);
  const dragLeaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, scrollLeft: 0 });

  const handleBoardMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Only pan on direct background clicks, not on cards
      if ((e.target as HTMLElement).closest("[draggable]")) return;
      isPanning.current = true;
      panStart.current = {
        x: e.clientX,
        scrollLeft: boardRef.current?.scrollLeft ?? 0,
      };
      e.currentTarget.style.cursor = "grabbing";
    },
    [],
  );

  const handleBoardMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isPanning.current || !boardRef.current) return;
      e.preventDefault();
      const dx = e.clientX - panStart.current.x;
      boardRef.current.scrollLeft = panStart.current.scrollLeft + dx;
    },
    [],
  );

  const handleBoardMouseUp = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      isPanning.current = false;
      e.currentTarget.style.cursor = "grab";
    },
    [],
  );

  const handleBoardMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      isPanning.current = false;
      e.currentTarget.style.cursor = "grab";
    },
    [],
  );

  const handleDragStart = (
    e: React.DragEvent,
    contractId: string,
    sourceColumn: ColumnId,
  ) => {
    setDragState({ contractId, sourceColumn });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, columnId: ColumnId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragLeaveTimer.current) {
      clearTimeout(dragLeaveTimer.current);
      dragLeaveTimer.current = null;
    }
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    dragLeaveTimer.current = setTimeout(() => {
      setDragOverColumn(null);
    }, 50);
  };

  // Keep localContracts in sync when sharedContracts changes (new uploads or version updates)
  useEffect(() => {
    setLocalContracts((prev) => {
      const prevMap = new Map(prev.map((c) => [c.id, c]));

      // Existing contracts whose kanbanStatus changed (e.g. new version resets to "review")
      const updated = prev.map((local) => {
        const shared = sharedContracts.find((c) => c.id === local.id);
        if (!shared) return local;
        if (shared.kanbanStatus !== local.status) {
          return {
            ...local,
            status: shared.kanbanStatus,
            isLoading: shared.isLoading,
            loadingText: shared.loadingText,
            name: shared.name,
            isNew: true,
          };
        }
        return local;
      });

      // Clear isNew after animation
      if (updated.some((c) => c.isNew)) {
        setTimeout(() => {
          setLocalContracts((lc) =>
            lc.map((c) => (c.isNew ? { ...c, isNew: false } : c)),
          );
        }, 600);
      }

      return updated;
    });
  }, [sharedContracts]);

  const handleDrop = (e: React.DragEvent, targetColumn: ColumnId) => {
    e.preventDefault();
    if (!dragState) return;
    const targetStatus = targetColumn as SharedContract["kanbanStatus"];
    setLocalContracts((prev) =>
      prev.map((c) =>
        c.id === dragState.contractId ? { ...c, status: targetColumn } : c,
      ),
    );
    onKanbanStatusChange?.(dragState.contractId, targetStatus);
    setDragState(null);
    setDragOverColumn(null);
  };

  const handleDragEnd = () => {
    setDragState(null);
    setDragOverColumn(null);
  };

  const lastUploadedId = useRef<string | null>(null);

  const handleUpload = (file: File) => {
    const now = "Just now";
    const ext = file.name.split(".").pop()?.toUpperCase() ?? "DOC";
    const newContract: SharedContract = {
      id: Date.now().toString(),
      name: file.name,
      version: "V1",
      fileStatus: "In Review",
      lastUpdated: now,
      submitted: now,
      type: ext,
      company: "Client Name",
      kanbanStatus: "review",
      isLoading: true,
      loadingText: "AI Review • Est. ~2 min",
    };
    // Add directly to local kanban with animation
    setLocalContracts((prev) => {
      setTimeout(() => {
        setLocalContracts((lc) =>
          lc.map((c) => (c.isNew ? { ...c, isNew: false } : c)),
        );
      }, 600);
      return [toInternalContract(newContract as SharedContract, true), ...prev];
    });
    // Also notify App so the files page gets updated
    onUpload?.(file);
  };

  const handleInvite = useCallback(() => {
    const reviewCard = localContracts.find((c) => c.status === "review");
    if (!reviewCard) return;

    // Measure the source card and target column
    const cardEl = document.querySelector(`[data-card-id="${reviewCard.id}"]`);
    const targetCol = document.querySelector(`[data-column-id="ready"]`);
    if (!cardEl || !targetCol) return;

    const startRect = cardEl.getBoundingClientRect();
    const targetRect = targetCol.getBoundingClientRect();

    // Estimate where the card will land in the target column (top of drop zone)
    const endRect = new DOMRect(
      targetRect.left + 8,
      targetRect.top + 8,
      startRect.width,
      startRect.height,
    );

    // Ghost the real card and launch the clone
    setLocalContracts((prev) =>
      prev.map((c) => (c.id === reviewCard.id ? { ...c, isGhost: true } : c)),
    );
    setFlyingCard({ contract: reviewCard, startRect, endRect });

    // After arc animation (700ms), move real card and stop flying
    setTimeout(() => {
      setFlyingCard(null);
      setLocalContracts((prev) =>
        prev.map((c) =>
          c.id === reviewCard.id
            ? {
                ...c,
                isGhost: false,
                status: "ready",
                isNew: true,
                isPulsing: false,
              }
            : c,
        ),
      );
      setTimeout(() => {
        setLocalContracts((prev) =>
          prev.map((c) =>
            c.id === reviewCard.id
              ? { ...c, isNew: false, isPulsing: true }
              : c,
          ),
        );
        setTimeout(() => {
          setLocalContracts((prev) =>
            prev.map((c) =>
              c.id === reviewCard.id ? { ...c, isPulsing: false } : c,
            ),
          );
        }, 5400);
      }, 50);
    }, 720);
  }, [localContracts]);

  const handleView = () => {
    const latest = sharedContracts[0];
    if (latest) {
      onView?.(latest.id);
    }
  };

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

  const handleSimulateClarification = useCallback(() => {
    const reviewCard = localContracts.find((c) => c.status === "review");
    if (!reviewCard) return;
    // Mark card as needing clarification
    setLocalContracts((prev) =>
      prev.map((c) =>
        c.id === reviewCard.id
          ? { ...c, needsClarification: true, isLoading: false }
          : c,
      ),
    );
    // Auto-open the modal
    setClarificationContractId(reviewCard.id);
  }, [localContracts]);

  const handleClarificationSubmit = useCallback(
    (contractId: string, answers: Record<string, string>) => {
      setLocalContracts((prev) =>
        prev.map((c) =>
          c.id === contractId
            ? {
                ...c,
                needsClarification: false,
                isLoading: true,
                loadingText: "AI Review • Est. ~2 min",
              }
            : c,
        ),
      );
      setClarificationContractId(null);
    },
    [],
  );

  const handleCardClick = (contractId: string) => {
    setSideSheetContractId(contractId);
    onCardClick?.(contractId);
  };

  // Build arc keyframes dynamically based on measured rects
  const flyingStyle = useCallback((fc: FlyingCard): React.CSSProperties => {
    const dx = fc.endRect.left - fc.startRect.left;
    const dy = fc.endRect.top - fc.startRect.top;
    // We inject a <style> tag dynamically — see below
    return {
      position: "fixed",
      top: fc.startRect.top,
      left: fc.startRect.left,
      width: fc.startRect.width,
      height: fc.startRect.height,
      zIndex: 9999,
      pointerEvents: "none",
      animation: "fly-arc 720ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
      "--dx": `${dx}px`,
      "--dy": `${dy}px`,
      "--arc": `${-Math.abs(dx) * 0.35}px`,
    } as React.CSSProperties;
  }, []);

  const getColumnContracts = (columnId: ColumnId) =>
    localContracts.filter((c) => c.status === columnId);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Inject arc + amber pulse keyframes */}
      <style>{`
        @keyframes fly-arc {
          0%   { transform: translate(0, 0) scale(1); opacity: 1; }
          40%  { transform: translate(calc(var(--dx) * 0.5), calc(var(--dy) * 0.5 + var(--arc))) scale(1.04); opacity: 1; }
          100% { transform: translate(var(--dx), var(--dy)) scale(1); opacity: 1; }
        }
        @keyframes pulse-ring-amber {
          0%   { box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.4); }
          50%  { box-shadow: 0 0 0 7px rgba(251, 191, 36, 0.1); }
          100% { box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.4); }
        }
      `}</style>

      {/* Flying card clone */}
      {flyingCard && (
        <div style={flyingStyle(flyingCard)}>
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-lg h-full">
            <div className="mb-3">
              <span className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-md">
                {flyingCard.contract.type}
              </span>
            </div>
            <div className="font-semibold text-gray-900 text-sm mb-2 leading-snug line-clamp-2">
              {flyingCard.contract.name}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
              <IconBuilding size={13} className="flex-shrink-0" />
              <span>{flyingCard.contract.company}</span>
            </div>
            {flyingCard.contract.isLoading && (
              <div className="flex items-center gap-1.5 text-xs text-blue-500 border-t border-gray-100 pt-3">
                <IconLoader2 size={13} className="animate-spin flex-shrink-0" />
                <span>{flyingCard.contract.loadingText}</span>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="flex-1 overflow-y-auto">
        <div className="px-8 py-8">
          {/* Quick Actions */}
          <div className="max-w-7xl mx-auto mb-10 bg-[#F3EFEB] p-4 rounded-2xl">
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
          {/* Kanban Board — empty state or board */}
          {localContracts.length === 0 ? (
            <div className="flex flex-col items-center px-8 mt-20">
              {/* Empty state copy */}
              <div className="flex flex-col items-center text-center mb-10">
                <IconLayoutColumns
                  size={40}
                  strokeWidth={1.25}
                  className="text-gray-900 mb-4"
                />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Your contract pipeline starts here
                </h2>
                <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
                  Track your contracts from first draft to signature in one
                  place. Upload a contract to automatically sort it into the
                  right state and keep work moving.
                </p>
                <button
                  onClick={() => setUploadModalOpen(true)}
                  className="mt-6 px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  Upload your first contract
                </button>
              </div>

              {/* Kanban screenshot mockup */}
              <div className="w-full max-w-2xl">
                <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
                  <div className="grid grid-cols-3 divide-x divide-gray-200">
                    {/* Col 1 */}
                    <div className="p-4">
                      <div className="text-xs font-semibold text-gray-500 mb-3">
                        In Review by General Legal
                      </div>
                      <div className="space-y-2">
                        <div className="border border-gray-200 rounded-xl p-3">
                          <span className="inline-block bg-gray-100 text-gray-500 text-[10px] font-medium px-1.5 py-0.5 rounded mb-1.5">
                            MSA
                          </span>
                          <div className="text-xs font-semibold text-gray-700 mb-1">
                            Enterprise SaaS Agreement
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-2">
                            <IconBuilding size={10} />
                            TechCorp Industries
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-blue-400 border-t border-gray-100 pt-2">
                            <IconLoader2 size={10} className="animate-spin" />
                            AI Review • Est. ~2 min
                          </div>
                        </div>
                        <div className="border border-gray-100 rounded-xl p-3 opacity-40">
                          <span className="inline-block bg-gray-100 text-gray-400 text-[10px] font-medium px-1.5 py-0.5 rounded mb-1.5">
                            MSA
                          </span>
                          <div className="text-xs font-semibold text-gray-400">
                            Enterprise SaaS Agreement
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Col 2 */}
                    <div className="p-4">
                      <div className="text-xs font-semibold text-gray-500 mb-3">
                        Ready for Review
                      </div>
                      <div className="border border-gray-200 rounded-xl p-3">
                        <span className="inline-block bg-gray-100 text-gray-500 text-[10px] font-medium px-1.5 py-0.5 rounded mb-1.5">
                          MSA
                        </span>
                        <div className="text-xs font-semibold text-gray-700 mb-1">
                          Master Services Agreement
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-2">
                          <IconBuilding size={10} />
                          TechCorp Industries
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-green-500 border-t border-gray-100 pt-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                          3 edits to review
                        </div>
                      </div>
                    </div>
                    {/* Col 3 */}
                    <div className="p-4">
                      <div className="text-xs font-semibold text-gray-500 mb-3">
                        In Negotiation
                      </div>
                      <div className="border border-gray-200 rounded-xl p-3">
                        <span className="inline-block bg-gray-100 text-gray-500 text-[10px] font-medium px-1.5 py-0.5 rounded mb-1.5">
                          MSA
                        </span>
                        <div className="text-xs font-semibold text-gray-700 mb-1 truncate">
                          Enterprise SaaS Agreement
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-2">
                          <IconBuilding size={10} />
                          TechCorp Industries
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-amber-500 border-t border-gray-100 pt-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                          Awaiting response
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-center text-xs text-gray-400 mt-3">
                  Example populated contract pipeline
                </p>
              </div>
            </div>
          ) : (
            <div className="">
              <div
                ref={boardRef}
                className="overflow-x-auto overflow-y-hidden cursor-grab select-none"
                onMouseDown={handleBoardMouseDown}
                onMouseMove={handleBoardMouseMove}
                onMouseUp={handleBoardMouseUp}
                onMouseLeave={handleBoardMouseLeave}
              >
                <div className="max-w-[81rem] mx-auto -mx-4">
                  <div
                    className="flex gap-6"
                    style={{ minWidth: "max-content" }}
                  >
                    {COLUMNS.map((column) => (
                      <div key={column.id} className="w-80 flex-shrink-0">
                        <KanbanColumn
                          column={column}
                          contracts={getColumnContracts(column.id)}
                          dragState={dragState}
                          isDragOver={dragOverColumn === column.id}
                          onDragStart={handleDragStart}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onDragEnd={handleDragEnd}
                          onCardClick={handleCardClick}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Demo triggers */}
          {localContracts.length === 0 && onSeed && (
            <div className="flex justify-center mt-8 pb-4">
              <button
                onClick={onSeed}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors cursor-pointer"
              >
                Seed with dummy contracts
              </button>
            </div>
          )}
          {localContracts.some((c) => c.status === "review") && (
            <div className="flex flex-col items-center gap-2 mt-8 pb-8">
              <button
                onClick={handleInvite}
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

      <UploadContractModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUpload={handleUpload}
        onView={handleView}
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
              onSubmit={(answers) =>
                handleClarificationSubmit(clarificationContractId, answers)
              }
            />
          ) : null;
        })()}

      <ContractSideSheet
        contract={
          sideSheetContractId
            ? (sharedContracts.find((c) => c.id === sideSheetContractId) ??
              null)
            : null
        }
        clarificationTasks={
          sideSheetContractId
            ? localContracts.find((c) => c.id === sideSheetContractId)
                ?.needsClarification
              ? mockClarificationTasks
              : undefined
            : undefined
        }
        onClarificationSubmit={(answers) => {
          if (sideSheetContractId)
            handleClarificationSubmit(sideSheetContractId, answers);
        }}
        onClose={() => setSideSheetContractId(null)}
        onUpload={onOpenUpload}
        onAskQuestion={onAskQuestion}
      />
    </div>
  );
}

export default HomePage;
