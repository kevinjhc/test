import { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { ContractsContent } from "./components/ContractsContent";
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

  return (
    <div className="h-screen flex flex-1 overflow-hidden bg-white flex-col">
      {/* Privileged & Confidential Banner */}
      <footer className="bg-black/5 px-6 border-b border-gray-200 py-1 flex items-center justify-center gap-2.5 rounded-b-xl">
        <IconShield size="16" />
        <span className="opacity-70 text-xs">Privileged & Confidential</span>
        <button className="no-underline hover:underline text-xs cursor-pointer">
          Learn more
        </button>
      </footer>

      <div className="flex w-full flex-1 min-h-0">
        {/* Sidebar */}
        <Sidebar
          isExpanded={isSidebarExpanded}
          onToggle={toggleSidebar}
          isMobile={isMobile}
        />

        {/* Main content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile header */}
          <Header onMenuClick={toggleSidebar} />

          {/* Content area */}
          <div className="flex-1 overflow-hidden">
            <ContractsContent
              contracts={mockContracts}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
