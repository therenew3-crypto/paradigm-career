"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { CATEGORIES, type JaseojeonCategory } from "@/data/jaseojeon";

type Msg = { role: "user" | "assistant"; content: string };

function greetingFor(cat: JaseojeonCategory): string {
  const note = cat.note ? ` (${cat.note})` : "";
  return `${cat.n}. ${cat.title} — 여기서 회사가 보려는 건 "${cat.intent}" 예요.${note}\n\n천천히 같이 가봐요. 먼저, ${cat.questions[0].q}`;
}

export default function BrainstormPage() {
  const [cat, setCat] = useState<JaseojeonCategory | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollToBottom() {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
    });
  }

  function selectCategory(c: JaseojeonCategory) {
    setCat(c);
    setMessages([{ role: "assistant", content: greetingFor(c) }]);
    setInput("");
  }

  function backToCategories() {
    setCat(null);
    setMessages([]);
    setInput("");
  }

  async function send() {
    const text = input.trim();
    if (!text || loading || !cat) return;

    const history: Msg[] = [...messages, { role: "user", content: text }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);
    scrollToBottom();

    try {
      const res = await fetch("/api/brainstorm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // 인사말(index 0)은 빼고 실제 대화만 전송
        body: JSON.stringify({
          categoryId: cat.id,
          messages: history.filter((_, i) => i !== 0),
        }),
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
          {cat ? (
            <button
              onClick={backToCategories}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 14,
                fontWeight: 400,
                letterSpacing: "-0.01em",
                color: "#0066cc",
                marginBottom: 10,
              }}
            >
              ← 항목 선택
            </button>
          ) : (
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
          )}
          <h2 style={{ margin: 0, fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em", color: "#1d1d1f" }}>
            {cat ? `${cat.n}. ${cat.title}` : "미친 브레인스토밍"}
          </h2>
          <p style={{ margin: "6px 0 0", fontSize: 15, fontWeight: 400, letterSpacing: "-0.01em", color: "#86868b" }}>
            {cat ? cat.intent : "어떤 항목부터 채워볼까요? 하나 고르면 질문을 던지며 같이 파고들게요."}
          </p>
        </div>
      </div>

      {/* body */}
      {!cat ? (
        // CATEGORY GRID
        <div style={{ flex: 1, overflowY: "auto", background: "#ffffff" }}>
          <div style={{ maxWidth: 740, margin: "0 auto", padding: "28px 24px 48px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: 12,
              }}
            >
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  className="cat-card"
                  onClick={() => selectCategory(c)}
                  style={{
                    textAlign: "left",
                    background: "#ffffff",
                    border: "1px solid #e0e0e0",
                    borderRadius: 18,
                    padding: "18px 18px 20px",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <span
                      style={{
                        fontSize: 22,
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                        color: "#0066cc",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {String(c.n).padStart(2, "0")}
                    </span>
                    {c.recommended && (
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: "#0066cc",
                          background: "#eaf1fb",
                          borderRadius: 980,
                          padding: "2px 8px",
                        }}
                      >
                        추천 시작
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em", color: "#1d1d1f" }}>
                    {c.title}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 400,
                      lineHeight: 1.45,
                      color: "#86868b",
                      marginTop: 4,
                    }}
                  >
                    {c.intent}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // GUIDED CHAT
        <>
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
                  placeholder="여기에 답해보세요.  Enter 전송 · Shift+Enter 줄바꿈"
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
                막연한 답은 안 받아줍니다. 실제 있었던 장면·감정·선택까지 같이 파고들어요.
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
