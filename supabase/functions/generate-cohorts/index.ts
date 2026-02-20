import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { objective, productCategory, geo, budgetRange } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an expert marketing data scientist specializing in audience segmentation for enterprise e-commerce campaigns. Generate highly specific, data-driven audience cohorts. Always respond using the provided tool/function.`;

    const userPrompt = `Generate 5 audience cohorts for a campaign with these parameters:
- Objective: ${objective || "maximize ROAS"}
- Product category: ${productCategory || "general e-commerce"}
- Geography: ${geo || "US, UK"}
- Budget range: ${budgetRange || "$10K-$50K"}

For each cohort provide:
- name: A specific, descriptive segment name
- size: Estimated audience size (number between 3000 and 30000)
- expectedUplift: Expected performance uplift as a percentage string like "+15%"
- reasoning: 1-2 sentences explaining the data signals behind this segment (mention RFM, lifecycle stage, browsing patterns, purchase history, etc.)
- messageAngle: The recommended messaging approach for this segment
- type: One of "RFM", "Lifecycle", "Behavioral", "Affinity", or "Lookalike"

Make the cohorts diverse across types and include at least one high-value, one churn-risk, and one new-customer segment.`;

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
              name: "return_cohorts",
              description: "Return generated audience cohorts",
              parameters: {
                type: "object",
                properties: {
                  cohorts: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        size: { type: "number" },
                        expectedUplift: { type: "string" },
                        reasoning: { type: "string" },
                        messageAngle: { type: "string" },
                        type: { type: "string", enum: ["RFM", "Lifecycle", "Behavioral", "Affinity", "Lookalike"] },
                      },
                      required: ["name", "size", "expectedUplift", "reasoning", "messageAngle", "type"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["cohorts"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_cohorts" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    let parsed;
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      try { parsed = JSON.parse(toolCall.function.arguments); } catch (e) { console.error("Tool call parse failed:", e); }
    }
    if (!parsed) {
      const content = data.choices?.[0]?.message?.content || "";
      let cleaned = content.trim();
      if (cleaned.startsWith("```")) cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) { try { parsed = JSON.parse(jsonMatch[0]); } catch (e) { console.error("Content parse failed:", e); } }
    }
    if (!parsed) throw new Error("Could not extract structured data from AI response");
    return new Response(JSON.stringify({ cohorts: parsed.cohorts }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-cohorts error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
