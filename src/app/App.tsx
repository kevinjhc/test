import { useState, useEffect, useCallback } from "react";
import { UploadContractModal } from "./components/UploadContractModal";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { ContractsContent } from "./components/ContractsContent";
import { ChatPage } from "./components/ChatPage";
import NewChatPage from "./components/NewChatPage";

import HomePage from "./components/HomePage";
import { AttorneyHomePage } from "./components/AttorneyHomePage";

export interface ClarificationTask {
  id: string;
  question: string;
  type: "text" | "select" | "yesno";
  options?: string[];
  answer?: string;
}

export interface VersionEntry {
  version: string;
  isLatest?: boolean;
  date: string;
  author: string;
  summary: string;
}

export interface SharedContract {
  id: string;
  name: string;
  version: string;
  // Files table status
  fileStatus: "In Review" | "Awaiting Review" | "Completed";
  lastUpdated: string;
  submitted: string;
  // Kanban
  type: string;
  company: string;
  kanbanStatus: "review" | "ready" | "negotiation" | "approved" | "signed";
  isLoading?: boolean;
  loadingText?: string;
  versions?: VersionEntry[];
  clarificationTasks?: ClarificationTask[];
  needsClarification?: boolean;
}

const initialContracts: SharedContract[] = [];

const seedContracts: SharedContract[] = [
  // Ready for review
  {
    id: "seed-3",
    name: "Master Services Agreement - TechCorp Industries.docx",
    version: "V3",
    fileStatus: "Awaiting Review",
    lastUpdated: "3 hours ago",
    submitted: "1 week ago",
    type: "MSA",
    company: "TechCorp Industries",
    kanbanStatus: "ready",
  },
  {
    id: "seed-4",
    name: "Software License Agreement - Vertex AI.docx",
    version: "V2",
    fileStatus: "Awaiting Review",
    lastUpdated: "5 days ago",
    submitted: "1 week ago",
    type: "License",
    company: "Vertex AI",
    kanbanStatus: "ready",
  },
  // In progress
  {
    id: "seed-5",
    name: "Employment Agreement - Sarah Chen.docx",
    version: "V1",
    fileStatus: "In Review",
    lastUpdated: "4 days ago",
    submitted: "4 days ago",
    type: "Employment",
    company: "General Legal",
    kanbanStatus: "review",
    isLoading: true,
    loadingText: "AI Review • Est. ~2 min",
  },
  {
    id: "seed-6",
    name: "IP Assignment Agreement - Founders.docx",
    version: "V2",
    fileStatus: "In Review",
    lastUpdated: "1 week ago",
    submitted: "2 weeks ago",
    type: "IP",
    company: "Internal",
    kanbanStatus: "negotiation",
  },
  {
    id: "seed-7",
    name: "Lease Agreement - 123 Market St.docx",
    version: "V1",
    fileStatus: "In Review",
    lastUpdated: "3 weeks ago",
    submitted: "3 weeks ago",
    type: "Lease",
    company: "Landlord LLC",
    kanbanStatus: "negotiation",
  },
  // Done
  {
    id: "seed-8",
    name: "Vendor Agreement - Stripe Inc.docx",
    version: "V1",
    fileStatus: "Completed",
    lastUpdated: "1 week ago",
    submitted: "2 weeks ago",
    type: "Vendor",
    company: "Stripe Inc",
    kanbanStatus: "signed",
  },
  {
    id: "seed-9",
    name: "Data Processing Agreement - AWS.docx",
    version: "V4",
    fileStatus: "Completed",
    lastUpdated: "3 weeks ago",
    submitted: "1 month ago",
    type: "DPA",
    company: "Amazon Web Services",
    kanbanStatus: "signed",
  },
  {
    id: "seed-10",
    name: "Shareholder Agreement - Series A.docx",
    version: "V2",
    fileStatus: "Completed",
    lastUpdated: "1 month ago",
    submitted: "6 weeks ago",
    type: "Shareholder",
    company: "General Legal",
    kanbanStatus: "signed",
  },
];

