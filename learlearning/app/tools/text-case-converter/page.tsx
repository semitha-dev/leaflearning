"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";

export default function TextCaseConverter() {
  const [inputText, setInputText] = useState("");
  const [convertedText, setConvertedText] = useState("");
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

  function convertText(type: string) {
    if (type === "upper") {
      setConvertedText(inputText.toUpperCase());
    } else if (type === "lower") {
      setConvertedText(inputText.toLowerCase());
    } else if (type === "capitalized") {
      const words = inputText
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1));
      setConvertedText(words.join(" "));
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col lg:flex-row items-start justify-center gap-10 p-6">
      {/* Text Case Converter Section */}
      <div className="w-full max-w-xl">
        <div className="flex justify-start mb-4">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 font-semibold text-sm bg-blue-100 px-3 py-1 rounded-md shadow-sm transition"
          >
            ← Back
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-6">Text Case Converter</h1>

        <div className="bg-white p-6 rounded-2xl shadow-xl w-full">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Enter Text
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full p-3 border rounded-lg text-black placeholder-gray-400 h-32"
              placeholder="Type or paste your text here..."
            />
          </div>

          <div className="flex gap-3 flex-wrap mb-4">
            <button
              onClick={() => convertText("upper")}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              UPPERCASE
            </button>
            <button
              onClick={() => convertText("lower")}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
            >
              lowercase
            </button>
            <button
              onClick={() => convertText("capitalized")}
              className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
            >
              Capitalized
            </button>
          </div>

          {convertedText && (
            <div className="mt-4">
              <label className="block text-gray-700 font-medium mb-1">
                Converted Text
              </label>
              <div className="bg-gray-100 p-3 rounded-lg text-black whitespace-pre-wrap">
                {convertedText}
              </div>
            </div>
          )}
        </div>
      </div>

    
    </div>
  );
}
