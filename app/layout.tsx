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
  title: "Prakash Bhambhani | Wings9 Group",
  description:
    "Prakash Bhambhani is a business strategist and corporate solutions specialist with nearly 30 years of experience leading Wings9 Group across consultancy, real estate, technology, trading, fashion, and vacation homes.",
  keywords: [
    "Prakash Bhambhani",
    "Wings9",
    "Wings9 Group",
    "business consultant Dubai",
    "corporate solutions specialist",
    "Wings9 Consultancies LLC",
    "Wings9 Properties LLC",
    "Wings9 Technologies LLC",
  ],
  authors: [{ name: "Prakash Bhambhani" }],
  openGraph: {
    title: "Prakash Bhambhani | Wings9 Group",
    description:
      "Nearly 30 years of strategic leadership across consultancy, real estate, technology, trading, and emerging business sectors.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prakash Bhambhani | Wings9 Group",
    description: "Nearly 30 years of strategic leadership across diversified business sectors.",
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
