"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";

const conversionFactors: Record<
  string,
  Record<string, Record<string, number>>
> = {
  length: {
    meter: { foot: 3.28084, kilometer: 0.001 },
    foot: { meter: 0.3048, kilometer: 0.0003048 },
    kilometer: { meter: 1000, foot: 3280.84 },
  },
  weight: {
    kilogram: { pound: 2.20462, gram: 1000 },
    pound: { kilogram: 0.453592, gram: 453.592 },
    gram: { kilogram: 0.001, pound: 0.00220462 },
  },
  speed: {
    "km/h": { "mph": 0.621371 },
    "mph": { "km/h": 1.60934 },
  },
};

export default function UnitConverter() {
  const [category, setCategory] = useState("length");
  const [fromUnit, setFromUnit] = useState("meter");
  const [toUnit, setToUnit] = useState("foot");
  const [value, setValue] = useState("");
  const [convertedValue, setConvertedValue] = useState<number | null>(null);
  const [news, setNews] = useState([]);

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

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    const units = Object.keys(conversionFactors[cat]);
    setFromUnit(units[0]);
    setToUnit(units[1] || units[0]);
    setConvertedValue(null);
    setValue("");
  };

  const handleConvert = (e: React.FormEvent) => {
    e.preventDefault();
    const input = parseFloat(value);
    if (isNaN(input)) return;

    const factor = conversionFactors[category]?.[fromUnit]?.[toUnit];
    if (factor !== undefined) {
      const result = input * factor;
      setConvertedValue(parseFloat(result.toFixed(4)));
    } else {
      setConvertedValue(null);
    }
  };

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

        <h1 className="text-4xl font-bold text-gray-800 mb-6">Unit Converter</h1>

        <form
          onSubmit={handleConvert}
          className="bg-white p-6 rounded-2xl shadow-xl w-full"
        >
          {/* Category Selection */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              {Object.keys(conversionFactors).map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* From/To Units */}
          <div className="flex gap-4 mb-4">
            <div className="w-1/2">
              <label className="block text-gray-700 font-medium mb-1">
                From
              </label>
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                {Object.keys(conversionFactors[category]).map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-1/2">
              <label className="block text-gray-700 font-medium mb-1">
                To
              </label>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                {Object.keys(conversionFactors[category][fromUnit] || {}).map(
                  (unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          {/* Input */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Value
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full p-2 border rounded-lg text-black"
              placeholder="Enter value to convert"
              step="any"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition w-full"
          >
            Convert
          </button>

          {convertedValue !== null && (
            <div className="mt-6 text-center">
              <p className="text-xl font-semibold text-black">
                Result: {convertedValue} {toUnit}
              </p>
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
