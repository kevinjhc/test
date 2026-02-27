import {
  IconUpload,
  IconFileTypeDocx,
  IconChevronRight,
  IconFile,
  IconCalendar,
  IconArrowBackUp,
  IconProgress,
  IconDownload,
  IconChevronDown,
} from "@tabler/icons-react";
import { useState } from "react";

interface Contract {
  id: string;
  name: string;
  version: string;
  status: "In Review" | "Awaiting Review" | "Completed";
  lastUpdated: string;
  submitted: string;
}

interface ContractsContentProps {
  contracts: Contract[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const filters = [
  "All",
  "Awaiting Review",
  "In Review",
  "Completed",
  "Uploaded via Chat",
];

export function ContractsContent({
  contracts,
  activeFilter,
  onFilterChange,
}: ContractsContentProps) {
  const [openContractId, setOpenContractId] = useState<string | null>(null);

  const toggleOpen = (id: string) => {
    setOpenContractId((prev) => (prev === id ? null : id));
  };

  const getPreviousVersions = (contract: Contract) => {
    // simple mock previous versions
    return [
      {
        version: "V3",
        status: "Completed",
        submitted: contract.submitted || "3 months ago",
        lastUpdated: contract.lastUpdated || "2 months ago",
      },
      {
        version: "V2",
        status: "In Review",
        submitted: contract.submitted || "2 months ago",
        lastUpdated: contract.lastUpdated || "1 month ago",
      },
    ];
  };

  const statusClass = (status: string) => {
    switch (status) {
      case "Completed":
        return "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-sm text-green-700 whitespace-nowrap";
      case "In Review":
        return "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-sm text-amber-700 whitespace-nowrap";
      case "Awaiting Review":
        return "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-yellow-50 border border-yellow-200 text-sm text-yellow-700 whitespace-nowrap";
      default:
        return "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gray-50 border border-gray-200 text-sm text-gray-700 whitespace-nowrap";
    }
  };
  return (
    <div className="h-full overflow-y-scroll pb-8">
      {/* Header section */}
      <div className="p-5 md:p-6 py-4 md:py-8 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl md:text-3xl font-semibold">Files</h1>
          <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full hover:bg-gray-600 transition-colors text-md cursor-pointer">
            <IconUpload size={20} />
            Upload file
          </button>
        </div>
        <p className="text-md text-gray-600 hidden md:block">
          View and track all of the contracts that General Legal manages on your
          behalf
        </p>
      </div>

      {/* Filter tabs */}
      <div className="px-5 md:px-6 pb-5 md:pb-8 max-w-5xl mx-auto">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={`
                px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors border border-gray-200 cursor-pointer
                ${
                  activeFilter === filter
                    ? "bg-black text-white"
                    : " text-gray-900 hover:bg-gray-50"
                }
              `}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop table view */}
      <div className="hidden md:block px-6 max-w-5xl mx-auto">
        <div className="overflow-hidden">
          {/* Table header + rows share the same grid template */}
          <div className="grid grid-cols-[1fr_100px_130px_150px_150px_56px]">
            {/* Header */}
            <div className="contents">
              <div className="flex items-center gap-2 text-sm text-gray-600 pr-4 py-2 border-b border-gray-200">
                <IconFile size={16} />
                Contract Name
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 px-4 py-2 border-b border-gray-200">
                <IconArrowBackUp size={16} />
                Version
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 px-4 py-2 border-b border-gray-200">
                <IconProgress size={16} />
                Status
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 px-4 py-2 border-b border-gray-200">
                <IconCalendar size={16} />
                Submitted
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 px-4 py-2 border-b border-gray-200">
                <IconCalendar size={16} />
                Last Updated
              </div>
              <div className="px-4 py-2 border-b border-gray-200"></div>
            </div>

            {/* Rows */}
            {contracts.map((contract) => {
              const isOpen = openContractId === contract.id;
              const rowBorderClass = isOpen ? "border-b-0" : "border-b border-gray-200";

              return (
                <div key={contract.id} className="contents group">
                  <div onClick={() => toggleOpen(contract.id)} className={`flex items-center gap-4 pr-4 py-4 ${rowBorderClass} group-hover:bg-gray-50 transition-colors cursor-pointer self-center`}>
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <IconFileTypeDocx size={20} className="text-blue-500" />
                    </div>
                    <span className="text-md line-clamp-2">{contract.name}</span>
                  </div>
                  <div onClick={() => toggleOpen(contract.id)} className={`flex items-center px-4 py-4 ${rowBorderClass} group-hover:bg-gray-50 transition-colors cursor-pointer`}>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full border border-gray-300 text-xs text-gray-600 whitespace-nowrap font-mono">
                      {contract.version}
                    </span>
                  </div>
                  <div onClick={() => toggleOpen(contract.id)} className={`flex items-center px-4 py-4 ${rowBorderClass} group-hover:bg-gray-50 transition-colors cursor-pointer`}>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-sm text-green-700 whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"></span>
                      {contract.status}
                    </span>
                  </div>
                  <div onClick={() => toggleOpen(contract.id)} className={`flex items-center text-md text-gray-600 px-4 py-4 ${rowBorderClass} group-hover:bg-gray-50 transition-colors cursor-pointer`}>
                    {contract.submitted}
                  </div>
                  <div onClick={() => toggleOpen(contract.id)} className={`flex items-center text-md text-gray-600 px-4 py-4 ${rowBorderClass} group-hover:bg-gray-50 transition-colors cursor-pointer`}>
                    {contract.lastUpdated}
                  </div>
                  <div className={`flex items-center px-4 py-4 ${rowBorderClass} group-hover:bg-gray-50 transition-colors cursor-pointer`}>
                    <button onClick={() => toggleOpen(contract.id)} className="w-6 h-6 flex items-center justify-center cursor-pointer">
                      {isOpen ? <IconChevronDown size={18} /> : <IconChevronRight size={20} />}
                    </button>
                  </div>

                  {isOpen && (
                    <div className="contents bg-gray-50">
                      <div className="col-span-full">
                        <div className="max-w-5xl mx-auto">
                          <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <h4 className="text-sm font-medium mb-3">Previous versions</h4>
                            <div className="space-y-4">
                              {getPreviousVersions(contract).map((v) => (
                                <div key={v.version} className="flex items-center justify-between gap-4 p-4 border rounded-md">
                                  <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                      <span className="inline-flex items-center px-2.5 py-1 rounded-full border border-gray-300 text-xs text-gray-600 whitespace-nowrap font-mono">{v.version}</span>
                                      <span className={statusClass(v.status)}>{v.status}</span>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">Submitted {v.submitted} • Updated {v.lastUpdated}</div>
                                  </div>
                                  <a href="#" download className="text-gray-600 hover:text-gray-800">
                                    <IconDownload />
                                  </a>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile card view */}
      <div className="md:hidden px-5 md:px-6">
        <div className="space-y-4">
          {contracts.map((contract) => {
            const isOpen = openContractId === contract.id;
            return (
              <div key={contract.id} className="">
                <div
                  onClick={() => toggleOpen(contract.id)}
                  className={`bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer ${isOpen ? "ring-1 ring-gray-200" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <IconFileTypeDocx size={20} className="text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-md line-clamp-2 mb-2">{contract.name}</div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-sm text-green-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"></span>
                          {contract.status}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full border border-gray-300 text-xs text-gray-600 font-mono">
                          {contract.version}
                        </span>
                      </div>
                      <div className="flex flex-col text-sm gap-1 text-gray-600">
                        <div className="flex items-center gap-2">
                          <IconCalendar size={16} />
                          <span>Last updated {contract.lastUpdated}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <IconCalendar size={16} />
                          <span>Submitted {contract.submitted}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <IconChevronRight size={20} className={`text-gray-400 flex-shrink-0 transform transition-transform ${isOpen ? "rotate-90" : ""}`} />
                    </div>
                  </div>
                </div>

                {isOpen && (
                  <div className="mt-3 max-w-full">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="text-sm font-medium mb-3">Previous versions</h4>
                      <div className="space-y-2">
                        {getPreviousVersions(contract).map((v) => (
                          <div key={v.version} className="flex items-center justify-between gap-4 px-3 py-2 border rounded-md">
                            <div className="flex flex-col">
                              <div className="flex items-center gap-4">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full border border-gray-300 text-xs text-gray-600 whitespace-nowrap font-mono">{v.version}</span>
                                <span className={statusClass(v.status)}>{v.status}</span>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">Submitted {v.submitted} • Updated {v.lastUpdated}</div>
                            </div>
                            <a href="#" download className="text-gray-600 hover:text-gray-800">
                              <IconDownload />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
