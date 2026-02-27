import { useState, useEffect } from "react";
import {
  IconFile,
  IconPlus,
  IconLayoutSidebar,
  IconSettings,
  IconCreditCard,
  IconLogout,
  IconChevronDown,
  IconUserPlus,
  IconTrash,
} from "@tabler/icons-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "./ui/tooltip";

interface SidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
  isMobile?: boolean;
  onNewChat?: () => void;
  onSelectChat?: (id: string, title: string) => void;
  onShowFiles?: () => void;
  onDeleteChat?: (id: string) => void;
}

interface ChatItem {
  id: string;
  title: string;
  timestamp: string;
}

const mockChats: ChatItem[] = [
  {
    id: "1",
    title: "Contract Review - Q4 2025",
    timestamp: "2h ago",
  },
  {
    id: "2",
    title: "NDA Questions",
    timestamp: "1d ago",
  },
  {
    id: "3",
    title: "Employment Agreement",
    timestamp: "3d ago",
  },
  {
    id: "4",
    title: "Lease Agreement Review",
    timestamp: "1w ago",
  },
  {
    id: "1",
    title: "Contract Review - Q4 2025",
    timestamp: "2h ago",
  },
  {
    id: "2",
    title: "NDA Questions",
    timestamp: "1d ago",
  },
  {
    id: "3",
    title: "Employment Agreement",
    timestamp: "3d ago",
  },
  {
    id: "4",
    title: "Lease Agreement Review",
    timestamp: "1w ago",
  },
  {
    id: "1",
    title: "Contract Review - Q4 2025",
    timestamp: "2h ago",
  },
  {
    id: "2",
    title: "NDA Questions",
    timestamp: "1d ago",
  },
  {
    id: "3",
    title: "Employment Agreement",
    timestamp: "3d ago",
  },
  {
    id: "4",
    title: "Lease Agreement Review",
    timestamp: "1w ago",
  },
  {
    id: "1",
    title: "Contract Review - Q4 2025",
    timestamp: "2h ago",
  },
  {
    id: "2",
    title: "NDA Questions",
    timestamp: "1d ago",
  },
  {
    id: "3",
    title: "Employment Agreement",
    timestamp: "3d ago",
  },
  {
    id: "4",
    title: "Lease Agreement Review",
    timestamp: "1w ago",
  },
  {
    id: "1",
    title: "Contract Review - Q4 2025",
    timestamp: "2h ago",
  },
  {
    id: "2",
    title: "NDA Questions",
    timestamp: "1d ago",
  },
  {
    id: "3",
    title: "Employment Agreement",
    timestamp: "3d ago",
  },
  {
    id: "4",
    title: "Lease Agreement Review",
    timestamp: "1w ago",
  },
  {
    id: "1",
    title: "Contract Review - Q4 2025",
    timestamp: "2h ago",
  },
  {
    id: "2",
    title: "NDA Questions",
    timestamp: "1d ago",
  },
  {
    id: "3",
    title: "Employment Agreement",
    timestamp: "3d ago",
  },
  {
    id: "4",
    title: "Lease Agreement Review",
    timestamp: "1w ago",
  },
];

