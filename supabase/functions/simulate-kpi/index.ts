import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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
