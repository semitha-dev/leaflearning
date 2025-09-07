"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";

export default function WordCounter() {
  const [text, setText] = useState("");
  const [wordCount, setWordCount] = useState<number | null>(null);
  const [news, setNews] = useState([]);

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

  // Word count logic
  function countWords(e: React.FormEvent) {
    e.preventDefault();
    const trimmedText = text.trim();
    const words = trimmedText === "" ? [] : trimmedText.split(/\s+/);
    setWordCount(words.length);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col lg:flex-row items-start justify-center gap-10 p-6">
      {/* Word Counter Section */}
      <div className="w-full max-w-xl">
        <div className="flex justify-start mb-4">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 font-semibold text-sm bg-blue-100 px-3 py-1 rounded-md shadow-sm transition"
          >
            ← Back
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-6">Word Counter</h1>

        <form
          onSubmit={countWords}
          className="bg-white p-6 rounded-2xl shadow-xl w-full"
        >
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Enter your text
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-2 border rounded-lg text-black placeholder-gray-400"
              rows={6}
              placeholder="Type or paste your text here..."
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition w-full"
          >
            Count Words
          </button>

          {wordCount !== null && (
            <div className="mt-6 text-center">
              <p className="text-xl font-semibold text-black">
                Word Count: {wordCount}
              </p>
            </div>
          )}
        </form>
      </div>

      
    </div>
  );
}
