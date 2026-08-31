// Deterministic tier/price scoring for the qualification form. No AI
// here on purpose - matches the existing philosophy already used in
// synkra-core's Zoho workflows (churn_detector.py, cashflow_digest.py):
// numeric/rules decisions are plain code so the same answers always
// produce the same quote, and it's explainable if a prospect asks why
// they landed on a given tier. AI is reserved for genuinely free-text
// judgment calls elsewhere (e.g. Integration Partner scoring) - this
// isn't one of those.

export type QualifiableService = "ai-voice-agent" | "speed-to-lead" | "lead-reactivation";
export type Tier = "standard" | "growth" | "advanced";

export type QualificationAnswers = {
  service: QualifiableService;
  monthly_volume: "under_100" | "100_300" | "300_800" | "800_plus";
  integrations_needed: "0_1" | "2_3" | "4_plus";
  multiple_sources: boolean; // multiple phone numbers / lead sources / campaigns
  complex_logic: boolean;    // multi-step qualification, dynamic routing/segmentation
  company_size: "1-10" | "11-50" | "51-200" | "201-500" | "500+";
};

export type QuoteResult = {
  tier: Tier;
  monthly: number;
  setup: number;
  /**
   * True when the answers cleanly resolve to one tier with no
   * contradiction - eligible for auto-send. False means a human should
   * look at it before anything goes to the prospect.
   */
  passed: boolean;
  reasonIfFlagged?: string;
};

// Real figures given for Standard/Growth/Advanced. Setup figures beyond
// the Standard (lowest) tier are this project's own estimates, not
// numbers explicitly given - confirm before relying on them, and adjust
// here (the only place they're defined).
const PRICING: Record<QualifiableService, Record<Tier, { monthly: number; setup: number }>> = {
  "ai-voice-agent": {
    standard: { monthly: 700, setup: 2500 },
    growth: { monthly: 1500, setup: 4500 },
    advanced: { monthly: 2500, setup: 7000 },
  },
  "speed-to-lead": {
    standard: { monthly: 700, setup: 3000 },
    growth: { monthly: 1500, setup: 5000 },
    advanced: { monthly: 2500, setup: 7000 },
  },
  "lead-reactivation": {
    standard: { monthly: 800, setup: 3500 },
    growth: { monthly: 1800, setup: 5500 },
    advanced: { monthly: 3000, setup: 8000 },
  },
};

function volumeScore(v: QualificationAnswers["monthly_volume"]): number {
  return { under_100: 0, "100_300": 1, "300_800": 2, "800_plus": 3 }[v];
}

function integrationsScore(v: QualificationAnswers["integrations_needed"]): number {
  return { "0_1": 0, "2_3": 1, "4_plus": 2 }[v];
}

/**
 * Sums to 0-7. 0-1 = Standard, 2-4 = Growth, 5-7 = Advanced.
 * company_size is NOT scored directly - deliberate, matches the
 * business's own stated philosophy: a small business with high genuine
 * usage needs a higher tier than a bigger business with low usage.
 */
export function computeQuote(answers: QualificationAnswers): QuoteResult {
  const score =
    volumeScore(answers.monthly_volume) +
    integrationsScore(answers.integrations_needed) +
    (answers.multiple_sources ? 1 : 0) +
    (answers.complex_logic ? 1 : 0);

  const tier: Tier = score <= 1 ? "standard" : score <= 4 ? "growth" : "advanced";
  const { monthly, setup } = PRICING[answers.service][tier];

  // Flag for review rather than auto-send when the answers contradict
  // each other - e.g. very low stated volume but also wants multiple
  // sources AND complex logic. That combination is a genuine mismatch
  // signal worth a human's eyes, not a scoring edge case to silently
  // resolve.
  const lowVolume = answers.monthly_volume === "under_100";
  const highComplexitySignals =
    (answers.multiple_sources ? 1 : 0) + (answers.complex_logic ? 1 : 0) +
    (answers.integrations_needed === "4_plus" ? 1 : 0);

  if (lowVolume && highComplexitySignals >= 2) {
    return {
      tier,
      monthly,
      setup,
      passed: false,
      reasonIfFlagged: "Low stated volume combined with high complexity signals - worth confirming before quoting.",
    };
  }

  return { tier, monthly, setup, passed: true };
}
