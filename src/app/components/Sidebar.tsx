import { useState, useEffect } from "react";
import {
  IconFile,
  IconLayoutSidebar,
  IconSettings,
  IconCreditCard,
  IconLogout,
  IconChevronDown,
  IconUserPlus,
  IconHome,
  IconMessageCircle,
  IconTrash,
} from "@tabler/icons-react";

import { Tooltip, TooltipTrigger, TooltipContent } from "./ui/tooltip";

interface ChatItem {
  id: string;
  title: string;
  timestamp: string;
}

const mockChats: ChatItem[] = [
  { id: "1", title: "Contract Review - Q4 2025", timestamp: "2h ago" },
  { id: "2", title: "NDA Questions", timestamp: "1d ago" },
  { id: "3", title: "Employment Agreement", timestamp: "3d ago" },
  { id: "4", title: "Lease Agreement Review", timestamp: "1w ago" },
  { id: "5", title: "IP Assignment Clause", timestamp: "1w ago" },
  { id: "6", title: "Vendor MSA Review", timestamp: "2w ago" },
  { id: "7", title: "Contractor Agreement", timestamp: "2w ago" },
  { id: "8", title: "Equity Grant Questions", timestamp: "3w ago" },
  { id: "9", title: "Privacy Policy Review", timestamp: "1mo ago" },
  { id: "10", title: "Terms of Service Update", timestamp: "1mo ago" },
];

interface SidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
  isMobile?: boolean;
  onShowHome?: () => void;
  onNewChat?: () => void;
  onSelectChat?: (id: string, title: string) => void;
  onShowFiles?: () => void;
  onInvite?: () => void;
  onShowSettings?: () => void;
  activeView?: "home" | "attorney" | "settings" | "files" | "chat" | "newChat";
}

