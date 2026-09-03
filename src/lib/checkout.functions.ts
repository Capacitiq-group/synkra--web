/**
 * The trusted checkout entry point. Never trusts a client-submitted total:
 * recomputes the full quote server-side via calculateQuote() from the raw
 * selection (product, plan, billing period, student status, add-ons), then
 * hands the authoritative amount off to synkra-client-hub's /api/checkout -
 * that repo owns the actual account/PocketBase record, the Paystack
 * transaction, and (for the free plan) the magic-link welcome email.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { calculateQuote, PRICING_VERSION, type QuoteInput } from "@/lib/pricing";
import { TERMS_VERSION, PRIVACY_VERSION } from "@/lib/legalVersions";

const checkoutInputSchema = z.object({
  product: z.enum(["flow", "chat"]),
  planId: z.enum(["free", "basic", "pro"]),
  billingPeriod: z.enum(["monthly", "annual"]),
  isStudent: z.boolean(),
  addons: z
    .array(z.object({ id: z.string().min(1).max(80), quantity: z.number().int().min(0).max(999) }))
    .max(20)
    .default([]),
  email: z.string().min(5).max(200),
  name: z.string().min(1).max(120),
  phone: z.string().max(40).optional(),
  businessName: z.string().max(120).optional(),
  howHeard: z.string().max(200).optional(),
  marketingConsent: z.boolean(),
  termsAccepted: z.boolean(),
});

export type CheckoutSubmission = z.infer<typeof checkoutInputSchema>;

type CheckoutBridgeResult =
  | { ok: true; reference: string; status: "pending" | "activated"; authorizationUrl?: string }
  | { ok: false; error: string; message: string };

function clientHubApiUrl(): string {
  const base = process.env["CLIENT_HUB_API_URL"];
  if (!base) {
    throw new Error(
      "CLIENT_HUB_API_URL is not set - checkout cannot reach synkra-client-hub's /api/checkout.",
    );
  }
  return base.replace(/\/+$/, "");
}

export const submitCheckoutFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => checkoutInputSchema.parse(data))
  .handler(async ({ data }): Promise<CheckoutBridgeResult> => {
    if (!data.termsAccepted) {
      return {
        ok: false,
        error: "terms_not_accepted",
        message: "You need to agree to the Terms of Service and Privacy Policy to continue.",
      };
    }

    // The authoritative price. This is exactly why client-hub's own
    // createCheckout trusts amountCentsOverride when it comes through
    // /api/checkout - it's this calculation, not anything the browser sent.
    const quoteInput: QuoteInput = {
      product: data.product,
      planId: data.planId,
      billingPeriod: data.billingPeriod,
      isStudent: data.isStudent,
      addons: data.addons,
    };
    let quote: ReturnType<typeof calculateQuote>;
    try {
      quote = calculateQuote(quoteInput);
    } catch (err) {
      // calculateQuote throws a plain Error for an unrecognised addon id -
      // shouldn't happen from the UI's own add-on picker, but a stale
      // cached page or a direct call could still send one.
      return {
        ok: false,
        error: "invalid_selection",
        message: err instanceof Error ? err.message : "Invalid plan or add-on selection.",
      };
    }

    const secret = process.env["CLIENT_HUB_API_SECRET"];
    if (!secret) {
      console.error("[checkout] CLIENT_HUB_API_SECRET is not set");
      return { ok: false, error: "server_misconfigured", message: "Checkout is not available right now." };
    }

    try {
      const response = await fetch(`${clientHubApiUrl()}/api/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Synkra-Secret": secret },
        body: JSON.stringify({
          email: data.email,
          name: data.name,
          tier: quote.planId,
          billingPeriod: quote.billingPeriod,
          amountCents: quote.totalCents,
          pricingVersion: PRICING_VERSION,
          addons: quote.addonLines.map((line) => ({
            id: line.key,
            quantity: data.addons.find((a) => a.id === line.key)?.quantity ?? 1,
            label: line.label,
          })),
          studentVerified: quote.isStudent,
          marketingConsent: data.marketingConsent,
          termsAccepted: data.termsAccepted,
          termsVersion: TERMS_VERSION,
          privacyVersion: PRIVACY_VERSION,
          ...(data.phone ? { phone: data.phone } : {}),
          ...(data.businessName ? { businessName: data.businessName } : {}),
          ...(data.howHeard ? { howHeard: data.howHeard } : {}),
        }),
      });

      const body = (await response.json()) as CheckoutBridgeResult;
      if (!response.ok) {
        return {
          ok: false,
          error: "error" in body ? body.error : "checkout_failed",
          message: "message" in body ? body.message : "Something went wrong. Please try again.",
        };
      }
      return body;
    } catch (err) {
      console.error("[checkout] failed to reach client-hub /api/checkout:", err);
      return {
        ok: false,
        error: "network_error",
        message: "Could not reach the checkout service. Please try again in a moment.",
      };
    }
  });

/**
 * Read-only quote preview, so the UI can show live pricing (order summary
 * step) without a round trip to client-hub - purely a display convenience,
 * has zero bearing on what's actually charged (submitCheckoutFn recomputes
 * this itself server-side either way).
 */
const quotePreviewSchema = z.object({
  product: z.enum(["flow", "chat"]),
  planId: z.enum(["free", "basic", "pro"]),
  billingPeriod: z.enum(["monthly", "annual"]),
  isStudent: z.boolean(),
  addons: z
    .array(z.object({ id: z.string().min(1).max(80), quantity: z.number().int().min(0).max(999) }))
    .max(20)
    .default([]),
});

export const previewQuoteFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => quotePreviewSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      return { ok: true as const, quote: calculateQuote(data) };
    } catch (err) {
      return {
        ok: false as const,
        message: err instanceof Error ? err.message : "Invalid plan or add-on selection.",
      };
    }
  });
