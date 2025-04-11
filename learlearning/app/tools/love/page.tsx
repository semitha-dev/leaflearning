"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";

export default function LoveCalculator() {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [lovePercentage, setLovePercentage] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [news, setNews] = useState([]);

  // Fetch news headlines
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

  // Simulate love percentage calculation
  function calculateLove(e: React.FormEvent) {
    e.preventDefault();
    if (name1.trim() && name2.trim()) {
      const combined = name1.toLowerCase() + name2.toLowerCase();
      let total = 0;
      for (let i = 0; i < combined.length; i++) {
        total += combined.charCodeAt(i);
      }
      const percentage = (total % 101); // Keep it between 0–100
      setLovePercentage(percentage);

      // Message based on score
      if (percentage > 80) setMessage("You two are a perfect match! ❤️");
      else if (percentage > 50) setMessage("definitely a spark! 🔥");
      else if (percentage > 30) setMessage("Therewon&apos;ts potential... 🤔");
      else setMessage("Maybe just friends 😅");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col lg:flex-row items-start justify-center gap-10 p-6">
      {/* Love Calculator Section */}
      <div className="w-full max-w-xl">
        <div className="flex justify-start mb-4">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 font-semibold text-sm bg-blue-100 px-3 py-1 rounded-md shadow-sm transition"
          >
            ← Back
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-6">Love Calculator</h1>

        <form
          onSubmit={calculateLove}
          className="bg-white p-6 rounded-2xl shadow-xl w-full"
        >
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Your Name
            </label>
            <input
              type="text"
              value={name1}
              onChange={(e) => setName1(e.target.value)}
              className="w-full p-2 border rounded-lg text-black placeholder-gray-400"
              placeholder="Enter your name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Crush's Name
            </label>
            <input
              type="text"
              value={name2}
              onChange={(e) => setName2(e.target.value)}
              className="w-full p-2 border rounded-lg text-black placeholder-gray-400"
              placeholder="Enter crush's name"
            />
          </div>

          <button
            type="submit"
            className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition w-full"
          >
            Calculate Love %
          </button>

          {lovePercentage !== null && (
            <div className="mt-6 text-center">
              <p className="text-xl font-semibold text-black">
                ❤️ Love Match: {lovePercentage}%
              </p>
              <p className="text-md text-gray-600 mt-1">{message}</p>
            </div>
          )}
        </form>
      </div>

      {/* News Section */}
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-blue-800">📰 Latest News</h2>
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