export function Sidebar({
  isExpanded,
  onToggle,
  isMobile = false,
  onShowHome,
  onNewChat,
  onSelectChat,
  onShowFiles,
  onShowSettings,
  onInvite,
  activeView,
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
          fixed md:sticky top-0 left-0 h-full bg-white border-r border-gray-200
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
                  viewBox="0 0 147 21"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  width="149"
                  height="24"
                  fill="none"
                  className="flex mt-0.5 flex-shrink-0 pl-5"
                >
                  <path
                    d="M11.8106 16.639C11.6818 16.639 11.5773 16.5325 11.5773 16.4012V15.8033C11.5773 15.5625 11.2193 15.442 11.046 15.6056C10.2411 16.3649 8.91538 16.8901 7.25543 16.8901C3.09028 16.8901 0 13.4664 0 8.5135C0 3.53778 3.11267 0 7.43458 0C10.64 0 12.8262 1.70974 13.8485 4.47591C13.8942 4.5996 13.8284 4.73617 13.7055 4.77828L11.4367 5.55541C11.3074 5.59969 11.169 5.52143 11.1301 5.38823C10.608 3.60202 9.29871 2.57916 7.45697 2.57916C4.74738 2.57916 2.86634 4.93007 2.86634 8.46785C2.86634 12.0056 4.74738 14.3794 7.50176 14.3794C9.74747 14.3794 11.2436 12.8089 11.4279 10.6093C11.4392 10.4748 11.3328 10.3623 11.2004 10.3623H7.44391C7.31508 10.3623 7.21064 10.2558 7.21064 10.1245V8.0437C7.21064 7.91239 7.31508 7.80595 7.44391 7.80595H13.9641C14.0929 7.80595 14.1974 7.91239 14.1974 8.0437V16.4012C14.1974 16.5325 14.0929 16.639 13.9641 16.639H11.8106Z"
                    fill="currentColor"
                  />
                  <path
                    d="M21.958 16.8901C18.599 16.8901 16.2477 14.3566 16.2477 10.659C16.2477 7.14404 18.5766 4.42793 21.8461 4.42793C25.2498 4.42793 27.0637 7.05274 27.0637 10.3395V11.0147C27.0637 11.146 26.9593 11.2524 26.8304 11.2524H19.0807C18.9427 11.2524 18.8345 11.3745 18.8546 11.5136C19.1297 13.4125 20.3081 14.562 21.958 14.562C23.1901 14.562 24.1884 13.9666 24.6081 12.8868C24.6581 12.7583 24.7981 12.6864 24.9249 12.7354L26.7739 13.4489C26.8961 13.4961 26.9568 13.6368 26.9031 13.7582C26.0336 15.7234 24.2247 16.8901 21.958 16.8901ZM21.8237 6.7332C20.5217 6.7332 19.4954 7.47584 19.0403 8.90466C18.9934 9.05208 19.105 9.19824 19.2571 9.19824H24.1168C24.2472 9.19824 24.3532 9.08907 24.3411 8.95674C24.2294 7.73861 23.4211 6.7332 21.8237 6.7332Z"
                    fill="currentColor"
                  />
                  <path
                    d="M29.3132 16.639C29.1844 16.639 29.08 16.5325 29.08 16.4012V4.89393C29.08 4.76262 29.1844 4.65618 29.3132 4.65618H31.5339C31.6627 4.65618 31.7672 4.76262 31.7672 4.89393V5.29164C31.7672 5.51237 32.0469 5.6229 32.2096 5.47724C32.8722 4.88401 33.7917 4.42793 35.0142 4.42793C37.4775 4.42793 38.9554 6.16259 38.9554 8.74175V16.4012C38.9554 16.5325 38.851 16.639 38.7222 16.639H36.5015C36.3727 16.639 36.2682 16.5325 36.2682 16.4012V9.5406C36.2682 8.05702 35.686 6.98427 34.208 6.98427C32.9988 6.98427 31.7672 7.89724 31.7672 9.60907V16.4012C31.7672 16.5325 31.6627 16.639 31.5339 16.639H29.3132Z"
                    fill="currentColor"
                  />
                  <path
                    d="M46.6694 16.8901C43.3104 16.8901 40.9591 14.3566 40.9591 10.659C40.9591 7.14404 43.288 4.42793 46.5574 4.42793C49.9612 4.42793 51.7751 7.05274 51.7751 10.3395V11.0147C51.7751 11.146 51.6706 11.2524 51.5418 11.2524H43.7921C43.6541 11.2524 43.5458 11.3745 43.566 11.5136C43.8411 13.4125 45.0194 14.562 46.6694 14.562C47.9014 14.562 48.8998 13.9666 49.3195 12.8868C49.3694 12.7583 49.5094 12.6864 49.6363 12.7354L51.4852 13.4489C51.6075 13.4961 51.6682 13.6368 51.6145 13.7582C50.745 15.7234 48.9361 16.8901 46.6694 16.8901ZM46.535 6.7332C45.2331 6.7332 44.2068 7.47584 43.7517 8.90466C43.7047 9.05208 43.8164 9.19824 43.9685 9.19824H48.8282C48.9586 9.19824 49.0646 9.08907 49.0525 8.95674C48.9407 7.73861 48.1325 6.7332 46.535 6.7332Z"
                    fill="currentColor"
                  />
                  <path
                    d="M60.2568 4.61221C60.3752 4.62265 60.4645 4.72501 60.4645 4.84616V7.10072C60.4645 7.24452 60.3403 7.3548 60.2 7.33991C59.9731 7.31585 59.7557 7.30381 59.4792 7.30381C57.7773 7.30381 56.4785 8.42221 56.4785 10.3395V16.4012C56.4785 16.5325 56.3741 16.639 56.2453 16.639H54.0246C53.8958 16.639 53.7913 16.5325 53.7913 16.4012V4.89393C53.7913 4.76262 53.8958 4.65618 54.0246 4.65618H56.2453C56.3741 4.65618 56.4785 4.76262 56.4785 4.89393V5.37042C56.4785 5.62451 56.9064 5.7522 57.0858 5.57574C57.7134 4.9583 58.6344 4.58771 59.7032 4.58771C59.9165 4.58771 60.0987 4.59827 60.2568 4.61221Z"
                    fill="currentColor"
                  />
                  <path
                    d="M65.1047 16.8444C62.8653 16.8444 61.1411 15.4521 61.1411 13.3066C61.1411 11.0242 62.8206 10.0199 65.0823 9.5406L68.1433 8.89509C68.2516 8.87225 68.3293 8.77501 68.3293 8.66227V8.65045C68.3293 7.50923 67.7471 6.80167 66.3139 6.80167C65.1198 6.80167 64.4549 7.321 64.1174 8.34098C64.0774 8.46174 63.956 8.5366 63.8342 8.50802L61.7642 8.02257C61.6329 7.99178 61.5539 7.85409 61.5988 7.72461C62.2463 5.85578 63.9344 4.42793 66.4259 4.42793C69.2474 4.42793 70.9493 5.7974 70.9493 8.55915V13.7175C70.9493 14.3144 71.1706 14.5471 71.7169 14.5364C71.8568 14.5337 71.9794 14.642 71.9794 14.7846V16.427C71.9794 16.5478 71.8902 16.6498 71.7722 16.6613C70.1865 16.8161 69.2449 16.5343 68.7733 15.8293C68.6767 15.6848 68.4644 15.6477 68.3363 15.7641C67.5843 16.4468 66.4598 16.8444 65.1047 16.8444ZM68.3293 12.4165V11.2493C68.3293 11.0981 68.1927 10.9853 68.0476 11.0167L65.7989 11.5035C64.6568 11.7546 63.8059 12.1198 63.8059 13.1925C63.8059 14.1283 64.4777 14.6533 65.5078 14.6533C66.9409 14.6533 68.3293 13.8772 68.3293 12.4165Z"
                    fill="currentColor"
                  />
                  <path
                    d="M76.3424 0.251068C76.4712 0.251068 76.5756 0.357514 76.5756 0.488822V16.4012C76.5756 16.5325 76.4712 16.639 76.3424 16.639H74.1217C73.9929 16.639 73.8884 16.5325 73.8884 16.4012V0.488822C73.8884 0.357514 73.9929 0.251068 74.1217 0.251068H76.3424Z"
                    fill="currentColor"
                  />
                  <path
                    d="M89.8119 8.07993C89.8119 10.1809 88.141 11.884 86.0797 11.884C84.0185 11.884 82.3475 10.1809 82.3475 8.07993C82.3475 5.979 84.0185 4.27586 86.0797 4.27586C88.141 4.27586 89.8119 5.979 89.8119 8.07993Z"
                    fill="currentColor"
                  />
                  <path
                    d="M95.3009 16.6405C95.1721 16.6405 95.0677 16.5341 95.0677 16.4028V0.490368C95.0677 0.35906 95.1721 0.252614 95.3009 0.252614H97.7007C97.8296 0.252614 97.934 0.35906 97.934 0.490368V13.8465C97.934 13.9778 98.0384 14.0842 98.1673 14.0842H105.27C105.398 14.0842 105.503 14.1907 105.503 14.322V16.4028C105.503 16.5341 105.398 16.6405 105.27 16.6405H95.3009Z"
                    fill="currentColor"
                  />
                  <path
                    d="M111.998 16.8916C108.639 16.8916 106.288 14.3581 106.288 10.6605C106.288 7.14558 108.617 4.42948 111.886 4.42948C115.29 4.42948 117.104 7.05429 117.104 10.341V11.0162C117.104 11.1475 117 11.254 116.871 11.254H109.121C108.983 11.254 108.875 11.376 108.895 11.5152C109.17 13.4141 110.348 14.5635 111.998 14.5635C113.23 14.5635 114.229 13.9681 114.648 12.8883C114.698 12.7598 114.838 12.688 114.965 12.7369L116.814 13.4505C116.936 13.4977 116.997 13.6383 116.943 13.7598C116.074 15.725 114.265 16.8916 111.998 16.8916ZM111.864 6.73475C110.562 6.73475 109.536 7.47739 109.081 8.9062C109.034 9.05363 109.145 9.19978 109.297 9.19978H114.157C114.288 9.19978 114.394 9.09062 114.381 8.95828C114.27 7.74016 113.461 6.73475 111.864 6.73475Z"
                    fill="currentColor"
                  />
                  <path
                    d="M129.578 15.4308C129.578 18.9686 127.204 21 123.845 21C121.222 21 119.354 19.9087 118.567 17.726C118.524 17.6053 118.588 17.4735 118.706 17.4303L120.764 16.6814C120.892 16.6347 121.031 16.7096 121.076 16.8405C121.487 18.0434 122.459 18.786 123.845 18.786C125.659 18.786 126.891 17.8731 126.891 15.6819V15.5456C126.891 15.3176 126.584 15.202 126.413 15.35C125.741 15.935 124.756 16.3438 123.577 16.3438C120.352 16.3438 118.426 13.6734 118.426 10.3867C118.426 7.09994 120.352 4.42948 123.577 4.42948C124.739 4.42948 125.735 4.83882 126.412 5.42439C126.583 5.57184 126.891 5.45569 126.891 5.22772V4.89548C126.891 4.76417 126.995 4.65772 127.124 4.65772H129.345C129.474 4.65772 129.578 4.76417 129.578 4.89548V15.4308ZM126.936 10.2725C126.936 8.08139 125.771 6.82604 124.092 6.82604C122.233 6.82604 121.136 8.14986 121.136 10.3867C121.136 12.6006 122.233 13.9473 124.092 13.9473C125.771 13.9473 126.936 12.6919 126.936 10.5464V10.2725Z"
                    fill="currentColor"
                  />
                  <path
                    d="M135.529 16.846C133.29 16.846 131.565 15.4537 131.565 13.3082C131.565 11.0257 133.245 10.0215 135.507 9.54215L138.568 8.89664C138.676 8.8738 138.754 8.77656 138.754 8.66382V8.652C138.754 7.51078 138.171 6.80322 136.738 6.80322C135.544 6.80322 134.879 7.32255 134.542 8.34252C134.502 8.46329 134.38 8.53815 134.259 8.50957L132.189 8.02412C132.057 7.99333 131.978 7.85564 132.023 7.72616C132.671 5.85733 134.359 4.42948 136.85 4.42948C139.672 4.42948 141.374 5.79894 141.374 8.5607V13.719C141.374 14.3159 141.595 14.5486 142.141 14.538C142.281 14.5352 142.404 14.6435 142.404 14.7862V16.4285C142.404 16.5494 142.315 16.6513 142.197 16.6628C140.611 16.8177 139.669 16.5358 139.198 15.8309C139.101 15.6864 138.889 15.6493 138.761 15.7656C138.009 16.4483 136.884 16.846 135.529 16.846ZM138.754 12.418V11.2508C138.754 11.0996 138.617 10.9868 138.472 11.0182L136.223 11.505C135.081 11.7561 134.23 12.1213 134.23 13.1941C134.23 14.1299 134.902 14.6548 135.932 14.6548C137.365 14.6548 138.754 13.8788 138.754 12.418Z"
                    fill="currentColor"
                  />
                  <path
                    d="M146.767 0.252614C146.896 0.252614 147 0.35906 147 0.490368V16.4028C147 16.5341 146.896 16.6405 146.767 16.6405H144.546C144.417 16.6405 144.313 16.5341 144.313 16.4028V0.490368C144.313 0.35906 144.417 0.252614 144.546 0.252614H146.767Z"
                    fill="currentColor"
                  />
                </svg>
              )}

              {/* Collapse/expand button */}
              {!isMobile && (
                <div className="w-14 ml-auto flex items-center justify-center flex-shrink-0">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={onToggle}
                        className="p-1.5 hover:cursor-pointer rounded-full flex items-center justify-center hover:bg-[#F3EFEB]"
                      >
                        <IconLayoutSidebar size={20} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      align="center"
                      hidden={isMobile}
                    >
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
                  <button
                    onClick={() => onShowHome && onShowHome()}
                    className={`w-full flex items-center py-2 rounded-xl hover:bg-[#F3EFEB] transition-colors cursor-pointer ${activeView === "home" ? "bg-[#F3EFEB]" : ""}`}
                  >
                    <div className="w-10 flex items-center justify-center flex-shrink-0">
                      <IconHome size={20} />
                    </div>
                    <span className="text-md whitespace-nowrap overflow-hidden">
                      Home
                    </span>
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  align="center"
                  hidden={isExpanded || isMobile}
                >
                  Home
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onShowFiles && onShowFiles()}
                    className={`w-full flex items-center py-2 rounded-xl hover:bg-[#F3EFEB] transition-colors cursor-pointer ${activeView === "files" ? "bg-[#F3EFEB]" : ""}`}
                  >
                    <div className="w-10 flex items-center justify-center flex-shrink-0">
                      <IconFile size={20} />
                    </div>
                    <span className="text-md whitespace-nowrap overflow-hidden">
                      Files
                    </span>
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  align="center"
                  hidden={isExpanded || isMobile}
                >
                  Files
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onNewChat && onNewChat()}
                    className={`w-full flex items-center py-2 rounded-xl hover:bg-[#F3EFEB] transition-colors cursor-pointer ${activeView === "chat" || activeView === "newChat" ? "bg-[#F3EFEB]" : ""}`}
                  >
                    <div className="w-10 flex items-center justify-center flex-shrink-0">
                      <IconMessageCircle size={20} />
                    </div>
                    <span className="text-md whitespace-nowrap overflow-hidden">
                      New Chat
                    </span>
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  align="center"
                  hidden={isExpanded || isMobile}
                >
                  New Chat
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
                  key={chat.id + chat.title}
                  onClick={() =>
                    onSelectChat && onSelectChat(chat.id, chat.title)
                  }
                  className="relative w-full px-3 p-2 rounded-xl hover:bg-[#F3EFEB] transition-colors text-left group cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4
                      title={chat.title}
                      className="text-md font-medium truncate"
                    >
                      {chat.title}
                    </h4>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-gray-500 truncate">
                      {chat.timestamp}
                    </p>
                  </div>
                  <button
                    onClick={(e) => e.stopPropagation()}
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
              <button
                onClick={() => onInvite?.()}
                className="w-full flex items-center border-t border-gray-200 hover:bg-[#F3EFEB] transition-colors px-3 py-2 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                  <IconUserPlus size={20} />
                </div>
                <span className="text-sm whitespace-nowrap ml-3 overflow-hidden">
                  Invite teammates
                </span>
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              align="center"
              hidden={isExpanded || isMobile}
            >
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
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onShowSettings?.();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#F3EFEB] transition-colors text-left cursor-pointer"
                  >
                    <IconSettings size={20} className="flex-shrink-0" />
                    <span className="text-sm">Settings</span>
                  </button>
                  <button
                    onClick={() => setIsDropdownOpen(false)}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#F3EFEB] transition-colors text-left cursor-pointer"
                  >
                    <IconCreditCard size={20} className="flex-shrink-0" />
                    <span className="text-sm">Billing</span>
                  </button>
                  <button
                    onClick={() => setIsDropdownOpen(false)}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#F3EFEB] transition-colors text-left cursor-pointer"
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
              className="w-full flex items-center hover:bg-[#F3EFEB] transition-colors px-3 py-2 cursor-pointer"
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
