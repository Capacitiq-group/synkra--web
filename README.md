# Synkra AI

> **Architecture:** the canonical description of Synkra's PocketBase instances,
> which repo uses which one, and the identity model lives in one place:
> [`SYNKRA-ARCHITECTURE.md` in `synkra-os`](https://github.com/Capacitiq-group/synkra-os/blob/main/SYNKRA-ARCHITECTURE.md).
> Do not restate it here — update it there.

> **Note:** the prose below is the original build brief and is stale in places
> (it describes Next.js + Supabase; this repo is TanStack Start + PocketBase).
> For anything about databases, instances or admin identity, the canonical doc
> above wins.


You are building the Synkra marketing website. Synkra is a South African AI automation agency. The site is built with Next.js 14 App Router, Tailwind CSS, and deployed on Vercel. The backend for form submissions uses Supabase. This prompt covers the complete foundation — repository structure, configuration files, global design system, SEO architecture, and empty page scaffolding for every page on the site. STACK

Next.js 14 with App Router



Tailwind CSS



Supabase for form submissions



Vercel for deployment



TypeScript throughout



next-seo or Next.js built-in metadata API for SEO REPOSITORY STRUCTURE

Create the following folder and file structure in full. Every file should exist even if empty at this stage: synkra/

├── app/

│   ├── layout.tsx

│   ├── page.tsx

│   ├── about/

│   │   └── page.tsx

│   ├── services/

│   │   ├── page.tsx

│   │   ├── ai-voice-agent/

│   │   │   └── page.tsx

│   │   ├── ai-web-widget/

│   │   │   └── page.tsx

│   │   ├── ai-whatsapp-agent/

│   │   │   └── page.tsx

│   │   ├── speed-to-lead/

│   │   │   └── page.tsx

│   │   ├── lead-reactivation/

│   │   │   └── page.tsx

│   │   ├── ai-knowledge-base/

│   │   │   └── page.tsx

│   │   └── automated-hiring/

│   │       └── page.tsx

│   ├── pricing/

│   │   └── page.tsx

│   ├── partner/

│   │   ├── page.tsx

│   │   ├── agency/

│   │   │   └── page.tsx

│   │   └── referral/

│   │       └── page.tsx

│   ├── contact/

│   │   └── page.tsx

│   ├── roi-calculator/

│   │   └── page.tsx

│   ├── help/

│   │   └── page.tsx

│   ├── legal/

│   │   ├── privacy-policy/

│   │   │   └── page.tsx

│   │   ├── terms-of-service/

│   │   │   └── page.tsx

│   │   └── refund-policy/

│   │       └── page.tsx

│   └── api/

│       └── submit-form/

│           └── route.ts

├── components/

│   ├── layout/

│   │   ├── Navbar.tsx

│   │   └── Footer.tsx

│   ├── ui/

│   │   ├── Button.tsx

│   │   ├── ServiceCard.tsx

│   │   ├── PricingCard.tsx

│   │   ├── StepCard.tsx

│   │   ├── HelpAccordion.tsx

│   │   └── FormInput.tsx

│   └── sections/

│       ├── Hero.tsx

│       ├── Problem.tsx

│       ├── Outcome.tsx

│       ├── HowItWorks.tsx

│       ├── ServicesGrid.tsx

│       ├── PricingTiers.tsx

│       ├── AfterCheckout.tsx

│       ├── PartnerSection.tsx

│       ├── ROILink.tsx

│       └── BottomCTA.tsx

├── lib/

│   ├── supabase.ts

│   └── metadata.ts

├── public/

│   ├── favicon.ico

│   ├── og-image.png

│   └── brochures/

├── styles/

│   └── globals.css

├── .env.local

├── .env.example

├── .gitignore

├── vercel.json

├── next.config.js

├── tailwind.config.ts

└── tsconfig.json ENVIRONMENT VARIABLES

Create .env.local with the following variables. This file must be added to .gitignore immediately and never committed to GitHub:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url

NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

CONTACT_EMAIL=hello@capacitiqgroup.co.za

QUOTE_EMAIL=quotes@capacitiqgroup.co.za

PARTNER_EMAIL=partners@capacitiqgroup.co.za

Create .env.example with the same keys but empty values. This file is committed to GitHub so anyone cloning the repo knows which variables are required:

NEXT_PUBLIC_SUPABASE_URL=

NEXT_PUBLIC_SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=

CONTACT_EMAIL=

QUOTE_EMAIL=

PARTNER_EMAIL=

Create .gitignore and ensure it includes at minimum:

.env.local

.env

node_modules

.next VERCEL.JSON

Create vercel.json in the root with the following configuration: {

  "framework": "nextjs",

  "buildCommand": "next build",

  "devCommand": "next dev",

  "installCommand": "npm install",

  "regions": ["iad1"],

  "headers": [

    {

      "source": "/(.*)",

      "headers": [

        {

          "key": "X-Content-Type-Options",

          "value": "nosniff"

        },

        {

          "key": "X-Frame-Options",

          "value": "DENY"

        },

        {

          "key": "X-XSS-Protection",

          "value": "1; mode=block"

        },

        {

          "key": "Referrer-Policy",

          "value": "strict-origin-when-cross-origin"

        },

        {

          "key": "Permissions-Policy",

          "value": "camera=(), microphone=(), geolocation=()"

        }

      ]

    }

  ],

  "redirects": [

    {

      "source": "/home",

      "destination": "/",

      "permanent": true

    }

  ]

} GLOBAL DESIGN SYSTEM — TAILWIND CONFIG

Create tailwind.config.ts with the complete Synkra design system: import type { Config } from 'tailwindcss'



const config: Config = {

  content: [

    './app/**/*.{js,ts,jsx,tsx,mdx}',

    './components/**/*.{js,ts,jsx,tsx,mdx}',

  ],

  theme: {

    extend: {

      colors: {

        brand: {

          black: '#0A0A0A',

          charcoal: '#252430',

          purple: {

            deep: '#42007b',

            mid: '#5d03a5',

            light: '#5a3489',

          },

          green: '#56d722',

          white: '#FFFFFF',

          gray: {

            light: '#F4F4F8',

            mid: '#888888',

            dark: '#333333',

          }

        }

      },

      fontFamily: {

        sans: ['Inter', 'sans-serif'],

        display: ['Inter', 'sans-serif'],

      },

      fontSize: {

        'display-xl': ['5rem', { lineHeight: '1.05', letterSpacing: '-0.02em', fontWeight: '700' }],

        'display-lg': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],

        'display-md': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],

        'display-sm': ['2.25rem', { lineHeight: '1.15', letterSpacing: '-0.01em', fontWeight: '700' }],

        'body-lg': ['1.125rem', { lineHeight: '1.7', fontWeight: '400' }],

        'body-md': ['1rem', { lineHeight: '1.7', fontWeight: '400' }],

        'body-sm': ['0.875rem', { lineHeight: '1.6', fontWeight: '400' }],

        'label': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.08em', fontWeight: '500' }],

      },

      spacing: {

        'section': '7rem',

        'section-sm': '4rem',

        'container': '1280px',

      },

      borderRadius: {

        'card': '1rem',

        'pill': '9999px',

        'button': '0.5rem',

      },

      maxWidth: {

        'container': '1280px',

        'content': '720px',

      },

      animation: {

        'fade-in': 'fadeIn 0.5s ease-in-out',

        'slide-up': 'slideUp 0.5s ease-out',

      },

      keyframes: {

        fadeIn: {

          '0%': { opacity: '0' },

          '100%': { opacity: '1' },

        },

        slideUp: {

          '0%': { opacity: '0', transform: 'translateY(20px)' },

          '100%': { opacity: '1', transform: 'translateY(0)' },

        },

      },

    },

  },

  plugins: [],

}



