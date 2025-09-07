"use client";

import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";

export default function EpochTimeConverter() {
  const [inputType, setInputType] = useState("toEpoch"); // "toEpoch" or "fromEpoch"
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState("");
  const [news, setNews] = useState([]);

  const convertTime = () => {
    try {
      if (inputType === "toEpoch") {
        const date = new Date(inputValue);
        if (isNaN(date.getTime())) {
          setResult("Invalid Date Format");
          return;
        }
        setResult(Math.floor(date.getTime() / 1000).toString());
      } else {
        const epoch = parseInt(inputValue);
        if (isNaN(epoch)) {
          setResult("Invalid Epoch Format");
          return;
        }
        const date = new Date(epoch * 1000);
        setResult(date.toUTCString());
      }
    } catch (err) {
      console.error("Conversion error", err);
      setResult("Something went wrong!");
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
      {/* Converter Section */}
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
          Epoch Time Converter
        </h1>

        <div className="bg-white p-6 rounded-2xl shadow-xl space-y-4">
          <div className="space-y-2">
            <label className="block font-medium text-black">Conversion Type:</label>
            <select
              value={inputType}
              onChange={(e) => setInputType(e.target.value)}
              className="w-full p-2 border rounded text-black"
            >
              <option value="toEpoch" className="text-black">Date → Epoch</option>
              <option value="fromEpoch" className="text-black">Epoch → Date</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block font-medium text-black">
              {inputType === "toEpoch" ? "Enter Date (e.g., 2025-04-11T12:00:00Z):" : "Enter Epoch Time:"}
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full p-2 border rounded text-black"
            />
          </div>

          <button
            onClick={convertTime}
            className="w-full bg-blue-600 text-white py-2 rounded-md shadow hover:bg-blue-700 transition"
          >
            Convert
          </button>

          {result && (
            <div className="mt-6 space-y-3">
              <p className="text-black font-semibold">Result:</p>
              <p className="text-black">{result}</p>
            </div>
          )}
        </div>
      </div>

     
    </div>
  );
}
