import Anthropic from "@anthropic-ai/sdk";

/**
 * 서버 전용 Claude 클라이언트.
 * ANTHROPIC_API_KEY는 서버 환경변수(절대 NEXT_PUBLIC_ 금지).
 * 반드시 서버 컴포넌트 / Route Handler / Server Action에서만 import 하세요.
 */
export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/** 브레인스토밍 엔진 기본 모델 */
export const MODEL = "claude-opus-4-8";
