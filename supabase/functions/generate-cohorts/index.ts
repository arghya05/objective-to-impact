import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { objective, objectiveType, targetKPI, targetValue, productCategory, geo, budgetRange, budgetMin, budgetMax, brandTone, timeWindow, brandName, occasion, targetAudience, ageRange, gender, painPoints, uniqueSellingPoints, promotionDetails, seasonality } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const objStr = objective || objectiveType || "maximize ROAS";
    const catStr = productCategory || "general e-commerce";
    const geoStr = geo || "US, UK";
    const budgetStr = budgetRange || `$${(budgetMin || 10000) / 1000}K-$${(budgetMax || 50000) / 1000}K`;

    const systemPrompt = `You are an expert marketing data scientist specializing in audience segmentation. Generate highly specific, data-driven audience cohorts that are tailored to the campaign objective, product category, geography, and budget. Always respond using the provided tool/function.`;

    const userPrompt = `Generate 5 audience cohorts for this campaign:
- Brand: ${brandName || "Not specified"}
- Objective: ${objStr}
- Target KPI: ${targetKPI || objStr} (target: ${targetValue || "4.0x"})
- Product category: ${catStr}
- Geography: ${geoStr}
- Budget range: ${budgetStr}
- Brand tone: ${brandTone || "Professional"}
- Campaign duration: ${timeWindow || "30 days"}
${occasion ? `- Campaign occasion: ${occasion}` : ""}
${targetAudience ? `- Target audience: ${targetAudience}` : ""}
${ageRange ? `- Age range: ${ageRange}` : ""}
${gender ? `- Gender focus: ${gender}` : ""}
${painPoints ? `- Customer pain points: ${painPoints}` : ""}
${uniqueSellingPoints ? `- USPs: ${uniqueSellingPoints}` : ""}
${promotionDetails ? `- Promotion: ${promotionDetails}` : ""}
${seasonality ? `- Seasonality: ${seasonality}` : ""}

IMPORTANT: Cohorts must be specifically relevant to the "${catStr}" category, "${brandName || "brand"}" brand, and "${objStr}" objective.
${occasion ? `Factor in the "${occasion}" occasion when building segments — e.g. seasonal buyers, event-triggered cohorts.` : ""}
${targetAudience ? `Prioritize segments that align with the described target audience: "${targetAudience}".` : ""}
- For ROAS objectives: focus on high-value buyers and conversion-ready segments
- For CAC objectives: focus on efficient acquisition segments with lower cost
- For Leads objectives: focus on interest-based and top-of-funnel segments
- For Retention objectives: focus on at-risk and loyal customer segments
- For Reactivation objectives: focus on dormant and lapsed customer segments

For each cohort provide:
- name: A specific segment name mentioning the product category${brandName ? ` and ${brandName}` : ""}
- size: Estimated audience size (3000-30000)
- expectedUplift: Expected uplift as "+XX%"
- reasoning: 1-2 sentences with specific data signals (RFM, lifecycle, browsing, purchase history)
- messageAngle: Messaging approach tailored to this segment AND the campaign objective${promotionDetails ? ` incorporating "${promotionDetails}"` : ""}
- type: One of "RFM", "Lifecycle", "Behavioral", "Affinity", or "Lookalike"`;

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
