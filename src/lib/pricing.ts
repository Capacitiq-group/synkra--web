// AUTHORITATIVE PRICING AND BILLING CALCULATION LAYER
// ---------------------------------------------------
// This is the single source of truth for every Synkra self-serve price,
// discount, add-on and cancellation calculation. UI components must never
// re-derive totals: they display what this module returns, and the server
// (src/lib/checkout.functions.ts) recomputes it from the raw selection
// before any payment handoff. Never trust a client-submitted total.
//
// All money is handled in integer cents (ZAR) to avoid float drift.

export type ProductId = "flow" | "chat";
export type BillingPeriod = "monthly" | "annual";
export type PlanId = "free" | "basic" | "pro";
export type DiscountType = "none" | "annual" | "student" | "promotional";

/**
 * Bump when any price, allowance or rule below changes. Historical billing
 * records store this string so an old transaction stays explainable under
 * the pricing that applied when it was purchased. Never edit past records.
 */
export const PRICING_VERSION = "flow-2026-09-01";

export const BILLING_CONFIG = {
  currency: "ZAR",
  /** Standard annual customers are charged 10 months for 12 months access. */
  annualMonthsCharged: 10,
  annualMonthsAccess: 12,
  /** Student annual is student monthly x 12 - the annual incentive does NOT stack. */
  studentAnnualMonthsCharged: 12,
  /**
   * Early-cancellation adjustment on annual plans, expressed as a fraction of
   * the amount originally paid. Modelled at 10% and SUBJECT TO LEGAL REVIEW -
   * this is not a final published policy. One value, referenced everywhere.
   */
  earlyCancellationRate: 0.1,
  /** Included monthly allowances never roll over. Purchased add-ons do. */
  includedAllowanceRollsOver: false,
} as const;

export type IncludedAllowance = {
  automationRuns: number;
  activeWorkflows: number;
  storageGb: number;
  aiOperations: number;
  emails: number;
  sms: number;
  whatsappConversations: number;
  voiceMinutes: number;
};

export type PlanConfig = {
  product: ProductId;
  id: PlanId;
  name: string;
  /** Regular monthly price in cents. */
  monthlyCents: number;
  /** Approved student monthly price in cents, or null when not eligible. */
  studentMonthlyCents: number | null;
  /** Standard annual customers get the two-months-free incentive. */
  annualEligible: boolean;
  included: IncludedAllowance;
  summary: string;
};

const NO_ALLOWANCE: IncludedAllowance = {
  automationRuns: 0,
  activeWorkflows: 0,
  storageGb: 0,
  aiOperations: 0,
  emails: 0,
  sms: 0,
  whatsappConversations: 0,
  voiceMinutes: 0,
};

export const FLOW_PLANS: PlanConfig[] = [
  {
    product: "flow",
    id: "free",
    name: "Free Forever",
    monthlyCents: 0,
    studentMonthlyCents: null,
    annualEligible: false,
    included: { ...NO_ALLOWANCE, automationRuns: 500, activeWorkflows: 5, storageGb: 1 },
    summary: "500 automation runs, 5 active workflows, 1 GB storage.",
  },
  {
    product: "flow",
    id: "basic",
    name: "Basic",
    monthlyCents: 19900,
    studentMonthlyCents: 14900,
    annualEligible: true,
    included: {
      automationRuns: 5000,
      activeWorkflows: 25,
      storageGb: 5,
      aiOperations: 1000,
      emails: 1000,
      sms: 50,
      whatsappConversations: 100,
      voiceMinutes: 10,
    },
    summary: "Higher run limits with an included monthly usage allowance.",
  },
  {
    product: "flow",
    id: "pro",
    name: "Pro",
    monthlyCents: 39900,
    studentMonthlyCents: 24900,
    annualEligible: true,
    included: {
      automationRuns: 25000,
      activeWorkflows: 100,
      storageGb: 25,
      aiOperations: 5000,
      emails: 5000,
      sms: 250,
      whatsappConversations: 500,
      voiceMinutes: 60,
    },
    summary: "The highest run limits, storage and included usage on Flow.",
  },
];

export function getPlan(product: ProductId, planId: PlanId): PlanConfig {
  const plan = FLOW_PLANS.find((p) => p.product === product && p.id === planId);
  if (!plan) throw new Error(`Unknown plan: ${product}/${planId}`);
  return plan;
}

