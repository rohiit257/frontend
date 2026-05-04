import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Prakash Bhambhani | A Vision in Motion",
  description:
    "CEO of Wings9 — leading five trailblazing enterprises shaping the future of business, real estate, technology, fashion, and vacation homes.",
  keywords: [
    "Prakash Bhambhani",
    "Wings9",
    "business consultant Dubai",
    "CEO Wings9",
    "Wings9 Consultancy",
    "Wings9 Properties",
    "Wings9 Technology",
  ],
  authors: [{ name: "Prakash Bhambhani" }],
  openGraph: {
    title: "Prakash Bhambhani | Wings9 Enterprises",
    description:
      "20+ years of strategic leadership across five trailblazing enterprises. Helping businesses scale globally.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prakash Bhambhani | Wings9 Enterprises",
    description: "Strategic leadership across five trailblazing enterprises.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f8f5" },
    { media: "(prefers-color-scheme: dark)", color: "#1B211A" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* DNS prefetch for Google APIs */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
