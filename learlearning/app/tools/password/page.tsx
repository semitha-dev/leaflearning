"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";

export default function PasswordGenerator() {
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");
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

  function generatePassword(e: React.FormEvent) {
    e.preventDefault();

    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+[]{}|;:,.<>?";

    let charPool = "";
    if (includeUppercase) charPool += upper;
    if (includeLowercase) charPool += lower;
    if (includeNumbers) charPool += numbers;
    if (includeSymbols) charPool += symbols;

    if (charPool.length === 0) {
      setGeneratedPassword("Select at least one character type.");
      return;
    }

    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charPool.length);
      password += charPool[randomIndex];
    }

    setGeneratedPassword(password);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col lg:flex-row items-start justify-center gap-10 p-6">
      {/* Password Generator Section */}
      <div className="w-full max-w-xl">
        <div className="flex justify-start mb-4">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 font-semibold text-sm bg-blue-100 px-3 py-1 rounded-md shadow-sm transition"
          >
            ← Back
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-6">Password Generator</h1>

        <form
          onSubmit={generatePassword}
          className="bg-white p-6 rounded-2xl shadow-xl w-full"
        >
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Password Length
            </label>
            <input
              type="number"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full p-2 border rounded-lg text-black placeholder-gray-400"
              placeholder="Enter length"
              min="4"
              max="64"
            />
          </div>

          <div className="space-y-2 mb-4">
            <label className="block">
              <input
                type="checkbox"
                checked={includeUppercase}
                onChange={(e) => setIncludeUppercase(e.target.checked)}
              />
              <span className="ml-2 text-gray-700">Include Uppercase Letters</span>
            </label>

            <label className="block">
              <input
                type="checkbox"
                checked={includeLowercase}
                onChange={(e) => setIncludeLowercase(e.target.checked)}
              />
              <span className="ml-2 text-gray-700">Include Lowercase Letters</span>
            </label>

            <label className="block">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
              />
              <span className="ml-2 text-gray-700">Include Numbers</span>
            </label>

            <label className="block">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
              />
              <span className="ml-2 text-gray-700">Include Symbols</span>
            </label>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition w-full"
          >
            Generate Password
          </button>

          {generatedPassword && (
            <div className="mt-6 text-center">
              <p className="text-xl font-semibold text-black break-all">
                {generatedPassword}
              </p>
            </div>
          )}
        </form>
      </div>

      
    </div>
  );
}
