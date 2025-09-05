import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import DonationNotice from "./components/DonationNotice";
import NavBar from "./components/Navbar";
import Update from "./components/Update";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Optional: you can also dynamically generate this using your `tools` array
const toolKeywords = [
  "BMI Calculator",
  "Love Calculator",
  "Age Calculator",
  "Random Name Generator",
  "Password Generator",
  "QR Code Generator",
  "Unit Converter",
  "Text to Speech",
  "Color Picker",
  "Word Counter",
  "Text Case Converter",
  "Markdown Previewer",
  "Todo List",
  "IP Address Finder",
  "JSON Formatter",
  "Lorem Ipsum Generator",
  "Epoch Time Converter",
  "Online Stopwatch"
].join(", ");

export const metadata: Metadata = {
  title: "Leaf Learning Tools - All-in-One Utility Toolkit",
  description: "Leaf Learning Tools offers 15+ online utilities including calculators, generators, formatters, converters, and more. All tools in one place, for free!",
  keywords: toolKeywords,
  openGraph: {
    title: "Leaf Learning Tools - All-in-One Utility Toolkit",
    description: "Access 15+ powerful tools like BMI calculator, QR generator, IP finder, and more from one simple dashboard.",
    url: "https://www.leaflearning.me/", // <-- replace with actual domain
    siteName: "Leaf Learning Tools",
    images: [
      {
        url: "favicon.ico",
        width: 800,
        height: 600,
        alt: "Leaf Learning Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Leaf Learning Tools - All-in-One Utility Toolkit",
    description: "Free online tools including calculators, formatters, and more – all in one place.",
    images: ["/logo.png"],
    creator: "@your_twitter", // optional
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="keywords" content={toolKeywords} />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
        <link rel="manifest" href="/site.webmanifest"></link>
        
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3641349574273554"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        
        {/* Wrap Nav + Banner in SAME gradient as pages */}
        <div className="bg-[radial-gradient(1200px_600px_at_-10%_-10%,#fde7d9_0%,transparent_60%),radial-gradient(800px_500px_at_110%_-10%,#ffe7ba_0%,transparent_55%),linear-gradient(to_bottom,#fff8f1,#fff5e7)]">
          <NavBar />
          <DonationNotice />
          <Update version='1.1.0'/>
          
        </div>

        {children}
        <Analytics /> {/* <--- Vercel analytics */}
      </body>
    </html>
  );
}
