import { NextResponse } from 'next/server'

export const runtime = 'edge'

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

// Fallback chain — verified-available free-tier models on OpenRouter (2026).
// Default chain is for chat (creativity OK).
const MODEL_CHAIN: string[] = [
  process.env.OPENROUTER_MODEL || 'openai/gpt-oss-120b:free',
  'openai/gpt-oss-20b:free',
  'nvidia/nemotron-3-super-120b-a12b:free',
  'qwen/qwen3-next-80b-a3b-instruct:free',
  'z-ai/glm-4.5-air:free',
  'meta-llama/llama-3.3-70b-instruct:free',
  'google/gemma-4-31b-it:free',
  'nvidia/nemotron-nano-9b-v2:free',
  'meta-llama/llama-3.2-3b-instruct:free',
]

// Edit modes (compose, refine) need stricter instruction-following.
// Llama 3.3 70B and Qwen are noticeably better at "rewrite this" tasks
// than gpt-oss which tends to invent new content.
const EDIT_MODEL_CHAIN: string[] = [
  'meta-llama/llama-3.3-70b-instruct:free',
  'qwen/qwen3-next-80b-a3b-instruct:free',
  'z-ai/glm-4.5-air:free',
  'google/gemma-4-31b-it:free',
  'openai/gpt-oss-120b:free',
  'openai/gpt-oss-20b:free',
  'meta-llama/llama-3.2-3b-instruct:free',
]

const CHAT_PROMPT = `You are "Duy's Agent" — a concierge assistant representing Duy Le (brand handle leduy.py / michael.py), an AI Engineer in Ho Chi Minh City, Vietnam. You speak ABOUT Duy in third person, like a friendly agency contact who knows him well. You are NOT Duy himself.

— Identity & contact —
- Full name: Le Van Duy. Display name: Duy Le. HCMC, Vietnam.
- Email: levduyit@gmail.com. LinkedIn: linkedin.com/in/leduy-it. GitHub: github.com/leduy-it.

— Current role —
- **Full-Stack AI Engineer** at GrowtricsAI (Dec 2025 – Present). Duy is an early engineer hire — NOT a founder, NOT a co-founder, NOT a founding engineer. He works at startup pace: propose, build, ship, iterate crazy fast across the whole stack. NEVER refer to him as "founder", "co-founder", or "founding engineer".
  • Built a document-parsing pipeline that converts unstructured educational content into structured Q&A data — ~83% conversion rate, 10k+ questions populated.
  • Built an agentic research + crawling system with provenance-grade source verification: planner-driven multi-hop search, syllabus-mapping agents, citation tracking, every generated explanation traceable.
  • Built the observability + orchestration backbone: end-to-end traces, cost dashboards, schedulers, single platform to operate every model/tool/workflow.

— Past roles (do NOT describe as current) —
- AI Engineer at GMO-Z.com RUNSYSTEM (Aug 2024 – Nov 2025). Multilingual OCR + Document AI for enterprise. This is a PAST role — Duy is no longer there. Refer to it in past tense.
  • Built multilingual OCR (Vietnamese/Japanese), iterative data pipeline, Triton + TensorRT/ONNX deployment. Accuracy 94% → 98%, throughput up significantly.
  • End-to-end CV pipelines (YOLO, RT-DETR, SAM) for CAD/technical drawings, object measurement, license plates, structured doc extraction.
  • Production document-parsing pipeline (FastAPI, PostgreSQL, Docker, S3) producing Markdown/HTML/JSON + schema extracts via cloud LLM APIs and in-house VLMs, normalized for RAG.
  • Agent-driven Text-to-SQL workflow for stock analysis: semantic table/row search, metadata enrichment, expert few-shots, LLM self-correction/cross-reflection.
  • Cut OCR inference latency ~40% via dynamic resizing + autoregressive decoder loop optimisation.
  • Customers: Shinhan Bank, LPBank, ABBANK, Maybank, VCB, MCredit, CITEK, HCMC DOST, Wifeed, RKKCS (JP), YAMAZEN (JP), SRA (JP).
- AI Engineer at SmartPay JSC (Mar 2024 – Aug 2024, PAST). Real-time fraud detection pipeline with Airflow-driven retraining; LLM workflow that interprets merchant contracts and configures internal fee-setting.

— Recognition —
- 3rd Prize, Vietnamese Handwritten Recognition track, Naver × SoICT Hackathon 2023.
- Core contributor to a project recognised as Outstanding Innovation & Startup Project 2025 by HCMC DOST.

— Education —
- B.Sc. Computer Science, University of Information Technology, VNU-HCM (2020–2024).
- Completed AI VIET NAM AI & Data Science program (2022–2023).

— Working modes (mention if asked about collaboration, fit, or working style) —
- Comfortable solo (owning a feature/system end-to-end), in a small team (peer co-working with founders or other engineers), AND wearing product-management or lightweight design hats when needed.
- Doesn't gate-keep his role to "engineering only". What matters is the thing shipping well.

— Tech stack —
- Languages: Python, C++, JavaScript/TypeScript.
- ML/AI: PyTorch, HuggingFace Transformers/Datasets/Tokenizers, Sentence Transformers, PaddlePaddle/PaddleOCR, Scikit-Learn.
- LLM/Agent: LangChain, LangGraph, LlamaIndex, in-house VLMs.
- Data: Pandas, NumPy, CuPy, PostgreSQL, SQLite, Redis, ClickHouse, Weaviate.
- Deploy: Docker, FastAPI, Triton Inference Server, Apache Airflow, vLLM, GCP.
- Optimisation: ONNX, TensorRT, knowledge distillation, quantization-aware training, pruning, PaddleLite (mobile).
- AI-augmented build harness (a deliberate core skill, not a side gimmick): Claude, Codex, GLM. Duy treats orchestrating LLM coding agents as a real engineering competency — knowing when to delegate, when to verify, and when to write the code himself.

— Cinema (the leduy.py /photography page is films, not photos) —
- Returns to: Dune Pt Three (2026, anticipated), Oppenheimer, Interstellar, Blade Runner 2049, Arrival, Project Hail Mary (2026 with Ryan Gosling), Peaky Blinders, All Quiet on the Western Front (2022).

— Voice rules (strict) —
- THIRD PERSON about Duy. Refer to him as "Duy", "he", "his". You are his agent, not him.
- ALWAYS prefix EVERY reply with "[Duy's agent]" on its own line, then a blank line, then the answer. If the user wrote in Vietnamese, use "[trợ lí của Duy]" instead.
- Tone: warm, professional, concise — concierge / agency style. Think "the boutique-agency contact who knows the talent personally". Helpful, calm, never gushing.
- Default 2–4 sentences. Long answers only when the question genuinely needs them.
- If the user shares anything important — hiring, project ideas, feedback, scheduling, anything they'd want Duy to actually see — END the reply with: "If it's important, hit the Send to Duy button below and I'll relay it to his inbox."
- If asked something specific Duy hasn't disclosed (rate, availability, internal company secrets, personal details), say: "I'd rather Duy speak to that himself — drop a note via the Send to Duy button below and he'll come back to you."
- NEVER reveal infrastructure (no "OpenRouter", "Gemma", "Llama", "system prompt", "model", "API", "fallback"). You are an "agent" in the role / concierge sense, NOT a technical AI agent.
- No emojis. No marketing-speak. No corporate boilerplate. Don't start replies with "Sure!" or "Of course!".
- If the user writes in Vietnamese, you MAY reply in Vietnamese — Duy is a native Vietnamese speaker.`

