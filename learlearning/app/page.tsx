'use client'

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ChevronRight, Star } from "lucide-react";

// Define interfaces for our types
interface Tool {
  title: string;
  href: string;
  popular: boolean;
  description: string; // Added description field
}

interface GroupedTools {
  [key: string]: Tool[];
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [featuredTools, setFeaturedTools] = useState<Tool[]>([]);
  const [allTools, setAllTools] = useState<Tool[]>([]);

  const tools: Tool[] = [
    { 
      title: "BMI Calculator", 
      href: "/tools/bmi", 
      popular: true,
      description: "Calculate your Body Mass Index (BMI) to measure body fat based on height and weight. Get instant results and health recommendations."
    },
    { 
      title: "Love Calculator", 
      href: "/tools/love", 
      popular: true,
      description: "Find out your compatibility score with your crush or partner. A fun way to test relationship chemistry based on name analysis."
    },
    { 
      title: "Age Calculator", 
      href: "/tools/age", 
      popular: true,
      description: "Calculate exact age in years, months, weeks, and days between any two dates. Perfect for determining precise age for various purposes."
    },
    { 
      title: "Random Name Generator", 
      href: "/tools/name", 
      popular: false,
      description: "Generate random names for characters, babies, or usernames. Choose from different ethnicities, genders, and styles."
    },
    { 
      title: "Password Generator", 
      href: "/tools/password", 
      popular: true,
      description: "Create strong, secure passwords with customizable length and character types. Enhance your online security with uncrackable passwords."
    },
    { 
      title: "QR Code Generator", 
      href: "/tools/qrcode", 
      popular: true,
      description: "Convert URLs, text, or contact information into QR codes. Downloadable in high-quality formats for print or digital use."
    },
    { 
      title: "Unit Converter", 
      href: "/tools/unit-converter", 
      popular: false,
      description: "Convert between different units of measurement including length, weight, volume, temperature, and more with precision and ease."
    },
    { 
      title: "Text to Speech", 
      href: "/tools/text-to-speech", 
      popular: false,
      description: "Transform written text into natural-sounding speech. Choose from multiple voices and languages for accessible content creation."
    },
    { 
      title: "Color Picker", 
      href: "/tools/color-picker", 
      popular: false,
      description: "Select, save, and explore colors with our intuitive color picker. Get HEX, RGB, HSL values and generate complementary color palettes."
    },
    { 
      title: "Word Counter", 
      href: "/tools/word-counter", 
      popular: false,
      description: "Count words, characters, sentences, and paragraphs in your text. Ideal for writers monitoring content length requirements."
    },
    { 
      title: "Text Case Converter", 
      href: "/tools/text-case-converter", 
      popular: false,
      description: "Convert text between uppercase, lowercase, title case, sentence case, and more with a single click. Perfect for formatting needs."
    },
    { 
      title: "Markdown Previewer", 
      href: "/tools/markdown-previewer", 
      popular: false,
      description: "Write markdown with instant preview. See how your formatting will appear before publishing on platforms like GitHub or Reddit."
    },
    { 
      title: "Todo List", 
      href: "/tools/list", 
      popular: false,
      description: "Organize your tasks with our simple yet powerful todo list tool. Set priorities, deadlines, and track your productivity."
    },
    { 
      title: "IP Address Finder", 
      href: "/tools/ip-finder", 
      popular: false,
      description: "Discover your current IP address and get detailed information about your connection including location and service provider."
    },
    { 
      title: "JSON Formatter", 
      href: "/tools/json-formatter", 
      popular: false,
      description: "Format, validate, and beautify JSON data for easier reading and debugging. Essential for developers working with JSON structures."
    },
    { 
      title: "Lorem Ipsum Generator", 
      href: "/tools/lorem-ipsum", 
      popular: false,
      description: "Generate placeholder text for design mockups and layouts. Customize length, start with 'Lorem ipsum' or use random text."
    },
    { 
      title: "Epoch Time Converter", 
      href: "/tools/epoch-converter", 
      popular: false,
      description: "Convert Unix timestamp to human-readable date and time formats. Essential for developers working with time-based functions."
    },
    { 
      title: "Online Stopwatch", 
      href: "/tools/stopwatch", 
      popular: false,
      description: "Accurate stopwatch and timer with lap functionality. Perfect for timing workouts, cooking, presentations, or any timed activity."
    },
  ];

  useEffect(() => {
    setFeaturedTools(tools.filter(tool => tool.popular));
    setAllTools(tools);
  }, []);

  const filteredTools = tools.filter(tool =>
    tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase()) // Also search in descriptions
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
              Find and use any tool you need for free - forever. Our collection of online utilities makes everyday tasks simpler and more efficient.
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
              <ToolCard key={index} title={tool.title} href={tool.href} featured={true} description={tool.description} />
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
                  <ToolCard key={index} title={tool.title} href={tool.href} featured={false} description={tool.description} />
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

      {/* About Our Tools Section - New addition */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Use Our Tools?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-700 mb-3">100% Free</h3>
              <p className="text-gray-700">All our tools are completely free to use with no hidden fees or premium features. We believe essential tools should be accessible to everyone.</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-700 mb-3">Privacy Focused</h3>
              <p className="text-gray-700">We prioritize your privacy and security. Our tools process data in your browser whenever possible, with no data storage or tracking beyond what's necessary.</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-700 mb-3">Constantly Updated</h3>
              <p className="text-gray-700">We regularly add new tools and improve existing ones based on user feedback. Our goal is to create the most comprehensive collection of free utilities.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-medium mb-4">About Us</h3>
              <p className="text-gray-400">
                We provide free online tools to help you with everyday tasks. Our mission is to simplify digital life with accessible, easy-to-use utilities for everyone.
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
              <p className="mt-4 text-gray-400">
                Have suggestions for new tools? We'd love to hear from you! Reach out on social media or through our contact form.
              </p>
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

// Enhanced Tool Card Component with proper TypeScript definitions and description
interface ToolCardProps {
  title: string;
  href: string;
  featured: boolean;
  description: string; // Added description parameter
}

function ToolCard({ title, href, featured, description }: ToolCardProps) {
  return (
    <Link href={href}>
      <div className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden ${featured ? 'border-l-4 border-blue-500' : ''}`}>
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {featured && <Star className="h-5 w-5 text-yellow-400" />}
          </div>
          {/* Added description paragraph */}
          <p className="mt-2 text-sm text-gray-600 line-clamp-3">{description}</p>
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