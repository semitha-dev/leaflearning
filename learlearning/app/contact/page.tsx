'use client'

import React from "react";
import Link from "next/link";
import { Mail, Clock, Calendar } from "lucide-react";

export default function Contact() {
  const openEmailClient = () => {
    window.location.href = "mailto:villaddarage@gmail.com";
  };

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
              <Link href="/contact" className="text-blue-600 font-medium hover:text-blue-700">Contact</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Have questions or suggestions? We'd love to hear from you.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white shadow-lg rounded-xl p-8">
          <div className="flex flex-col items-center text-center mb-10">
            <Mail className="h-16 w-16 text-blue-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Email Us With Your Questions</h2>
            <p className="text-lg text-gray-700 mb-6">
              For any inquiries, suggestions, or feedback, please send us an email directly.
              We aim to respond to all messages within 24-48 hours during our business days.
            </p>
            
            <a 
              href="mailto:villaddarage@gmail.com" 
              className="text-xl font-medium text-blue-600 hover:text-blue-800 flex items-center"
            >
              leaflearningoffcial@gmail.com
            </a>

            <button
              onClick={openEmailClient}
              className="mt-6 px-8 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors flex items-center"
            >
              <Mail className="h-5 w-5 mr-2" />
              Send Us an Email
            </button>
          </div>
          
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Our Business Hours</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                <div className="flex items-center space-x-3 mb-4">
                  <Calendar className="h-6 w-6 text-blue-600" />
                  <h4 className="text-lg font-medium text-gray-900">Weekdays</h4>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <p className="text-gray-700">Monday to Friday: 10:00 AM - 7:00 PM</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                <div className="flex items-center space-x-3 mb-4">
                  <Calendar className="h-6 w-6 text-red-600" />
                  <h4 className="text-lg font-medium text-gray-900">Weekends</h4>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <p className="text-gray-700">Saturday and Sunday: Closed</p>
                </div>
              </div>
            </div>
            
            <p className="mt-8 text-center text-gray-600">
              We value your feedback and are committed to continuously improving our tools and services.
            </p>
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