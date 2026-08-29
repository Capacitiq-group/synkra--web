export type UtilityInfo = {
  slug: string;
  name: string;
  description: string;
  status: "live" | "coming-soon";
};

// Every entry here has a real, working backend endpoint (see
// synkra-utilities/backend/app/routers/) - "coming-soon" means the
// frontend page for it hasn't been built yet, not that the API doesn't
// exist. Only qr-code-generator has a page this round.
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
    status: "coming-soon",
  },
  {
    slug: "image-compressor",
    name: "Image Compressor",
    description: "Shrink JPG, PNG, and WebP file sizes without losing quality.",
    status: "coming-soon",
  },
  {
    slug: "image-converter",
    name: "Image Converter",
    description: "Convert between JPG, PNG, and WebP.",
    status: "coming-soon",
  },
  {
    slug: "file-compressor",
    name: "File Compressor",
    description: "Shrink PDF and DOCX file sizes.",
    status: "coming-soon",
  },
  {
    slug: "file-converter",
    name: "File Converter",
    description: "Convert PDFs to images and CSVs to XLSX.",
    status: "coming-soon",
  },
  {
    slug: "csv-cleaner",
    name: "CSV Cleaner",
    description: "Clean up messy spreadsheet exports before you import them anywhere else.",
    status: "coming-soon",
  },
  {
    slug: "email-signature-generator",
    name: "Email Signature Generator",
    description: "Build a clean HTML email signature you can paste into any mail client.",
    status: "coming-soon",
  },
];