export default config GLOBAL CSS

Create styles/globals.css: @tailwind base;

@tailwind components;

@tailwind utilities;



@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');



@layer base {

  * {

    box-sizing: border-box;

    margin: 0;

    padding: 0;

  }



  html {

    scroll-behavior: smooth;

    -webkit-font-smoothing: antialiased;

    -moz-osx-font-smoothing: grayscale;

  }



  body {

    background-color: #0A0A0A;

    color: #FFFFFF;

    font-family: 'Inter', sans-serif;

  }



  ::selection {

    background-color: #56d722;

    color: #0A0A0A;

  }



  ::-webkit-scrollbar {

    width: 6px;

  }



  ::-webkit-scrollbar-track {

    background: #0A0A0A;

  }



  ::-webkit-scrollbar-thumb {

    background: #252430;

    border-radius: 9999px;

  }

}



@layer components {

  .container-main {

    @apply max-w-[1280px] mx-auto px-6 lg:px-12;

  }



  .section-padding {

    @apply py-24 lg:py-28;

  }



  .section-padding-sm {

    @apply py-16 lg:py-20;

  }



  .btn-primary {

    @apply bg-brand-green text-brand-black font-semibold text-body-md px-6 py-3 rounded-button hover:opacity-90 transition-opacity duration-200 inline-flex items-center gap-2;

  }



  .btn-secondary {

    @apply border border-white/20 text-white font-semibold text-body-md px-6 py-3 rounded-button hover:border-white/40 transition-colors duration-200 inline-flex items-center gap-2;

  }



  .btn-pill-primary {

    @apply bg-brand-green text-brand-black font-semibold text-body-sm px-5 py-2.5 rounded-pill hover:opacity-90 transition-opacity duration-200;

  }



  .card-dark {

    @apply bg-brand-charcoal rounded-card p-8 border border-white/5;

  }



  .label-tag {

    @apply text-label uppercase tracking-widest text-brand-gray-mid;

  }



  .heading-display {

    @apply text-display-lg lg:text-display-xl font-bold text-white leading-tight tracking-tight;

  }



  .heading-section {

    @apply text-display-sm lg:text-display-md font-bold text-white leading-tight tracking-tight;

  }



  .heading-card {

    @apply text-xl font-bold text-white;

  }



  .body-text {

    @apply text-body-md text-white/70 leading-relaxed;

  }



  .green-text {

    @apply text-brand-green;

  }



  .divider {

    @apply border-t border-white/5;

  }

} GLOBAL SEO ARCHITECTURE

