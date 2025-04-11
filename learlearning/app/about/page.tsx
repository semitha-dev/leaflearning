'use client'

import React from "react";
import Link from "next/link";
import { ChevronRight, Code, Sparkles, Globe, Calendar, Shield, Zap } from "lucide-react";

export default function About() {
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
            <Link href="/" className=" text-gray-600 font-medium hover:text-blue-700">Home</Link>

              <Link href="/about" className="text-blue-600 font-medium hover:text-blue-700">About</Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Our Mission</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              We bring all the tools you need together in one place, completely free.
            </p>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white shadow-lg rounded-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <p className="text-lg text-gray-700 mb-6">
            This website was created with a simple mission: to provide a centralized platform where anyone can access a wide range of useful tools without having to visit multiple sites or pay for services that should be free.
          </p>
          <p className="text-lg text-gray-700 mb-6">
            We believe that helpful digital tools should be accessible to everyone, regardless of their financial situation. That's why we've created this comprehensive collection of utilities that can assist you with everyday tasks, creative projects, and technical requirements.
          </p>
          <p className="text-lg text-gray-700">
            To maintain our free service, we run non-intrusive advertisements. By allowing these ads, you help support our continuous development of new tools and the maintenance of existing ones. If you enjoy our services, simply keeping your adblocker disabled while using our site is a great way to show your support.
          </p>
        </div>

        {/* Tools Count */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-16">
          <div className="bg-white shadow-md rounded-xl p-8 text-center w-full md:w-1/3">
            <h3 className="text-4xl font-bold text-blue-600 mb-2">18+</h3>
            <p className="text-lg text-gray-700">Tools Available</p>
          </div>
          <div className="bg-white shadow-md rounded-xl p-8 text-center w-full md:w-1/3">
            <h3 className="text-4xl font-bold text-purple-600 mb-2">100%</h3>
            <p className="text-lg text-gray-700">Free to Use</p>
          </div>
          <div className="bg-white shadow-md rounded-xl p-8 text-center w-full md:w-1/3">
            <h3 className="text-4xl font-bold text-green-600 mb-2">24/7</h3>
            <p className="text-lg text-gray-700">Always Available</p>
          </div>
        </div>

        {/* Upcoming Features */}
        <div className="bg-white shadow-lg rounded-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Coming Soon</h2>
          <p className="text-lg text-gray-700 mb-6">
            We're constantly working to expand our collection of tools. Here are some exciting features we're currently developing:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <FeatureCard 
              icon={<Code className="h-8 w-8 text-indigo-500" />}
              title="Code Formatter" 
              description="Beautify and format your code in multiple programming languages with syntax highlighting and customizable options."
            />
            <FeatureCard 
              icon={<Globe className="h-8 w-8 text-green-500" />}
              title="Language Translator" 
              description="Translate text between 50+ languages with accurate results and natural language processing."
            />
            <FeatureCard 
              icon={<Calendar className="h-8 w-8 text-blue-500" />}
              title="Date Duration Calculator" 
              description="Calculate the exact time between two dates with customizable outputs for days, weeks, months and years."
            />
            <FeatureCard 
              icon={<Shield className="h-8 w-8 text-red-500" />}
              title="File Encryption Tool" 
              description="Secure your sensitive files with strong encryption algorithms before sharing or storing them."
            />
            <FeatureCard 
              icon={<Sparkles className="h-8 w-8 text-yellow-500" />}
              title="AI Text Summarizer" 
              description="Automatically generate concise summaries of long articles, research papers, or documents."
            />
            <FeatureCard 
              icon={<Zap className="h-8 w-8 text-purple-500" />}
              title="Image Optimizer" 
              description="Compress and optimize your images for the web without losing quality."
            />
          </div>
          
          <p className="text-lg text-gray-700">
            Have an idea for a tool you'd like to see? We're always open to suggestions! Please visit our <Link href="/contact" className="text-blue-600 hover:text-blue-800 underline">Contact page</Link> to share your thoughts.
          </p>
        </div>
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
            <p className="text-gray-400">© {new Date().getFullYear()} LeaflearningOffcial. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

// Feature Card Component
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-all duration-300">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
}