// ---------------------------------------------------------------------------
// ADD-ONS
// Purchased add-ons are tracked separately from included allowance and are
// explicitly bound to a product, so a Flow checkout can never buy or consume
// a Chat add-on.
// ---------------------------------------------------------------------------

export type AddonId =
  | "flow_ai_operations"
  | "flow_email"
  | "flow_sms"
  | "flow_whatsapp"
  | "flow_voice"
  | "flow_storage";

export type AddonConfig = {
  id: AddonId;
  product: ProductId;
  name: string;
  /** What one unit of this add-on grants. */
  packDescription: string;
  unit: string;
  unitsPerPack: number;
  priceCents: number;
  /** Storage is a recurring monthly add-on; usage packs are once-off. */
  recurring: boolean;
  /** How long a purchased pack stays valid. Null for recurring add-ons. */
  validityMonths: number | null;
};

export const FLOW_ADDONS: AddonConfig[] = [
  {
    id: "flow_ai_operations",
    product: "flow",
    name: "AI Operations",
    packDescription: "500 AI operations",
    unit: "operations",
    unitsPerPack: 500,
    priceCents: 5000,
    recurring: false,
    validityMonths: 6,
  },
  {
    id: "flow_email",
    product: "flow",
    name: "Email",
    packDescription: "500 emails",
    unit: "emails",
    unitsPerPack: 500,
    priceCents: 5000,
    recurring: false,
    validityMonths: 6,
  },
  {
    id: "flow_sms",
    product: "flow",
    name: "SMS",
    packDescription: "50 SMS",
    unit: "messages",
    unitsPerPack: 50,
    priceCents: 5000,
    recurring: false,
    validityMonths: 6,
  },
  {
    id: "flow_whatsapp",
    product: "flow",
    name: "WhatsApp",
    packDescription: "100 conversations",
    unit: "conversations",
    unitsPerPack: 100,
    priceCents: 5000,
    recurring: false,
    validityMonths: 6,
  },
  {
    id: "flow_voice",
    product: "flow",
    name: "Voice Calls",
    packDescription: "10 minutes",
    unit: "minutes",
    unitsPerPack: 10,
    priceCents: 5000,
    recurring: false,
    validityMonths: 6,
  },
  {
    id: "flow_storage",
    product: "flow",
    name: "Extra Storage",
    packDescription: "1 GB",
    unit: "GB",
    unitsPerPack: 1,
    priceCents: 3000,
    recurring: true,
    validityMonths: null,
  },
];

export function addonsForProduct(product: ProductId): AddonConfig[] {
  return FLOW_ADDONS.filter((a) => a.product === product);
}

export function getAddon(product: ProductId, id: string): AddonConfig {
  const addon = FLOW_ADDONS.find((a) => a.id === id && a.product === product);
  if (!addon) throw new Error(`Add-on ${id} is not available for product ${product}`);
  return addon;
}

// ---------------------------------------------------------------------------
// PROMOTIONS
// Discounts never stack. Each promotion declares what it may combine with;
// the resolver below picks exactly ONE pricing benefit.
// ---------------------------------------------------------------------------

export type Promotion = {
  code: string;
  label: string;
  percentOff: number;
  /** Which other benefits this promotion may combine with. Empty = none. */
  combinesWith: DiscountType[];
  expiresAt: string | null;
};

export const PROMOTIONS: Promotion[] = [];

export function findPromotion(code: string | null | undefined): Promotion | null {
  if (!code) return null;
  const normalised = code.trim().toUpperCase();
  const promo = PROMOTIONS.find((p) => p.code === normalised);
  if (!promo) return null;
  if (promo.expiresAt && new Date(promo.expiresAt).getTime() < Date.now()) return null;
  return promo;
}

// ---------------------------------------------------------------------------
// QUOTE CALCULATION
// ---------------------------------------------------------------------------

export type QuoteInput = {
  product: ProductId;
  planId: PlanId;
  billingPeriod: BillingPeriod;
  isStudent: boolean;
  /** Add-on packs by id. Quantities are clamped to sane integers. */
  addons?: { id: string; quantity: number }[];
  promoCode?: string | null;
};

export type QuoteLine = {
  key: string;
  label: string;
  detail: string;
  amountCents: number;
};

