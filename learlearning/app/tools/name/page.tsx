"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Copy,
  Check,
  RefreshCw,
  Star,
  StarOff,
  Download,
  Dice5,
  Trash2,
} from "lucide-react";

/* ================== Word Banks ================== */
// (kept your lists intact)
const adjectives = [
  "Swift","Silent","Fierce","Mighty","Wise","Clever","Brave","Noble",
  "Shadowy","Fearless","Radiant","Vigilant","Cunning","Loyal","Sly",
  "Grim","Luminous","Ancient","Savage","Vengeful","Dark","Bold","Gentle",
  "Wicked","Frozen","Burning","Mystic","Electric","Thunderous","Crimson",
  "Stormy","Golden","Icy","Shining","Flaming","Roaring","Silent","Deadly",
  "Stealthy","Majestic","Enchanted","Blazing","Eternal","Glorious","Arcane",
  "Chaotic","Radiant","Daring","Ghostly","Sacred","Shattered","Molten",
  "Unseen","Blinded","Raging","Hallowed","Frosty","Spirited","Royal",
  "Gallant","Sinister","Echoing","Thunderous","Haunted","Piercing","Untamed",
  "Savage","Celestial","Void","Astral","Runed","Solar","Lunar","Twilight",
  "Nocturnal","Heated","Mirrored","Primal","Shattered","Venomous","Jagged",
  "Fabled","Grizzled","Unbroken","Unyielding","Obsidian","Verdant","Iron",
  "Silent","Merciless","Radiant","Spectral","Shrouded","Infinite","Infernal",
  "Moonlit","Starborn","Divine","Tainted","Echoed","Scarlet"
];
const nouns = [
  "Dragon","Phoenix","Knight","Ranger","Hunter","Sorcerer","Titan","Mage",
  "Champion","Slayer","Reaper","Viking","Juggernaut","Demon","Phantom",
  "Invoker","Shaman","Druid","Sentinel","Witch","Monk","Warlock","Crusader",
  "Fighter","Rogue","Defender","Alchemist","Spartan","Witcher","Elementalist",
  "Mercenary","Specter","Warden","Vanguard","Tactician","Sniper","Gladiator",
  "Banshee","Swordsman","Champion","Beast","Warrior","Assassin","Ninja",
  "Warlord","Samurai","Gladiator","Berserker","Destroyer","Outlaw","Fury",
  "Blademaster","Hunter","Ranger","Mage","Champion","Slayer","Reaper"
];
const gamerAdjectives = [
  "Elite","Savage","Fierce","Blazing","Vicious","Unstoppable","Relentless","Deadly","Powerful",
  "Swift","Invincible","Ruthless","Dominating","Fearless","Untamed","Supreme","Untouchable","Fury",
  "Mighty","Epic","Legendary","Iron","Shadow","Titan","Dragon","Phoenix","Storm","Blaze",
  "Thunder","Infernal","Dark","Lightning","Vengeful","Venomous","Crimson","Savage","Burning",
  "Eternal","Wicked","Toxic","Cursed","Unyielding","Unbreakable","Raging","Chaotic","Doom",
  "Void","Shattered","Lethal","Brutal","Cunning","Mystic","Warrior","Vengeful","Titanic","Feral"
];
const gamerNouns = [
  "Warrior","Assassin","Knight","Ninja","Warlord","Sorcerer","Titan","Ranger","Hunter",
  "Samurai","Gladiator","Berserker","Mage","Beast","Hunter","Champion","Slayer","Reaper",
  "Viking","Destroyer","Juggernaut","Demon","Phantom","Outlaw","Invoker","Shaman","Druid",
  "Fury","Blademaster","Sentinel","Frost","Witch","Monk","Warlock","Crusader","Fighter",
  "Rogue","Defender","Alchemist","Spartan","Witcher","Elementalist","Bountyhunter","Mercenary",
  "Specter","Warden","Vanguard","Tactician","Sniper","Gladiator","Banshee","Swordsman","Champion"
];
const businessAdjectives = [
  "Global","Strategic","Innovative","Dynamic","Pioneering","Progressive","Sustainable","Efficient",
  "Trustworthy","Collaborative","Expert","Driven","Focused","Professional","Reliable","Visionary",
  "Bold","Creative","Authentic","Elite","Distinctive","Agile","Strategic","Resilient","Dedicated",
  "Unique","Resourceful","Global","Empowered","Insightful","Responsive","Leverage","Innovative",
  "Forward-thinking","Synergistic","Impactful","Transformative","Inspirational","Comprehensive","Value-driven",
  "Adaptive","Competent","Cutting-edge","Customer-focused","Collaborative","Optimized","Proactive","Successful"
];
const businessNouns = [
  "Solutions","Consultants","Enterprises","Ventures","Partners","Group","Corporation","Technologies",
  "Systems","Strategies","Services","Innovation","Network","Advisors","Consulting","Firm","Enterprises",
  "Associates","Developers","Experts","Holdings","Corporation","Concepts","Partners","Global","Insights",
  "Leadership","Global","Management","Solutions","Insights","Innovations","Team","Agency","Industry",
  "Capital","Experts","Growth","Enterprise","Technologies","Consultants","Strategies","Research","Corporation",
  "Associates","Solutions","Consulting","Marketing","Development","Alliance","Focus","Growth","Corporation"
];

