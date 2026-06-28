import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { angle, objectiveType, targetKPI, targetValue, productCategory, brandTone, geo, budgetMin, budgetMax, timeWindow, customPrompt, brandName, brandDescription, occasion, targetAudience, painPoints, uniqueSellingPoints, keyMessages, callToAction, promotionDetails, competitorContext, seasonality, previousCampaignLearnings } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an expert advertising copywriter specializing in performance marketing. Generate creative ad copy that is specifically optimized for the campaign's objective and audience context. For each variant you MUST explain WHY this variant was chosen — the strategic reasoning behind the messaging approach, why it will resonate with the target audience, and how it supports the campaign objective. Always respond using the provided tool/function.`;

    let userPrompt = `Generate 2 ad copy variants for the "${angle}" creative angle.

CAMPAIGN CONTEXT:
- Brand: ${brandName || "Not specified"}${brandDescription ? ` — ${brandDescription}` : ""}
- Campaign Objective: ${objectiveType || "ROAS"} (optimize for ${targetKPI || objectiveType || "ROAS"} target: ${targetValue || "4.0x"})
- Product Category: ${productCategory || "general e-commerce"}
- Brand Tone: ${brandTone || "Professional"}
- Target Geography: ${geo || "US"}
- Budget: $${budgetMin || 10000} - $${budgetMax || 50000}
- Campaign Duration: ${timeWindow || "30 days"}
${occasion ? `- Campaign Occasion: ${occasion}` : ""}
${targetAudience ? `- Target Audience: ${targetAudience}` : ""}
${painPoints ? `- Customer Pain Points: ${painPoints}` : ""}
${uniqueSellingPoints ? `- USPs: ${uniqueSellingPoints}` : ""}
${keyMessages && keyMessages.length > 0 ? `- Key Messages: ${keyMessages.join("; ")}` : ""}
${callToAction ? `- Primary CTA: ${callToAction}` : ""}
${promotionDetails ? `- Promotion/Offer: ${promotionDetails}` : ""}
${competitorContext ? `- Competitor Context: ${competitorContext}` : ""}
${seasonality ? `- Seasonality: ${seasonality}` : ""}
${previousCampaignLearnings ? `- Previous Learnings: ${previousCampaignLearnings}` : ""}

REQUIREMENTS:
- Copy MUST directly support the ${objectiveType || "ROAS"} objective
- Use the ${brandTone || "Professional"} tone consistently
- Tailor messaging to the ${productCategory || "general"} category${brandName ? ` for ${brandName}` : ""}
${occasion ? `- Incorporate the "${occasion}" occasion/context into the messaging` : ""}
${promotionDetails ? `- Feature the promotion: "${promotionDetails}"` : ""}
${callToAction ? `- Use "${callToAction}" as the primary call to action` : "- Include clear CTAs that drive the target KPI"}
${uniqueSellingPoints ? `- Highlight these USPs: ${uniqueSellingPoints}` : ""}
${painPoints ? `- Address these customer pain points: ${painPoints}` : ""}
- Each variant needs: headline (under 10 words), short copy (1 punchy line), long copy (3-4 persuasive lines), description tag (category + key benefit), reasoning (2-3 sentences explaining WHY this variant approach was chosen, what psychological trigger it uses, and why it will perform well for the ${objectiveType} objective), and a suggested imagePrompt (a detailed image generation prompt that would pair perfectly with this copy variant${brandName ? `, featuring ${brandName} brand aesthetic` : ""})`;

    if (customPrompt) {
      userPrompt += `\n\nUSER CUSTOM DIRECTION:\n"${customPrompt}"`;
    }

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
              name: "return_copy_variants",
              description: "Return generated ad copy variants with reasoning and image prompts",
              parameters: {
                type: "object",
                properties: {
                  variants: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        headline: { type: "string" },
                        short: { type: "string" },
                        long: { type: "string" },
                        description: { type: "string" },
                        reasoning: { type: "string", description: "2-3 sentences explaining WHY this variant was chosen, the psychological trigger used, and why it supports the campaign objective" },
                        imagePrompt: { type: "string", description: "A detailed image generation prompt that pairs perfectly with this copy variant" },
                      },
                      required: ["headline", "short", "long", "description", "reasoning", "imagePrompt"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["variants"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_copy_variants" } },
      }),
    });

    const fallbackVariants = (reason: string) => ({
      variants: [
        {
          headline: `${brandName || "Your Brand"}: ${angle}`,
          short: `Discover ${productCategory || "what's new"} — built for ${targetAudience || "you"}.`,
          long: `${brandName || "We"} bring you ${productCategory || "products"} crafted around ${angle}. ${uniqueSellingPoints || "Quality, value, and trust"} — every time. ${callToAction || "Shop now"} and see the difference.`,
          description: `${productCategory || "Premium"} · ${angle}`,
          reasoning: `Fallback variant: leads with the ${angle} angle and ${brandTone || "professional"} tone to support the ${objectiveType || "ROAS"} objective. Live AI generation unavailable (${reason}).`,
          imagePrompt: `Editorial product photo of ${productCategory || "product"} for ${brandName || "brand"}, ${brandTone || "clean"} aesthetic, soft natural light, 4:5`,
        },
        {
          headline: `${callToAction || "Save today"} on ${productCategory || "what you love"}`,
          short: `${promotionDetails || "Limited-time offer"} — don't miss out.`,
          long: `${occasion ? `For ${occasion}, ` : ""}${brandName || "we"} are offering ${promotionDetails || "exclusive savings"} on ${productCategory || "top picks"}. ${painPoints ? `No more ${painPoints}. ` : ""}${callToAction || "Shop the sale"}.`,
          description: `${occasion || "Seasonal"} · ${productCategory || "Offer"}`,
          reasoning: `Fallback variant: urgency + offer framing to drive ${targetKPI || objectiveType || "ROAS"}. Live AI generation unavailable (${reason}).`,
          imagePrompt: `Lifestyle hero shot featuring ${productCategory || "product"}, ${occasion || "seasonal"} mood, vibrant color palette, 1:1`,
        },
      ],
      _fallback: true,
      _reason: reason,
    });

    if (!response.ok) {
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      const reason = response.status === 429 ? "rate_limited"
        : (response.status === 402 || response.status === 403) ? "credits_exhausted"
        : `gateway_${response.status}`;
      return new Response(JSON.stringify(fallbackVariants(reason)), {
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
      if (jsonMatch) { try { parsed = JSON.parse(jsonMatch[0]); } catch (e) { console.error("Content parse failed:", e); } }
    }
    if (!parsed) {
      return new Response(JSON.stringify(fallbackVariants("parse_failed")), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ variants: parsed.variants }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-copy error:", e);
    return new Response(JSON.stringify({
      variants: [{
        headline: "Creative preview unavailable",
        short: "Live AI generation is offline.",
        long: "The AI gateway is temporarily unavailable. Add workspace credits or retry to generate live copy variants.",
        description: "Fallback",
        reasoning: e instanceof Error ? e.message : "Unknown error",
        imagePrompt: "Minimal placeholder graphic, neutral palette, 1:1",
      }],
      _fallback: true,
      _reason: "exception",
    }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

