"use client";

import { useState, useRef, useCallback } from "react";
import axios from "axios";

export type MessageRole = "user" | "assistant";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
}

export type ChatStatus = "idle" | "sending" | "success" | "blocked" | "error";

export interface BlockedInfo {
  message: string;
  category: string;
  riskScore: number;
  confidence: number;
}

interface ChatSuccessResult {
  ok: true;
  response: string;
}

interface ChatBlockedResult {
  ok: false;
  blocked: true;
  info: BlockedInfo;
}

interface ChatErrorResult {
  ok: false;
  blocked: false;
  message: string;
}

type ChatResult = ChatSuccessResult | ChatBlockedResult | ChatErrorResult;

export async function sendChatPrompt(prompt: string): Promise<ChatResult> {
  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_GATEWAY_API_URL}/ai`, { prompt });
    return { ok: true, response: res.data.response };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 403) {
        const data = error.response.data;
        return {
          ok: false,
          blocked: true,
          info: {
            message: data.message,
            category: data.category,
            riskScore: data.riskScore,
            confidence: data.confidence,
          },
        };
      }
      return {
        ok: false,
        blocked: false,
        message: "The gateway returned an unexpected error.",
      };
    }
    return {
      ok: false,
      blocked: false,
      message: "Unable to reach the gateway.",
    };
  }
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<ChatStatus>("idle");
  const [blockedInfo, setBlockedInfo] = useState<BlockedInfo | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isSending = useRef(false);

  const sendPrompt = useCallback(async (prompt: string) => {
    if (isSending.current || !prompt.trim()) return;
    isSending.current = true;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: prompt,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setStatus("sending");
    setBlockedInfo(null);
    setErrorMessage(null);

    const result = await sendChatPrompt(prompt);

    if (result.ok) {
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: result.response,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setStatus("success");
    } else if (result.blocked) {
      setBlockedInfo(result.info);
      setStatus("blocked");
    } else {
      setErrorMessage(result.message);
      setStatus("error");
    }

    isSending.current = false;
    setStatus("idle");
  }, []);

  const dismissBlocked = useCallback(() => setBlockedInfo(null), []);
  const dismissError = useCallback(() => setErrorMessage(null), []);

  return {
    messages,
    status,
    blockedInfo,
    errorMessage,
    sendPrompt,
    dismissBlocked,
    dismissError,
  };
}
