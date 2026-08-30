export type UtilityInfo = {
  slug: string;
  name: string;
  description: string;
  status: "live" | "coming-soon";
};

// Every entry here has a real, working backend endpoint (see
// synkra-utilities/backend/app/routers/) and now a full frontend page too.
export const UTILITIES: UtilityInfo[] = [
  {
    slug: "qr-code-generator",
    name: "QR Code Generator",
    description:
      "Create a QR code for a link, WiFi network, WhatsApp number, vCard, and more. Customise the colours, make the background transparent, and add your own logo.",
    status: "live",
  },
  {
    slug: "background-remover",
    name: "Background Remover",
    description: "Remove the background from any image automatically.",
    status: "live",
  },
  {
    slug: "image-compressor",
    name: "Image Compressor",
    description: "Shrink JPG, PNG, and WebP file sizes without losing quality.",
    status: "live",
  },
  {
    slug: "image-converter",
    name: "Image Converter",
    description: "Convert between JPG, PNG, and WebP.",
    status: "live",
  },
  {
    slug: "file-compressor",
    name: "File Compressor",
    description: "Shrink PDF and DOCX file sizes.",
    status: "live",
  },
  {
    slug: "file-converter",
    name: "File Converter",
    description: "Convert PDF pages to images, or CSV to XLSX.",
    status: "live",
  },
  {
    slug: "csv-cleaner",
    name: "CSV Cleaner",
    description: "Clean up messy spreadsheet exports before you import them anywhere else.",
    status: "live",
  },
  {
    slug: "email-signature-generator",
    name: "Email Signature Generator",
    description: "Build a clean HTML email signature you can paste into any mail client.",
    status: "live",
  },
];