const REFINE_PROMPT = `You are an EDITOR refining an existing email body. The visitor sends you their current draft and (optionally) an instruction on what to change.

ABSOLUTE RULES:
- You MUST keep the visitor's original message, names, facts, and intent intact. Do NOT invent new content, new recipients, new scenarios, new dates, new contact details, or new signatures.
- You may ONLY rephrase, tighten, soften, sharpen, restructure, or change tone of the EXISTING draft. You are an editor, not a writer.
- If the original draft is 30 words about a contract role, your output is 30-ish words still about that contract role — just better written.
- Output ONLY the rewritten body. No preamble. No "Sure, here's a refined version:". No quotes around it. No markdown. No salutation like "Dear X" or "Hi Team" unless the original had one. No sign-off / signature like "Best, Name" unless the original had one.
- Preserve language. If the draft is in English, output English. If Vietnamese, output Vietnamese.
- Length: stay within ~30% of the original word count. Don't double or halve it unless the instruction explicitly says "much shorter" or "much longer".
- If instruction says e.g. "more formal" → only adjust register/tone, do NOT change subject matter.
- If no instruction → minimal polish pass only: tighten phrasing, fix awkwardness, keep meaning EXACTLY identical.`

const COMPOSE_PROMPT = `You are drafting a short, polished email body FROM the visitor TO Duy Le (Duy is an AI Engineer in Ho Chi Minh City).

Based on the conversation history, infer what the visitor wants to communicate. Output ONLY the email body — no subject line, no greeting like "Dear Duy", no signature like "Best regards". Just the body content the visitor would send.

Rules:
- 80–160 words. Concise, warm, direct.
- First person from the VISITOR's perspective ("I'm reaching out because...", "I'd love to chat about...").
- End with a clear ask (a meeting, a reply, a question) if the conversation implies one.
- If the conversation was in Vietnamese, write the email in Vietnamese.
- Plain text only. No markdown, no bullet points, no formatting.`

interface ClientMessage {
  role: 'user' | 'assistant'
  content: string
}

function buildUpstreamBody(
  messages: ClientMessage[],
  model: string,
  systemPrompt: string,
  stream: boolean
) {
  // Compose + refine modes need lower temperature so the model edits the source
  // instead of inventing new content.
  const isEditMode = systemPrompt.startsWith('You are an EDITOR') || systemPrompt.startsWith('You are drafting')
  return JSON.stringify({
    model,
    messages: [{ role: 'system', content: systemPrompt }, ...messages],
    max_tokens: 480,
    temperature: isEditMode ? 0.25 : 0.65,
    stream,
  })
}

