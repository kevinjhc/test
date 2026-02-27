import { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { ContractsContent } from "./components/ContractsContent";
import { ChatPage } from "./components/ChatPage";
import NewChatPage from "./components/NewChatPage";
import { IconShield } from "@tabler/icons-react";

// Mock contract data
const mockContracts = [
  {
    id: "1",
    name: "General Legal, Inc. - Global Form of Non-Immediately Exercisable Exercise Agreement(25063329.3)(1).docx",
    version: "V1",
    status: "In Review" as const,
    lastUpdated: "2 days ago",
    submitted: "2 days ago",
  },
  {
    id: "2",
    name: "General Legal, Inc. - Global Form of Non-Immediately Exercisable Exercise Agreement(25063329.3)(1).docx",
    version: "V1",
    status: "In Review" as const,
    lastUpdated: "2 days ago",
    submitted: "2 days ago",
  },
  {
    id: "3",
    name: "General Legal, Inc. - Global Form of Non-Immediately Exercisable Exercise Agreement(25063329.3)(1).docx",
    version: "V1",
    status: "In Review" as const,
    lastUpdated: "2 days ago",
    submitted: "2 days ago",
  },
  {
    id: "4",
    name: "General Legal, Inc. - Global Form of Non-Immediately Exercisable Exercise Agreement(25063329.3)(1).docx",
    version: "V1",
    status: "In Review" as const,
    lastUpdated: "2 days ago",
    submitted: "2 days ago",
  },
  {
    id: "5",
    name: "General Legal, Inc. - Global Form of Non-Immediately Exercisable Exercise Agreement(25063329.3)(1).docx",
    version: "V1",
    status: "In Review" as const,
    lastUpdated: "2 days ago",
    submitted: "2 days ago",
  },
];

export default function App() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [view, setView] = useState<"files" | "chat" | "newChat">("newChat");
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeChatTitle, setActiveChatTitle] = useState<string | null>(null);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // On mobile, start with sidebar collapsed
      if (mobile) {
        setIsSidebarExpanded(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

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

  const handleShowFiles = () => {
    setView("files");
  };

  return (
    <div className="h-screen flex flex-1 overflow-hidden bg-white flex-col">
      {/* Privileged & Confidential Banner */}
      <footer className="bg-blue-50 border-blue-200 text-blue-900 border-b px-6 py-1.5 flex items-center justify-center gap-2.5 rounded-b-xl">
        <IconShield size="16" />
        <span className="opacity-70 font-semibold text-sm">Privileged & Confidential</span>
        <button className="no-underline font-normal hover:underline text-sm cursor-pointer">
          Learn more
        </button>
      </footer>

      <div className="flex w-full flex-1 min-h-0">
        {/* Sidebar */}
        <Sidebar
          isExpanded={isSidebarExpanded}
          onToggle={toggleSidebar}
          isMobile={isMobile}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          onShowFiles={handleShowFiles}
        />

        {/* Main content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile header */}
          <Header onMenuClick={toggleSidebar} />

          {/* Content area */}
          <div className="flex-1 overflow-hidden">
            {view === "files" ? (
              <ContractsContent
                contracts={mockContracts}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
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