export type Quote = {
  pricingVersion: string;
  currency: string;
  product: ProductId;
  planId: PlanId;
  planName: string;
  billingPeriod: BillingPeriod;
  isStudent: boolean;
  /** The monthly rate the plan is charged at before the annual incentive. */
  effectiveMonthlyCents: number;
  /** The normal (non-student) monthly rate - used by refund calculations. */
  normalMonthlyCents: number;
  monthsCharged: number;
  monthsAccess: number;
  planSubtotalCents: number;
  addonLines: QuoteLine[];
  addonSubtotalCents: number;
  subtotalCents: number;
  discountType: DiscountType;
  discountLabel: string | null;
  discountCents: number;
  taxCents: number;
  totalCents: number;
  paidUpfront: boolean;
  /** Human-readable note about which single benefit was applied. */
  benefitNote: string | null;
  includedAllowance: IncludedAllowance;
  rejectedBenefits: string[];
};

function clampQty(n: unknown): number {
  const q = Math.floor(Number(n));
  if (!Number.isFinite(q) || q < 0) return 0;
  return Math.min(q, 999);
}

export function calculateQuote(input: QuoteInput): Quote {
  const plan = getPlan(input.product, input.planId);
  const promo = findPromotion(input.promoCode);
  const rejected: string[] = [];

  const studentEligible = input.isStudent && plan.studentMonthlyCents !== null;
  if (input.isStudent && !studentEligible) {
    rejected.push("Student pricing is not available on this plan.");
  }

  const annualRequested = input.billingPeriod === "annual" && plan.annualEligible;
  if (input.billingPeriod === "annual" && !plan.annualEligible) {
    rejected.push("Annual billing is not available on this plan.");
  }

  // ---- Single-benefit resolution. Discounts must never stack. ----
  // Priority: student pricing > annual incentive > promotional discount.
  let discountType: DiscountType = "none";
  if (studentEligible) discountType = "student";
  else if (annualRequested) discountType = "annual";
  else if (promo && promo.percentOff > 0) discountType = "promotional";

  if (studentEligible && annualRequested) {
    rejected.push(
      "The annual two-months-free incentive cannot be combined with student pricing.",
    );
  }
  if (promo && discountType !== "promotional") {
    const allowed = promo.combinesWith.includes(discountType);
    if (!allowed) {
      rejected.push(
        `Promotional code ${promo.code} cannot be combined with the ${discountType} pricing benefit.`,
      );
    }
  }

  const normalMonthlyCents = plan.monthlyCents;
  const effectiveMonthlyCents = studentEligible
    ? (plan.studentMonthlyCents as number)
    : normalMonthlyCents;

  const isAnnual = annualRequested;
  const monthsAccess = isAnnual ? BILLING_CONFIG.annualMonthsAccess : 1;
  // Students pay 12 x student monthly. Standard annual pays 10 x monthly.
  const monthsCharged = isAnnual
    ? studentEligible
      ? BILLING_CONFIG.studentAnnualMonthsCharged
      : BILLING_CONFIG.annualMonthsCharged
    : 1;

  // List price before any benefit: what the customer would pay at the normal
  // monthly rate for the months of access they receive.
  const listPlanCents = normalMonthlyCents * monthsAccess;
  const planSubtotalCents = effectiveMonthlyCents * monthsCharged;

  const addonLines: QuoteLine[] = [];
  for (const requested of input.addons ?? []) {
    const qty = clampQty(requested.quantity);
    if (qty <= 0) continue;
    const addon = getAddon(input.product, requested.id);
    // Recurring add-ons follow the plan's billing period; usage packs are once-off.
    const multiplier = addon.recurring ? monthsCharged : 1;
    addonLines.push({
      key: addon.id,
      label: `${addon.name} x ${qty}`,
      detail: addon.recurring
        ? `${addon.packDescription} per month${isAnnual ? ", billed upfront for the year" : ""}`
        : `${addon.packDescription} per pack, valid ${addon.validityMonths} months`,
      amountCents: addon.priceCents * qty * multiplier,
    });
  }
  const addonSubtotalCents = addonLines.reduce((s, l) => s + l.amountCents, 0);

  let discountCents = 0;
  let discountLabel: string | null = null;
  let benefitNote: string | null = null;

  if (discountType === "annual") {
    discountCents = listPlanCents - planSubtotalCents;
    discountLabel = "Annual incentive (2 months free)";
    benefitNote = "Paid upfront for 12 months of access at 10 months' price.";
  } else if (discountType === "student") {
    discountCents = listPlanCents - planSubtotalCents;
    discountLabel = "Student discount";
    benefitNote = isAnnual
      ? "Student annual is 12 x the student monthly price. The annual two-months-free incentive does not apply on top of student pricing."
      : "Student monthly pricing applied.";
  } else if (discountType === "promotional" && promo) {
    discountCents = Math.round((planSubtotalCents * promo.percentOff) / 100);
    discountLabel = `${promo.label} (${promo.percentOff}% off)`;
    benefitNote = `Promotional code ${promo.code} applied.`;
  }

  const subtotalCents = listPlanCents + addonSubtotalCents;
  const totalCents = Math.max(0, subtotalCents - discountCents);

  return {
    pricingVersion: PRICING_VERSION,
    currency: BILLING_CONFIG.currency,
    product: input.product,
    planId: plan.id,
    planName: plan.name,
    billingPeriod: isAnnual ? "annual" : "monthly",
    isStudent: studentEligible,
    effectiveMonthlyCents,
    normalMonthlyCents,
    monthsCharged,
    monthsAccess,
    planSubtotalCents,
    addonLines,
    addonSubtotalCents,
    subtotalCents,
    discountType,
    discountLabel,
    discountCents,
    // Prices are quoted VAT inclusive; no separate tax line is added here.
    taxCents: 0,
    totalCents,
    paidUpfront: isAnnual,
    benefitNote,
    includedAllowance: plan.included,
    rejectedBenefits: rejected,
  };
}

