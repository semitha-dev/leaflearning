"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

/** ---------- Helpers ---------- */
type Units = "metric" | "imperial";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function kgFromLb(lb: number) {
  return lb * 0.45359237;
}
function cmFromFtIn(ft: number, inches: number) {
  return (ft * 12 + inches) * 2.54;
}
function lbFromKg(kg: number) {
  return kg / 0.45359237;
}
function toFeetInches(cm: number) {
  const totalIn = cm / 2.54;
  const ft = Math.floor(totalIn / 12);
  const inches = Math.round(totalIn - ft * 12);
  return { ft, inches };
}

function computeBMI(kg: number, cm: number) {
  if (!kg || !cm) return null;
  const m = cm / 100;
  const bmi = kg / (m * m);
  return Number(bmi.toFixed(1));
}
function bmiCategory(bmi: number | null) {
  if (bmi == null) return { label: "-", color: "bg-gray-200 text-gray-700" };
  if (bmi < 18.5) return { label: "Underweight", color: "bg-blue-100 text-blue-800" };
  if (bmi < 25) return { label: "Normal", color: "bg-emerald-100 text-emerald-800" };
  if (bmi < 30) return { label: "Overweight", color: "bg-amber-100 text-amber-800" };
  return { label: "Obese", color: "bg-rose-100 text-rose-800" };
}
function idealWeightRangeKg(cm: number) {
  if (!cm) return null;
  const m = cm / 100;
  const min = 18.5 * m * m;
  const max = 24.9 * m * m;
  return { min: Number(min.toFixed(1)), max: Number(max.toFixed(1)) };
}
function progressPercent(bmi: number | null) {
  // Map BMI 12–40 to 0–100% for a friendly bar
  if (bmi == null) return 0;
  return clamp(((bmi - 12) / (40 - 12)) * 100, 0, 100);
}

