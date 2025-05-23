"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { marked } from "marked"; // v5+ is async

export default function MarkdownPreviewer() {
  const [markdown, setMarkdown] = useState("# Welcome to Markdown Previewer!");
  const [html, setHtml] = useState(""); // New state for the rendered HTML
  const [news, setNews] = useState([]);

  // Convert Markdown to HTML when markdown changes
  useEffect(() => {
    async function convertMarkdown() {
      const parsed = await marked.parse(markdown); // await because it's async
      setHtml(parsed);
    }

    convertMarkdown();
  }, [markdown]);

  // Fetch news on first load
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col lg:flex-row items-start justify-center gap-10 p-6">
      {/* Markdown Section */}
      <div className="w-full max-w-2xl">
        <div className="flex justify-start mb-4">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 font-semibold text-sm bg-blue-100 px-3 py-1 rounded-md shadow-sm transition"
          >
            ← Back
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Markdown Previewer
        </h1>

        <div className="bg-white p-6 rounded-2xl shadow-xl w-full">
          <label className="block text-gray-700 font-medium mb-2">
            Enter Markdown
          </label>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            rows={10}
            className="w-full p-3 border rounded-lg text-black placeholder-gray-400 mb-6"
            placeholder="Type some markdown here..."
          />

          <h2 className="text-xl font-bold mb-2 text-gray-700">Preview:</h2>
          <div
            className="prose prose-sm sm:prose lg:prose-lg max-w-none bg-gray-100 p-4 rounded-lg text-black"
            dangerouslySetInnerHTML={{ __html: html }} // using html state
          />
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
