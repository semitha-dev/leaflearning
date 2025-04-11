"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";

export default function TextToSpeechConverter() {
  const [text, setText] = useState("");
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

  function handleSpeak(e: React.FormEvent) {
    e.preventDefault();
    if (text.trim() !== "") {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col lg:flex-row items-start justify-center gap-10 p-6">
      {/* Text-to-Speech Section */}
      <div className="w-full max-w-xl">
        <div className="flex justify-start mb-4">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 font-semibold text-sm bg-blue-100 px-3 py-1 rounded-md shadow-sm transition"
          >
            ← Back
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-6">Text to Speech Converter</h1>

        <form
          onSubmit={handleSpeak}
          className="bg-white p-6 rounded-2xl shadow-xl w-full"
        >
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Enter text to speak
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-2 border rounded-lg text-black placeholder-gray-400"
              placeholder="Type anything you want me to say..."
              rows={5}
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition w-full"
          >
            Speak
          </button>
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
