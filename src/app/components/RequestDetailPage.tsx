import React, { useState } from "react";
import {
  IconDownload,
  IconChevronDown,
  IconChevronRight,
  IconSend,
  IconX,
  IconPencil,
  IconCheck,
  IconFileTypeDocx,
  IconAlertCircle,
  IconArrowLeft,
  IconUpload,
} from "@tabler/icons-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type RequestStatus = "in-progress" | "waiting" | "completed";

interface Version {
  label: string;
  uploadedBy: string;
  date: string;
  isLatest?: boolean;
}

interface Message {
  id: string;
  sender: "user" | "firm";
  senderName: string;
  time: string;
  text: string;
}

interface Request {
  id: string;
  title: string;
  type: string;
  status: RequestStatus;
  requestedBy: string;
  requestedDate: string;
  lastUpdate: string;
  versions: Version[];
  messages: Message[];
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const mockRequest: Request = {
  id: "1",
  title: "Vendor MSA Review",
  type: "Contract review",
  status: "waiting",
  requestedBy: "Kevin",
  requestedDate: "Mar 20",
  lastUpdate: "2h ago",
  versions: [
    {
      label: "V3",
      uploadedBy: "General Legal",
      date: "Today 1:42 PM",
      isLatest: true,
    },
    { label: "V2", uploadedBy: "Kevin Chang", date: "Mar 22" },
    { label: "V1", uploadedBy: "Kevin Chang", date: "Mar 20" },
  ],
  messages: [
    {
      id: "1",
      sender: "user",
      senderName: "Kevin",
      time: "Mar 20, 9:10 AM",
      text: "Hi, can you review this MSA? We need it signed by end of month.",
    },
    {
      id: "2",
      sender: "firm",
      senderName: "Sarah Chen",
      time: "Mar 20, 10:30 AM",
      text: "Got it, we'll take a look and come back with any redlines.",
    },
    {
      id: "3",
      sender: "firm",
      senderName: "Sarah Chen",
      time: "Today, 1:42 PM",
      text: "We've uploaded a revised version. Key changes: reduced liability cap from $500K to $250K, clarified IP ownership. Please review and let us know if you'd like any further changes.",
    },
  ],
};

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: RequestStatus }) {
  if (status === "waiting")
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-700">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        Waiting on you
      </span>
    );
  if (status === "in-progress")
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-700">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
        In progress
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 border border-green-200 text-xs font-semibold text-green-700">
      <IconCheck size={12} strokeWidth={2.5} />
      Completed
    </span>
  );
}

// ─── Action Banner ────────────────────────────────────────────────────────────

function ActionBanner({
  status,
  onApprove,
  onRequestChanges,
  onAskQuestion,
  onNewRequest,
  onReopen,
}: {
  status: RequestStatus;
  onApprove: () => void;
  onRequestChanges: () => void;
  onAskQuestion: () => void;
  onNewRequest: () => void;
  onReopen: () => void;
}) {
  if (status === "waiting") {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-5 flex items-start justify-between gap-6">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <IconAlertCircle size={18} className="text-amber-600" />
          </div>
          <div>
            <div className="text-sm font-semibold text-amber-900 mb-0.5">
              Your legal team left an update
            </div>
            <div className="text-sm text-amber-700">
              They uploaded a revised document and need your input.
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onRequestChanges}
            className="px-3 py-2 rounded-xl border border-amber-200 text-sm text-amber-700 hover:bg-amber-100 transition-colors cursor-pointer"
          >
            Reject
          </button>
          <button
            onClick={onApprove}
            className="px-4 py-2 rounded-xl bg-amber-600 text-white text-sm font-medium hover:bg-amber-700 transition-colors cursor-pointer"
          >
            Approve
          </button>
        </div>
      </div>
    );
  }
  if (status === "completed") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl px-6 py-5 flex items-start justify-between gap-6">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <IconCheck size={18} className="text-green-600" strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-sm font-semibold text-green-900 mb-0.5">
              This request is complete 🎉
            </div>
            <div className="text-sm text-green-700">
              You approved this version. Your legal team has been notified.
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onReopen}
            className="px-3 py-2 rounded-xl border border-green-200 text-sm text-green-700 hover:bg-green-100 transition-colors cursor-pointer"
          >
            Reopen request
          </button>
          <button
            onClick={onNewRequest}
            className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors cursor-pointer"
          >
            Start a new request
          </button>
        </div>
      </div>
    );
  }
  // in-progress — no banner
  return null;
}