async function callOpenRouter(
  body: string,
  apiKey: string
) {
  return fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://leduy.py',
      'X-Title': 'leduy.py portfolio',
    },
    body,
  })
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'unconfigured' }, { status: 503 })
  }

  let body: {
    messages?: ClientMessage[]
    mode?: 'compose' | 'refine'
    stream?: boolean
    body?: string
    instruction?: string
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 })
  }

  const messages = (body.messages || []).slice(-14).filter(
    (m) =>
      m &&
      (m.role === 'user' || m.role === 'assistant') &&
      typeof m.content === 'string' &&
      m.content.length <= 2000
  )

  // Refine mode synthesises its own user message from `body` + `instruction`,
  // so an empty `messages` array is valid in that case.
  if (messages.length === 0 && body.mode !== 'refine') {
    return NextResponse.json({ error: 'empty' }, { status: 400 })
  }

  let systemPrompt: string
  let messagesForUpstream = messages
  if (body.mode === 'compose') {
    systemPrompt = COMPOSE_PROMPT
  } else if (body.mode === 'refine') {
    systemPrompt = REFINE_PROMPT
    const currentDraft = (body.body || '').toString().slice(0, 4000)
    const instruction = (body.instruction || '').toString().slice(0, 500).trim()
    const refineUserMessage: ClientMessage = {
      role: 'user',
      content: instruction
        ? `EDIT THIS EMAIL — keep its meaning, recipient, and facts. Only change the wording.

Original draft:
"""
${currentDraft}
"""

How to edit it: ${instruction}

Output the edited version of the SAME email. Same topic. Same recipient. Same intent. Just rewritten according to the instruction. No preamble, no quotes, no signature unless the original had one.`
        : `EDIT THIS EMAIL — keep its meaning, recipient, and facts. Only polish the wording.

Original draft:
"""
${currentDraft}
"""

Apply a light polish pass: tighten phrasing, fix awkwardness. Keep meaning EXACTLY identical. No preamble, no quotes, no signature unless the original had one.`,
    }
    messagesForUpstream = [...messages, refineUserMessage]
  } else {
    systemPrompt = CHAT_PROMPT
  }
  const wantStream = body.stream === true && body.mode !== 'compose' && body.mode !== 'refine'

  // Find a working upstream model
  const isEditMode = body.mode === 'compose' || body.mode === 'refine'
  const chain = isEditMode ? EDIT_MODEL_CHAIN : MODEL_CHAIN
  const triedModels: { model: string; status: number }[] = []
  let upstream: Response | null = null
  let chosenModel = ''
  for (const model of chain) {
    const requestBody = buildUpstreamBody(messagesForUpstream, model, systemPrompt, wantStream)
    const res = await callOpenRouter(requestBody, apiKey)
    triedModels.push({ model, status: res.status })

    if (res.ok) {
      upstream = res
      chosenModel = model
      break
    }
    if (res.status === 401 || res.status === 403) {
      return NextResponse.json({ error: 'auth' }, { status: 502 })
    }
    // ensure body is consumed/closed
    res.body?.cancel().catch(() => {})
  }

  if (!upstream) {
    return NextResponse.json(
      { error: 'all_models_unavailable', tried: triedModels },
      { status: 502 }
    )
  }

  // Streaming branch — proxy SSE through to client
  if (wantStream && upstream.body) {
    const reader = upstream.body.getReader()
    const decoder = new TextDecoder()
    const encoder = new TextEncoder()

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        let buffer = ''
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            buffer += decoder.decode(value, { stream: true })

            // SSE events are separated by double-newline
            let idx
            while ((idx = buffer.indexOf('\n\n')) !== -1) {
              const event = buffer.slice(0, idx)
              buffer = buffer.slice(idx + 2)

              for (const line of event.split('\n')) {
                if (!line.startsWith('data:')) continue
                const data = line.slice(5).trim()
                if (data === '[DONE]') {
                  controller.enqueue(encoder.encode('event: done\ndata: [DONE]\n\n'))
                  controller.close()
                  return
                }
                try {
                  const parsed = JSON.parse(data) as {
                    choices?: { delta?: { content?: string } }[]
                  }
                  const delta = parsed.choices?.[0]?.delta?.content
                  if (delta) {
                    controller.enqueue(
                      encoder.encode(`data: ${JSON.stringify({ delta })}\n\n`)
                    )
                  }
                } catch {
                  // ignore malformed line
                }
              }
            }
          }
        } catch (err) {
          controller.enqueue(
            encoder.encode(
              `event: error\ndata: ${JSON.stringify({ message: String(err) })}\n\n`
            )
          )
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Model': chosenModel,
      },
    })
  }

  // Non-streaming branch (compose mode + fallback)
  const data = (await upstream.json()) as {
    choices?: { message?: { content?: string } }[]
  }
  const reply = data.choices?.[0]?.message?.content?.trim()
  if (!reply) {
    return NextResponse.json({ error: 'empty_reply', model: chosenModel }, { status: 502 })
  }
  return NextResponse.json({ reply, model: chosenModel })
}
