import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type CohortType = "RFM" | "Lifecycle" | "Behavioral" | "Affinity" | "Lookalike";

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const pickAudienceLabel = (targetAudience?: string, occasion?: string, productCategory?: string) => {
  if (targetAudience?.trim()) return targetAudience.trim();
  if (occasion?.trim()) return `${occasion.trim()} shoppers`;
  return `${productCategory || "category"} buyers`;
};

const fallbackCohorts = ({
  objective,
  objectiveType,
  targetKPI,
  productCategory,
  geo,
  budgetMin,
  budgetMax,
  brandName,
  occasion,
  targetAudience,
  promotionDetails,
  customSegmentRequest,
}: Record<string, unknown>) => {
  const objectiveText = String(objectiveType || targetKPI || objective || "ROAS");
  const category = String(productCategory || "general e-commerce");
  const market = String(geo || "US");
  const brand = String(brandName || "the brand");
  const promo = String(promotionDetails || "the offer");
  const audience = pickAudienceLabel(
    typeof targetAudience === "string" ? targetAudience : undefined,
    typeof occasion === "string" ? occasion : undefined,
    category,
  );
  const minBudget = Number(budgetMin) || 10000;
  const maxBudget = Number(budgetMax) || 50000;
  const budgetScale = clamp(Math.round((minBudget + maxBudget) / 6000), 3, 30);
  const oneOff = typeof customSegmentRequest === "string" && customSegmentRequest.trim().length > 0;

  const templates: Array<{
    name: string;
    type: CohortType;
    size: number;
    expectedUplift: string;
    reasoning: string;
    messageAngle: string;
  }> = [
    {
      name: `${brand} high-intent ${category} converters`,
      type: "Behavioral",
      size: budgetScale * 920,
      expectedUplift: "+24%",
      reasoning: `Users in ${market} with recent product views, cart activity, and high predicted order value for ${category}. Prioritizes conversion-ready behavior for ${objectiveText}.`,
      messageAngle: `Lead with ${promo !== "the offer" ? promo : "a clear value exchange"}, fast purchase proof, and low-friction checkout messaging.`,
    },
    {
      name: `Loyal ${category} repeat buyers`,
      type: "RFM",
      size: budgetScale * 680,
      expectedUplift: "+19%",
      reasoning: `High recency and frequency customers with above-average monetary value. Strong fit for efficient incremental lift without over-broad discounting.`,
      messageAngle: `Position as a personalized reward with exclusive timing and premium product recommendations from ${brand}.`,
    },
    {
      name: `At-risk ${audience}`,
      type: "Lifecycle",
      size: budgetScale * 760,
      expectedUplift: "+16%",
      reasoning: `Previously engaged users whose browsing or purchase cadence has slowed. Lifecycle signals suggest a timely incentive can prevent churn.`,
      messageAngle: `Use reminder-led copy, urgency, and category-specific benefits to bring them back before the buying window closes.`,
    },
    {
      name: `${category} affinity explorers`,
      type: "Affinity",
      size: budgetScale * 1100,
      expectedUplift: "+13%",
      reasoning: `Prospects showing adjacent interests, content engagement, and merchant/category affinity but limited purchase history. Suitable for scalable reach.`,
      messageAngle: `Educate with best-sellers, social proof, and a simple first-order reason to try ${brand}.`,
    },
    {
      name: `Lookalikes of top ${objectiveText} customers`,
      type: "Lookalike",
      size: budgetScale * 1250,
      expectedUplift: "+21%",
      reasoning: `Modeled from customers with high predicted response, strong expected order value, and positive incremental order probability.`,
      messageAngle: `Mirror winning messages from top customers: benefit-first creative, relevant merchant proof, and offer clarity.`,
    },
  ];

  if (!oneOff) return { cohorts: templates };

  return {
    cohorts: [
      {
        ...templates[0],
        name: String(customSegmentRequest).trim(),
        reasoning: `${templates[0].reasoning} This fallback segment is shaped around the requested custom definition.`,
      },
    ],
  };
};

const fallbackResponse = (input: Record<string, unknown>, reason: string) =>
  new Response(JSON.stringify({ ...fallbackCohorts(input), _fallback: true, _reason: reason }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const input = await req.json();
    const { objective, objectiveType, targetKPI, targetValue, productCategory, geo, budgetRange, budgetMin, budgetMax, brandTone, timeWindow, brandName, occasion, targetAudience, ageRange, gender, painPoints, uniqueSellingPoints, promotionDetails, seasonality } = input;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) return fallbackResponse(input, "missing_api_key");

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
        "Lovable-API-Key": LOVABLE_API_KEY,
        "X-Lovable-AIG-SDK": "edge-function-fetch",
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
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      if (response.status === 429) {
        return fallbackResponse(input, "rate_limited");
      }
      if (response.status === 402 || response.status === 403) {
        return fallbackResponse(input, "credits_exhausted");
      }
      return fallbackResponse(input, `gateway_${response.status}`);
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
    if (!parsed) return fallbackResponse(input, "parse_failed");
    return new Response(JSON.stringify({ cohorts: parsed.cohorts }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-cohorts error:", e);
    return fallbackResponse({}, "exception");
  }
});
