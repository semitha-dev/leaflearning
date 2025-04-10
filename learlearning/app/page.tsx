'use client'

import React, { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  // 1. This is the list of all your tools in one place
  const tools = [
    { title: "BMI Calculator", href: "/tools/bmi" },
    { title: "Love Calculator", href: "/tools/love" },
    { title: "Age Calculator", href: "/tools/age" },
    { title: "Random Name Generator", href: "/tools/name" },
    { title: "Password Generator", href: "/tools/password" },
    { title: "QR Code Generator", href: "/tools/qrcode" },
    { title: "Unit Converter", href: "/tools/unit-converter" },
    { title: "Text to Speech", href: "/tools/text-to-speech" },
    { title: "Color Picker", href: "/tools/color-picker" },
    { title: "Word Counter", href: "/tools/word-counter" },
    { title: "Text Case Converter", href: "/tools/text-case-converter" },
    { title: "Markdown Previewer", href: "/tools/markdown-previewer" },
    { title: "Currency Converter", href: "/tools/currency-converter" },
    { title: "IP Address Finder", href: "/tools/ip-finder" },
    { title: "JSON Formatter", href: "/tools/json-formatter" },
    { title: "Lorem Ipsum Generator", href: "/tools/lorem-ipsum" },
    { title: "Epoch Time Converter", href: "/tools/epoch-converter" },
    { title: "Online Stopwatch", href: "/tools/stopwatch" },
    { title: "Random Number Generator", href: "/tools/random-number" },
    { title: "Temperature Converter", href: "/tools/temp-converter" }
  ];
  
  // 2. Filter tools based on the search term (case-insensitive)
  const filteredTools = tools.filter(tool =>
    tool.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 3. Update search input state
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900 p-4">
      <header className="text-center py-10">
        <h1 className="text-4xl font-bold mb-2">Free Tools & Generators</h1>
        <p className="text-lg text-gray-600">
          This website runs using Ads. So if you can please disable your adblocker to keep this site free forever.
        </p>
        <input
          type="text"
          placeholder="Search a tool"
          value={searchTerm}
          onChange={handleInputChange}
          className="w-full max-w-md p-2 border rounded-xl bg-white mt-4"
        />
      </header>

      {/* 4. Show filtered cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {filteredTools.map((tool, index) => (
          <ToolCard key={index} title={tool.title} href={tool.href} />
        ))}
      </section>

      <footer className="text-center py-10 text-sm text-gray-500">
        © {new Date().getFullYear()} YourSiteName. All rights reserved.
      </footer>
    </main>
  );
}

// Component that renders each card
function ToolCard({ title, href }: { title: string; href: string }) {
  return (
    <Link href={href}>
      <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6 cursor-pointer">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-600">Click to use this tool</p>
      </div>
    </Link>
  );
}