export default function App() {
  const [contracts, setContracts] =
    useState<SharedContract[]>(initialContracts);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [view, setView] = useState<
    "home" | "attorney" | "files" | "chat" | "newChat"
  >("files");
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeChatTitle, setActiveChatTitle] = useState<string | null>(null);
  const [scrollToId, setScrollToId] = useState<string | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadTargetId, setUploadTargetId] = useState<string | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setIsSidebarExpanded(false);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => setIsSidebarExpanded((v) => !v);

  const handleSeedContracts = useCallback(() => {
    setContracts(seedContracts);
  }, []);

  const handleShowHome = () => setView("home");

  const handleShowAttorney = () => setView("attorney");

  const handleNewChat = () => {
    setActiveChatId(null);
    setActiveChatTitle(null);
    setView("newChat");
  };

  const handleSelectChat = (id: string, title: string) => {
    setActiveChatId(id);
    setActiveChatTitle(title);
    setView("chat");
  };

  const handleShowFiles = () => setView("files");

  const handleCardClick = useCallback((contractId: string) => {
    setView("files");
    setScrollToId(contractId);
  }, []);

  const handleScrollComplete = useCallback(() => setScrollToId(null), []);

  const handleOpenUpload = useCallback((targetId?: string) => {
    setUploadTargetId(targetId ?? null);
    setUploadModalOpen(true);
  }, []);

  const handleView = useCallback((contractId: string) => {
    setView("files");
    setScrollToId(contractId);
  }, []);

  const handleUpload = useCallback((file: File, targetId?: string | null) => {
    const now = "Just now";
    const ext = file.name.split(".").pop()?.toUpperCase() ?? "DOC";

    if (targetId) {
      // New version of an existing contract
      setContracts((prev) =>
        prev.map((c) => {
          if (c.id !== targetId) return c;
          const prevVersionNum = parseInt(c.version.replace(/\D/g, "")) || 1;
          const newVersionNum = prevVersionNum + 1;
          const newVersionStr = `V${newVersionNum}`;
          const newVersionEntry: VersionEntry = {
            version: newVersionStr,
            isLatest: true,
            date: new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            author: "Kevin Chang",
            summary: `New version uploaded: ${file.name}`,
          };
          const existingVersions = (c.versions ?? []).map((v) => ({
            ...v,
            isLatest: false,
          }));
          return {
            ...c,
            version: newVersionStr,
            name: file.name,
            fileStatus: "In Review" as const,
            lastUpdated: now,
            kanbanStatus: "review" as const,
            isLoading: true,
            loadingText: "AI Review • Est. ~2 min",
            versions: [newVersionEntry, ...existingVersions],
          };
        }),
      );
      return;
    }

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
      versions: [
        {
          version: "V1",
          isLatest: true,
          date: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          author: "Kevin Chang",
          summary: `Initial upload: ${file.name}`,
        },
      ],
    };
    setContracts((prev) => [newContract, ...prev]);
  }, []);

  const handleKanbanStatusChange = useCallback(
    (contractId: string, newStatus: SharedContract["kanbanStatus"]) => {
      setContracts((prev) =>
        prev.map((c) =>
          c.id === contractId ? { ...c, kanbanStatus: newStatus } : c,
        ),
      );
    },
    [],
  );

  return (
    <div className="h-screen flex flex-1 overflow-hidden bg-white flex-col">
      <div className="flex w-full flex-1 min-h-0">
        <Sidebar
          isExpanded={isSidebarExpanded}
          onToggle={toggleSidebar}
          isMobile={isMobile}
          onShowHome={handleShowHome}
          onInvite={handleShowAttorney}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          onShowFiles={handleShowFiles}
          activeView={view}
        />

        <main className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuClick={toggleSidebar} />

          <div className="flex-1 overflow-hidden">
            {view === "home" ? (
              <HomePage
                contracts={contracts}
                onNewChat={handleNewChat}
                onUpload={handleUpload}
                onOpenUpload={handleOpenUpload}
                onView={handleView}
                onKanbanStatusChange={handleKanbanStatusChange}
                onSeed={handleSeedContracts}
                onAskQuestion={() =>
                  handleSelectChat("1", "Contract Review - Q4 2025")
                }
              />
            ) : view === "attorney" ? (
              <AttorneyHomePage
                contracts={contracts}
                onNewChat={handleNewChat}
                onOpenUpload={handleOpenUpload}
                onView={handleView}
                onKanbanStatusChange={handleKanbanStatusChange}
                onAskQuestion={() =>
                  handleSelectChat("1", "Contract Review - Q4 2025")
                }
              />
            ) : view === "files" ? (
              <ContractsContent
                contracts={contracts.map((c) => ({
                  id: c.id,
                  name: c.name,
                  version: c.version,
                  status: c.fileStatus,
                  lastUpdated: c.lastUpdated,
                  submitted: c.submitted,
                  versions: c.versions,
                  clarificationTasks: c.clarificationTasks,
                }))}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                scrollToId={scrollToId}
                onScrollComplete={handleScrollComplete}
                onUpload={(contractId) => handleOpenUpload(contractId)}
                onNewChat={handleNewChat}
                onSeed={handleSeedContracts}
                onAskQuestion={() =>
                  handleSelectChat("1", "Contract Review - Q4 2025")
                }
                onClarificationSubmit={(contractId, answers) => {
                  setContracts((prev) =>
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
                }}
              />
            ) : view === "newChat" ? (
              <NewChatPage onSelectChat={handleSelectChat} />
            ) : (
              <ChatPage chatId={activeChatId} title={activeChatTitle} />
            )}
          </div>
        </main>
      </div>

      <UploadContractModal
        open={uploadModalOpen}
        onClose={() => {
          setUploadModalOpen(false);
          setUploadTargetId(null);
        }}
        isNewVersion={!!uploadTargetId}
        onUpload={(file) => {
          handleUpload(file, uploadTargetId);
        }}
        onView={() => {
          setUploadModalOpen(false);
          const target = uploadTargetId
            ? contracts.find((c) => c.id === uploadTargetId)
            : contracts[0];
          if (target) handleView(target.id);
          setUploadTargetId(null);
        }}
      />
    </div>
  );
}