/** ---------- Component ---------- */
export default function BMICalculator() {
  // persisted state
  const [units, setUnits] = useState<Units>("metric");
  const [kg, setKg] = useState<number | "">("");
  const [cm, setCm] = useState<number | "">("");
  const [lb, setLb] = useState<number | "">("");
  const [ft, setFt] = useState<number | "">("");
  const [inch, setInch] = useState<number | "">("");

  // load persisted
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("bmi_prefs") || "{}");
      if (saved.units) setUnits(saved.units);
      if (saved.kg !== undefined) setKg(saved.kg);
      if (saved.cm !== undefined) setCm(saved.cm);
      if (saved.lb !== undefined) setLb(saved.lb);
      if (saved.ft !== undefined) setFt(saved.ft);
      if (saved.inch !== undefined) setInch(saved.inch);
    } catch {}
  }, []);
  // persist
  useEffect(() => {
    try {
      localStorage.setItem(
        "bmi_prefs",
        JSON.stringify({ units, kg, cm, lb, ft, inch })
      );
    } catch {}
  }, [units, kg, cm, lb, ft, inch]);

  // unify to metric for calc
  const { kgCalc, cmCalc } = useMemo(() => {
    if (units === "metric") {
      return {
        kgCalc: typeof kg === "number" ? kg : NaN,
        cmCalc: typeof cm === "number" ? cm : NaN,
      };
    }
    const kgVal =
      typeof lb === "number" ? kgFromLb(lb) : NaN;
    const cmVal =
      typeof ft === "number" && typeof inch === "number"
        ? cmFromFtIn(ft, inch)
        : NaN;
    return { kgCalc: kgVal, cmCalc: cmVal };
  }, [units, kg, cm, lb, ft, inch]);

  const bmi = useMemo(() => computeBMI(kgCalc, cmCalc), [kgCalc, cmCalc]);
  const cat = bmiCategory(bmi);
  const range = idealWeightRangeKg(cmCalc);
  const pct = progressPercent(bmi);

  // handy actions
  function resetAll() {
    setKg("");
    setCm("");
    setLb("");
    setFt("");
    setInch("");
  }

  function switchUnits(next: Units) {
    if (next === units) return;
    if (next === "metric") {
      // convert current imperial to metric
      const kgM = typeof lb === "number" ? kgFromLb(lb) : "";
      const cmM =
        typeof ft === "number" && typeof inch === "number"
          ? cmFromFtIn(ft, inch)
          : "";
      setKg(kgM === "" ? "" : Number(kgM.toFixed(1)));
      setCm(cmM === "" ? "" : Math.round(cmM));
    } else {
      // convert current metric to imperial
      const lbI = typeof kg === "number" ? lbFromKg(kg) : "";
      const ftIn =
        typeof cm === "number" && cm > 0 ? toFeetInches(cm) : null;
      setLb(lbI === "" ? "" : Number(lbI.toFixed(1)));
      setFt(ftIn ? ftIn.ft : "");
      setInch(ftIn ? ftIn.inches : "");
    }
    setUnits(next);
  }

  return (
    <main
      className="min-h-screen text-stone-800
                 bg-[radial-gradient(1200px_600px_at_-10%_-10%,#fde7d9_0%,transparent_60%),radial-gradient(800px_500px_at_110%_-10%,#ffe7ba_0%,transparent_55%),linear-gradient(to_bottom,#fff8f1,#fff5e7)]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top row */}
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/"
            className="inline-flex items-center text-sm px-3 py-1.5 rounded-lg
                       bg-amber-50 text-amber-800 border border-amber-200
                       hover:bg-amber-100"
          >
            ← Back
          </Link>

          <div className="inline-flex rounded-lg overflow-hidden ring-1 ring-amber-200">
            <button
              onClick={() => switchUnits("metric")}
              className={`px-3 py-1.5 text-sm ${
                units === "metric"
                  ? "bg-white text-stone-900"
                  : "bg-amber-50/60 text-stone-600 hover:bg-amber-50"
              }`}
            >
              Metric
            </button>
            <button
              onClick={() => switchUnits("imperial")}
              className={`px-3 py-1.5 text-sm border-l border-amber-200 ${
                units === "imperial"
                  ? "bg-white text-stone-900"
                  : "bg-amber-50/60 text-stone-600 hover:bg-amber-50"
              }`}
            >
              Imperial
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Calculator Card */}
          <section
            className="rounded-2xl border border-amber-200 bg-white/80 backdrop-blur
                       shadow-[0_2px_20px_rgba(253,230,138,0.25)] p-5"
          >
            <h1 className="text-3xl font-extrabold text-stone-900">BMI Calculator</h1>
            <p className="mt-1 text-stone-600">
              Quick, privacy-first calculator. Your inputs are stored locally for convenience.
            </p>

            <div className="mt-5 space-y-4">
              {units === "metric" ? (
                <>
                  <div>
                    <label className="block text-sm text-stone-700 mb-1">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      inputMode="decimal"
                      value={kg}
                      onChange={(e) =>
                        setKg(e.target.value === "" ? "" : Number(e.target.value))
                      }
                      placeholder="e.g. 70"
                      className="w-full rounded-lg border border-amber-200 bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-amber-300 text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-stone-700 mb-1">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      inputMode="decimal"
                      value={cm}
                      onChange={(e) =>
                        setCm(e.target.value === "" ? "" : Number(e.target.value))
                      }
                      placeholder="e.g. 175"
                      className="w-full rounded-lg border border-amber-200 bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-amber-300 text-stone-900"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm text-stone-700 mb-1">
                      Weight (lb)
                    </label>
                    <input
                      type="number"
                      inputMode="decimal"
                      value={lb}
                      onChange={(e) =>
                        setLb(e.target.value === "" ? "" : Number(e.target.value))
                      }
                      placeholder="e.g. 165"
                      className="w-full rounded-lg border border-amber-200 bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-amber-300 text-stone-900"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-stone-700 mb-1">Height (ft)</label>
                      <input
                        type="number"
                        inputMode="numeric"
                        value={ft}
                        onChange={(e) =>
                          setFt(e.target.value === "" ? "" : Number(e.target.value))
                        }
                        placeholder="e.g. 5"
                        className="w-full rounded-lg border border-amber-200 bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-amber-300 text-stone-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-stone-700 mb-1">Height (in)</label>
                      <input
                        type="number"
                        inputMode="numeric"
                        value={inch}
                        onChange={(e) =>
                          setInch(e.target.value === "" ? "" : Number(e.target.value))
                        }
                        placeholder="e.g. 9"
                        className="w-full rounded-lg border border-amber-200 bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-amber-300 text-stone-900"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={resetAll}
                  className="text-sm px-3 py-1.5 rounded-lg border border-amber-200 text-stone-700 hover:bg-amber-50"
                >
                  Reset
                </button>
                <span className="text-xs text-stone-500">
                  Calculates automatically as you type.
                </span>
              </div>
            </div>

            {/* Results */}
            <div className="mt-6 rounded-xl border border-amber-200 bg-white/70 p-4">
              <div className="flex items-end gap-3 flex-wrap">
                <div className="text-4xl font-extrabold text-stone-900 tabular-nums">
                  {bmi ?? "--"}
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${cat.color}`}
                >
                  {cat.label}
                </span>
              </div>

              {/* Progress bar */}
              <div className="mt-3">
                <div className="h-2 w-full rounded-full bg-stone-200/70 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-400 via-emerald-500 to-rose-400"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="mt-1 flex justify-between text-[11px] text-stone-500">
                  <span>12</span>
                  <span>18.5</span>
                  <span>25</span>
                  <span>30</span>
                  <span>40</span>
                </div>
              </div>

              {/* Ideal range */}
              {range && (
                <div className="mt-3 text-sm text-stone-700">
                  Ideal weight range for your height (BMI 18.5–24.9):{" "}
                  <strong className="text-stone-900">
                    {range.min}–{range.max} kg
                  </strong>
                  {units === "imperial" && (
                    <>
                      {" "}
                      (<strong className="text-stone-900">
                        {Math.round(lbFromKg(range.min))}–{Math.round(lbFromKg(range.max))} lb
                      </strong>)
                    </>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Tips / Extras Card (local-only) */}
          <aside
            className="rounded-2xl border border-amber-200 bg-white/80 backdrop-blur
                       shadow-[0_2px_20px_rgba(253,230,138,0.25)] p-5"
          >
            <h2 className="text-xl font-semibold text-stone-900">Wellness Tips</h2>
            <ul className="mt-3 space-y-3 text-stone-700 text-sm leading-relaxed">
              <li className="rounded-lg border border-amber-200/60 bg-amber-50/40 p-3">
                🥗 Aim for balanced plates: ½ veggies, ¼ protein, ¼ whole grains.
              </li>
              <li className="rounded-lg border border-emerald-200/60 bg-emerald-50/40 p-3">
                🚶 Move a little every hour. Short walks add up.
              </li>
              <li className="rounded-lg border border-blue-200/60 bg-blue-50/40 p-3">
                💧 Hydrate throughout the day—water first.
              </li>
              <li className="rounded-lg border border-rose-200/60 bg-rose-50/40 p-3">
                😴 Aim for consistent sleep. Recovery matters as much as training.
              </li>
            </ul>

            <div className="mt-5 text-xs text-stone-500">
              BMI is a simple screening tool. It doesn’t directly measure body fat or
              account for factors like muscle mass. For personal guidance, talk to a
              healthcare professional.
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