// ─── Version History ──────────────────────────────────────────────────────────

function VersionHistory({ versions }: { versions: Version[] }) {
  const [open, setOpen] = useState(false);
  const older = versions.slice(1);
  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer mt-3"
      >
        {open ? <IconChevronDown size={13} /> : <IconChevronRight size={13} />}
        Version history ({older.length} older{" "}
        {older.length === 1 ? "version" : "versions"})
      </button>
      {open && (
        <div className="mt-2 space-y-1.5 pl-2 border-l-2 border-gray-100 ml-1">
          {older.map((v) => (
            <div
              key={v.label}
              className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div>
                <span className="text-xs font-semibold text-gray-700 font-mono mr-2">
                  {v.label}
                </span>
                <span className="text-xs text-gray-400">
                  Uploaded by {v.uploadedBy} · {v.date}
                </span>
              </div>
              <button className="text-xs text-gray-400 hover:text-gray-700 inline-flex items-center gap-1 cursor-pointer">
                <IconDownload size={12} />
                Download
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Chat Panel ───────────────────────────────────────────────────────────────

function ConversationPanel({ messages }: { messages: Message[] }) {
  const [input, setInput] = useState("");

  return (
    <div className="flex flex-col h-full border border-gray-200 rounded-2xl overflow-hidden">
      <div className="flex-shrink-0 px-4 py-3 border-b border-gray-100 bg-gray-50">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Conversation
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.map((msg, i) => {
          const isUser = msg.sender === "user";
          return (
            <div
              key={msg.id}
              className={`px-4 py-4 ${i < messages.length - 1 ? "border-b border-gray-50" : ""}`}
            >
              <div className="flex items-start gap-2.5">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                    isUser
                      ? "bg-gray-200 text-gray-700"
                      : "bg-gray-900 text-white"
                  }`}
                >
                  {msg.senderName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-gray-900">
                      {msg.senderName}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {msg.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {msg.text}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="flex-shrink-0 border-t border-gray-100 p-3">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && input.trim()) setInput("");
            }}
            placeholder="Message General Legal AI…"
            className="flex-1 text-sm text-gray-700 placeholder-gray-400 bg-transparent focus:outline-none"
          />
          <button
            onClick={() => setInput("")}
            className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer flex-shrink-0"
          >
            <IconSend size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Side Sheet ───────────────────────────────────────────────────────────────

interface RequestSideSheetProps {
  open: boolean;
  onClose: () => void;
  onNewRequest: () => void;
}

export function RequestSideSheet({
  open,
  onClose,
  onNewRequest,
}: RequestSideSheetProps) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [open]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[55] bg-black/20 transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleClose}
      />
      {/* Sheet */}
      <div
        className={`fixed top-0 right-0 h-full z-[60] w-[820px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <RequestDetailContent
          onClose={handleClose}
          onNewRequest={() => {
            handleClose();
            onNewRequest();
          }}
        />
      </div>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

interface RequestDetailPageProps {
  onBack: () => void;
  onNewRequest: () => void;
}

export function RequestDetailPage({
  onBack,
  onNewRequest,
}: RequestDetailPageProps) {
  return (
    <RequestDetailContent
      onClose={onBack}
      onNewRequest={() => {
        onBack();
        onNewRequest();
      }}
      showBackButton
    />
  );
}

// ─── Shared Detail Content ────────────────────────────────────────────────────

interface RequestDetailContentProps {
  onClose: () => void;
  onNewRequest: () => void;
  showBackButton?: boolean;
}

function RequestDetailContent({
  onClose,
  onNewRequest,
  showBackButton = false,
}: RequestDetailContentProps) {
  const [request, setRequest] = useState<Request>(mockRequest);
  const [requestChangesOpen, setRequestChangesOpen] = useState(false);
  const [changesText, setChangesText] = useState("");

  const handleApprove = () => {
    setRequest((r) => ({ ...r, status: "completed" }));
  };

  const handleReopen = () => {
    setRequest((r) => ({ ...r, status: "waiting" }));
  };

  const latest = request.versions[0];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Request changes modal */}
      {requestChangesOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setRequestChangesOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">
                Request changes
              </h2>
              <button
                onClick={() => setRequestChangesOpen(false)}
                className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center cursor-pointer"
              >
                <IconPencil size={15} className="text-gray-500" />
              </button>
            </div>
            <textarea
              value={changesText}
              onChange={(e) => setChangesText(e.target.value)}
              rows={4}
              autoFocus
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-gray-200 transition mb-4"
              placeholder="Describe the changes you'd like…"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRequestChangesOpen(false)}
                className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={!changesText.trim()}
                onClick={() => {
                  setRequest((r) => ({ ...r, status: "in-progress" }));
                  setRequestChangesOpen(false);
                  setChangesText("");
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  changesText.trim()
                    ? "bg-gray-900 text-white hover:bg-gray-700 cursor-pointer"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Send request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex-shrink-0 border-b border-gray-200 px-6 py-5">
        {showBackButton && (
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors cursor-pointer mb-3"
          >
            <IconArrowLeft size={15} />
            Requests
          </button>
        )}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <h1 className="text-lg font-semibold text-gray-900">
                {request.title}
              </h1>
              <StatusBadge status={request.status} />
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span>
                Requested by {request.requestedBy} · {request.requestedDate}
              </span>
              <span>·</span>
              <span>Last update {request.lastUpdate}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {!showBackButton && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                <IconX size={16} className="text-gray-500" />
              </button>
            )}
          </div>
        </div>

        {/* Quick actions row */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRequestChangesOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <IconUpload size={16} />
            Upload new version
          </button>
          <button
            onClick={() => setRequestChangesOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <IconPencil size={16} className="text-orange-500" />
            Request changes
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
            <IconSend size={16} className="text-blue-500" />
            Ask a question
          </button>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-6 space-y-5">
          {/* Action banner */}
          <ActionBanner
            status={request.status}
            onApprove={handleApprove}
            onRequestChanges={() => setRequestChangesOpen(true)}
            onAskQuestion={() => {}}
            onNewRequest={onNewRequest}
            onReopen={handleReopen}
          />

          {/* Files */}
          <div className="space-y-4">
            <div id="latest-version">
              <div className="border border-gray-200 rounded-2xl p-5 bg-white">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <IconFileTypeDocx size={22} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="font-mono text-xs font-semibold text-gray-600 border border-gray-300 rounded px-1.5 py-0.5 flex-shrink-0">
                        {latest.label}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        Master Service Agreement
                      </span>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider bg-blue-50 text-blue-600 border border-blue-200 flex-shrink-0">
                        LATEST
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Uploaded by {latest.uploadedBy} · {latest.date}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer inline-flex items-center gap-1.5">
                      <IconDownload size={13} />
                      Download
                    </button>
                    <button className="px-4 py-1.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors cursor-pointer">
                      Open
                    </button>
                  </div>
                </div>
                <VersionHistory versions={request.versions} />
              </div>
            </div>
          </div>

          {/* Conversation — full width */}
          <div style={{ height: "360px" }}>
            <ConversationPanel messages={request.messages} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestDetailPage;