// ---------------------------------------------------------------------------
// ADD-ON CONSUMPTION (FIFO)
// Included allowance is always consumed first and never rolls over. Purchased
// packs are then consumed oldest purchase first, so every deduction is
// auditable. Balances live in the client portal; this is the reference
// implementation the portal and refund maths share.
// ---------------------------------------------------------------------------

export type PurchasedAddonLot = {
  lotId: string;
  product: ProductId;
  addonId: AddonId;
  purchasedAt: string;
  expiresAt: string | null;
  unitsPurchased: number;
  unitsConsumed: number;
  unitPriceCents: number;
};

export type ConsumptionResult = {
  fromIncluded: number;
  fromPurchased: { lotId: string; units: number }[];
  unmet: number;
  includedRemaining: number;
  lots: PurchasedAddonLot[];
};

export function consumeUsage(args: {
  product: ProductId;
  addonId: AddonId;
  units: number;
  includedRemaining: number;
  lots: PurchasedAddonLot[];
  at?: Date;
}): ConsumptionResult {
  const at = args.at ?? new Date();
  let remaining = Math.max(0, Math.floor(args.units));

  const fromIncludedUnits = Math.min(remaining, Math.max(0, args.includedRemaining));
  remaining -= fromIncludedUnits;

  const lots = args.lots
    .filter((l) => l.product === args.product && l.addonId === args.addonId)
    .filter((l) => !l.expiresAt || new Date(l.expiresAt).getTime() >= at.getTime())
    .sort((a, b) => new Date(a.purchasedAt).getTime() - new Date(b.purchasedAt).getTime())
    .map((l) => ({ ...l }));

  const fromPurchased: { lotId: string; units: number }[] = [];
  for (const lot of lots) {
    if (remaining <= 0) break;
    const available = lot.unitsPurchased - lot.unitsConsumed;
    if (available <= 0) continue;
    const take = Math.min(available, remaining);
    lot.unitsConsumed += take;
    remaining -= take;
    fromPurchased.push({ lotId: lot.lotId, units: take });
  }

  return {
    fromIncluded: fromIncludedUnits,
    fromPurchased,
    unmet: remaining,
    includedRemaining: Math.max(0, args.includedRemaining - fromIncludedUnits),
    lots,
  };
}

/** Included allowance expires at the end of each billing period. */
export function rolloverIncludedAllowance(): number {
  return BILLING_CONFIG.includedAllowanceRollsOver ? -1 : 0;
}

