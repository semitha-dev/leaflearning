"use client"

import React, { useState } from "react";

export default function BMICalculator() {
  const [weight, setWeight] = useState(0);
  const [height, setHeight] = useState(0);
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState("");

  function calculateBMI() {
    if (weight > 0 && height > 0) {
      const heightInMeters = height / 100;
      const result = weight / (heightInMeters * heightInMeters);
      setBmi(parseFloat(result.toFixed(2)));
      setCategory(getBMICategory(result));
    }
  }

  function getBMICategory(bmi: number): string {
    if (bmi < 18.5) return "Underweight";
    else if (bmi < 24.9) return "Normal weight";
    else if (bmi < 29.9) return "Overweight";
    else return "Obese";
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-4">BMI Calculator</h1>

      {/* Top Ad placeholder */}
      <div className="bg-yellow-100 text-yellow-800 text-center py-3 px-6 mb-6 w-full max-w-xl rounded-lg">
        Ad Space (Top Banner)
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-xl">
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Weight (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Height (cm)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <button
          onClick={calculateBMI}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Calculate BMI
        </button>

        {bmi && (
          <div className="mt-6 text-center">
            <p className="text-xl font-semibold">Your BMI: {bmi}</p>
            <p className="text-md text-gray-600">Category: {category}</p>
          </div>
        )}
      </div>

      {/* Bottom Ad placeholder */}
      <div className="bg-yellow-100 text-yellow-800 text-center py-3 px-6 mt-6 w-full max-w-xl rounded-lg">
        Ad Space (Bottom Banner)
      </div>
    </div>
  );
}
