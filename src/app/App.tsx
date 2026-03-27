import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { ContractsContent } from "./components/ContractsContent";
import { ChatPage } from "./components/ChatPage";
import NewChatPage from "./components/NewChatPage";
import HomePage from "./components/HomePage";

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

  const handleUpload = useCallback((file: File) => {
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
                onCardClick={handleCardClick}
                onUpload={handleUpload}
                onKanbanStatusChange={handleKanbanStatusChange}
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
                }))}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                scrollToId={scrollToId}
                onScrollComplete={handleScrollComplete}
              />
            ) : view === "newChat" ? (
              <NewChatPage />
            ) : (
              <ChatPage chatId={activeChatId} title={activeChatTitle} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
