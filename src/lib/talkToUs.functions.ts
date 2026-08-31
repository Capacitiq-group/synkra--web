import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import PocketBase from "pocketbase";
import { sendEmail } from "@/lib/email.server";

function publicClient(): PocketBase {
  const url = process.env["POCKETBASE_URL"] ?? process.env["VITE_POCKETBASE_URL"];
  if (!url) throw new Error("Missing POCKETBASE_URL environment variable.");
  const pb = new PocketBase(url.replace(/\/+$/, ""));
  pb.autoCancellation(false);
  return pb;
}

// Exactly 7 fields, per instruction - matches the form UI 1:1.
const TalkToUsInput = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(200),
  phone: z.string().min(1).max(64),
  company: z.string().min(1).max(200),
  service_interest: z.string().min(1).max(120),
  preferred_time: z.string().max(200).optional().default(""),
  message: z.string().max(2000).optional().default(""),
});

export const submitTalkToUs = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => TalkToUsInput.parse(d))
  .handler(async ({ data }) => {
    const pb = publicClient();

    let record: any;
    try {
      // Reuses form_submissions (same public-create/admin-read collection
      // every other site form uses) rather than a dedicated collection -
      // this form's shape fits the existing generic columns fine, unlike
      // Integration Partner's much larger structure.
      record = await pb.collection("form_submissions").create({
        form_type: "talk_to_us",
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        message: data.message || null,
        payload: {
          service_interest: data.service_interest,
          preferred_time: data.preferred_time || null,
        },
      });
    } catch (err: any) {
      return { ok: false, error: err?.message ?? "Could not submit your request." };
    }

    // Confirmation to the submitter: name + company only, matching the
    // same minimal-content rule as the Integration Partner confirmation.
    sendEmail({
      to: data.email,
      subject: "We've received your request to talk with Synkra",
      html: `
        <p>Hi ${data.name},</p>
        <p>Thanks for reaching out on behalf of ${data.company}. Our team will be in touch shortly to set up a time to talk.</p>
        <p>— Synkra</p>
      `,
    }).catch(() => {});

    // Internal notification to hello@synkra.co.za - this recipient is
    // Synkra's own team, so the full submission is appropriate here
    // (the minimal-content rule above is specifically about what the
    // external submitter receives, not internal visibility).
    sendEmail({
      to: "hello@synkra.co.za",
      subject: `New Talk to Us request: ${data.company}`,
      html: `
        <p>New consultation request via the website.</p>
        <ul>
          <li><strong>Name:</strong> ${data.name}</li>
          <li><strong>Company:</strong> ${data.company}</li>
          <li><strong>Email:</strong> ${data.email}</li>
          <li><strong>Phone:</strong> ${data.phone}</li>
          <li><strong>Interested in:</strong> ${data.service_interest}</li>
          ${data.preferred_time ? `<li><strong>Preferred time:</strong> ${data.preferred_time}</li>` : ""}
          ${data.message ? `<li><strong>Message:</strong> ${data.message}</li>` : ""}
        </ul>
      `,
    }).catch(() => {});

    return { ok: true, id: record.id };
  });
