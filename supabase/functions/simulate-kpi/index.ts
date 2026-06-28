import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function buildFallback(totalBudget: number, objectiveType?: string, productCategory?: string, brandName?: string) {
  const obj = objectiveType || "ROAS";
  const cat = productCategory || "e-commerce";
  const brand = brandName || "your brand";
  const conv = Math.round(totalBudget / 22);
  const revenue = Math.round(totalBudget * 3.8);
  const mkAlloc = (channel: string, pct: number, cpa: string, roas: string, cap: string) => ({
    channel, budget: Math.round(totalBudget * pct), percentage: Math.round(pct * 100),
    expectedCPA: cpa, expectedROAS: roas, frequencyCap: cap,
  });
  let channelAllocations;
  if (/lead/i.test(obj)) {
    channelAllocations = [
      mkAlloc("Google Search", 0.35, "$18.20", "3.2x", "3/day"),
      mkAlloc("LinkedIn", 0.25, "$32.40", "2.4x", "2/day"),
      mkAlloc("Display", 0.20, "$12.10", "2.1x", "5/day"),
      mkAlloc("Email", 0.12, "$4.80", "5.6x", "2/week"),
      mkAlloc("Meta", 0.08, "$16.30", "2.9x", "3/day"),
    ];
  } else if (/retent|reactiv/i.test(obj)) {
    channelAllocations = [
      mkAlloc("Email", 0.40, "$3.20", "6.8x", "2/week"),
      mkAlloc("Push", 0.20, "$1.40", "5.1x", "1/day"),
      mkAlloc("WhatsApp/SMS", 0.18, "$2.80", "4.9x", "2/week"),
      mkAlloc("Meta Retargeting", 0.14, "$9.60", "4.2x", "3/day"),
      mkAlloc("Google RLSA", 0.08, "$11.20", "3.8x", "3/day"),
    ];
  } else {
    channelAllocations = [
      mkAlloc("Meta", 0.32, "$14.20", "4.1x", "3/day"),
      mkAlloc("Google Shopping", 0.28, "$12.80", "4.6x", "4/day"),
      mkAlloc("Email", 0.15, "$3.80", "6.2x", "2/week"),
      mkAlloc("TikTok", 0.12, "$15.40", "3.4x", "3/day"),
      mkAlloc("Display", 0.08, "$18.20", "2.6x", "5/day"),
      mkAlloc("Affiliates", 0.05, "$10.40", "3.9x", "—"),
    ];
  }
  return {
    predictedROAS: "3.8x",
    predictedCPA: "$15.40",
    predictedConversions: conv,
    predictedRevenue: `$${revenue.toLocaleString()}`,
    confidenceLevel: "Medium",
    keyRisks: [
      `Seasonality may compress CPMs in ${cat}`,
      "Creative fatigue after week 2 without rotation",
      "Attribution gaps across upper-funnel channels",
    ],
    recommendations: [
      `Prioritize top-3 channels for ${brand}`,
      "Cap frequency to protect incrementality",
      "Hold 10% budget for in-flight optimization",
    ],
    kpiBreakdown: [
      { metric: "ROAS", predicted: "3.8x", benchmark: "3.2x", status: "above" },
      { metric: "CPA", predicted: "$15.40", benchmark: "$18.00", status: "above" },
      { metric: "CTR", predicted: "1.6%", benchmark: "1.4%", status: "on_target" },
      { metric: "CVR", predicted: "2.9%", benchmark: "3.1%", status: "below" },
    ],
    suggestedCreativeAngles: [
      `Hero offer for ${cat}`,
      "Social proof / testimonials",
      "Urgency + limited-time framing",
    ],
    suggestedImagePrompts: [
      { format: "1:1", channel: "Meta", prompt: `Lifestyle hero shot of ${cat} product for ${brand}` },
      { format: "4:5", channel: "Instagram", prompt: `UGC-style ${cat} flatlay for ${brand}` },
      { format: "9:16", channel: "TikTok/Reels", prompt: `Vertical demo of ${cat} for ${brand}` },
    ],
    channelAllocations,
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });


  try {
    const { objectiveType, targetKPI, targetValue, timeWindow, budgetMin, budgetMax, productCategory, geo, brandTone, brandName, occasion, targetAudience, promotionDetails, seasonality, uniqueSellingPoints } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const totalBudget = ((budgetMin || 10000) + (budgetMax || 50000)) / 2;

    const systemPrompt = `You are an expert marketing analytics simulator and media planner. Based on campaign parameters, simulate realistic KPI projections AND recommend optimal channel allocations. Always respond using the provided tool/function.`;

    const userPrompt = `Simulate KPI projections and recommend channel budget allocations for this campaign:
- Brand: ${brandName || "Not specified"}
- Objective: ${objectiveType || "ROAS"}
- Target KPI: ${targetKPI || objectiveType || "ROAS"} with target value: ${targetValue || "4.0x"}
- Time window: ${timeWindow || "30 days"}
- Budget range: $${budgetMin || 10000} - $${budgetMax || 50000} (midpoint: $${totalBudget})
- Product category: ${productCategory || "general e-commerce"}
- Geography: ${geo || "US"}
- Brand tone: ${brandTone || "Professional"}
${occasion ? `- Campaign occasion: ${occasion}` : ""}
${targetAudience ? `- Target audience: ${targetAudience}` : ""}
${promotionDetails ? `- Promotion: ${promotionDetails}` : ""}
${seasonality ? `- Seasonality: ${seasonality}` : ""}
${uniqueSellingPoints ? `- USPs: ${uniqueSellingPoints}` : ""}

Provide ALL of the following:
1. predictedROAS: realistic ROAS prediction as string like "3.8x"
2. predictedCPA: cost per acquisition as string like "$14.50"
3. predictedConversions: estimated conversions as number
4. predictedRevenue: estimated revenue as string like "$180,000"
5. confidenceLevel: "High", "Medium", or "Low"
6. keyRisks: array of 2-3 risk factors${occasion ? ` considering the "${occasion}" context` : ""}
7. recommendations: array of 2-3 strategic recommendations${brandName ? ` for ${brandName}` : ""}
8. kpiBreakdown: array of 3-5 objects { metric, predicted, benchmark, status } where status is "above"/"on_target"/"below"
9. suggestedCreativeAngles: array of 3 strings
10. suggestedImagePrompts: array of 3 objects { format (like "1:1","4:5","9:16"), channel, prompt } - prompts should reference "${productCategory || "e-commerce"}"${brandName ? ` and ${brandName}` : ""} specifically
11. channelAllocations: array of 5-7 objects { channel, budget (number), percentage (number), expectedCPA (string), expectedROAS (string), frequencyCap (string) }
    - Channels should be appropriate for ${objectiveType || "ROAS"} objective and ${productCategory || "e-commerce"} category
    - Budget numbers should sum to approximately $${totalBudget}
    - For ROAS: favor Meta, Google, Email
    - For Leads: favor Google, LinkedIn, Display
    - For Retention/Reactivation: favor Email, Push, WhatsApp/SMS
    - For CAC: favor high-efficiency channels`;

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
              name: "return_simulation",
              description: "Return KPI simulation results with channel allocations",
              parameters: {
                type: "object",
                properties: {
                  predictedROAS: { type: "string" },
                  predictedCPA: { type: "string" },
                  predictedConversions: { type: "number" },
                  predictedRevenue: { type: "string" },
                  confidenceLevel: { type: "string", enum: ["High", "Medium", "Low"] },
                  keyRisks: { type: "array", items: { type: "string" } },
                  recommendations: { type: "array", items: { type: "string" } },
                  kpiBreakdown: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        metric: { type: "string" },
                        predicted: { type: "string" },
                        benchmark: { type: "string" },
                        status: { type: "string", enum: ["above", "on_target", "below"] },
                      },
                      required: ["metric", "predicted", "benchmark", "status"],
                      additionalProperties: false,
                    },
                  },
                  suggestedCreativeAngles: { type: "array", items: { type: "string" } },
                  suggestedImagePrompts: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        format: { type: "string" },
                        channel: { type: "string" },
                        prompt: { type: "string" },
                      },
                      required: ["format", "channel", "prompt"],
                      additionalProperties: false,
                    },
                  },
                  channelAllocations: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        channel: { type: "string" },
                        budget: { type: "number" },
                        percentage: { type: "number" },
                        expectedCPA: { type: "string" },
                        expectedROAS: { type: "string" },
                        frequencyCap: { type: "string" },
                      },
                      required: ["channel", "budget", "percentage", "expectedCPA", "expectedROAS", "frequencyCap"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["predictedROAS", "predictedCPA", "predictedConversions", "predictedRevenue", "confidenceLevel", "keyRisks", "recommendations", "kpiBreakdown", "suggestedCreativeAngles", "suggestedImagePrompts", "channelAllocations"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_simulation" } },
      }),
    });

    if (!response.ok) {
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      if (response.status === 429) {
        return new Response(JSON.stringify({ ...buildFallback(totalBudget, objectiveType, productCategory, brandName), _fallback: true, _reason: "rate_limited" }), {
          status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402 || response.status === 403) {
        return new Response(JSON.stringify({ ...buildFallback(totalBudget, objectiveType, productCategory, brandName), _fallback: true, _reason: "credits_exhausted" }), {
          status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ ...buildFallback(totalBudget, objectiveType, productCategory, brandName), _fallback: true, _reason: `gateway_${response.status}` }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
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
      if (jsonMatch) { try { parsed = JSON.parse(jsonMatch[0]); } catch (e) { console.error("Content JSON parse failed:", e); } }
    }
    if (!parsed) throw new Error("Could not extract structured data from AI response");

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("simulate-kpi error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
