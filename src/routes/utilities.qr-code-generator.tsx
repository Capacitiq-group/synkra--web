import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { buildHead } from "@/lib/seo";
import { postForBlob, UtilitiesApiError } from "@/lib/utilitiesApi";

export const Route = createFileRoute("/utilities/qr-code-generator")({
  head: () =>
    buildHead({
      title: "QR Code Generator",
      description:
        "Create a free QR code for a link, WiFi network, WhatsApp number, email, phone number, or vCard. Customise the colours, use a transparent background, and add your own logo. No account required.",
      path: "/utilities/qr-code-generator",
    }),
  component: QrGeneratorPage,
});

type QrType = "url" | "text" | "email" | "phone" | "whatsapp" | "wifi" | "vcard";

const QR_TYPES: { value: QrType; label: string }[] = [
  { value: "url", label: "Website link" },
  { value: "text", label: "Plain text" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone number" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "wifi", label: "WiFi network" },
  { value: "vcard", label: "Contact card (vCard)" },
];

function QrGeneratorPage() {
  const [qrType, setQrType] = useState<QrType>("url");
  const [outputFormat, setOutputFormat] = useState<"png" | "svg">("png");
  const [errorCorrection, setErrorCorrection] = useState<"L" | "M" | "Q" | "H">("M");
  const [size, setSize] = useState(10);
  const [margin, setMargin] = useState(4);
  const [fillColor, setFillColor] = useState("#000000");
  const [backColor, setBackColor] = useState("#FFFFFF");
  const [transparentBg, setTransparentBg] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const [logoSizePct, setLogoSizePct] = useState(22);

  // Payload fields
  const [value, setValue] = useState("https://synkra.co.za");
  const [email, setEmail] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [whatsappMessage, setWhatsappMessage] = useState("");
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiEncryption, setWifiEncryption] = useState<"WPA" | "WEP" | "nopass">("WPA");
  const [wifiHidden, setWifiHidden] = useState(false);
  const [vcardName, setVcardName] = useState("");
  const [vcardOrg, setVcardOrg] = useState("");
  const [vcardTitle, setVcardTitle] = useState("");
  const [vcardPhone, setVcardPhone] = useState("");
  const [vcardEmail, setVcardEmail] = useState("");
  const [vcardWebsite, setVcardWebsite] = useState("");
  const [vcardAddress, setVcardAddress] = useState("");

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const pngOnlyDisabled = outputFormat !== "png";

  function buildBody() {
    const body: Record<string, unknown> = {
      qr_type: qrType,
      output_format: outputFormat,
      error_correction: errorCorrection,
      size,
      margin,
      fill_color: fillColor,
      back_color: backColor,
      transparent_background: outputFormat === "png" ? transparentBg : false,
    };
    if (outputFormat === "png" && logoUrl.trim()) {
      body.logo_url = logoUrl.trim();
      body.logo_size_pct = logoSizePct;
    }
    switch (qrType) {
      case "url":
      case "text":
        body.value = value;
        break;
      case "email":
        body.email = email;
        if (emailSubject) body.email_subject = emailSubject;
        if (emailBody) body.email_body = emailBody;
        break;
      case "phone":
        body.phone = phone;
        break;
      case "whatsapp":
        body.whatsapp_number = whatsappNumber;
        if (whatsappMessage) body.whatsapp_message = whatsappMessage;
        break;
      case "wifi":
        body.wifi_ssid = wifiSsid;
        if (wifiPassword) body.wifi_password = wifiPassword;
        body.wifi_encryption = wifiEncryption;
        body.wifi_hidden = wifiHidden;
        break;
      case "vcard":
        body.vcard_name = vcardName;
        if (vcardOrg) body.vcard_org = vcardOrg;
        if (vcardTitle) body.vcard_title = vcardTitle;
        if (vcardPhone) body.vcard_phone = vcardPhone;
        if (vcardEmail) body.vcard_email = vcardEmail;
        if (vcardWebsite) body.vcard_website = vcardWebsite;
        if (vcardAddress) body.vcard_address = vcardAddress;
        break;
    }
    return body;
  }

  async function generate() {
    setBusy(true);
    setError(null);
    try {
      const blob = await postForBlob("/qr/generate", buildBody());
      const url = URL.createObjectURL(blob);
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = url;
      setPreviewUrl(url);
    } catch (e) {
      setError(e instanceof UtilitiesApiError ? e.message : "Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  }

  function download() {
    if (!previewUrl) return;
    const a = document.createElement("a");
    a.href = previewUrl;
    a.download = `synkra-qr.${outputFormat}`;
    a.click();
  }

  return (
    <section className="bg-[#0a0a0a]">
      <div className="container-main section-padding">
        <p className="label-tag">Free Tool</p>
        <h1 className="heading-display mt-6 max-w-[800px]">QR Code Generator</h1>
        <p className="body-text mt-6 max-w-[600px]">
          Create a QR code for a link, WiFi network, contact card, and more.
          Customise the colours, make the background transparent, and add
          your own logo. Nothing is stored — generated on demand, every
          time.
        </p>
      </div>

      <div className="container-main">
        <div className="hairline" />
      </div>

      <div className="container-main section-padding">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Form */}
          <div className="space-y-6">
            <div>
              <label className="label-tag block">QR code type</label>
              <select
                value={qrType}
                onChange={(e) => setQrType(e.target.value as QrType)}
                className="mt-2 w-full rounded-md border border-white/10 bg-[#0f0f0f] px-3 py-2.5 text-sm text-white focus:border-[var(--color-brand-green)] focus:outline-none"
              >
                {QR_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            {(qrType === "url" || qrType === "text") && (
              <Field label={qrType === "url" ? "URL" : "Text"}>
                <input value={value} onChange={(e) => setValue(e.target.value)} className="input" placeholder="https://" />
              </Field>
            )}

            {qrType === "email" && (
              <>
                <Field label="Email address"><input value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="hello@example.com" /></Field>
                <Field label="Subject (optional)"><input value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} className="input" /></Field>
                <Field label="Body (optional)"><textarea value={emailBody} onChange={(e) => setEmailBody(e.target.value)} className="input" rows={3} /></Field>
              </>
            )}

            {qrType === "phone" && (
              <Field label="Phone number"><input value={phone} onChange={(e) => setPhone(e.target.value)} className="input" placeholder="+27..." /></Field>
            )}

            {qrType === "whatsapp" && (
              <>
                <Field label="WhatsApp number"><input value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} className="input" placeholder="+27..." /></Field>
                <Field label="Pre-filled message (optional)"><textarea value={whatsappMessage} onChange={(e) => setWhatsappMessage(e.target.value)} className="input" rows={2} /></Field>
              </>
            )}

            {qrType === "wifi" && (
              <>
                <Field label="Network name (SSID)"><input value={wifiSsid} onChange={(e) => setWifiSsid(e.target.value)} className="input" /></Field>
                <Field label="Password">
                  <input value={wifiPassword} onChange={(e) => setWifiPassword(e.target.value)} className="input" disabled={wifiEncryption === "nopass"} />
                </Field>
                <Field label="Encryption">
                  <select value={wifiEncryption} onChange={(e) => setWifiEncryption(e.target.value as any)} className="input">
                    <option value="WPA">WPA/WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">None</option>
                  </select>
                </Field>
                <label className="flex items-center gap-2 text-sm text-white/70">
                  <input type="checkbox" checked={wifiHidden} onChange={(e) => setWifiHidden(e.target.checked)} />
                  Hidden network
                </label>
              </>
            )}

            {qrType === "vcard" && (
              <>
                <Field label="Full name"><input value={vcardName} onChange={(e) => setVcardName(e.target.value)} className="input" /></Field>
                <Field label="Organisation (optional)"><input value={vcardOrg} onChange={(e) => setVcardOrg(e.target.value)} className="input" /></Field>
                <Field label="Job title (optional)"><input value={vcardTitle} onChange={(e) => setVcardTitle(e.target.value)} className="input" /></Field>
                <Field label="Phone (optional)"><input value={vcardPhone} onChange={(e) => setVcardPhone(e.target.value)} className="input" /></Field>
                <Field label="Email (optional)"><input value={vcardEmail} onChange={(e) => setVcardEmail(e.target.value)} className="input" /></Field>
                <Field label="Website (optional)"><input value={vcardWebsite} onChange={(e) => setVcardWebsite(e.target.value)} className="input" /></Field>
                <Field label="Address (optional)"><input value={vcardAddress} onChange={(e) => setVcardAddress(e.target.value)} className="input" /></Field>
              </>
            )}

            <div className="hairline" />

            <div className="grid grid-cols-2 gap-4">
              <Field label="Format">
                <select value={outputFormat} onChange={(e) => setOutputFormat(e.target.value as "png" | "svg")} className="input">
                  <option value="png">PNG</option>
                  <option value="svg">SVG</option>
                </select>
              </Field>
              <Field label="Error correction">
                <select value={errorCorrection} onChange={(e) => setErrorCorrection(e.target.value as any)} className="input">
                  <option value="L">Low</option>
                  <option value="M">Medium</option>
                  <option value="Q">Quartile</option>
                  <option value="H">High</option>
                </select>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label={`Box size (${size}px)`}>
                <input type="range" min={1} max={40} value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full" />
              </Field>
              <Field label={`Margin (${margin})`}>
                <input type="range" min={0} max={20} value={margin} onChange={(e) => setMargin(Number(e.target.value))} className="w-full" />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Foreground colour">
                <input type="color" value={fillColor} onChange={(e) => setFillColor(e.target.value)} className="h-10 w-full rounded-md border border-white/10 bg-[#0f0f0f]" />
              </Field>
              <Field label="Background colour">
                <input
                  type="color"
                  value={backColor}
                  onChange={(e) => setBackColor(e.target.value)}
                  disabled={outputFormat === "png" && transparentBg}
                  className="h-10 w-full rounded-md border border-white/10 bg-[#0f0f0f] disabled:opacity-40"
                />
              </Field>
            </div>

            <label className={`flex items-center gap-2 text-sm ${pngOnlyDisabled ? "text-white/30" : "text-white/70"}`}>
              <input
                type="checkbox"
                checked={transparentBg}
                disabled={pngOnlyDisabled}
                onChange={(e) => setTransparentBg(e.target.checked)}
              />
              Transparent background (PNG only)
            </label>

            <div className="hairline" />

            <Field label="Logo / icon URL (optional, PNG only)">
              <input
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                disabled={pngOnlyDisabled}
                className="input disabled:opacity-40"
                placeholder="https://example.com/logo.png"
              />
              <p className="mt-1 text-xs text-white/40">
                Must be a publicly reachable image link (PNG, JPEG, or WebP) — this
                tool fetches it, it doesn't accept uploads. Error correction is
                automatically raised to High when a logo is used.
              </p>
            </Field>
            {logoUrl.trim() && (
              <Field label={`Logo size (${logoSizePct}% of QR width)`}>
                <input
                  type="range"
                  min={10}
                  max={35}
                  value={logoSizePct}
                  disabled={pngOnlyDisabled}
                  onChange={(e) => setLogoSizePct(Number(e.target.value))}
                  className="w-full"
                />
              </Field>
            )}

            <button onClick={generate} disabled={busy} className="btn-primary w-full justify-center disabled:opacity-60">
              {busy ? "Generating..." : "Generate QR code"}
            </button>
            {error && <p className="text-sm text-red-400">{error}</p>}
          </div>

          {/* Preview */}
          <div className="flex flex-col items-center justify-start">
            <div
              className="flex h-[320px] w-full max-w-[320px] items-center justify-center rounded-2xl border border-white/5"
              style={{
                backgroundImage:
                  "linear-gradient(45deg, #1a1a1a 25%, transparent 25%), linear-gradient(-45deg, #1a1a1a 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1a1a1a 75%), linear-gradient(-45deg, transparent 75%, #1a1a1a 75%)",
                backgroundSize: "20px 20px",
                backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                backgroundColor: "#0f0f0f",
              }}
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Generated QR code" className="max-h-full max-w-full" />
              ) : (
                <p className="body-sm px-8 text-center text-white/30">
                  Your QR code will appear here
                </p>
              )}
            </div>
            {previewUrl && (
              <button onClick={download} className="btn-secondary mt-6">
                Download {outputFormat.toUpperCase()}
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`.input { width: 100%; border-radius: 0.375rem; border: 1px solid rgba(255,255,255,0.1); background: #0f0f0f; padding: 0.5rem 0.75rem; font-size: 0.875rem; color: white; } .input:focus { outline: none; border-color: #56d722; } .input:disabled { opacity: 0.4; }`}</style>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label-tag block">{label}</label>
      <div className="mt-2">{children}</div>
    </div>
  );
}
