"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import axios from "axios";
import QRCode from "react-qr-code";

export default function QRCodeGenerator() {
  const [inputText, setInputText] = useState("");
  const [showFrame, setShowFrame] = useState(false);
  const [generatedQR, setGeneratedQR] = useState<string | null>(null);
  const [news, setNews] = useState([]);
  const qrRef = useRef<HTMLDivElement>(null);

  // Fetch top headlines
  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await axios.get(
          "https://newsapi.org/v2/top-headlines?country=us&pageSize=5&apiKey=298eb3424f814f16bccfcd60f822e3d7"
        );
        setNews(res.data.articles);
      } catch (err) {
        console.error("News fetch error", err);
      }
    }

    fetchNews();
  }, []);

  function generateQRCode(e: React.FormEvent) {
    e.preventDefault();
    if (inputText) {
      setGeneratedQR(inputText);
    }
  }

  function downloadQRCode() {
    if (!qrRef.current) return;
    
    // Find the SVG element inside our ref container
    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;
    
    // Create a canvas element
    const canvas = document.createElement("canvas");
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    const img = new Image();
    img.onload = () => {
      // Set canvas dimensions (with padding if frame is shown)
      const padding = showFrame ? 32 : 0; // 16px padding on each side when frame is shown
      canvas.width = svg.width.baseVal.value + padding;
      canvas.height = svg.height.baseVal.value + padding;
      
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      // Fill with white background
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw frame if enabled
      if (showFrame) {
        ctx.strokeStyle = "#4b5563"; // gray-600
        ctx.lineWidth = 8;
        ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);
      }
      
      // Draw the QR code image centered
      const x = padding / 2;
      const y = padding / 2;
      ctx.drawImage(img, x, y);
      
      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (!blob) return;
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        const filename = `qrcode-${Date.now()}.png`;
        
        a.download = filename;
        a.href = url;
        a.click();
        
        // Clean up
        URL.revokeObjectURL(url);
      }, "image/png");
    };
    
    img.src = svgUrl;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex flex-col lg:flex-row items-start justify-center gap-10 p-6">
      {/* QR Code Generator Section */}
      <div className="w-full max-w-xl">
        <div className="flex justify-start mb-4">
          <Link
            href="/"
            className="text-green-600 hover:text-green-800 font-semibold text-sm bg-green-100 px-3 py-1 rounded-md shadow-sm transition"
          >
            ← Back
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-6">QR Code Generator</h1>

        <form
          onSubmit={generateQRCode}
          className="bg-white p-6 rounded-2xl shadow-xl w-full"
        >
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Text to Encode
            </label>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full p-2 border rounded-lg text-black placeholder-gray-400"
              placeholder="Enter text or URL"
            />
          </div>

          <div className="mb-4 flex items-center gap-2">
            <label className="text-gray-700">Include Frame around QR?</label>
            <input
              type="checkbox"
              checked={showFrame}
              onChange={() => setShowFrame(!showFrame)}
              className="h-5 w-5"
            />
          </div>

          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition w-full"
          >
            Generate QR Code
          </button>

          {generatedQR && (
            <div className="mt-6 text-center">
              <div
                ref={qrRef}
                className={`inline-block p-4 ${
                  showFrame ? "border-4 border-gray-700" : ""
                }`}
              >
                <QRCode value={generatedQR} />
              </div>
              
              <div className="mt-4">
                <button
                  onClick={downloadQRCode}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                  type="button"
                >
                  Download QR Code
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* News Section */}
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-green-800">📰 Latest News</h2>
        {news.length === 0 ? (
          <p className="text-gray-500">Loading news...</p>
        ) : (
          <ul className="space-y-3">
            {news.map((article: any, idx) => (
              <li key={idx} className="border-b pb-2">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-md font-medium text-black hover:text-green-600 transition"
                >
                  • {article.title}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}