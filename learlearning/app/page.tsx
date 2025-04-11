'use client'

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ChevronRight, Star } from "lucide-react";

// Define interfaces for our types
interface Tool {
  title: string;
  href: string;
  popular: boolean;
}

interface GroupedTools {
  [key: string]: Tool[];
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [featuredTools, setFeaturedTools] = useState<Tool[]>([]);
  const [allTools, setAllTools] = useState<Tool[]>([]);

  const tools: Tool[] = [
    { title: "BMI Calculator", href: "/tools/bmi", popular: true },
    { title: "Love Calculator", href: "/tools/love", popular: true },
    { title: "Age Calculator", href: "/tools/age", popular: true },
    { title: "Random Name Generator", href: "/tools/name", popular: false },
    { title: "Password Generator", href: "/tools/password", popular: true },
    { title: "QR Code Generator", href: "/tools/qrcode", popular: true },
    { title: "Unit Converter", href: "/tools/unit-converter", popular: false },
    { title: "Text to Speech", href: "/tools/text-to-speech", popular: false },
    { title: "Color Picker", href: "/tools/color-picker", popular: false },
    { title: "Word Counter", href: "/tools/word-counter", popular: false },
    { title: "Text Case Converter", href: "/tools/text-case-converter", popular: false },
    { title: "Markdown Previewer", href: "/tools/markdown-previewer", popular: false },
    { title: "Todo List", href: "/tools/list", popular: false },
    { title: "IP Address Finder", href: "/tools/ip-finder", popular: false },
    { title: "JSON Formatter", href: "/tools/json-formatter", popular: false },
    { title: "Lorem Ipsum Generator", href: "/tools/lorem-ipsum", popular: false },
    { title: "Epoch Time Converter", href: "/tools/epoch-converter", popular: false },
    { title: "Online Stopwatch", href: "/tools/stopwatch", popular: false },
  ];

  useEffect(() => {
    setFeaturedTools(tools.filter(tool => tool.popular));
    setAllTools(tools);
  }, []);

  const filteredTools = tools.filter(tool =>
    tool.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Group tools by category (first letter)
  const groupedTools: GroupedTools = filteredTools.reduce((acc: GroupedTools, tool) => {
    const firstLetter = tool.title[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(tool);
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <img
                  src="/cover2.png"
                  alt="Site Logo"
                  className="h-16 w-auto object-contain"
                />
              </Link>
            </div>
            <div className="flex items-center space-x-4">
            <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>

              <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Free Tools & Generators</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Find and use any tool you need for free - forever. 
              <span className="block mt-2 text-sm text-blue-200">
                This website runs using ads. Please consider disabling your adblocker to support us.
              </span>
            </p>
            
            {/* Search Bar - Changed background color to white for better visibility */}
            <div className="mt-8 max-w-md mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search for tools..."
                  value={searchTerm}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 rounded-full bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Tools Section */}
      {searchTerm === "" && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTools.map((tool, index) => (
              <ToolCard key={index} title={tool.title} href={tool.href} featured={true} />
            ))}
          </div>
        </section>
      )}

      {/* All Tools Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {searchTerm ? "Search Results" : "All Tools"}
        </h2>
        
        {Object.keys(groupedTools).length > 0 ? (
          Object.keys(groupedTools).sort().map((letter) => (
            <div key={letter} className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-200 pb-2">{letter}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedTools[letter].map((tool, index) => (
                  <ToolCard key={index} title={tool.title} href={tool.href} featured={false} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No tools found matching your search.</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-medium mb-4">About Us</h3>
              <p className="text-gray-400">
                We provide free online tools to help you with everyday tasks.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white">About</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
                <a href="#" className="text-gray-400 hover:text-white">Instagram</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">© {new Date().getFullYear()} LeafLearningOffcial. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

// Enhanced Tool Card Component with proper TypeScript definitions
interface ToolCardProps {
  title: string;
  href: string;
  featured: boolean;
}

function ToolCard({ title, href, featured }: ToolCardProps) {
  return (
    <Link href={href}>
      <div className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden ${featured ? 'border-l-4 border-blue-500' : ''}`}>
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {featured && <Star className="h-5 w-5 text-yellow-400" />}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">Free to use</p>
            <div className="bg-blue-50 text-blue-600 rounded-full p-1">
              <ChevronRight className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}