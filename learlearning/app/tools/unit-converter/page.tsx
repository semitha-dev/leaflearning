"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeftRight,
  Copy,
  Star,
  StarOff,
  RotateCcw,
  Sparkles,
} from "lucide-react";

/* ==============================
   Conversion Model
   ============================== */

/** For most categories, we use "base unit factors":
 *   value_in_base = input * toBase[fromUnit]
 *   output = value_in_base / toBase[toUnit]
 *
 * For Temperature we need custom formula pairs.
 */
type CategoryKey =
  | "length"
  | "weight"
  | "speed"
  | "temperature"
  | "area"
  | "volume"
  | "time"
  | "data";

type ToBaseMap = Record<string, number>; // factor from unit -> base
type CategoryDef =
  | { kind: "factor"; label: string; baseUnit: string; toBase: ToBaseMap }
  | {
      kind: "temperature";
      label: string;
      units: Array<"celsius" | "fahrenheit" | "kelvin">;
      // convert X in FROM to TO
      convert: (from: string, to: string, x: number) => number;
    };

const CATEGORIES: Record<CategoryKey, CategoryDef> = {
  length: {
    kind: "factor",
    label: "Length",
    baseUnit: "meter",
    toBase: {
      meter: 1,
      kilometer: 1000,
      centimeter: 0.01,
      millimeter: 0.001,
      mile: 1609.344,
      yard: 0.9144,
      foot: 0.3048,
      inch: 0.0254,
    },
  },
  weight: {
    kind: "factor",
    label: "Weight",
    baseUnit: "kilogram",
    toBase: {
      kilogram: 1,
      gram: 0.001,
      milligram: 0.000001,
      pound: 0.45359237,
      ounce: 0.028349523125,
      ton: 1000,
      "stone(uk)": 6.35029318,
    },
  },
  speed: {
    kind: "factor",
    label: "Speed",
    baseUnit: "m/s",
    toBase: {
      "m/s": 1,
      "km/h": 1000 / 3600,
      mph: 1609.344 / 3600,
      knot: 1852 / 3600,
    },
  },
  temperature: {
    kind: "temperature",
    label: "Temperature",
    units: ["celsius", "fahrenheit", "kelvin"],
    convert: (from, to, x) => {
      // normalize to Celsius first
      let c: number;
      if (from === "celsius") c = x;
      else if (from === "fahrenheit") c = (x - 32) * (5 / 9);
      else c = x - 273.15; // kelvin -> c

      if (to === "celsius") return c;
      if (to === "fahrenheit") return c * (9 / 5) + 32;
      return c + 273.15; // -> kelvin
    },
  },
  area: {
    kind: "factor",
    label: "Area",
    baseUnit: "m²",
    toBase: {
      "m²": 1,
      "km²": 1e6,
      "cm²": 0.0001,
      "mm²": 0.000001,
      hectare: 10000,
      acre: 4046.8564224,
      "ft²": 0.09290304,
      "in²": 0.00064516,
      "yd²": 0.83612736,
    },
  },
  volume: {
    kind: "factor",
    label: "Volume",
    baseUnit: "liter",
    toBase: {
      liter: 1,
      milliliter: 0.001,
      "m³": 1000,
      "cm³": 0.001,
      gallon: 3.785411784, // US
      quart: 0.946352946, // US
      pint: 0.473176473, // US
      cup: 0.2365882365, // US
      "fl oz": 0.0295735295625, // US
      tablespoon: 0.01478676478125,
      teaspoon: 0.00492892159375,
    },
  },
  time: {
    kind: "factor",
    label: "Time",
    baseUnit: "second",
    toBase: {
      second: 1,
      millisecond: 0.001,
      minute: 60,
      hour: 3600,
      day: 86400,
      week: 604800,
    },
  },
  data: {
    kind: "factor",
    label: "Data",
    baseUnit: "byte",
    toBase: {
      byte: 1,
      kilobyte: 1024,
      megabyte: 1024 ** 2,
      gigabyte: 1024 ** 3,
      terabyte: 1024 ** 4,
      bit: 1 / 8,
      kilobit: 1024 / 8,
      megabit: (1024 ** 2) / 8,
      gigabit: (1024 ** 3) / 8,
    },
  },
};

const DEFAULT_CATEGORY: CategoryKey = "length";

/* ==============================
   Utilities / formatting
   ============================== */

function roundTo(n: number, decimals: number) {
  const p = 10 ** decimals;
  return Math.round(n * p) / p;
}

function title(u: string) {
  return u.replace(/\b([a-z])/g, (m) => m.toUpperCase());
}

/* ==============================
   Component
   ============================== */

type Favorite = { category: CategoryKey; from: string; to: string };

