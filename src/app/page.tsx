const steps = [
  { n: "①", t: "미친 브레인스토밍", d: "막연한 말은 안 받아준다. 끝까지 파고들어 '진짜'를 캔다" },
  { n: "②", t: "소재 연결", d: "흩어진 경험을 가로질러 '반복되는 나'를 찾는다" },
  { n: "③", t: "차별화 도출", d: "장점 vs 강점을 갈라 '남과 구분되는 나'를 확정 (자서전 소스)" },
  { n: "④", t: "전 문항 파생", d: "1분자소·지원동기·차별화·클로징 + 면접 답까지" },
  { n: "⑤", t: "회사별 최적화", d: "회사가 진짜 원하는 것에 맞춰 '동그라미 지원서'로" },
];

function EnvBadge({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-black/10 dark:border-white/15 px-4 py-3">
      <span className="font-mono text-sm">{label}</span>
      <span
        className={`text-sm font-semibold ${
          ok ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
        }`}
      >
        {ok ? "✓ 연결됨" : "○ 미설정"}
      </span>
    </div>
  );
}

export default function Home() {
  const supabaseOk =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const anthropicOk = !!process.env.ANTHROPIC_API_KEY;

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <p className="text-sm font-semibold tracking-wide text-blue-600 dark:text-blue-400">
        PARADIGM CAREER · 해커톤 v5
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">취업자서전</h1>
      <p className="mt-4 text-lg text-black/70 dark:text-white/70">
        공통 자소서로 <b>세모</b>가 되지 말고, 자서전 하나로 회사마다{" "}
        <b className="text-blue-600 dark:text-blue-400">동그라미</b>가 되는 것.
      </p>

      <section className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">
          핵심 흐름
        </h2>
        <ol className="mt-4 space-y-3">
          {steps.map((s) => (
            <li
              key={s.n}
              className="flex gap-4 rounded-xl border border-black/10 dark:border-white/15 p-4"
            >
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{s.n}</span>
              <div>
                <p className="font-semibold">{s.t}</p>
                <p className="text-sm text-black/60 dark:text-white/60">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">
          연결 상태
        </h2>
        <div className="mt-4 space-y-2">
          <EnvBadge label="Supabase" ok={supabaseOk} />
          <EnvBadge label="Anthropic (Claude)" ok={anthropicOk} />
        </div>
        <p className="mt-3 text-xs text-black/50 dark:text-white/50">
          환경변수는 <code>.env.local</code>(로컬)과 Vercel 프로젝트 설정(배포)에서 채웁니다. 예시는{" "}
          <code>.env.local.example</code> 참고.
        </p>
      </section>

      <footer className="mt-16 border-t border-black/10 dark:border-white/15 pt-6 text-xs text-black/40 dark:text-white/40">
        세모를 동그라미로 — Next.js · Supabase · Claude
      </footer>
    </main>
  );
}
