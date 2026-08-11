import React, { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { PageHeader, EmptyState } from "../../components/recruiter";
import { useConversations } from "../../hooks/useConversations";
import { useDashboard } from "../../context/DashboardContext";
import { MessageSquare, Search, Send } from "lucide-react";

export default function RecruiterMessagesPage() {
  const { theme } = useDashboard();
  const dark = theme === "dark";
  const [inputText, setInputText] = useState("");
  const [localSearch, setLocalSearch] = useState("");

  const {
    conversations,
    activeConvId,
    setActiveConvId,
    messages,
    loading,
    sendMessage,
  } = useConversations();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConvId) return;

    const text = inputText.trim();
    setInputText("");
    try {
      await sendMessage(text);
    } catch {
      // Failed to send
    }
  };

  const filteredConversations = conversations.filter(
    (c) =>
      !localSearch ||
      c.partner.name.toLowerCase().includes(localSearch.toLowerCase()) ||
      c.partner.role.toLowerCase().includes(localSearch.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(localSearch.toLowerCase())
  );

  const activeConv = conversations.find((c) => c.id === activeConvId);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        <PageHeader
          badge="Communications"
          title="Direct Candidate & Liaison Messaging"
          description="Communicate directly with student applicants, intern candidates, and university placement coordinators."
        />

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        ) : conversations.length === 0 ? (
          <div
            className={`rounded-3xl border p-12 text-center shadow-xl ${
              dark ? "bg-slate-900/80 border-slate-800" : "bg-white border-emerald-200/80"
            }`}
          >
            <EmptyState
              icon={<MessageSquare size={32} className="text-emerald-500" />}
              title="No Active Direct Messages"
              description="Direct message conversations will be created when candidates contact your job listings or university officers initiate communication."
            />
          </div>
        ) : (
          <div
            className={`rounded-3xl border overflow-hidden shadow-xl grid grid-cols-1 md:grid-cols-3 h-[580px] ${
              dark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"
            }`}
          >
            {/* Sidebar */}
            <div
              className={`border-r p-4 space-y-4 flex flex-col ${
                dark ? "border-slate-800 bg-slate-950/40" : "border-slate-100 bg-slate-50/60"
              }`}
            >
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border outline-none ${
                    dark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200"
                  }`}
                />
              </div>

              <div className="space-y-1 overflow-y-auto flex-1">
                {filteredConversations.map((conv) => {
                  const isSelected = conv.id === activeConvId;
                  return (
                    <div
                      key={conv.id}
                      onClick={() => setActiveConvId(conv.id)}
                      className={`p-3 rounded-2xl cursor-pointer flex items-center gap-3 transition-all ${
                        isSelected
                          ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                          : dark
                          ? "hover:bg-slate-800/60 text-slate-300"
                          : "hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center ${
                          isSelected ? "bg-white/20 text-white" : "bg-emerald-500/20 text-emerald-400"
                        }`}
                      >
                        {conv.partner.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold truncate">{conv.partner.name}</p>
                          {conv.unreadCount > 0 && (
                            <span className="bg-emerald-400 text-slate-950 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-[10px] truncate ${
                            isSelected ? "text-emerald-100" : "text-slate-400"
                          }`}
                        >
                          {conv.partner.role}
                        </p>
                        <p
                          className={`text-[11px] truncate mt-0.5 ${
                            isSelected ? "text-white/80" : "text-slate-400"
                          }`}
                        >
                          {conv.lastMessage}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chat Thread */}
            <div className="md:col-span-2 flex flex-col justify-between p-6">
              {activeConv ? (
                <>
                  <div className="pb-4 border-b border-slate-800/40 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm">{activeConv.partner.name}</h3>
                      <p className="text-[11px] text-emerald-400 font-semibold">{activeConv.partner.role}</p>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto py-4 space-y-4 max-h-[400px]">
                    {messages.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-10">Beginning of conversation with {activeConv.partner.name}.</p>
                    ) : (
                      messages.map((m) => (
                        <div key={m.id} className={`flex flex-col ${m.isMe ? "items-end" : "items-start"}`}>
                          <div
                            className={`max-w-md p-3.5 rounded-2xl text-xs ${
                              m.isMe
                                ? "bg-emerald-600 text-white rounded-br-none shadow-md"
                                : dark
                                ? "bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700/60"
                                : "bg-slate-100 text-slate-800 rounded-bl-none"
                            }`}
                          >
                            <p>{m.content}</p>
                          </div>
                          <span className="text-[9px] text-slate-500 mt-1 px-1">
                            {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>

                  <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-800/40 flex gap-2">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder={`Type a message to ${activeConv.partner.name}...`}
                      className={`flex-1 px-4 py-2.5 text-xs rounded-xl border outline-none ${
                        dark ? "bg-slate-950/60 border-slate-800 text-white" : "bg-slate-50 border-slate-200"
                      }`}
                    />
                    <button
                      type="submit"
                      disabled={!inputText.trim()}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 flex items-center gap-1 cursor-pointer"
                    >
                      <Send size={14} /> Send
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-xs text-slate-500">
                  Select a conversation thread to start messaging.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

