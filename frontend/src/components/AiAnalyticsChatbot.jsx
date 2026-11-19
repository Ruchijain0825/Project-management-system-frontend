
import { useEffect, useRef, useState } from "react";
import {
  Bot,
  X,
  Send,
  Sparkles,
  MessageCircle,
  Loader2,
  Trash2,
  Bug,
  CheckCircle2,
  AlertCircle,
  ListTodo
} from "lucide-react";

import api from "../services/api";

const suggestions = [
  "How many bugs are there?",
  "Which category has the most tickets?",
  "How many critical tickets are pending?",
  "Give me a project summary"
];

const initialMessage = {
  role: "assistant",
  content:
    "Hi! I'm your TaskFlow AI assistant. I can analyze your project tickets, categories, priorities and statuses. What would you like to know?"
};

export default function AIAnalyticsChatbot({ projectId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([initialMessage]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages, loading]);

  const sendMessage = async (text = input) => {
    const question = text.trim();

    if (!question || loading) return;

    if (!projectId) {
      setError("Please select a project first.");
      return;
    }

    setError("");
    setInput("");

    setMessages((prev) => [
      ...prev,
      { role: "user", content: question }
    ]);

    setLoading(true);

    try {
      const { data } = await api.post("/ai/chat", {
        projectId,
        message: question
      });

      if (!data.success) {
        throw new Error(data.message || "Unable to get AI response");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer,
          analytics: data.analytics
        }
      ]);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Something went wrong. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([initialMessage]);
    setError("");
    setInput("");
  };

  const formatAnswer = (answer) =>
    answer.split("\n").map((line, index) => (
      <p key={index} className={line.trim() ? "mb-2 last:mb-0" : "h-2"}>
        {line}
      </p>
    ));

  return (
    <>
      {/* Floating chatbot button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xl shadow-indigo-900/30 transition hover:scale-105 hover:bg-indigo-500"
          aria-label="Open TaskFlow AI"
          title="TaskFlow AI Assistant"
        >
          <MessageCircle size={25} />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 rounded-full border-2 border-slate-950 bg-emerald-400" />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 z-50 flex h-[min(680px,85vh)] w-[min(410px,calc(100vw-24px))] flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl shadow-black/50">

          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-gradient-to-r from-indigo-700 to-violet-700 px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                <Bot size={23} className="text-white" />
              </div>

              <div>
                <h3 className="font-semibold text-white">
                  TaskFlow AI
                </h3>
                <p className="flex items-center gap-1 text-xs text-indigo-100">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Project Analytics Assistant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={clearChat}
                disabled={loading}
                title="Clear conversation"
                className="rounded-lg p-2 text-white/80 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
              >
                <Trash2 size={17} />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                title="Close chatbot"
                className="rounded-lg p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                <X size={19} />
              </button>
            </div>
          </div>

          {/* Project context */}
          <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-900/80 px-4 py-2.5 text-xs text-slate-400">
            <Sparkles size={14} className="text-indigo-400" />
            Analyzing selected project tickets
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto bg-slate-950 p-4">

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-2 ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400">
                    <Bot size={17} />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-3 text-sm leading-6 ${
                    message.role === "user"
                      ? "rounded-br-sm bg-indigo-600 text-white"
                      : "rounded-bl-sm border border-slate-800 bg-slate-900 text-slate-200"
                  }`}
                >
                  {message.role === "assistant"
                    ? formatAnswer(message.content)
                    : message.content}

                  {/* Analytics cards */}
                  {message.analytics && (
                    <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-700 pt-3">
                      <div className="rounded-lg bg-slate-800 p-2">
                        <p className="text-xs text-slate-400">Total tickets</p>
                        <p className="text-lg font-bold text-white">
                          {message.analytics.totalTickets}
                        </p>
                      </div>

                      <div className="rounded-lg bg-slate-800 p-2">
                        <p className="text-xs text-slate-400">Pending</p>
                        <p className="text-lg font-bold text-amber-400">
                          {message.analytics.pendingTickets}
                        </p>
                      </div>

                      {Object.entries(message.analytics.categories || {}).map(
                        ([name, count]) => (
                          <div
                            key={name}
                            className="rounded-lg bg-slate-800 p-2"
                          >
                            <p className="text-xs text-slate-400">{name}</p>
                            <p className="font-semibold text-white">{count}</p>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400">
                  <Bot size={17} />
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-400">
                  <Loader2 size={15} className="animate-spin" />
                  Analyzing your tickets...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested questions */}
          {messages.length === 1 && (
            <div className="border-t border-slate-800 bg-slate-900/60 px-4 py-3">
              <p className="mb-2 text-xs font-medium text-slate-400">
                TRY ASKING
              </p>

              <div className="flex flex-wrap gap-2">
                {suggestions.map((question) => (
                  <button
                    key={question}
                    disabled={loading || !projectId}
                    onClick={() => sendMessage(question)}
                    className="rounded-full border border-slate-700 px-3 py-1.5 text-left text-xs text-slate-300 transition hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-indigo-300 disabled:opacity-40"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mx-4 mt-2 flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300">
              <AlertCircle size={15} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="border-t border-slate-800 bg-slate-900 p-3"
          >
            <div className="flex items-end gap-2 rounded-xl border border-slate-700 bg-slate-950 p-2 focus-within:border-indigo-500">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder={
                  projectId
                    ? "Ask about your project tickets..."
                    : "Select a project first..."
                }
                disabled={!projectId || loading}
                rows={1}
                maxLength={1000}
                className="max-h-24 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-slate-500 disabled:cursor-not-allowed"
              />

              <button
                type="submit"
                disabled={!input.trim() || loading || !projectId}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Send message"
              >
                {loading ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : (
                  <Send size={17} />
                )}
              </button>
            </div>

            <p className="mt-2 text-center text-[10px] text-slate-500">
              AI answers are based on your selected project's database statistics.
            </p>
          </form>
        </div>
      )}
    </>
  );
}
