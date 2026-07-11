"use client";

import { useEffect, useRef, useState } from "react";
import { ShieldCheck, ShieldAlert, Bot, User, Code, FileText, HelpCircle, X, AlertTriangle } from "lucide-react";
import { useChat, type Message, type BlockedInfo } from "@/lib/chat";
import { PromptInput } from "@/components/chat/prompt-input";

const SUGGESTIONS = [
  { icon: ShieldAlert, label: "Explain SQL Injection" },
  { icon: Code, label: "Write a Python script" },
  { icon: HelpCircle, label: "What is Prompt Injection?" },
  { icon: FileText, label: "Summarize this document" },
];

function ChatHeader() {
  return (
    <div className="flex items-center justify-between border-b border-border px-6 py-4">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-primary" />
        <span className="text-base font-medium text-foreground">AI Security Gateway</span>
        <span className="ml-2 rounded-full border border-border bg-card px-2.5 py-0.5 text-xs text-muted-foreground">
          Protected by Felix Warano
        </span>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
        Gateway online
      </div>
    </div>
  );
}

function ChatEmptyState({ onSuggestionClick }: { onSuggestionClick: (prompt: string) => void }) {
  return (
    <div className="flex min-h-0 flex-1 animate-in fade-in flex-col items-center justify-center overflow-y-auto px-6 text-center duration-300">
      <div className="mx-auto w-full max-w-2xl">
      <h1 className="text-2xl font-medium text-foreground">AI Security Gateway</h1>
      <p className="mt-2 text-sm text-muted-foreground">All prompts are analyzed before reaching the AI.</p>
      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {SUGGESTIONS.map(({ icon: Icon, label }) => (
          <button
            key={label}
            onClick={() => onSuggestionClick(label)}
            className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left text-sm text-foreground transition-colors hover:border-border-strong hover:bg-card-elevated"
          >
            <Icon className="h-4 w-4 text-muted-foreground" />
            {label}
          </button>
        ))}
      </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser ? "bg-primary/20 text-primary" : "bg-card-elevated text-muted-foreground"
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div className={`flex max-w-[75%] flex-col ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
            isUser
              ? "rounded-tr-sm bg-primary text-primary-foreground"
              : "rounded-tl-sm border border-border bg-card text-foreground"
          }`}
        >
          {message.content}
        </div>
        <span className="mt-1 px-1 text-xs text-muted-foreground">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-card-elevated text-muted-foreground">
        <Bot className="h-4 w-4" />
      </div>
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

function SecurityAlertCard({ info, onDismiss }: { info: BlockedInfo; onDismiss: () => void }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 rounded-xl border border-destructive/40 bg-destructive/10 p-4 duration-200">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 text-destructive">
          <ShieldAlert className="h-5 w-5" />
          <span className="text-sm font-medium">Prompt blocked by Security Gateway</span>
        </div>
        <button onClick={onDismiss} className="text-muted-foreground transition-colors hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>
      <p className="mt-2 text-sm text-foreground">{info.message}</p>
      <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
        <div>
          <p className="text-muted-foreground">Category</p>
          <p className="mt-0.5 font-medium text-foreground">{info.category}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Risk score</p>
          <p className="mt-0.5 font-medium text-destructive">{info.riskScore}/100</p>
        </div>
        <div>
          <p className="text-muted-foreground">Confidence</p>
          <p className="mt-0.5 font-medium text-foreground">{info.confidence}%</p>
        </div>
      </div>
    </div>
  );
}

function ErrorBanner({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div className="animate-in fade-in flex items-center justify-between rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-warning duration-200">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4" />
        {message}
      </div>
      <button onClick={onDismiss} className="text-warning/70 hover:text-warning">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function MessageList({
  messages,
  status,
  blockedInfo,
  errorMessage,
  onDismissBlocked,
  onDismissError,
}: {
  messages: Message[];
  status: string;
  blockedInfo: BlockedInfo | null;
  errorMessage: string | null;
  onDismissBlocked: () => void;
  onDismissError: () => void;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status, blockedInfo, errorMessage]);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
      <div className="mx-auto flex w-full max-w-3xl flex-col space-y-4">
      {messages.map((message) => (
        <div key={message.id} className="animate-in fade-in slide-in-from-bottom-2 duration-200">
          <MessageBubble message={message} />
        </div>
      ))}
      {status === "sending" && <TypingIndicator />}
      {blockedInfo && <SecurityAlertCard info={blockedInfo} onDismiss={onDismissBlocked} />}
      {errorMessage && <ErrorBanner message={errorMessage} onDismiss={onDismissError} />}
      <div ref={bottomRef} />
      </div>
    </div>
  );
}

export function ChatContainer() {
  const { messages, status, blockedInfo, errorMessage, sendPrompt, dismissBlocked, dismissError } = useChat();
  const [prefill, setPrefill] = useState("");

  return (
    <div className="flex h-full min-h-0 flex-col">
      <ChatHeader />
      {messages.length === 0 ? (
        <ChatEmptyState onSuggestionClick={setPrefill} />
      ) : (
        <MessageList
          messages={messages}
          status={status}
          blockedInfo={blockedInfo}
          errorMessage={errorMessage}
          onDismissBlocked={dismissBlocked}
          onDismissError={dismissError}
        />
      )}
      <PromptInput
        disabled={status === "sending"}
        initialValue={prefill}
        onValueConsumed={() => setPrefill("")}
        onSend={sendPrompt}
      />
    </div>
  );
}