Create lib/metadata.ts with the base metadata configuration used across all pages: import type { Metadata } from 'next'



const baseUrl = 'https://synkra.co.za'



export const defaultMetadata: Metadata = {

  metadataBase: new URL(baseUrl),

  title: {

    default: 'Synkra — AI Systems That Run Your Business While You Grow It',

    template: '%s | Synkra'

  },

  description: 'Synkra builds AI automation systems for South African businesses. Voice agents, WhatsApp agents, speed-to-lead systems, lead reactivation, knowledge bases, and automated hiring. Starting from R700 per month.',

  keywords: [

    'AI automation South Africa',

    'AI receptionist South Africa',

    'WhatsApp bot South Africa',

    'lead automation South Africa',

    'business automation South Africa',

    'AI agency South Africa',

    'voice agent South Africa',

    'automated hiring South Africa',

    'AI knowledge base',

    'speed to lead system',

  ],

  authors: [{ name: 'Synkra' }],

  creator: 'Synkra',

  publisher: 'Synkra',

  robots: {

    index: true,

    follow: true,

    googleBot: {

      index: true,

      follow: true,

      'max-video-preview': -1,

      'max-image-preview': 'large',

      'max-snippet': -1,

    },

  },

  openGraph: {

    type: 'website',

    locale: 'en_ZA',

    url: baseUrl,

    siteName: 'Synkra',

    title: 'Synkra — AI Systems That Run Your Business While You Grow It',

    description: 'AI automation systems for South African businesses. Voice agents, WhatsApp agents, lead automation, and more. Starting from R700 per month.',

    images: [

      {

        url: '/og-image.png',

        width: 1200,

        height: 630,

        alt: 'Synkra — AI Automation for South African Businesses',

      }

    ],

  },

  twitter: {

    card: 'summary_large_image',

    title: 'Synkra — AI Systems That Run Your Business While You Grow It',

    description: 'AI automation systems for South African businesses. Starting from R700 per month.',

    images: ['/og-image.png'],

  },

  alternates: {

    canonical: baseUrl,

  },

}



export function generatePageMetadata(

  title: string,

  description: string,

  path: string,

): Metadata {

  return {

    title,

    description,

    openGraph: {

      title: `${title} | Synkra`,

      description,

      url: `${baseUrl}${path}`,

    },

    alternates: {

      canonical: `${baseUrl}${path}`,

    },

  }

}  ROOT LAYOUT

Create app/layout.tsx as the global layout wrapping every page:

typescriptimport type { Metadata } from 'next'

import { defaultMetadata } from '@/lib/metadata'

import Navbar from '@/components/layout/Navbar'

import Footer from '@/components/layout/Footer'

import '@/styles/globals.css'



export const metadata: Metadata = defaultMetadata



export default function RootLayout({

  children,

}: {

  children: React.ReactNode

}) {

  return (

    <html lang="en-ZA">

      <body>

        <Navbar />

        <main>{children}</main>

        <Footer />

      </body>

    </html>

  )

} SUPABASE CLIENT

Create lib/supabase.ts:

