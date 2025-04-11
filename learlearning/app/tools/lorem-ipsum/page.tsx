"use client";

import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";

export default function LoremIpsumGenerator() {
  const [textType, setTextType] = useState("paragraphs"); // "paragraphs", "sentences", "words"
  const [amount, setAmount] = useState(3); // default number
  const [result, setResult] = useState<string[]>([]);
  const [news, setNews] = useState([]);

  const generateLorem = async () => {
    try {
      // Always fetch 5 paragraphs of lorem text
      const url = "https://baconipsum.com/api/?type=meat-and-filler&paras=5";
      const res = await axios.get(url);
      const combinedText = res.data.join(" ");

      if (textType === "words") {
        const words = combinedText.split(/\s+/).slice(0, amount).join(" ");
        setResult([words]);
      } else if (textType === "sentences") {
        const sentences = combinedText.match(/[^.!?]+[.!?]+/g) || [];
        setResult(sentences.slice(0, amount));
      } else {
        setResult(res.data.slice(0, amount)); // paragraphs
      }
    } catch (err) {
      console.error("Failed to fetch lorem ipsum", err);
    }
  };

  // Fetch top headlines
  React.useEffect(() => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col lg:flex-row items-start justify-center gap-10 p-6">
      {/* Generator Section */}
      <div className="w-full max-w-xl">
        <div className="flex justify-start mb-4">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 font-semibold text-sm bg-blue-100 px-3 py-1 rounded-md shadow-sm transition"
          >
            ← Back
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Lorem Ipsum Generator
        </h1>

        <div className="bg-white p-6 rounded-2xl shadow-xl space-y-4">
          <div className="space-y-2">
            <label className="block font-medium text-black">Type:</label>
            <select
              value={textType}
              onChange={(e) => setTextType(e.target.value)}
              className="w-full p-2 border rounded text-black"
            >
              <option className="text-black" value="paragraphs">Paragraphs</option>
              <option className="text-black" value="sentences">Sentences</option>
              <option className="text-black" value="words">Words</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block font-medium text-black">Amount:</label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full p-2 border rounded text-black"
            />
          </div>

          <button
            onClick={generateLorem}
            className="w-full bg-blue-600 text-white py-2 rounded-md shadow hover:bg-blue-700 transition"
          >
            Generate
          </button>

          <div className="mt-6 space-y-3">
            {result.map((text, idx) => (
              <p key={idx} className="text-black">
                {text}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* News Section */}
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-blue-800">📰 Latest News</h2>
        {news.length === 0 ? (
          <p className="text-gray-600">Loading news...</p>
        ) : (
          <ul className="space-y-3">
            {news.map((article: any, idx) => (
              <li key={idx} className="border-b pb-2">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-md font-medium text-black hover:text-blue-600 transition"
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
