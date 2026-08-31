// Scores a submitted integration partner application against the rubric
// you specified. This is advisory only - it assigns a flag, never a
// decision. Runs server-side only, called from
// partnerIntegration.functions.ts right after the record is created.

const RUBRIC_SYSTEM_PROMPT = `You are an internal analyst for Synkra, a South African AI automation company. You are scoring an inbound Integration Partner application. This is an ADVISORY tool only - you assign a score and a flag, a human makes every actual decision about the partnership. Never write as if you are deciding anything; write as if you are briefing a colleague who will decide.

Score the submission out of 100 across these 8 weighted categories. Follow the point ranges exactly - do not invent your own scale.

1. CUSTOMER OVERLAP - 25 points
How valuable is their existing customer base to Synkra? Consider: industry, business size, South African presence, SME penetration, number of active customers, geographic expansion potential.
- Strong overlap with Synkra's target businesses: 20-25
- Moderate overlap: 12-19
- Some overlap: 5-11
- Little/no overlap: 0-4

2. TECHNICAL INTEGRATION READINESS - 20 points
- Well-documented REST/GraphQL API: 6
- Webhooks: 4
- OAuth 2.0: 3
- Sandbox/test environment: 3
- Developer documentation/portal: 2
- Stable integration infrastructure: 2

3. STRATEGIC VALUE - 15 points
Does integrating this platform make Synkra meaningfully more useful?
- Critical platform in a target industry: 13-15
- Highly useful: 10-12
- Useful but replaceable: 5-9
- Little strategic value: 0-4

4. MARKET POSITION - 10 points
Consider: customer base, market presence, brand recognition, growth, local relevance, industry penetration.
- Dominant/important local platform: 10
- Established and growing: 7-9
- Smaller but credible: 4-6
- Very small/emerging: 1-3
- Insignificant or questionable: 0

5. PARTNERSHIP WILLINGNESS - 10 points
Does the company actually want to work with Synkra?
- Actively seeking integration partners: 8-10
- Open to partnership: 5-7
- Neutral/uncertain: 2-4
- Resistant: 0-1

6. COMMERCIAL POTENTIAL - 10 points
Consider: referral opportunities, joint customers, reseller potential, marketplace exposure, cross-selling, automation demand, potential agency work.
- Substantial commercial opportunity: 10
- Strong opportunity: 7-9
- Moderate: 4-6
- Limited: 1-3
- None apparent: 0

7. INTEGRATION ECONOMICS - 5 points (deliberately low-weighted - a difficult integration can still be worth doing if the platform has thousands of relevant customers)
- Easy, inexpensive integration: 5
- Moderate effort: 3-4
- Difficult/expensive: 1-2
- Extremely difficult: 0

8. RELIABILITY & MATURITY - 5 points
Consider: API stability, documentation quality, uptime/reliability, versioning, developer support, company's operational maturity.
- Mature and reliable: 5
- Generally reliable: 3-4
- Questionable: 1-2
- Unacceptable: 0

Total possible: 100 points.

Assign a flag based on the total score:
- high_priority: 75-100
- worth_reviewing: 50-74
- monitor: 25-49
- low_priority: 0-24

Also identify:
- strengths: what makes this application promising (as a list of short points)
- risks: concerns, red flags, or reasons for caution (as a list of short points)
- missing_information: what the applicant did not provide that would help evaluate this properly (as a list of short points)
- summary: 2-3 sentences briefing a human reviewer on the overall picture

Respond with ONLY valid JSON, no markdown fences, no prose outside the JSON, in exactly this shape:
{
  "category_scores": {
    "customer_overlap": number,
    "technical_readiness": number,
    "strategic_value": number,
    "market_position": number,
    "partnership_willingness": number,
    "commercial_potential": number,
    "integration_economics": number,
    "reliability_maturity": number
  },
  "total_score": number,
  "flag": "high_priority" | "worth_reviewing" | "monitor" | "low_priority",
  "strengths": string[],
  "risks": string[],
  "missing_information": string[],
  "summary": string
}`;

export type AiScoringResult = {
  category_scores: Record<string, number>;
  total_score: number;
  flag: "high_priority" | "worth_reviewing" | "monitor" | "low_priority";
  strengths: string[];
  risks: string[];
  missing_information: string[];
  summary: string;
};

export async function scorePartnerApplication(
  submission: Record<string, unknown>,
): Promise<AiScoringResult> {
  const baseUrl = (process.env["OLLAMA_BASE_URL"] ?? "").replace(/\/+$/, "");
  const model = process.env["OLLAMA_MODEL"];
  if (!baseUrl) {
    throw new Error("Missing OLLAMA_BASE_URL environment variable.");
  }
  if (!model) {
    throw new Error("Missing OLLAMA_MODEL environment variable.");
  }

  const res = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      model,
      stream: false,
      // Ollama's structured-output mode - constrains the model to emit
      // valid JSON, same purpose as Anthropic's json-only instruction but
      // enforced by the server rather than just requested in the prompt.
      format: "json",
      messages: [
        { role: "system", content: RUBRIC_SYSTEM_PROMPT },
        {
          role: "user",
          content: `Score this Integration Partner application:\n\n${JSON.stringify(submission, null, 2)}`,
        },
      ],
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Ollama API error (${res.status}): ${body.slice(0, 300)}`);
  }

  const data = await res.json();
  const text: string = data?.message?.content ?? "";

  let parsed: AiScoringResult;
  try {
    // format: "json" should mean this is already clean, but strip fences
    // defensively in case the model wraps it anyway.
    const cleaned = text.replace(/^```json\s*|```$/g, "").trim();
    parsed = JSON.parse(cleaned);
  } catch (e) {
    throw new Error(`Could not parse AI scoring response as JSON: ${text.slice(0, 300)}`);
  }

  if (
    typeof parsed.total_score !== "number" ||
    !["high_priority", "worth_reviewing", "monitor", "low_priority"].includes(parsed.flag)
  ) {
    throw new Error("AI scoring response was missing required fields.");
  }

  return parsed;
}