typescriptimport { createClient } from '@supabase/supabase-js'



const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!

const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!



export const supabase = createClient(supabaseUrl, supabaseAnonKey)



export const supabaseAdmin = createClient(

  supabaseUrl,

  process.env.SUPABASE_SERVICE_ROLE_KEY!

) GLOBAL DESIGN RULES — ENFORCE THROUGHOUT ALL PROMPTS

These rules apply to every component and every page built on this site. They are not optional:

Typography — headings use tight tracking and high font weight. Body text uses white at 70% opacity on dark backgrounds. No text is placed at full white opacity except headings and CTAs. No fragmented headings. No em dashes or en dashes anywhere in copy.

Colour — background is always #0A0A0A or #252430. Green #56d722 is used exclusively for primary CTAs, key numbers, and accent elements. Purple is used for brand accents and highlights. Never use green as a background for large sections.

Spacing — sections use section-padding class. Cards use consistent internal padding of p-8. Gaps between grid items are gap-6 or gap-8. Never use arbitrary spacing values — always use the design system tokens.

Buttons — primary buttons are always green with black text using btn-primary class. Secondary buttons are always outlined white using btn-secondary class. Pill buttons in the navbar use btn-pill-primary. No other button styles exist on this site.

Cards — all cards use card-dark class. No glass effects. No frosted glass. No gradients on cards. No shadows on cards — separation is created by the border at white 5% opacity.

Images — no stock photography. No 3D renders. No AI generated images. The site is typography and colour driven. If an image is used it must be a real photograph of real work.

No marquee scrolling elements anywhere on the site.

No ombre or gradient backgrounds anywhere on the site.

No animations beyond subtle fade-in and slide-up on page load. No scroll-triggered animations that are distracting.

Forms — all forms submit to Supabase and route notifications to the correct email address at capacitiqgroup.co.za. No third party form services. No Google Forms. No Typeform.

SEO — every page must have a unique title, unique meta description, canonical URL, and Open Graph tags using the generatePageMetadata function from lib/metadata.ts.

Mobile — every component is built mobile-first. Nothing is designed desktop-first and retrofitted for mobile.

Accessibility — all interactive elements have focus states. All images have alt text. Colour contrast meets WCAG AA minimum throughout. EMPTY PAGE SCAFFOLDING

Every page file must export a default function that returns a div with a placeholder comment indicating what goes on that page. The metadata export must be present on every page from day one using generatePageMetadata. Example structure for every page:

typescriptimport { generatePageMetadata } from '@/lib/metadata'



export const metadata = generatePageMetadata(

  'Page Title',

  'Page meta description for SEO.',

  '/page-path'

)



export default function PageName() {

  return (

    <div>

      {/* Page content goes here */}

    </div>

  )

}

Apply this pattern to every page in the structure. Each page must have its own specific title, description, and path already filled in on day one even though the content is empty. Do not use placeholder text for metadata — write the real SEO metadata for every page now.

The SEO metadata for each page is as follows:

Home — title: AI Systems That Run Your Business While You Grow It — description: Synkra builds AI automation systems for South African businesses. Voice agents, WhatsApp agents, speed-to-lead, lead reactivation, knowledge bases, and automated hiring. From R700 per month. — path: /

About — title: About Synkra — description: Synkra is a South African AI automation company built to make automation affordable for every business, not just enterprises. — path: /about

Services — title: AI Automation Services — description: Explore every AI automation service Synkra offers. Voice agents, WhatsApp agents, speed-to-lead systems, lead reactivation, knowledge bases, and automated hiring. — path: /services

AI Voice Agent — title: AI Voice Agent — description: An AI receptionist that answers every call your business receives, handles the conversation, and books appointments. Available 24 hours a day from R700 per month. — path: /services/ai-voice-agent. AI Web Widget — title: AI Web Widget Agent — description: A conversational AI agent embedded on your website that answers visitor questions and converts them into booked clients before they leave. — path: /services/ai-web-widget

AI WhatsApp Agent — title: AI WhatsApp Agent — description: An AI agent that responds to every WhatsApp message your business receives instantly, at any hour, without your team typing a single response. — path: /services/ai-whatsapp-agent

Speed to Lead — title: Speed to Lead System — description: An automated system that calls every new lead within 90 seconds of them submitting a form, before your competitors have seen the notification. — path: /services/speed-to-lead

Lead Reactivation — title: Lead Reactivation Campaign — description: An AI-powered outreach campaign that books meetings from the dormant contacts already sitting in your database. — path: /services/lead-reactivation