type Category = "Gamer" | "Casual" | "Business";
const CATEGORIES: Record<Category, string[]> = {
  Gamer: [...gamerAdjectives, ...gamerNouns],
  Casual: [...adjectives, ...nouns],
  Business: [...businessAdjectives, ...businessNouns],
};

/* ================== Helpers ================== */
function toCase(s: string, mode: "Title" | "lower" | "UPPER"): string {
  if (mode === "Title") {
    return s
      .split(/\s+/)
      .map(w => w[0] ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w)
      .join(" ");
  }
  if (mode === "lower") return s.toLowerCase();
  return s.toUpperCase();
}

function downloadCSV(filename: string, rows: string[]) {
  const csv = ["Name"].concat(rows.map(r => `"${r.replace(/"/g, '""')}"`)).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/* ================== Component ================== */
export default function NameGenerator() {
  // core controls
  const [numNames, setNumNames] = useState(10);
  const [wordsPerName, setWordsPerName] = useState(2);
  const [category, setCategory] = useState<Category>("Gamer");

  // advanced options
  const [ensureUnique, setEnsureUnique] = useState(true);
  const [separator, setSeparator] = useState(" ");
  const [caseMode, setCaseMode] = useState<"Title" | "lower" | "UPPER">("Title");
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");

  // data
  const [names, setNames] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  // UI feedback
  const [copied, setCopied] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // persist favorites + last settings
  useEffect(() => {
    const fav = localStorage.getItem("namegen_favorites");
    const last = localStorage.getItem("namegen_last_settings");
    if (fav) setFavorites(JSON.parse(fav));
    if (last) {
      try {
        const parsed = JSON.parse(last);
        setNumNames(parsed.numNames ?? 10);
        setWordsPerName(parsed.wordsPerName ?? 2);
        setCategory(parsed.category ?? "Gamer");
        setEnsureUnique(parsed.ensureUnique ?? true);
        setSeparator(parsed.separator ?? " ");
        setCaseMode(parsed.caseMode ?? "Title");
        setPrefix(parsed.prefix ?? "");
        setSuffix(parsed.suffix ?? "");
      } catch {}
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("namegen_favorites", JSON.stringify(favorites));
  }, [favorites]);
  useEffect(() => {
    localStorage.setItem(
      "namegen_last_settings",
      JSON.stringify({ numNames, wordsPerName, category, ensureUnique, separator, caseMode, prefix, suffix })
    );
  }, [numNames, wordsPerName, category, ensureUnique, separator, caseMode, prefix, suffix]);

  const pool = useMemo(() => CATEGORIES[category], [category]);

  const pickWord = () => pool[Math.floor(Math.random() * pool.length)];

  const buildName = () => {
    const raw = Array.from({ length: wordsPerName }, pickWord).join(separator);
    const withAffixes = `${prefix ? prefix + separator : ""}${raw}${suffix ? separator + suffix : ""}`;
    return toCase(withAffixes.replace(/\s+/g, separator).trim(), caseMode);
  };

  const generate = () => {
    const set = new Set<string>();
    const out: string[] = [];
    while (out.length < numNames) {
      const candidate = buildName();
      if (ensureUnique) {
        if (!set.has(candidate)) {
          set.add(candidate);
          out.push(candidate);
        }
        if (set.size >= 5000) break; // hard stop (safety)
      } else {
        out.push(candidate);
      }
    }
    setNames(out);
    setCopied(null);
    setCopiedAll(false);
  };

  const copyOne = async (name: string) => {
    await navigator.clipboard.writeText(name);
    setCopied(name);
    setTimeout(() => setCopied(null), 1200);
  };

  const copyAll = async () => {
    if (!names.length) return;
    await navigator.clipboard.writeText(names.join("\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1200);
  };

  const toggleFavorite = (name: string) => {
    setFavorites(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : prev.concat(name)
    );
  };

  const exportCSV = () => downloadCSV("generated-names.csv", names);

  const clearAll = () => {
    setNames([]);
    setCopied(null);
    setCopiedAll(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white text-stone-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-start mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-amber-800 hover:text-amber-900 font-medium text-sm bg-amber-100 px-3 py-1.5 rounded-md ring-1 ring-amber-200 transition"
          >
            ← Back
          </Link>
        </div>

        <div className="flex items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Name Generator
          </h1>

          <div className="flex items-center gap-2">
            <button
              onClick={generate}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white shadow-sm ring-1 ring-amber-700/20"
              title="Generate"
            >
              <RefreshCw className="h-4 w-4" /> Generate
            </button>
            <button
              onClick={copyAll}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-amber-50 text-stone-800 ring-1 ring-amber-200"
              title="Copy all"
            >
              <Copy className="h-4 w-4" />
              {copiedAll ? "Copied!" : "Copy all"}
            </button>
            <button
              onClick={exportCSV}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white hover:bg-amber-50 text-stone-800 ring-1 ring-amber-200"
              title="Export CSV"
            >
              <Download className="h-4 w-4" /> CSV
            </button>
            <button
              onClick={() => {
                generate();
              }}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white hover:bg-amber-50 text-stone-800 ring-1 ring-amber-200"
              title="Roll new batch"
            >
              <Dice5 className="h-4 w-4" /> Roll
            </button>
            <button
              onClick={clearAll}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white hover:bg-amber-50 text-stone-800 ring-1 ring-amber-200"
              title="Clear list"
            >
              <Trash2 className="h-4 w-4" /> Clear
            </button>
          </div>
        </div>

        {/* Card: Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white/90 backdrop-blur rounded-2xl shadow-sm ring-1 ring-amber-200 p-5">
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name Type</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full p-2 rounded-lg border border-amber-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="Gamer">Gamer</option>
                  <option value="Casual">Casual</option>
                  <option value="Business">Business</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Number of names</label>
                <input
                  type="number"
                  min={1}
                  value={numNames}
                  onChange={(e) => setNumNames(Math.max(1, parseInt(e.target.value || "1", 10)))}
                  className="w-full p-2 rounded-lg border border-amber-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Words per name</label>
                <input
                  type="number"
                  min={1}
                  value={wordsPerName}
                  onChange={(e) => setWordsPerName(Math.max(1, parseInt(e.target.value || "1", 10)))}
                  className="w-full p-2 rounded-lg border border-amber-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>

            {/* Advanced */}
            <div className="mt-5 grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Case</label>
                <select
                  value={caseMode}
                  onChange={(e) => setCaseMode(e.target.value as any)}
                  className="w-full p-2 rounded-lg border border-amber-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="Title">Title</option>
                  <option value="lower">lower</option>
                  <option value="UPPER">UPPER</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Separator</label>
                <input
                  type="text"
                  value={separator}
                  onChange={(e) => setSeparator(e.target.value)}
                  className="w-full p-2 rounded-lg border border-amber-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="e.g., space, -, _"
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input
                  id="unique"
                  type="checkbox"
                  checked={ensureUnique}
                  onChange={(e) => setEnsureUnique(e.target.checked)}
                  className="h-4 w-4 accent-amber-600"
                />
                <label htmlFor="unique" className="text-sm">Ensure unique</label>
              </div>
            </div>

            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Prefix</label>
                <input
                  type="text"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  className="w-full p-2 rounded-lg border border-amber-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="Optional prefix"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Suffix</label>
                <input
                  type="text"
                  value={suffix}
                  onChange={(e) => setSuffix(e.target.value)}
                  className="w-full p-2 rounded-lg border border-amber-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="Optional suffix"
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <button
                onClick={generate}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white shadow-sm ring-1 ring-amber-700/20"
              >
                <RefreshCw className="h-4 w-4" /> Generate
              </button>
              <button
                onClick={copyAll}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white hover:bg-amber-50 text-stone-800 ring-1 ring-amber-200"
              >
                <Copy className="h-4 w-4" />
                {copiedAll ? "Copied!" : "Copy all"}
              </button>
              <button
                onClick={exportCSV}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white hover:bg-amber-50 text-stone-800 ring-1 ring-amber-200"
              >
                <Download className="h-4 w-4" /> CSV
              </button>
              <button
                onClick={clearAll}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white hover:bg-amber-50 text-stone-800 ring-1 ring-amber-200"
              >
                <Trash2 className="h-4 w-4" /> Clear
              </button>
            </div>
          </div>

          {/* Favorites */}
          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-sm ring-1 ring-amber-200 p-5">
            <h2 className="text-lg font-semibold mb-3">Favorites</h2>
            {favorites.length === 0 ? (
              <p className="text-sm text-stone-600">Save names you like to keep them here.</p>
            ) : (
              <ul className="space-y-2">
                {favorites.map((n) => (
                  <li
                    key={n}
                    className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 ring-1 ring-amber-100 bg-amber-50"
                  >
                    <span className="truncate">{n}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyOne(n)}
                        className="p-1 rounded-md bg-white hover:bg-amber-100 ring-1 ring-amber-200"
                        title="Copy"
                      >
                        {copied === n ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => toggleFavorite(n)}
                        className="p-1 rounded-md bg-white hover:bg-amber-100 ring-1 ring-amber-200"
                        title="Remove from favorites"
                      >
                        <StarOff className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="mt-8 bg-white/90 backdrop-blur rounded-2xl shadow-sm ring-1 ring-amber-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-amber-100">
            <h2 className="text-lg font-semibold">Generated Names</h2>
            <div className="text-sm text-stone-600">
              {names.length ? `${names.length} results` : "No results yet"}
            </div>
          </div>

          <div className="p-5">
            {names.length === 0 ? (
              <div className="text-stone-600 text-sm">
                Click <span className="font-medium text-amber-800">Generate</span> to create names
                based on your settings.
              </div>
            ) : (
              <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {names.map((n, idx) => (
                  <li
                    key={`${n}-${idx}`}
                    className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 ring-1 ring-amber-100 bg-white hover:bg-amber-50 transition"
                  >
                    <span className="truncate">{n}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => copyOne(n)}
                        className="p-1 rounded-md hover:bg-amber-100 ring-1 ring-amber-200 bg-white"
                        title="Copy"
                      >
                        {copied === n ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => toggleFavorite(n)}
                        className={`p-1 rounded-md ring-1 ring-amber-200 bg-white hover:bg-amber-100`}
                        title={favorites.includes(n) ? "Unfavorite" : "Favorite"}
                      >
                        <Star className={`h-4 w-4 ${favorites.includes(n) ? "fill-amber-500 text-amber-500" : ""}`} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Footer action */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={generate}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white shadow-sm ring-1 ring-amber-700/20"
          >
            <Dice5 className="h-4 w-4" /> Generate another batch
          </button>
        </div>
      </div>
    </div>
  );
}
