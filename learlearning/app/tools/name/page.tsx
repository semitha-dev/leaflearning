"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";

// Example word bank for different categories
const adjectives = [
  "Swift", "Silent", "Fierce", "Mighty", "Wise", "Clever", "Brave", "Noble",
  "Shadowy", "Fearless", "Radiant", "Vigilant", "Cunning", "Loyal", "Sly",
  "Grim", "Luminous", "Ancient", "Savage", "Vengeful", "Dark", "Bold", "Gentle",
  "Wicked", "Frozen", "Burning", "Mystic", "Electric", "Thunderous", "Crimson",
  "Stormy", "Golden", "Icy", "Shining", "Flaming", "Roaring", "Silent", "Deadly",
  "Stealthy", "Majestic", "Enchanted", "Blazing", "Eternal", "Glorious", "Arcane",
  "Chaotic", "Radiant", "Daring", "Ghostly", "Sacred", "Shattered", "Molten",
  "Unseen", "Blinded", "Raging", "Hallowed", "Frosty", "Spirited", "Royal",
  "Gallant", "Sinister", "Echoing", "Thunderous", "Haunted", "Piercing", "Untamed",
  "Savage", "Celestial", "Void", "Astral", "Runed", "Solar", "Lunar", "Twilight",
  "Nocturnal", "Heated", "Mirrored", "Primal", "Shattered", "Venomous", "Jagged",
  "Fabled", "Grizzled", "Unbroken", "Unyielding", "Obsidian", "Verdant", "Iron",
  "Silent", "Merciless", "Radiant", "Spectral", "Shrouded", "Infinite", "Infernal",
  "Moonlit", "Starborn", "Divine", "Tainted", "Echoed", "Scarlet"
];

const nouns = [
  "Dragon", "Phoenix", "Knight", "Ranger", "Hunter", "Sorcerer", "Titan", "Mage",
  "Champion", "Slayer", "Reaper", "Viking", "Juggernaut", "Demon", "Phantom",
  "Invoker", "Shaman", "Druid", "Sentinel", "Witch", "Monk", "Warlock", "Crusader",
  "Fighter", "Rogue", "Defender", "Alchemist", "Spartan", "Witcher", "Elementalist",
  "Mercenary", "Specter", "Warden", "Vanguard", "Tactician", "Sniper", "Gladiator",
  "Banshee", "Swordsman", "Champion", "Beast", "Warrior", "Assassin", "Ninja",
  "Warlord", "Samurai", "Gladiator", "Berserker", "Destroyer", "Outlaw", "Fury",
  "Blademaster", "Hunter", "Ranger", "Mage", "Champion", "Slayer", "Reaper"
];

const gamerAdjectives = [
  "Elite", "Savage", "Fierce", "Blazing", "Vicious", "Unstoppable", "Relentless", "Deadly", "Powerful",
  "Swift", "Invincible", "Ruthless", "Dominating", "Fearless", "Untamed", "Supreme", "Untouchable", "Fury",
  "Mighty", "Epic", "Legendary", "Iron", "Shadow", "Titan", "Dragon", "Phoenix", "Storm", "Blaze",
  "Thunder", "Infernal", "Dark", "Lightning", "Vengeful", "Venomous", "Crimson", "Savage", "Burning",
  "Eternal", "Wicked", "Toxic", "Cursed", "Unyielding", "Unbreakable", "Raging", "Chaotic", "Doom",
  "Void", "Shattered", "Lethal", "Brutal", "Cunning", "Mystic", "Warrior", "Vengeful", "Titanic", "Feral"
];

const gamerNouns = [
  "Warrior", "Assassin", "Knight", "Ninja", "Warlord", "Sorcerer", "Titan", "Ranger", "Hunter",
  "Samurai", "Gladiator", "Berserker", "Mage", "Beast", "Hunter", "Champion", "Slayer", "Reaper",
  "Viking", "Destroyer", "Juggernaut", "Demon", "Phantom", "Outlaw", "Invoker", "Shaman", "Druid",
  "Fury", "Blademaster", "Sentinel", "Frost", "Witch", "Monk", "Warlock", "Crusader", "Fighter",
  "Rogue", "Defender", "Alchemist", "Spartan", "Witcher", "Elementalist", "Bountyhunter", "Mercenary",
  "Specter", "Warden", "Vanguard", "Tactician", "Sniper", "Gladiator", "Banshee", "Swordsman", "Champion"
];

