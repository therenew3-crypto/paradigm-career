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
    <main
      style={{
        height: "calc(100dvh - 44px)",
        display: "flex",
        flexDirection: "column",
        background: "#ffffff",
      }}
    >
      {/* sub header */}
      <div
        style={{
          borderBottom: "1px solid #e0e0e0",
          background: "rgba(245,245,247,0.8)",
          backdropFilter: "saturate(180%) blur(20px)",
          WebkitBackdropFilter: "saturate(180%) blur(20px)",
        }}
      >
        <div style={{ maxWidth: 740, margin: "0 auto", padding: "22px 24px 20px" }}>
          <Link
            href="/"
            style={{
              display: "inline-block",
              fontSize: 14,
              fontWeight: 400,
              letterSpacing: "-0.01em",
              color: "#0066cc",
              textDecoration: "none",
              marginBottom: 10,
            }}
          >
            ← 취업자서전
          </Link>
          <h2 style={{ margin: 0, fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em", color: "#1d1d1f" }}>
            미친 브레인스토밍
          </h2>
          <p style={{ margin: "6px 0 0", fontSize: 15, fontWeight: 400, letterSpacing: "-0.01em", color: "#86868b" }}>
            막연한 말은 안 받아줍니다. 끝까지 파고들어 &lsquo;진짜 나&rsquo;를 캡니다.
          </p>
        </div>
      </div>

      {/* messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", background: "#ffffff" }}>
        <div
          style={{
            maxWidth: 740,
            margin: "0 auto",
            padding: "32px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {messages.map((m, i) => {
            const isUser = m.role === "user";
            const text = m.content || (loading && i === messages.length - 1 ? "…" : "");
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: isUser ? "flex-end" : "flex-start",
                  animation: "apRise .28s ease-out both",
                }}
              >
                <div
                  style={{
                    maxWidth: "80%",
                    background: isUser ? "#0066cc" : "#f5f5f7",
                    color: isUser ? "#ffffff" : "#1d1d1f",
                    fontSize: 17,
                    fontWeight: 400,
                    lineHeight: 1.47,
                    letterSpacing: "-0.01em",
                    padding: "14px 18px",
                    borderRadius: isUser ? "20px 20px 6px 20px" : "20px 20px 20px 6px",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {text}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* composer */}
      <div style={{ borderTop: "1px solid #e0e0e0", background: "#ffffff" }}>
        <div style={{ maxWidth: 740, margin: "0 auto", padding: "16px 24px 24px" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
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
              placeholder="여기에 막 쏟아내세요.  Enter 전송 · Shift+Enter 줄바꿈"
              style={{
                flex: 1,
                resize: "none",
                fontFamily: "inherit",
                fontSize: 17,
                fontWeight: 400,
                letterSpacing: "-0.01em",
                lineHeight: 1.47,
                color: "#1d1d1f",
                background: "#ffffff",
                border: "1px solid #d2d2d7",
                borderRadius: 22,
                padding: "13px 18px",
                outline: "none",
                minHeight: 50,
                maxHeight: 160,
              }}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              style={{
                flexShrink: 0,
                height: 50,
                background: "#0066cc",
                color: "#fff",
                border: "none",
                fontFamily: "inherit",
                fontSize: 16,
                fontWeight: 400,
                letterSpacing: "-0.01em",
                padding: "0 26px",
                borderRadius: 980,
                cursor: loading || !input.trim() ? "default" : "pointer",
                opacity: loading || !input.trim() ? 0.4 : 1,
              }}
            >
              보내기
            </button>
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 400,
              letterSpacing: "-0.01em",
              color: "#86868b",
              marginTop: 10,
              paddingLeft: 6,
            }}
          >
            장점·강점 구분 없이 떠오르는 경험·성격·했던 일을 10개든 20개든 던지세요.
          </div>
        </div>
      </div>
    </main>
  );
}
