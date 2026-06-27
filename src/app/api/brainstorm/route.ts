import { anthropic, MODEL } from "@/lib/anthropic";
import { systemBlocksFor } from "@/lib/brainstorm-prompt";
import { getCategory } from "@/data/jaseojeon";

export const runtime = "nodejs";
export const maxDuration = 60;

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  let messages: ChatMessage[];
  let categoryId: string;
  try {
    const body = await req.json();
    messages = body.messages;
    categoryId = body.categoryId;
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response("messages 배열이 필요합니다.", { status: 400 });
    }
  } catch {
    return new Response("잘못된 요청 본문입니다.", { status: 400 });
  }

  const category = getCategory(categoryId);
  if (!category) {
    return new Response("알 수 없는 자서전 항목입니다.", { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response("ANTHROPIC_API_KEY가 설정되지 않았습니다.", { status: 500 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const claude = anthropic.messages.stream({
          model: MODEL,
          max_tokens: 1024,
          system: systemBlocksFor(category),
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
        });
        claude.on("text", (t) => controller.enqueue(encoder.encode(t)));
        await claude.finalMessage();
        controller.close();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "알 수 없는 오류";
        controller.enqueue(encoder.encode(`\n\n[오류] ${msg}`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
