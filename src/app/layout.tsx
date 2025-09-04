import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/lib/convex-client-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "tiquo Data Room",
  description: " The Universal Booking, Loyalty & Point of Sale Platform",
  keywords: ["tiquo", "data room", "investor documents", "secure sharing", "business infrastructure", "technology company", "workflow automation", "financial documents", "pitch deck", "cap table"],
  authors: [{ name: "tiquo" }],
  creator: "tiquo",
  publisher: "tiquo",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: "tiquo Data Room",
    description: "The Universal Booking, Loyalty & Point of Sale Platform",
    url: "https://dataroom.tiquo.co",
    siteName: "tiquo Data Room",
    images: [
      {
        url: "/tiquo logo.svg",
        width: 400,
        height: 400,
        alt: "tiquo Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "tiquo Data Room",
    description: "The Universal Booking, Loyalty & Point of Sale Platform",
    images: ["/tiquo logo.svg"],
  },
  verification: {
    google: "google-site-verification-placeholder",
  },
  alternates: {
    canonical: "https://dataroom.tiquo.co",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.ico", sizes: "16x16", type: "image/x-icon" },
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
    ],
    apple: [
      { url: "/favicon.ico", sizes: "180x180" },
    ],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  category: 'business',
  other: {
    "theme-color": "#6366f1",
    "color-scheme": "light",
    "HandheldFriendly": "true",
    "MobileOptimized": "width",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "format-detection": "telephone=no",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "TIQUO",
              "url": "https://tiquo.co",
              "logo": "https://dataroom.tiquo.co/tiquo logo.svg",
              "description": "Modern technology solutions for business infrastructure and workflow automation",
              "foundingDate": "2024",
              "industry": "Technology",
              "services": [
                "Business Infrastructure Solutions",
                "Workflow Automation",
                "Document Management Systems",
                "Secure Data Rooms"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "Business",
                "url": "https://tiquo.co"
              }
            })
          }}
        />
      </head>
      <body
        className={`${inter.variable} antialiased`}
      >
        <ConvexClientProvider>
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
