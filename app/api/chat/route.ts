import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'meta-llama/llama-3-8b-instruct';

const SYSTEM_PROMPT = `You are a medical assistant AI.
Suggest doctor specialization based on patient symptoms.
Do NOT provide diagnosis.
Do NOT prescribe medicine.
Keep answers short and clear.
Always include this disclaimer at the end:
'This is not medical advice. Please consult a healthcare professional.'`;

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured', reply: '' },
        { status: 503 }
      );
    }

    const body = await req.json();
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    const history = Array.isArray(body.history)
      ? body.history
          .filter((m: unknown) => m && typeof m === 'object' && 'role' in m && 'content' in m)
          .map((m: { role: string; content: string }) => ({ role: m.role as 'user' | 'assistant', content: String(m.content).trim() }))
          .slice(-20)
      : [];

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required', reply: '' },
        { status: 400 }
      );
    }

    const apiMessages = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
      ...history,
      { role: 'user' as const, content: message },
    ];

    const res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.NEXTAUTH_URL || 'http://localhost:3000',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: apiMessages,
        max_tokens: 256,
        temperature: 0.4,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('[chat] OpenRouter error:', res.status, errText);
      return NextResponse.json(
        {
          error: 'AI service temporarily unavailable',
          reply: 'Sorry, I couldn’t process that. Please try again or describe your symptoms in a few words.',
        },
        { status: 502 }
      );
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
      error?: { message?: string };
    };

    if (data.error?.message) {
      console.error('[chat] OpenRouter API error:', data.error.message);
      return NextResponse.json(
        { error: data.error.message, reply: '' },
        { status: 502 }
      );
    }

    const content = data.choices?.[0]?.message?.content?.trim() ?? '';
    return NextResponse.json({ reply: content || 'I couldn’t generate a response. Please try again.' });
  } catch (e) {
    console.error('[chat] Unexpected error:', e);
    return NextResponse.json(
      {
        error: 'Server error',
        reply: 'Something went wrong. Please try again later.',
      },
      { status: 500 }
    );
  }
}