export default function UnitConverter() {
  // core state
  const [category, setCategory] = useState<CategoryKey>(DEFAULT_CATEGORY);
  const [fromUnit, setFromUnit] = useState<string>("meter");
  const [toUnit, setToUnit] = useState<string>("foot");
  const [value, setValue] = useState<string>("");
  const [precision, setPrecision] = useState<number>(4);

  // local goodies
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [history, setHistory] = useState<
    { at: number; category: CategoryKey; from: string; to: string; input: number; output: number }[]
  >([]);

  // load persisted UI state
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("unit_converter_state") || "{}");
      if (saved.category) setCategory(saved.category);
      if (saved.fromUnit) setFromUnit(saved.fromUnit);
      if (saved.toUnit) setToUnit(saved.toUnit);
      if (typeof saved.precision === "number") setPrecision(saved.precision);
      if (Array.isArray(saved.favorites)) setFavorites(saved.favorites);
      if (Array.isArray(saved.history)) setHistory(saved.history);
    } catch {}
  }, []);

  // persist
  useEffect(() => {
    try {
      localStorage.setItem(
        "unit_converter_state",
        JSON.stringify({ category, fromUnit, toUnit, precision, favorites, history })
      );
    } catch {}
  }, [category, fromUnit, toUnit, precision, favorites, history]);

  // units list for current category
  const units: string[] = useMemo(() => {
    const def = CATEGORIES[category];
    if (def.kind === "factor") return Object.keys(def.toBase);
    return def.units;
  }, [category]);

  // keep units valid when category changes
  useEffect(() => {
    const us = CATEGORIES[category];
    if (us.kind === "factor") {
      const keys = Object.keys(us.toBase);
      if (!keys.includes(fromUnit)) setFromUnit(keys[0]);
      if (!keys.includes(toUnit)) setToUnit(keys[Math.min(1, keys.length - 1)]);
    } else {
      if (!us.units.includes(fromUnit as any)) setFromUnit(us.units[0]);
      if (!us.units.includes(toUnit as any)) setToUnit(us.units[Math.min(1, us.units.length - 1)]);
    }
  }, [category]); // eslint-disable-line

  // conversion
  const numericInput = parseFloat(value);
  const canConvert = !Number.isNaN(numericInput) && fromUnit && toUnit;

  const result: number | null = useMemo(() => {
    if (!canConvert) return null;
    const def = CATEGORIES[category];
    const x = numericInput;

    if (def.kind === "factor") {
      const base = def.toBase;
      const f = base[fromUnit];
      const t = base[toUnit];
      if (f == null || t == null) return null;
      const out = (x * f) / t;
      return roundTo(out, precision);
    } else {
      const out = def.convert(fromUnit, toUnit, x);
      return roundTo(out, precision);
    }
  }, [category, fromUnit, toUnit, numericInput, precision, canConvert]);

  // actions
  function swapUnits() {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  }

  function addFavorite() {
    const next = { category, from: fromUnit, to: toUnit };
    // avoid duplicates
    if (!favorites.some((f) => f.category === category && f.from === fromUnit && f.to === toUnit)) {
      setFavorites([next, ...favorites].slice(0, 10));
    }
  }
  function removeFavorite() {
    setFavorites(favorites.filter((f) => !(f.category === category && f.from === fromUnit && f.to === toUnit)));
  }
  const isFav = favorites.some((f) => f.category === category && f.from === fromUnit && f.to === toUnit);

  function copyResult() {
    if (result == null) return;
    navigator.clipboard.writeText(String(result)).catch(() => {});
  }

  // push to history when there is a valid conversion and user changes inputs
  useEffect(() => {
    if (!canConvert || result == null) return;
    // store most recent at top, dedupe by same params+input within last items
    const key = (h: any) =>
      `${h.category}|${h.from}|${h.to}|${h.input}`;
    const entry = { at: Date.now(), category, from: fromUnit, to: toUnit, input: numericInput, output: result };
    const next = [entry, ...history.filter((h) => key(h) !== key(entry))].slice(0, 12);
    setHistory(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, fromUnit, toUnit, numericInput, precision]);

  function clearHistory() {
    setHistory([]);
  }

  /* ==============================
     UI
     ============================== */

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
          <div className="text-sm text-stone-600">
            Private & local-only • Nothing leaves your browser
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
          {/* Converter */}
          <section
            className="rounded-2xl border border-amber-200 bg-white/80 backdrop-blur
                       shadow-[0_2px_20px_rgba(253,230,138,0.25)] p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-extrabold text-stone-900">Unit Converter</h1>
                <p className="text-stone-600 mt-1">Fast, friendly conversions with live results.</p>
              </div>

              <button
                onClick={() => {
                  // reset inputs (keep favorites/history)
                  setCategory(DEFAULT_CATEGORY);
                  setFromUnit("meter");
                  setToUnit("foot");
                  setValue("");
                  setPrecision(4);
                }}
                className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border border-amber-200 hover:bg-amber-50 text-stone-700"
                title="Reset"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
            </div>

            {/* Category */}
            <div className="mt-4 grid sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label className="block text-sm text-stone-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryKey)}
                  className="w-full rounded-lg border border-amber-200 bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-amber-300"
                >
                  {Object.entries(CATEGORIES).map(([key, def]) => (
                    <option key={key} value={key}>
                      {(def as any).label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Precision */}
              <div className="sm:col-span-2">
                <label className="block text-sm text-stone-700 mb-1">Precision: {precision} decimals</label>
                <input
                  type="range"
                  min={0}
                  max={8}
                  value={precision}
                  onChange={(e) => setPrecision(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            {/* From / To */}
            <div className="mt-4 grid sm:grid-cols-2 gap-3 items-end">
              <div>
                <label className="block text-sm text-stone-700 mb-1">From</label>
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="w-full rounded-lg border border-amber-200 bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-amber-300"
                >
                  {units.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center sm:justify-end">
                <button
                  onClick={swapUnits}
                  className="inline-flex items-center gap-2 text-xs px-3 py-2 rounded-lg border border-amber-200 hover:bg-amber-50 text-stone-700"
                  title="Swap units"
                >
                  <ArrowLeftRight className="h-4 w-4" />
                  Swap
                </button>
              </div>

              <div>
                <label className="block text-sm text-stone-700 mb-1">To</label>
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="w-full rounded-lg border border-amber-200 bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-amber-300"
                >
                  {units.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Input */}
            <div className="mt-4 grid sm:grid-cols-[1fr_auto] gap-3 items-end">
              <div>
                <label className="block text-sm text-stone-700 mb-1">Value</label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Enter a number…"
                  className="w-full rounded-lg border border-amber-200 bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-amber-300"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={copyResult}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-amber-200 hover:bg-amber-50 text-stone-700"
                  title="Copy result"
                  disabled={result == null}
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </button>
                <button
                  type="button"
                  onClick={isFav ? removeFavorite : addFavorite}
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-amber-200 ${
                    isFav ? "text-rose-700 hover:bg-rose-50 border-rose-200" : "text-stone-700 hover:bg-amber-50"
                  }`}
                  title={isFav ? "Remove favorite" : "Save as favorite"}
                >
                  {isFav ? <StarOff className="h-4 w-4" /> : <Star className="h-4 w-4" />}
                  {isFav ? "Unfavorite" : "Favorite"}
                </button>
              </div>
            </div>

            {/* Result */}
            <div className="mt-4 rounded-xl border border-amber-200 bg-white/70 p-4">
              <div className="text-xs text-stone-500 mb-1">Result</div>
              <div className="text-2xl font-semibold text-stone-900">
                {result == null ? "—" : `${result} ${toUnit}`}
              </div>
            </div>

            {/* Favorites */}
            {favorites.length > 0 && (
              <div className="mt-6">
                <div className="text-sm font-semibold text-stone-800 mb-2">Favorites</div>
                <div className="flex flex-wrap gap-2">
                  {favorites.map((f, i) => (
                    <button
                      key={`${f.category}-${f.from}-${f.to}-${i}`}
                      onClick={() => {
                        setCategory(f.category);
                        setFromUnit(f.from);
                        setToUnit(f.to);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-amber-200 bg-white/60 hover:bg-amber-50 text-sm text-stone-700"
                    >
                      {CATEGORIES[f.category].label}: {f.from} → {f.to}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* History */}
            {history.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold text-stone-800">Recent</div>
                  <button
                    onClick={clearHistory}
                    className="text-xs px-2 py-1 rounded border border-amber-200 text-stone-700 hover:bg-amber-50"
                  >
                    Clear
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-2">
                  {history.map((h) => (
                    <button
                      key={`${h.at}`}
                      onClick={() => {
                        setCategory(h.category);
                        setFromUnit(h.from);
                        setToUnit(h.to);
                        setValue(String(h.input));
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg border border-amber-200 bg-white/60 hover:bg-amber-50/60"
                    >
                      <div className="text-xs text-stone-500">
                        {CATEGORIES[h.category].label} • {h.from} → {h.to}
                      </div>
                      <div className="truncate text-sm text-stone-800">
                        {h.input} → <b>{h.output}</b>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Tips / Shortcuts */}
          <aside
            className="rounded-2xl border border-amber-200 bg-white/80 backdrop-blur
                       shadow-[0_2px_20px_rgba(253,230,138,0.25)] p-5"
          >
            <div className="inline-flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-amber-100 grid place-items-center border border-amber-200 text-amber-900">
                <Sparkles className="h-4 w-4" />
              </div>
              <h2 className="text-xl font-semibold text-stone-900">Tips & Notes</h2>
            </div>

            <ul className="mt-3 space-y-3 text-stone-700 text-sm leading-relaxed">
              <li className="rounded-lg border border-amber-200/60 bg-amber-50/50 p-3">
                ⚡ Conversions update <b>as you type</b>. Use the <i>Swap</i> button to quickly reverse units.
              </li>
              <li className="rounded-lg border border-rose-200/60 bg-rose-50/50 p-3">
                🌡️ Temperature uses <b>true formulas</b> (not factors), so decimals can matter—tweak precision above.
              </li>
              <li className="rounded-lg border border-emerald-200/60 bg-emerald-50/50 p-3">
                ⭐ Save common pairs as <b>Favorites</b> (stored locally). They’ll follow you on refresh.
              </li>
              <li className="rounded-lg border border-blue-200/60 bg-blue-50/50 p-3">
                🧠 Data units are binary (KB=1024B). If you prefer decimal (1000), I can add a toggle.
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </main>
  );
}
