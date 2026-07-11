"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Send, Loader2 } from "lucide-react";

interface PromptInputProps {
    disabled: boolean;
    initialValue?: string;
    onValueConsumed?: () => void;
    onSend: (prompt: string) => void;
}

const MAX_HEIGHT = 200;

export function PromptInput({ disabled, initialValue, onValueConsumed, onSend }: PromptInputProps) {
    const [value, setValue] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (!initialValue) return;
        setValue(initialValue);
        textareaRef.current?.focus();
        onValueConsumed?.();
    }, [initialValue, onValueConsumed]);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        textarea.style.height = "auto";
        textarea.style.height = `${Math.min(textarea.scrollHeight, MAX_HEIGHT)}px`;
    }, [value]);

    function handleSend() {
        const trimmed = value.trim();
        if (disabled || !trimmed) return;
        onSend(trimmed);
        setValue("");
        if (textareaRef.current) textareaRef.current.style.height = "auto";
    }

    function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    return (
        <div className="border-t border-border px-6 py-4">
            <div className="mx-auto flex w-full max-w-3xl items-end gap-3 rounded-2xl border border-border bg-card px-4 py-2.5 focus-within:border-border-strong">
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                    rows={1}
                    placeholder="Ask anything. Every prompt is analyzed by the Gateway first."
                    className="max-h-50 flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-60"
                />
                <button
                    onClick={handleSend}
                    disabled={disabled || !value.trim()}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity disabled:opacity-40"
                >
                    {disabled ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
            </div>
            <p className="mx-auto mt-2 w-full max-w-3xl px-1 text-xs text-muted-foreground">Enter to send, Shift + Enter for a new line</p>
        </div>
    );
}