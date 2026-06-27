# 배포 연결 가이드 — GitHub · Vercel · Supabase

> 코드는 이미 준비되어 있습니다. 아래 3단계는 **계정 로그인이 필요해 직접** 진행하셔야 합니다.
> 순서: **Supabase(키 발급) → GitHub(코드 업로드) → Vercel(import + 키 입력 + 배포)**

---

## 1. Supabase 프로젝트 만들기

1. https://supabase.com → 로그인 → **New project**
2. 이름/DB 비밀번호/리전(Northeast Asia (Seoul) 추천) 입력 후 생성 (~2분)
3. 좌측 **Project Settings → API** 에서 두 값 복사:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. (로컬 테스트용) 프로젝트 루트에 `.env.local` 파일을 만들고 `.env.local.example`를 복붙해 값 채우기
   ```
   cp .env.local.example .env.local   # 그 뒤 값 입력
   ```

> ⚠️ `anon` 키만 프론트(`NEXT_PUBLIC_`)에 노출하세요. `service_role` 키는 절대 클라이언트에 넣지 마세요.

---

## 2. GitHub에 코드 올리기

1. https://github.com/new → 빈 저장소 생성 (README/.gitignore **추가하지 말 것**)
   - 이름 예: `chwijaseojeon`
2. 생성 후 안내되는 URL을 사용해 로컬에서 push (이미 git 커밋은 되어 있음):
   ```bash
   git remote add origin https://github.com/<당신아이디>/chwijaseojeon.git
   git branch -M main
   git push -u origin main
   ```
   - push 시 GitHub 로그인(토큰/브라우저 인증) 필요

---

## 3. Vercel에서 import + 배포

1. https://vercel.com → 로그인(GitHub 계정으로 로그인 추천)
2. **Add New → Project → Import** 에서 방금 만든 `chwijaseojeon` 저장소 선택
   - Framework: **Next.js** 자동 감지됨 (별도 설정 불필요)
3. **Environment Variables** 에 3개 입력:
   | Key | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | (Supabase Project URL) |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (Supabase anon key) |
   | `ANTHROPIC_API_KEY` | (Claude API 키 — 추후 브레인스토밍 엔진용, 지금은 비워둬도 빌드됨) |
4. **Deploy** 클릭 → 1~2분 후 `https://chwijaseojeon.vercel.app` 형태 URL 생성

> 이후 `git push` 할 때마다 Vercel이 **자동 재배포**합니다. (push → 자동 빌드 → 배포)
> 배포된 사이트의 "연결 상태" 패널에서 Supabase/Anthropic 키가 잡혔는지 바로 확인됩니다.

---

## 확인 체크리스트

- [ ] Supabase Project URL / anon key 발급
- [ ] `.env.local` 채우고 `npm run dev`로 로컬 동작 확인 (http://localhost:3000)
- [ ] GitHub 저장소 생성 + `git push`
- [ ] Vercel import + 환경변수 3개 입력 + Deploy
- [ ] 배포 URL 접속 → 연결 상태 ✓ 확인
