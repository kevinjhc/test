import { useState, useEffect, useCallback } from "react";
import { UploadContractModal } from "./components/UploadContractModal";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { ContractsContent } from "./components/ContractsContent";
import { ChatPage } from "./components/ChatPage";
import NewChatPage from "./components/NewChatPage";
import HomePage from "./components/HomePage";

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
}

const initialContracts: SharedContract[] = [];

export default function App() {
  const [contracts, setContracts] =
    useState<SharedContract[]>(initialContracts);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [view, setView] = useState<"home" | "files" | "chat" | "newChat">(
    "home",
  );
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

  const handleShowHome = () => setView("home");

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
                }))}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                scrollToId={scrollToId}
                onScrollComplete={handleScrollComplete}
                onUpload={(contractId) => handleOpenUpload(contractId)}
                onAskQuestion={() =>
                  handleSelectChat("1", "Contract Review - Q4 2025")
                }
              />
            ) : view === "newChat" ? (
              <NewChatPage />
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
