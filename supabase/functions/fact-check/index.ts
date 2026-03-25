import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, mode } = await req.json();

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Content is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are CredNews, an expert AI fact-checker. Your job is to analyze text or article content and extract individual claims, then evaluate each claim for truthfulness.

For each claim you identify, provide:
1. The exact claim text (quoted from the source)
2. A verdict: "true", "false", "mixed", or "unverified"
3. A brief explanation (2-3 sentences) citing why you reached that verdict

Also provide an overall credibility score from 0-100 where:
- 80-100: Highly credible, mostly verified facts
- 50-79: Mixed credibility, some claims unverified or misleading
- 0-49: Low credibility, contains significant false or misleading claims

Be fair, balanced, and base your analysis on widely accepted scientific consensus, verified data, and reputable sources.`;

    const userPrompt = mode === "link"
      ? `Analyze the following URL for factual claims. Since you cannot browse URLs, analyze the URL itself and any context clues, then provide your best assessment. URL: ${content}`
      : `Analyze the following text for factual claims and fact-check each one:\n\n${content}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "fact_check_result",
              description: "Return structured fact-check results with claims and overall score",
              parameters: {
                type: "object",
                properties: {
                  overallScore: {
                    type: "number",
                    description: "Overall credibility score from 0-100",
                  },
                  summary: {
                    type: "string",
                    description: "A brief 1-2 sentence summary of the overall analysis",
                  },
                  claims: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        text: {
                          type: "string",
                          description: "The exact claim text from the source",
                        },
                        verdict: {
                          type: "string",
                          enum: ["true", "false", "mixed", "unverified"],
                          description: "The verdict for this claim",
                        },
                        explanation: {
                          type: "string",
                          description: "Brief explanation of why this verdict was reached",
                        },
                      },
                      required: ["text", "verdict", "explanation"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["overallScore", "summary", "claims"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "fact_check_result" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds in Settings > Workspace > Usage." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      throw new Error("No structured response from AI");
    }

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("fact-check error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