// ---------------------------------------------------------------------------
// CANCELLATION / REFUND
// Deterministic and auditable. The annual incentive is reversed on early
// cancellation: usage is re-priced at the normal monthly rate.
// ---------------------------------------------------------------------------

export type CancellationInput = {
  amountPaidCents: number;
  /** The plan's normal monthly rate at the time of purchase. */
  normalMonthlyCents: number;
  billingPeriod: BillingPeriod;
  startDate: string;
  cancellationDate: string;
  /** Once-off purchased add-on spend, generally non-refundable. */
  purchasedAddonCents?: number;
  pricingVersion?: string;
  earlyCancellationRate?: number;
};

export type CancellationResult = {
  pricingVersion: string;
  amountPaidCents: number;
  monthsUsed: number;
  monthsAccess: number;
  usageChargeCents: number;
  annualDiscountReversedCents: number;
  cancellationAdjustmentRate: number;
  cancellationAdjustmentCents: number;
  purchasedAddonCents: number;
  purchasedAddonRefundCents: number;
  refundCents: number;
  breakdown: string[];
  notes: string[];
};

export function monthsBetween(start: string, end: string): number {
  const s = new Date(start);
  const e = new Date(end);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return 0;
  if (e <= s) return 0;
  let months =
    (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
  if (e.getDate() > s.getDate()) months += 1; // any part of a month counts as used
  return Math.max(1, months);
}

export function calculateCancellation(input: CancellationInput): CancellationResult {
  const rate = input.earlyCancellationRate ?? BILLING_CONFIG.earlyCancellationRate;
  const monthsAccess =
    input.billingPeriod === "annual" ? BILLING_CONFIG.annualMonthsAccess : 1;
  const monthsUsedRaw = monthsBetween(input.startDate, input.cancellationDate);
  const monthsUsed = Math.min(monthsUsedRaw, monthsAccess);

  const usageChargeCents = input.normalMonthlyCents * monthsUsed;
  const addonSpend = Math.max(0, input.purchasedAddonCents ?? 0);
  const planPaidCents = Math.max(0, input.amountPaidCents - addonSpend);

  // Reversing the incentive means months used are charged at the normal rate.
  const annualDiscountReversedCents =
    input.billingPeriod === "annual"
      ? Math.max(0, usageChargeCents - Math.round((planPaidCents / monthsAccess) * monthsUsed))
      : 0;

  const cancellationAdjustmentCents =
    monthsUsed < monthsAccess ? Math.round(input.amountPaidCents * rate) : 0;

  const refundBeforeFloor =
    planPaidCents - usageChargeCents - cancellationAdjustmentCents;
  const refundCents = Math.max(0, refundBeforeFloor);

  const notes = [
    "Purchased add-ons are generally non-refundable, subject to applicable consumer-law rights and to circumstances where Synkra failed to provide the purchased service. Refundable add-on amounts are assessed case by case and recorded separately.",
    "Included monthly allowances are not refundable and do not roll over.",
    `The early-cancellation adjustment is modelled at ${(rate * 100).toFixed(0)}% and is subject to legal review.`,
  ];

  return {
    pricingVersion: input.pricingVersion ?? PRICING_VERSION,
    amountPaidCents: input.amountPaidCents,
    monthsUsed,
    monthsAccess,
    usageChargeCents,
    annualDiscountReversedCents,
    cancellationAdjustmentRate: rate,
    cancellationAdjustmentCents,
    purchasedAddonCents: addonSpend,
    purchasedAddonRefundCents: 0,
    refundCents,
    breakdown: [
      `Amount paid: ${formatCents(input.amountPaidCents)}`,
      `Add-on spend excluded from plan refund: ${formatCents(addonSpend)}`,
      `Months used: ${monthsUsed} of ${monthsAccess}`,
      `Usage charged at normal monthly rate (${formatCents(input.normalMonthlyCents)}): ${formatCents(usageChargeCents)}`,
      `Annual incentive reversed: ${formatCents(annualDiscountReversedCents)}`,
      `Cancellation adjustment: ${formatCents(cancellationAdjustmentCents)}`,
      `Refundable balance: ${formatCents(refundCents)}`,
    ],
    notes,
  };
}

export function formatCents(cents: number): string {
  const value = (cents / 100).toLocaleString("en-ZA", {
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return `R${value}`;
}
