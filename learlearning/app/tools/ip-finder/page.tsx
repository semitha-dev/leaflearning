"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import axios from "axios";
import { jsPDF } from "jspdf";

export default function IPAddressFinder() {
  const [ipAddress, setIpAddress] = useState("");
  const [ipDetails, setIpDetails] = useState<any>(null);
  const [frame, ] = useState<boolean>(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Fetch user's public IP address by default on load
  useEffect(() => {
    async function fetchIpAddress() {
      try {
        const res = await axios.get("https://api.ipify.org?format=json");
        setIpAddress(res.data.ip);
      } catch (err) {
        console.error("Error fetching IP address", err);
      }
    }

    fetchIpAddress();
  }, []);

  // Fetch IP details from ip-api service
  async function getIpDetails(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await axios.get(`https://ip-api.com/json/${ipAddress}`);
      setIpDetails(res.data);
    } catch (err) {
      console.error("Error fetching IP details", err);
    }
  }

  // Generate and download PDF report
  function downloadPdfReport() {
    if (!ipDetails) return;
    
    setIsGeneratingPdf(true);
    
    try {
      // Create new PDF document
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(22);
      doc.setTextColor(44, 62, 80);
      doc.text("IP Address Report", 105, 20, { align: "center" });
      
      // Add date
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 30, { align: "center" });
      
      // Add divider
      doc.setDrawColor(200, 200, 200);
      doc.line(20, 35, 190, 35);
      
      // Add IP details
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(`IP Address: ${ipDetails.query}`, 20, 50);
      doc.text(`Location: ${ipDetails.city}, ${ipDetails.regionName}, ${ipDetails.country}`, 20, 60);
      doc.text(`Coordinates: ${ipDetails.lat}, ${ipDetails.lon}`, 20, 70);
      doc.text(`ISP: ${ipDetails.isp}`, 20, 80);
      doc.text(`Organization: ${ipDetails.org || "N/A"}`, 20, 90);
      doc.text(`AS: ${ipDetails.as || "N/A"}`, 20, 100);
      doc.text(`Timezone: ${ipDetails.timezone}`, 20, 110);
      
      // Add map section title
      doc.setFontSize(16);
      doc.setTextColor(44, 62, 80);
      doc.text("Location Map", 20, 130);
      
      // Add map note (since we can't include an actual map image)
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text("To view the location on a map, visit:", 20, 140);
      doc.setTextColor(0, 102, 204);
      doc.text(`https://www.google.com/maps?q=${ipDetails.lat},${ipDetails.lon}`, 20, 150);
      
      // Add footer
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text("Generated by IP Address Finder Tool", 105, 280, { align: "center" });
      
      // Save PDF
      doc.save(`ip-report-${ipDetails.query}.pdf`);
    } catch (error) {
      console.error("Error generating PDF", error);
      alert("There was an error generating the PDF report.");
    } finally {
      setIsGeneratingPdf(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex flex-col lg:flex-row items-start justify-center gap-10 p-6">
      {/* IP Address Finder Section */}
      <div className="w-full max-w-xl">
        <div className="flex justify-start mb-4">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 font-semibold text-sm bg-blue-100 px-3 py-1 rounded-md shadow-sm transition"
          >
            ← Back
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-6">IP Address Finder</h1>

        <form
          className="bg-white p-6 rounded-2xl shadow-xl w-full"
        >
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              IP Address
            </label>
            <input
              type="text"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              className="w-full p-2 border rounded-lg text-black placeholder-gray-400"
              placeholder="Enter IP address (default is public)"
            />
          </div>

          

          <button
            type="submit"
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition w-full"
          >
            Currently Disabled
          </button>
        </form>

        {ipDetails && (
          <div
            ref={reportRef}
            className={`mt-6 p-6 ${frame ? "border-4 border-blue-500" : ""} rounded-2xl shadow-xl bg-white`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">IP Information</h2>
              <button
                onClick={downloadPdfReport}
                disabled={isGeneratingPdf}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
              >
                {isGeneratingPdf ? (
                  "Generating PDF..."
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                    </svg>
                    Download PDF Report
                  </>
                )}
              </button>
            </div>
            <ul className="space-y-2 mt-4 text-gray-600">
              <li><strong>IP Address:</strong> {ipDetails.query}</li>
              <li><strong>Location:</strong> {ipDetails.city}, {ipDetails.regionName}, {ipDetails.country}</li>
              <li><strong>Coordinates:</strong> {ipDetails.lat}, {ipDetails.lon}</li>
              <li><strong>ISP:</strong> {ipDetails.isp}</li>
              <li><strong>Organization:</strong> {ipDetails.org || "N/A"}</li>
              <li><strong>AS:</strong> {ipDetails.as || "N/A"}</li>
              <li><strong>Timezone:</strong> {ipDetails.timezone}</li>
            </ul>
          </div>
        )}
      </div>

      {/* Optional: News Section (If you want to add something extra) */}
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-blue-800">📰 IP Security Tips</h2>
        <ul className="space-y-3 text-gray-600 text-bold">
          <li className="pb-2 border-b ">
            <p className="text-md font-medium">
              • Always use a VPN when connecting to public Wi-Fi networks
            </p>
          </li>
          <li className="pb-2 border-b">
            <p className="text-md font-medium">
              • Check your IP location periodically to ensure your VPN is working correctly
            </p>
          </li>
          <li className="pb-2 border-b">
            <p className="text-md font-medium">
              • Be aware that your IP address can reveal your approximate location
            </p>
          </li>
          <li className="pb-2 border-b">
            <p className="text-md font-medium">
              • Consider using Tor browser for maximum anonymity
            </p>
          </li>
          <li className="pb-2 border-b">
            <p className="text-md font-medium">
              • Update your router firmware regularly to patch security vulnerabilities
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}