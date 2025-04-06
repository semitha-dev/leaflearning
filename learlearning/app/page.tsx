import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 text-gray-900 p-4">
      <header className="text-center py-10">
        <h1 className="text-4xl font-bold mb-2">Free Tools & Generators</h1>
        <p className="text-lg text-gray-600">Useful calculators and tools for everyday needs</p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <ToolCard title="BMI Calculator" href="/tools/bmi" />
        <ToolCard title="Love Calculator" href="/tools/love" />
        <ToolCard title="Age Calculator" href="/tools/age" />
        <ToolCard title="Random Name Generator" href="/tools/name" />
        <ToolCard title="Password Generator" href="/tools/password" />
      </section>

      <footer className="text-center py-10 text-sm text-gray-500">
        © {new Date().getFullYear()} YourSiteName. All rights reserved.
      </footer>
    </main>
  );
}

function ToolCard({ title, href }: { title: string; href: string }) {
  return (
    <Link href={href}>
      <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6 cursor-pointer">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-600">Click to use this tool</p>
      </div>
    </Link>
  );
}