export function Sidebar({
  isExpanded,
  onToggle,
  isMobile = false,
  onNewChat,
  onSelectChat,
  onShowFiles,
  onDeleteChat,
}: SidebarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLogoVisible, setIsLogoVisible] = useState(false);

  useEffect(() => {
    if (!isExpanded) {
      // Delay entrance until sidebar animation is nearly done
      const timer = setTimeout(() => setIsLogoVisible(true), 220);
      return () => clearTimeout(timer);
    } else {
      // Disappear immediately on expand
      setIsLogoVisible(false);
    }
  }, [isExpanded]);

  if (isMobile && !isExpanded) {
    return null;
  }

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isExpanded && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 h-full bg-gray-50 border-r border-gray-200
          flex flex-col transition-all duration-300 z-50
          ${isExpanded ? "w-[320px]" : "w-14"}
          ${isMobile && !isExpanded ? "hidden" : ""}
        `}
      >
        {/* Top section */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Header */}
          <div className="flex-shrink-0 pt-4 pb-3">
            <div className="flex items-center flex-row">
                {isExpanded && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="149"
                  height="24"
                  fill="none"
                  className="flex flex-1 mt-2 flex-shrink-0 pl-5"
                >
                  <path
                    fill="#000"
                    d="M6.7 15.932c-4.196 0-6.7-3.277-6.7-7.945C0 3.255 2.676 0 7.257 0c4.088 0 5.822 2.527 6.186 4.647l-2.761.45c-.236-1.35-1.2-2.891-3.468-2.891-2.783 0-4.367 2.312-4.367 5.76 0 3.362 1.477 5.738 4.388 5.738 3.04 0 3.853-2.526 3.853-3.897V9.53h-4.11V7.366h6.636v8.202h-1.99l-.236-2.335c-.707 1.628-2.419 2.698-4.688 2.698M20.565 15.824c-3.297 0-5.266-2.012-5.266-5.503 0-3.533 1.948-5.717 5.137-5.717 3.126 0 4.902 1.82 4.902 5.096v1.157h-7.513c.021 1.82 1.156 2.933 2.826 2.933 1.22 0 2.119-.62 2.59-1.777l2.012.92c-.792 1.842-2.505 2.891-4.688 2.891m-2.74-6.66h4.945v-.17c0-1.713-.878-2.656-2.398-2.656-1.584 0-2.504 1.05-2.547 2.827M27.088 15.568V4.86h2.483v2.077c.727-1.585 1.883-2.334 3.553-2.334 2.333 0 3.532 1.477 3.532 4.325v6.639h-2.612v-6.36c0-1.692-.663-2.527-1.99-2.527-1.477 0-2.376 1.2-2.376 3.212v5.675zM43.676 15.824c-3.297 0-5.266-2.012-5.266-5.503 0-3.533 1.948-5.717 5.137-5.717 3.125 0 4.902 1.82 4.902 5.096v1.157h-7.513c.021 1.82 1.156 2.933 2.825 2.933 1.22 0 2.12-.62 2.59-1.777l2.013.92c-.792 1.842-2.505 2.891-4.688 2.891m-2.74-6.66h4.944v-.17c0-1.713-.877-2.656-2.397-2.656-1.584 0-2.504 1.05-2.547 2.827M52.639 7.452c.535-1.713 1.67-2.848 3.403-2.848.107 0 .193 0 .3.021v2.506c-.129-.022-.236-.022-.364-.022-1.028 0-1.713.279-2.205.75-.878.856-.985 2.055-.985 3.233v4.476h-2.59V4.86h2.44zM60.456 15.824c-2.183 0-3.639-1.263-3.639-3.169 0-1.028.45-1.884 1.306-2.42.75-.45 1.755-.728 3.468-.963l2.29-.3v-.257c0-1.606-.642-2.27-1.97-2.27-1.262 0-2.011.643-2.097 1.863H57.16c.15-2.27 1.969-3.704 4.73-3.704 3.19 0 4.603 1.349 4.603 4.454v3.19c0 1.478.107 2.549.342 3.32h-2.611c-.108-.557-.15-1.157-.172-1.82-.514 1.284-1.883 2.076-3.596 2.076m.835-1.841c1.605 0 2.654-1.135 2.654-2.805v-.686l-2.397.364c-1.434.236-2.055.75-2.055 1.67 0 .9.706 1.457 1.798 1.457M71.363.043v15.525h-2.59V.043zM78.173 15.568V.364h2.783v12.89h6.614v2.314zM93.42 15.824c-3.296 0-5.265-2.012-5.265-5.503 0-3.533 1.948-5.717 5.137-5.717 3.125 0 4.902 1.82 4.902 5.096v1.157h-7.513c.021 1.82 1.156 2.933 2.825 2.933 1.22 0 2.12-.62 2.59-1.777l2.013.92c-.792 1.842-2.505 2.891-4.688 2.891m-2.74-6.66h4.945v-.17c0-1.713-.877-2.656-2.397-2.656-1.584 0-2.504 1.05-2.547 2.827M104.16 20c-3.661 0-5.03-1.263-5.03-2.74 0-.943.62-1.735 1.797-2.1-.942-.385-1.37-1.091-1.37-1.927 0-1.113.664-1.884 1.713-2.29-.835-.643-1.327-1.628-1.327-2.742 0-2.12 1.669-3.597 4.409-3.597.878 0 1.627.15 2.269.428.343-1.178 1.285-1.97 2.826-1.97.193 0 .364.022.578.064v1.928a4 4 0 0 0-.878-.086c-.685 0-1.199.214-1.52.685.75.643 1.135 1.52 1.135 2.548 0 2.12-1.67 3.662-4.41 3.662-.813 0-1.52-.128-2.14-.386-.343.193-.535.45-.535.814 0 .557.471.985 1.626.985h2.805c2.504 0 3.788 1.114 3.788 3.062 0 2.227-1.862 3.662-5.736 3.662m.192-9.722c1.178 0 1.948-.878 1.948-2.055 0-1.22-.77-2.035-1.948-2.035-1.198 0-1.948.836-1.948 2.013 0 1.2.75 2.077 1.948 2.077m-3.082 6.489c0 1.134 1.241 1.541 3.082 1.541 2.419 0 3.211-.663 3.211-1.52s-.642-1.306-1.841-1.306h-2.804c-.321 0-.621-.022-.878-.043-.535.343-.77.814-.77 1.328M114.361 15.824c-2.183 0-3.639-1.263-3.639-3.169 0-1.028.45-1.884 1.306-2.42.749-.45 1.755-.728 3.468-.963l2.29-.3v-.257c0-1.606-.642-2.27-1.969-2.27-1.263 0-2.013.643-2.098 1.863h-2.654c.149-2.27 1.969-3.704 4.73-3.704 3.19 0 4.602 1.349 4.602 4.454v3.19c0 1.478.107 2.549.343 3.32h-2.612c-.107-.557-.149-1.157-.171-1.82-.514 1.284-1.884 2.076-3.596 2.076m.835-1.841c1.605 0 2.654-1.135 2.654-2.805v-.686l-2.397.364c-1.434.236-2.055.75-2.055 1.67 0 .9.706 1.457 1.798 1.457M125.268.043v15.525h-2.59V.043zM149 7.654a7.563 7.563 0 0 1-7.562 7.564 7.563 7.563 0 0 1-7.562-7.564 7.563 7.563 0 0 1 7.562-7.565A7.563 7.563 0 0 1 149 7.654"
                  />
                </svg>
              )}

              {/* Collapse/expand button */}
              {!isMobile && (
                <div className="w-14 flex items-center justify-center flex-shrink-0">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={onToggle}
                        className="p-1.5 hover:cursor-pointer rounded-full flex items-center justify-center hover:bg-gray-100"
                      >
                        <IconLayoutSidebar size={20} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="center" hidden={isMobile}>
                      {isExpanded ? "Collapse sidebar" : "Expand sidebar"}
                    </TooltipContent>
                  </Tooltip>
                </div>
              )}
            </div>
          </div>

          {/* Navigation items */}
          <div className="flex-shrink-0 px-2">
            <nav className="space-y-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={() => onNewChat && onNewChat()} className="w-full flex items-center py-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="w-10 flex items-center justify-center flex-shrink-0">
                      <IconPlus size={20} />
                    </div>
                    <span className="text-md whitespace-nowrap overflow-hidden">
                      New Chat
                    </span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" align="center" hidden={isExpanded || isMobile}>
                  New Chat
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={() => onShowFiles && onShowFiles()} className="w-full flex items-center py-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="w-10 flex items-center justify-center flex-shrink-0">
                      <IconFile size={20} />
                    </div>
                    <span className="text-md whitespace-nowrap overflow-hidden">
                      Files
                    </span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" align="center" hidden={isExpanded || isMobile}>
                  Files
                </TooltipContent>
              </Tooltip>
            </nav>
          </div>

            {isExpanded && (
            <div className="flex-shrink-0 w-full h-px bg-gray-200 mt-4"></div>
          )}

            {isExpanded && (
            <div className="flex-1 min-h-0 overflow-y-auto px-2 pt-4">
              {mockChats.map((chat) => (
                <button
                  key={Math.random().toString(36).slice(2)}
                  onClick={() => onSelectChat && onSelectChat(chat.id, chat.title)}
                  className="relative w-full px-3 p-2 rounded-xl hover:bg-gray-100 transition-colors text-left group cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 title={chat.title} className="text-md font-medium truncate">
                      {chat.title}
                    </h4>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-gray-500 truncate">{chat.timestamp}</p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChat && onDeleteChat(chat.id);
                    }}
                    className="absolute right-2.5 top-4.5 opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-red-600 p-1 rounded"
                    aria-label="Delete chat"
                  >
                    <IconTrash size={16} />
                  </button>
                </button>
              ))}
            </div>
          )}
        </div>

        {!isExpanded && (
          <div className="flex items-center justify-center w-14 mb-4">
            <div
              style={{
                width: 20,
                height: 149,
                overflow: "visible",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  transformOrigin: "top left",
                  transform: `rotate(-90deg) translateX(-100%) translateY(${isLogoVisible ? "0px" : "-20px"})`,
                  opacity: isLogoVisible ? 1 : 0,
                  transition: isLogoVisible
                    ? "opacity 200ms ease-out, transform 200ms ease-out"
                    : "none",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="149"
                  height="20"
                  fill="none"
                >
                  <path
                    fill="#000"
                    d="M6.7 15.932c-4.196 0-6.7-3.277-6.7-7.945C0 3.255 2.676 0 7.257 0c4.088 0 5.822 2.527 6.186 4.647l-2.761.45c-.236-1.35-1.2-2.891-3.468-2.891-2.783 0-4.367 2.312-4.367 5.76 0 3.362 1.477 5.738 4.388 5.738 3.04 0 3.853-2.526 3.853-3.897V9.53h-4.11V7.366h6.636v8.202h-1.99l-.236-2.335c-.707 1.628-2.419 2.698-4.688 2.698M20.565 15.824c-3.297 0-5.266-2.012-5.266-5.503 0-3.533 1.948-5.717 5.137-5.717 3.126 0 4.902 1.82 4.902 5.096v1.157h-7.513c.021 1.82 1.156 2.933 2.826 2.933 1.22 0 2.119-.62 2.59-1.777l2.012.92c-.792 1.842-2.505 2.891-4.688 2.891m-2.74-6.66h4.945v-.17c0-1.713-.878-2.656-2.398-2.656-1.584 0-2.504 1.05-2.547 2.827M27.088 15.568V4.86h2.483v2.077c.727-1.585 1.883-2.334 3.553-2.334 2.333 0 3.532 1.477 3.532 4.325v6.639h-2.612v-6.36c0-1.692-.663-2.527-1.99-2.527-1.477 0-2.376 1.2-2.376 3.212v5.675zM43.676 15.824c-3.297 0-5.266-2.012-5.266-5.503 0-3.533 1.948-5.717 5.137-5.717 3.125 0 4.902 1.82 4.902 5.096v1.157h-7.513c.021 1.82 1.156 2.933 2.825 2.933 1.22 0 2.12-.62 2.59-1.777l2.013.92c-.792 1.842-2.505 2.891-4.688 2.891m-2.74-6.66h4.944v-.17c0-1.713-.877-2.656-2.397-2.656-1.584 0-2.504 1.05-2.547 2.827M52.639 7.452c.535-1.713 1.67-2.848 3.403-2.848.107 0 .193 0 .3.021v2.506c-.129-.022-.236-.022-.364-.022-1.028 0-1.713.279-2.205.75-.878.856-.985 2.055-.985 3.233v4.476h-2.59V4.86h2.44zM60.456 15.824c-2.183 0-3.639-1.263-3.639-3.169 0-1.028.45-1.884 1.306-2.42.75-.45 1.755-.728 3.468-.963l2.29-.3v-.257c0-1.606-.642-2.27-1.97-2.27-1.262 0-2.011.643-2.097 1.863H57.16c.15-2.27 1.969-3.704 4.73-3.704 3.19 0 4.603 1.349 4.603 4.454v3.19c0 1.478.107 2.549.342 3.32h-2.611c-.108-.557-.15-1.157-.172-1.82-.514 1.284-1.883 2.076-3.596 2.076m.835-1.841c1.605 0 2.654-1.135 2.654-2.805v-.686l-2.397.364c-1.434.236-2.055.75-2.055 1.67 0 .9.706 1.457 1.798 1.457M71.363.043v15.525h-2.59V.043zM78.173 15.568V.364h2.783v12.89h6.614v2.314zM93.42 15.824c-3.296 0-5.265-2.012-5.265-5.503 0-3.533 1.948-5.717 5.137-5.717 3.125 0 4.902 1.82 4.902 5.096v1.157h-7.513c.021 1.82 1.156 2.933 2.825 2.933 1.22 0 2.12-.62 2.59-1.777l2.013.92c-.792 1.842-2.505 2.891-4.688 2.891m-2.74-6.66h4.945v-.17c0-1.713-.877-2.656-2.397-2.656-1.584 0-2.504 1.05-2.547 2.827M104.16 20c-3.661 0-5.03-1.263-5.03-2.74 0-.943.62-1.735 1.797-2.1-.942-.385-1.37-1.091-1.37-1.927 0-1.113.664-1.884 1.713-2.29-.835-.643-1.327-1.628-1.327-2.742 0-2.12 1.669-3.597 4.409-3.597.878 0 1.627.15 2.269.428.343-1.178 1.285-1.97 2.826-1.97.193 0 .364.022.578.064v1.928a4 4 0 0 0-.878-.086c-.685 0-1.199.214-1.52.685.75.643 1.135 1.52 1.135 2.548 0 2.12-1.67 3.662-4.41 3.662-.813 0-1.52-.128-2.14-.386-.343.193-.535.45-.535.814 0 .557.471.985 1.626.985h2.805c2.504 0 3.788 1.114 3.788 3.062 0 2.227-1.862 3.662-5.736 3.662m.192-9.722c1.178 0 1.948-.878 1.948-2.055 0-1.22-.77-2.035-1.948-2.035-1.198 0-1.948.836-1.948 2.013 0 1.2.75 2.077 1.948 2.077m-3.082 6.489c0 1.134 1.241 1.541 3.082 1.541 2.419 0 3.211-.663 3.211-1.52s-.642-1.306-1.841-1.306h-2.804c-.321 0-.621-.022-.878-.043-.535.343-.77.814-.77 1.328M114.361 15.824c-2.183 0-3.639-1.263-3.639-3.169 0-1.028.45-1.884 1.306-2.42.749-.45 1.755-.728 3.468-.963l2.29-.3v-.257c0-1.606-.642-2.27-1.969-2.27-1.263 0-2.013.643-2.098 1.863h-2.654c.149-2.27 1.969-3.704 4.73-3.704 3.19 0 4.602 1.349 4.602 4.454v3.19c0 1.478.107 2.549.343 3.32h-2.612c-.107-.557-.149-1.157-.171-1.82-.514 1.284-1.884 2.076-3.596 2.076m.835-1.841c1.605 0 2.654-1.135 2.654-2.805v-.686l-2.397.364c-1.434.236-2.055.75-2.055 1.67 0 .9.706 1.457 1.798 1.457M125.268.043v15.525h-2.59V.043zM149 7.654a7.563 7.563 0 0 1-7.562 7.564 7.563 7.563 0 0 1-7.562-7.564 7.563 7.563 0 0 1 7.562-7.565A7.563 7.563 0 0 1 149 7.654"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Bottom section */}
        <>
          {/* Invite button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="w-full flex items-center border-t border-gray-200 hover:bg-gray-100 transition-colors px-3 py-2 cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                  <IconUserPlus size={20} />
                </div>
                <span className="text-sm whitespace-nowrap ml-3 overflow-hidden">
                  Invite teammates
                </span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" align="center" hidden={isExpanded || isMobile}>
              Invite teammates
            </TooltipContent>
          </Tooltip>
          <div className="border-t border-gray-200 relative">
            {/* Dropdown menu */}
            {isDropdownOpen && (
              <>
                {/* Backdrop to close dropdown */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsDropdownOpen(false)}
                />

                {/* Dropdown content */}
                <div
                  className={`absolute bottom-full mb-2 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-20 ${isExpanded ? "left-2 right-2" : "left-2 min-w-[160px]"}`}
                >
                  <button
                    onClick={() => setIsDropdownOpen(false)}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 transition-colors text-left cursor-pointer"
                  >
                    <IconSettings size={20} className="flex-shrink-0" />
                    <span className="text-sm">Settings</span>
                  </button>
                  <button
                    onClick={() => setIsDropdownOpen(false)}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 transition-colors text-left cursor-pointer"
                  >
                    <IconCreditCard size={20} className="flex-shrink-0" />
                    <span className="text-sm">Billing</span>
                  </button>
                  <button
                    onClick={() => setIsDropdownOpen(false)}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 transition-colors text-left cursor-pointer"
                  >
                    <IconLogout size={20} className="flex-shrink-0" />
                    <span className="text-sm">Sign out</span>
                  </button>
                </div>
              </>
            )}

            {/* User profile button */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center hover:bg-gray-100 transition-colors px-3 py-2 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm flex-shrink-0">
                K
              </div>
              <div className="flex-1 flex items-center min-w-0 ml-3 overflow-hidden">
                <div className="flex-1 text-left min-w-0">
                  <div className="text-sm font-medium whitespace-nowrap">
                    Kevin Chang
                  </div>
                  <div className="text-xs text-gray-500 whitespace-nowrap">
                    Free plan
                  </div>
                </div>
                <IconChevronDown
                  size={16}
                  className={`flex-shrink-0 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </div>
            </button>
          </div>
        </>
      </aside>
    </>
  );
}
