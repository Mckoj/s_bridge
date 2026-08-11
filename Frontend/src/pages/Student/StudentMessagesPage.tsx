import React, { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useDashboard } from "../../context/DashboardContext";
import { useConversations } from "../../hooks/useConversations";
import {
  MessageSquare,
  Search,
  Send,
  Sparkles,
} from "lucide-react";

function useTheme() {
  return useDashboard().theme === "dark";
}

export default function StudentMessagesPage() {
  const dark = useTheme();
  const { searchQuery } = useDashboard();
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

  const searchTerm = (localSearch || searchQuery).toLowerCase();

  const filteredConversations = conversations.filter(
    (c) =>
      !searchTerm ||
      c.partner.name.toLowerCase().includes(searchTerm) ||
      c.partner.role.toLowerCase().includes(searchTerm) ||
      c.lastMessage.toLowerCase().includes(searchTerm)
  );

  const activeConv = conversations.find((c) => c.id === activeConvId);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div
          className={`relative overflow-hidden rounded-[28px] border p-6 ${
            dark
              ? "bg-slate-900/70 border-slate-800/80"
              : "bg-white/80 border-slate-200/80 shadow-xs"
          }`}
        >
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold bg-indigo-500/10 border-indigo-500/20 text-indigo-400">
            <Sparkles size={13} />
            Communication Hub
          </div>
          <h1
            className={`mt-2 text-2xl md:text-3xl font-extrabold tracking-tight ${
              dark ? "text-white" : "text-slate-800"
            }`}
          >
            Messages & Inquiries
          </h1>
          <p
            className={`mt-1 text-xs md:text-sm font-medium ${
              dark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Direct messaging channel with your assigned host supervisor and university coordinator.
          </p>
        </div>

        {/* Messaging Interface */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        ) : conversations.length === 0 ? (
          <div
            className={`rounded-[24px] border p-12 text-center flex flex-col items-center justify-center ${
              dark
                ? "bg-slate-900/40 border-slate-800/80"
                : "bg-white border-slate-200 shadow-xs"
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
              <MessageSquare size={32} />
            </div>
            <h3
              className={`text-lg font-bold ${
                dark ? "text-white" : "text-slate-800"
              }`}
            >
              No Active Conversations
            </h3>
            <p
              className={`text-xs max-w-sm mt-1 mb-2 leading-relaxed ${
                dark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Messaging threads will automatically activate once an industrial attachment or university liaison supervisor connects with your profile.
            </p>
          </div>
        ) : (
          <div
            className={`rounded-[28px] border overflow-hidden grid grid-cols-1 md:grid-cols-3 min-h-[550px] ${
              dark
                ? "bg-slate-900/70 border-slate-800/80"
                : "bg-white border-slate-200 shadow-xs"
            }`}
          >
            {/* Contacts Sidebar */}
            <div
              className={`border-b md:border-b-0 md:border-r p-4 flex flex-col ${
                dark ? "border-slate-800/80 bg-slate-950/40" : "border-slate-100 bg-slate-50/50"
              }`}
            >
              <div className="relative mb-4">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border outline-none ${
                    dark
                      ? "bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-indigo-500"
                      : "bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-500"
                  }`}
                />
              </div>

              <div className="space-y-1 overflow-y-auto flex-1">
                {filteredConversations.map((conv) => {
                  const isSelected = conv.id === activeConvId;
                  return (
                    <button
                      key={conv.id}
                      onClick={() => setActiveConvId(conv.id)}
                      className={`w-full p-3 rounded-2xl text-left transition-all flex items-start gap-3 cursor-pointer ${
                        isSelected
                          ? dark
                            ? "bg-indigo-600/15 border border-indigo-500/30 text-white"
                            : "bg-indigo-50 border border-indigo-200 text-slate-900"
                          : dark
                          ? "hover:bg-slate-800/60 text-slate-300"
                          : "hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-full font-bold text-white flex items-center justify-center shrink-0 bg-indigo-600"
                      >
                        {conv.partner.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold truncate">
                            {conv.partner.name}
                          </h4>
                          {conv.unreadCount > 0 && (
                            <span className="bg-indigo-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-indigo-400 font-semibold mt-0.5">
                          {conv.partner.role}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate mt-1">
                          {conv.lastMessage}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chat Thread Panel */}
            <div className="md:col-span-2 flex flex-col h-full">
              {activeConv ? (
                <>
                  {/* Chat Header */}
                  <div
                    className={`p-4 border-b flex items-center gap-3 ${
                      dark ? "border-slate-800/80 bg-slate-900/60" : "border-slate-100 bg-white"
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-full font-bold text-white flex items-center justify-center shrink-0 bg-indigo-600"
                    >
                      {activeConv.partner.avatar}
                    </div>
                    <div>
                      <h3
                        className={`text-sm font-bold ${
                          dark ? "text-white" : "text-slate-800"
                        }`}
                      >
                        {activeConv.partner.name}
                      </h3>
                      <p className="text-xs font-medium text-indigo-400">
                        {activeConv.partner.role}
                      </p>
                    </div>
                  </div>

                  {/* Message Stream */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[400px]">
                    {messages.length === 0 ? (
                      <div className="text-center py-12 text-xs text-slate-500">
                        This is the beginning of your conversation with {activeConv.partner.name}.
                      </div>
                    ) : (
                      messages.map((msg) => {
                        return (
                          <div
                            key={msg.id}
                            className={`flex flex-col ${msg.isMe ? "items-end" : "items-start"}`}
                          >
                            <div
                              className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                                msg.isMe
                                  ? "bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-500/10"
                                  : dark
                                  ? "bg-slate-800 text-slate-200 rounded-bl-none"
                                  : "bg-slate-100 text-slate-800 rounded-bl-none"
                              }`}
                            >
                              {msg.content}
                            </div>
                            <span className="text-[9px] text-slate-500 mt-1 px-1">
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Input Box */}
                  <form
                    onSubmit={handleSendMessage}
                    className={`p-4 border-t flex items-center gap-3 ${
                      dark ? "border-slate-800/80 bg-slate-900/60" : "border-slate-100 bg-white"
                    }`}
                  >
                    <input
                      type="text"
                      placeholder={`Message ${activeConv.partner.name}...`}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className={`flex-1 px-4 py-2.5 text-xs rounded-xl border outline-none ${
                        dark
                          ? "bg-slate-950/70 border-slate-800 text-white focus:border-indigo-500"
                          : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500"
                      }`}
                    />
                    <button
                      type="submit"
                      disabled={!inputText.trim()}
                      className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
                    >
                      <Send size={16} />
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-xs text-slate-500">
                  Select a contact to view your conversation.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

