import Link from "next/link";

const flow: { n: string; t: string; d: string; note?: string }[] = [
  { n: "01", t: "미친 브레인스토밍", d: "막연한 말은 안 받아준다. 끝까지 파고들어 '진짜'를 캔다" },
  { n: "02", t: "소재 연결", d: "흩어진 경험을 가로질러 '반복되는 나'를 찾는다" },
  { n: "03", t: "차별화 도출", d: "장점 vs 강점을 갈라 '남과 구분되는 나'를 확정", note: "(자서전 소스)" },
  { n: "04", t: "전 문항 파생", d: "1분자소 · 지원동기 · 차별화 · 클로징 + 면접 답까지" },
  { n: "05", t: "회사별 최적화", d: "회사가 진짜 원하는 것에 맞춰 '동그라미 지원서'로" },
];

function StatusRow({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 22px",
        background: "#ffffff",
      }}
    >
      <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em", color: "#1d1d1f" }}>
        {label}
      </span>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          fontSize: 14,
          fontWeight: 400,
          color: ok ? "#1d1d1f" : "#86868b",
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: ok ? "#0066cc" : "#c7c7cc",
          }}
        />
        {ok ? "연결됨" : "미설정"}
      </span>
    </div>
  );
}

export default function Home() {
  const supabaseOk =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const anthropicOk = !!process.env.ANTHROPIC_API_KEY;

  return (
    <div style={{ background: "#ffffff" }}>
      {/* HERO TILE */}
      <section style={{ background: "#ffffff", padding: "96px 24px 104px", textAlign: "center" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: "-0.01em",
              color: "#0066cc",
              marginBottom: 20,
            }}
          >
            PARADIGM CAREER · 해커톤 v5
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(48px, 12vw, 80px)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1.04,
              color: "#1d1d1f",
            }}
          >
            취업자서전
          </h1>
          <p
            style={{
              margin: "26px auto 0",
              maxWidth: 680,
              fontSize: "clamp(20px, 4vw, 27px)",
              fontWeight: 400,
              letterSpacing: "-0.01em",
              lineHeight: 1.32,
              color: "#1d1d1f",
              textWrap: "pretty",
            }}
          >
            공통 자소서로 <span style={{ color: "#86868b" }}>세모</span>가 되지 말고,
            <br />
            자서전 하나로 회사마다 <span style={{ color: "#0066cc" }}>동그라미</span>가 되는 것.
          </p>

          <div
            style={{
              marginTop: 36,
              display: "flex",
              gap: 14,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/brainstorm"
              style={{
                background: "#0066cc",
                color: "#fff",
                fontSize: 17,
                fontWeight: 400,
                letterSpacing: "-0.01em",
                padding: "12px 24px",
                borderRadius: 980,
                textDecoration: "none",
              }}
            >
              미친 브레인스토밍 시작하기
            </Link>
            <a
              href="#flow"
              style={{
                background: "transparent",
                color: "#0066cc",
                border: "1px solid #0066cc",
                fontSize: 17,
                fontWeight: 400,
                letterSpacing: "-0.01em",
                padding: "12px 24px",
                borderRadius: 980,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              5단계 흐름 보기
            </a>
          </div>

          {/* metaphor render */}
          <div
            style={{
              marginTop: 84,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 16,
                width: 200,
              }}
            >
              <svg width="116" height="116" viewBox="0 0 120 120">
                <polygon
                  points="60,18 104,100 16,100"
                  fill="none"
                  stroke="#c7c7cc"
                  strokeWidth="2.5"
                  strokeDasharray="8 8"
                  strokeLinejoin="round"
                />
              </svg>
              <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em", color: "#86868b" }}>
                공통 자소서
              </div>
              <div style={{ fontSize: 13, color: "#a1a1a6", marginTop: -10 }}>세모 · 어디서나 안 맞음</div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                padding: "0 18px",
                marginBottom: 28,
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em", color: "#0066cc" }}>
                자서전 한 권으로
              </span>
              <svg width="96" height="22" viewBox="0 0 96 22">
                <path d="M2 11 H82" stroke="#0066cc" strokeWidth="2.5" strokeLinecap="round" />
                <path
                  d="M75 4 L88 11 L75 18"
                  fill="none"
                  stroke="#0066cc"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 16,
                width: 200,
              }}
            >
              <div style={{ animation: "apFloat 5s ease-in-out infinite" }}>
                <svg
                  width="116"
                  height="116"
                  viewBox="0 0 120 120"
                  style={{ filter: "drop-shadow(3px 5px 30px rgba(0,0,0,0.22))" }}
                >
                  <circle cx="60" cy="60" r="46" fill="#0066cc" />
                </svg>
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em", color: "#1d1d1f" }}>
                회사별 지원서
              </div>
              <div style={{ fontSize: 13, color: "#0066cc", marginTop: -10 }}>동그라미 · 그 회사에 딱</div>
            </div>
          </div>
        </div>
      </section>

      {/* FLOW TILE (dark) */}
      <section id="flow" style={{ background: "#272729", padding: "104px 24px" }}>
        <div style={{ maxWidth: 740, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "-0.01em",
                color: "#2997ff",
                marginBottom: 14,
              }}
            >
              핵심 흐름
            </div>
            <h2
              style={{
                margin: 0,
                fontSize: "clamp(32px, 7vw, 44px)",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                lineHeight: 1.12,
                color: "#ffffff",
              }}
            >
              막연함을 끝까지 파고들어
              <br />
              &lsquo;진짜 나&rsquo;를 캡니다
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {flow.map((s, i) => (
              <div
                key={s.n}
                style={{
                  display: "flex",
                  gap: 28,
                  alignItems: "baseline",
                  padding: "28px 0",
                  borderTop: "1px solid rgba(255,255,255,0.10)",
                  borderBottom: i === flow.length - 1 ? "1px solid rgba(255,255,255,0.10)" : undefined,
                }}
              >
                <div
                  style={{
                    fontSize: 34,
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    color: "#2997ff",
                    width: 48,
                    flexShrink: 0,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {s.n}
                </div>
                <div>
                  <div style={{ fontSize: 21, fontWeight: 600, letterSpacing: "-0.01em", color: "#ffffff" }}>
                    {s.t}
                  </div>
                  <div
                    style={{
                      fontSize: 17,
                      fontWeight: 400,
                      lineHeight: 1.47,
                      color: "#cccccc",
                      marginTop: 6,
                    }}
                  >
                    {s.d}
                    {s.note && <span style={{ color: "#86868b" }}> {s.note}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 56 }}>
            <Link
              href="/brainstorm"
              style={{
                background: "#0066cc",
                color: "#fff",
                fontSize: 17,
                fontWeight: 400,
                letterSpacing: "-0.01em",
                padding: "12px 24px",
                borderRadius: 980,
                textDecoration: "none",
              }}
            >
              지금 시작하기
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER TILE (parchment) */}
      <section style={{ background: "#f5f5f7", padding: "80px 24px" }}>
        <div style={{ maxWidth: 740, margin: "0 auto" }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: "-0.01em",
              color: "#86868b",
              marginBottom: 18,
            }}
          >
            연결 상태
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              background: "#e0e0e0",
              border: "1px solid #e0e0e0",
              borderRadius: 18,
              overflow: "hidden",
            }}
          >
            <StatusRow label="Supabase" ok={supabaseOk} />
            <StatusRow label="Anthropic (Claude)" ok={anthropicOk} />
          </div>
          <p
            style={{
              fontSize: 12,
              fontWeight: 400,
              letterSpacing: "-0.01em",
              lineHeight: 1.6,
              color: "#7a7a7a",
              margin: "18px 0 0",
            }}
          >
            환경변수는 .env.local(로컬)과 Vercel 프로젝트 설정(배포)에서 채웁니다. 예시는 .env.local.example 참고.
          </p>
          <div
            style={{
              marginTop: 48,
              paddingTop: 28,
              borderTop: "1px solid #e0e0e0",
              fontSize: 12,
              color: "#7a7a7a",
              letterSpacing: "-0.01em",
            }}
          >
            PARADIGM CAREER · 취업자서전 — 세모를 동그라미로
          </div>
        </div>
      </section>
    </div>
  );
}
