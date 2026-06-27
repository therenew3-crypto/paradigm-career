"use client";

import Link from "next/link";
import { useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING =
  "흩어진 '나'를 막 쏟아내 봐요. 장점·강점 구분 없이 떠오르는 경험·성격·했던 일을 10개든 20개든 던지면 됩니다. 거기서 진짜 당신을 같이 캐낼게요.";

export default function BrainstormPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollToBottom() {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
    });
  }

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const history: Msg[] = [...messages, { role: "user", content: text }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);
    scrollToBottom();

    try {
      const res = await fetch("/api/brainstorm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // 인사말은 빼고 실제 대화만 전송
        body: JSON.stringify({ messages: history.filter((_, i) => i !== 0) }),
      });
      if (!res.body) throw new Error("스트림 없음");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: "assistant", content: acc };
          return next;
        });
        scrollToBottom();
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "오류";
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = { role: "assistant", content: `[오류] ${msg}` };
        return next;
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex h-dvh max-w-2xl flex-col px-4">
      <header className="py-4">
        <Link href="/" className="text-sm text-black/50 hover:underline dark:text-white/50">
          ← 취업자서전
        </Link>
        <h1 className="mt-1 text-xl font-bold">미친 브레인스토밍</h1>
        <p className="text-sm text-black/50 dark:text-white/50">
          막연한 말은 안 받아줍니다. 끝까지 파고들어 &lsquo;진짜 나&rsquo;를 캡니다.
        </p>
      </header>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto py-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm ${
                m.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-black/5 dark:bg-white/10"
              }`}
            >
              {m.content || (loading && i === messages.length - 1 ? "…" : "")}
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 border-t border-black/10 bg-white py-3 dark:border-white/15 dark:bg-black">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            rows={1}
            placeholder="여기에 막 쏟아내세요. (Enter 전송 · Shift+Enter 줄바꿈)"
            className="flex-1 resize-none rounded-xl border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-white/20"
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            className="shrink-0 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white disabled:opacity-40"
          >
            보내기
          </button>
        </div>
      </div>
    </main>
  );
}