AI Knowledge Base — title: AI Knowledge Base — description: A private AI system trained on your business documents that answers any question your team has in seconds. — path: /services/ai-knowledge-base

Automated Hiring — title: Automated Hiring System — description: An AI system that screens every job application, contacts qualified candidates, and builds your shortlist without your team reading a single CV manually. — path: /services/automated-hiring

Pricing — title: Transparent Pricing — description: Every Synkra service has a clear setup fee and monthly retainer. No hidden costs, no long-term contracts. View full pricing for all seven services. — path: /pricing

Partner With Us — title: Partner With Synkra — description: Agency partners earn 35% and referral partners earn 15% of every setup fee when a client they bring signs up and pays. Apply to become a Synkra partner. — path: /partner

Agency Partner Application — title: Apply as an Agency Partner — description: Offer AI automation to your existing clients without building anything yourself. Earn 35% of every setup fee. Apply to become a Synkra agency partner. — path: /partner/agency

Referral Partner Application — title: Apply as a Referral Partner — description: Refer businesses to Synkra and earn 15% of every setup fee when they sign up and pay. No selling required. Apply to become a Synkra referral partner. — path: /partner/referral

Contact — title: Contact Synkra — description: Get in touch with the Synkra team. We respond to every enquiry within 24 hours on business days. — path: /contact

ROI Calculator — title: ROI Calculator — description: Find out what your current manual processes are costing your business every month and what solving them permanently with AI is worth. — path: /roi-calculator

Help Center — title: Help Center — description: Answers to every common question about Synkra services, pricing, credits, onboarding, and how everything works. — path: /help Privacy Policy — title: Privacy Policy — description: How Synkra collects, uses, and protects your personal information. — path: /legal/privacy-policy

Terms of Service — title: Terms of Service — description: The terms and conditions governing your use of Synkra services. — path: /legal/terms-of-service

Refund Policy — title: Refund Policy — description: Synkra refund and cancellation policy. Everything you need to know about payments, credits, and what happens when you pause or cancel. — path: /legal/refund-policy. NAVBAR COMPONENT

Build Navbar.tsx as a floating pill navbar fixed to the top of the page:

Dark pill shape, not full width, centered, floats above the page content with a top margin of 1.5rem. Background is #252430 with a subtle border at white 8% opacity. On scroll it gains a slightly stronger background opacity.

Left side — SYNKRA wordmark in white, bold, tracking wide.

Centre — navigation links: Services, Pricing, About, Partner With Us, Client Login. Each link is white at 70% opacity, transitions to full white on hover. Separated by a vertical divider at white 10% opacity.

Right side — Get Started button using btn-pill-primary class in green.

On mobile — hamburger icon on the right, wordmark on the left, green Get Started button hidden, full menu opens as a dark overlay with all links stacked vertically and the Get Started button at the bottom in full width green. FOOTER COMPONENT

Build Footer.tsx as a standalone dark card matching Image 1 from the reference images:

The footer is a dark rounded card sitting inside a slightly lighter page background section. It does not span full bleed — it sits as a card with margin on all sides.

Inside the card:

Top section — three columns:

Left column — Synkra tagline in small body text at white 60% opacity. Below it the contact form link text — no email addresses displayed directly, just "Get in touch" linking to /contact. Below that — a Capacitiq Group company — in label-tag style.

Centre column — heading: Services in label-tag style. Below it links to all seven service pages in body-sm white at 60% opacity, each transitioning to white on hover.

Right column — heading: Company in label-tag style. Below it links to About, Partner With Us, Client Login, Partner Login, Privacy Policy, Terms of Service, Refund Policy.

Bottom section — a divider line then a single row: left side shows copyright text in label-tag style — Synkra. South Africa. All rights reserved. Right side shows the current year dynamically.

Large SYNKRA wordmark positioned at the bottom right of the card, oversized, white at 6% opacity, partially clipped by the card edge exactly as in the reference image. By the end of Day 1 the following is complete and deployed to Vercel:

The full repository structure exists with every file in place. The design system is configured and working. The navbar and footer are built, pixel perfect, and appearing on every page. Every page has its correct SEO metadata. The Supabase client is configured. Environment variables are set locally and configured in Vercel dashboard. The site deploys automatically on every push to main. Every global design rule is enforced from this point forward and must not be violated in any subsequent prompt..The attached images are for you to reference when you design.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7a73c7f6-169a-481a-b5fa-b1afe75f370c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
