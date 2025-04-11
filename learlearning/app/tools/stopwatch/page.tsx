"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import axios from "axios";

export default function StopwatchAndTimer() {
  const [mode, setMode] = useState("stopwatch");
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [news, setNews] = useState([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleRunning = () => {
    if (isRunning) {
      clearInterval(intervalRef.current!);
      setIsRunning(false);
    } else {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setTime((prev) => {
          if (mode === "timer") {
            return prev > 0 ? prev - 1 : 0;
          } else {
            return prev + 1;
          }
        });
      }, 1000);
    }
  };

  const reset = () => {
    clearInterval(intervalRef.current!);
    setIsRunning(false);
    setTime(0);
  };

  const setTimer = () => {
    const total = hours * 3600 + minutes * 60 + seconds;
    if (total <= 0) {
      alert("Set a valid timer duration.");
      return;
    }
    setTime(total);
  };

  const formatTime = (t: number) => {
    const h = Math.floor(t / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((t % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (t % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  useEffect(() => {
    if (mode === "timer" && time === 0 && isRunning) {
      clearInterval(intervalRef.current!);
      setIsRunning(false);
      alert("⏰ Timer finished!");

      // 🔊 Play sound
      if (audioRef.current) {
        audioRef.current.play().catch((err) => console.error("Audio play error", err));
      }
    }
  }, [time, isRunning, mode]);

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
      <audio ref={audioRef} src="/alarm.mp3" preload="auto" />

      {/* Stopwatch / Timer Section */}
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
          {mode === "stopwatch" ? "⏱️ Online Stopwatch" : "⏰ Online Timer"}
        </h1>

        <div className="bg-white p-6 rounded-2xl shadow-xl space-y-4">
          <div className="space-y-2">
            <label className="block font-medium text-black">Mode:</label>
            <select
              value={mode}
              onChange={(e) => {
                reset();
                setMode(e.target.value);
              }}
              className="w-full p-2 border rounded text-black"
            >
              <option value="stopwatch">Stopwatch</option>
              <option value="timer">Timer</option>
            </select>
          </div>

          {mode === "timer" && (
            <div className="space-y-2">
              <label className="block font-medium text-black">
                Set Timer:
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={hours}
                  onChange={(e) => setHours(parseInt(e.target.value))}
                  className="w-1/3 p-2 border rounded text-black"
                  placeholder="HH"
                  min={0}
                />
                <input
                  type="number"
                  value={minutes}
                  onChange={(e) => setMinutes(parseInt(e.target.value))}
                  className="w-1/3 p-2 border rounded text-black"
                  placeholder="MM"
                  min={0}
                  max={59}
                />
                <input
                  type="number"
                  value={seconds}
                  onChange={(e) => setSeconds(parseInt(e.target.value))}
                  className="w-1/3 p-2 border rounded text-black"
                  placeholder="SS"
                  min={0}
                  max={59}
                />
              </div>
              <button
                onClick={setTimer}
                className="w-full bg-blue-400 text-white py-2 rounded-md shadow hover:bg-blue-500 transition"
              >
                Set Timer
              </button>
            </div>
          )}

          <div className="text-center text-5xl font-mono font-bold py-4 text-black">
            {formatTime(time)}
          </div>

          <div className="flex gap-4">
            <button
              onClick={toggleRunning}
              className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
            >
              {isRunning ? "Pause" : "Start"}
            </button>
            <button
              onClick={reset}
              className="flex-1 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
            >
              Reset
            </button>
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