const businessAdjectives = [
  "Global", "Strategic", "Innovative", "Dynamic", "Pioneering", "Progressive", "Sustainable", "Efficient",
  "Trustworthy", "Collaborative", "Expert", "Driven", "Focused", "Professional", "Reliable", "Visionary",
  "Bold", "Creative", "Authentic", "Elite", "Distinctive", "Agile", "Strategic", "Resilient", "Dedicated",
  "Unique", "Resourceful", "Global", "Empowered", "Insightful", "Responsive", "Leverage", "Innovative",
  "Forward-thinking", "Synergistic", "Impactful", "Transformative", "Inspirational", "Comprehensive", "Value-driven",
  "Adaptive", "Competent", "Cutting-edge", "Customer-focused", "Collaborative", "Optimized", "Proactive", "Successful"
];

const businessNouns = [
  "Solutions", "Consultants", "Enterprises", "Ventures", "Partners", "Group", "Corporation", "Technologies",
  "Systems", "Strategies", "Services", "Innovation", "Network", "Advisors", "Consulting", "Firm", "Enterprises",
  "Associates", "Developers", "Experts", "Holdings", "Corporation", "Concepts", "Partners", "Global", "Insights",
  "Leadership", "Global", "Management", "Solutions", "Insights", "Innovations", "Team", "Agency", "Industry",
  "Capital", "Experts", "Growth", "Enterprise", "Technologies", "Consultants", "Strategies", "Research", "Corporation",
  "Associates", "Solutions", "Consulting", "Marketing", "Development", "Alliance", "Focus", "Growth", "Corporation"
];

export default function NameGenerator() {
  const [numNames, setNumNames] = useState(10); // Number of names to generate
  const [wordsPerName, setWordsPerName] = useState(2); // Words per name
  const [category, setCategory] = useState("Gamer"); // Selected category for name generation
  const [names, setNames] = useState<string[]>([]);
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

  const generateRandomWord = () => {
    let pool;
    if (category === "Gamer") {
      pool = [...gamerAdjectives, ...gamerNouns];
    } else if (category === "Business") {
      pool = [...businessAdjectives, ...businessNouns];
    } else {
      pool = [...adjectives, ...nouns];
    }
    return pool[Math.floor(Math.random() * pool.length)];
  };

  function generateNames(e: React.FormEvent) {
    e.preventDefault();
    const generated = Array.from({ length: numNames }, () => {
      return Array.from({ length: wordsPerName }, generateRandomWord).join(" ");
    });
    setNames(generated);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col lg:flex-row items-start justify-center gap-10 p-6">
      {/* Name Generator Section */}
      <div className="w-full max-w-xl">
        <div className="flex justify-start mb-4">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 font-semibold text-sm bg-blue-100 px-3 py-1 rounded-md shadow-sm transition"
          >
            ← Back
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-black mb-6">Name Generator</h1>

        <form
          onSubmit={generateNames}
          className="bg-white p-6 rounded-2xl shadow-xl w-full"
        >
          <div className="mb-4">
            <label className="block text-black font-medium mb-1">
              Select Name Type
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border rounded-lg text-black placeholder-gray-400"
            >
              <option value="Gamer">Gamer</option>
              <option value="Casual">Casual</option>
              <option value="Business">Business</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-black font-medium mb-1">
              Number of Names
            </label>
            <input
              type="number"
              value={numNames}
              onChange={(e) => setNumNames(parseInt(e.target.value))}
              className="w-full p-2 border rounded-lg text-black placeholder-gray-400"
              placeholder="Enter how many names"
              min={1}
            />
          </div>

          <div className="mb-4">
            <label className="block text-black font-medium mb-1">
              Words per Name
            </label>
            <input
              type="number"
              value={wordsPerName}
              onChange={(e) => setWordsPerName(parseInt(e.target.value))}
              className="w-full p-2 border rounded-lg text-black placeholder-gray-400"
              placeholder="Enter how many words per name"
              min={1}
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition w-full"
          >
            Generate Names
          </button>

          {names.length > 0 && (
            <div className="mt-6 text-black space-y-2">
              <h2 className="text-xl font-semibold mb-2">Generated Names:</h2>
              {names.map((name, idx) => (
                <p key={idx} className="text-md">{idx + 1}. {name}</p>
              ))}
            </div>
          )}
        </form>
      </div>

      {/* News Section */}
      
    </div>
  );
}
