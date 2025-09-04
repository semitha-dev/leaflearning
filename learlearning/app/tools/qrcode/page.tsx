"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import QRCode from "react-qr-code";

/* ---------- Types ---------- */
type Tab = "URL" | "Text" | "Wi-Fi" | "Contact";
type HistoryItem = { value: string; at: number; label?: string };

/* ---------- Helpers ---------- */
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

function buildWifiString(ssid: string, password: string, hidden: boolean, encryption: "WPA" | "WEP" | "nopass") {
  // WIFI:T:WPA;S:NetworkName;P:Password;H:true;;
  const T = encryption;
  const S = ssid.replace(/([\\;,:"])/g, "\\$1");
  const P = encryption === "nopass" ? "" : password.replace(/([\\;,:"])/g, "\\$1");
  const H = hidden ? "H:true;" : "";
  return `WIFI:T:${T};S:${S};${encryption === "nopass" ? "" : `P:${P};`}${H};`;
}

function buildVCard(n: string, org: string, email: string, phone: string) {
  // very small vCard 3.0
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    n && `FN:${n}`,
    org && `ORG:${org}`,
    phone && `TEL;TYPE=CELL:${phone}`,
    email && `EMAIL:${email}`,
    "END:VCARD",
  ]
    .filter(Boolean)
    .join("\n");
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/* ---------- Component ---------- */
export default function QRCodeGenerator() {
  /* State: builder */
  const [tab, setTab] = useState<Tab>("URL");

  // URL/Text
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");

  // Wi-Fi
  const [ssid, setSsid] = useState("");
  const [pass, setPass] = useState("");
  const [wifiHidden, setWifiHidden] = useState(false);
  const [wifiEnc, setWifiEnc] = useState<"WPA" | "WEP" | "nopass">("WPA");

  // Contact
  const [fullName, setFullName] = useState("");
  const [org, setOrg] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Appearance
  const [size, setSize] = useState(256);
  const [fg, setFg] = useState("#111827"); // stone-900
  const [bg, setBg] = useState("#ffffff");
  const [level, setLevel] = useState<"L" | "M" | "Q" | "H">("M");
  const [includeMargin, setIncludeMargin] = useState(true);

  // Logo overlay
  const [logoUrl, setLogoUrl] = useState("");
  const [logoPct, setLogoPct] = useState(18); // % of QR dimension

  // Output value + history
  const value = useMemo(() => {
    if (tab === "Text") return text;
    if (tab === "URL") return url;
    if (tab === "Wi-Fi") return buildWifiString(ssid, pass, wifiHidden, wifiEnc);
    return buildVCard(fullName, org, email, phone);
  }, [tab, url, text, ssid, pass, wifiHidden, wifiEnc, fullName, org, email, phone]);

  const [history, setHistory] = useState<HistoryItem[]>([]);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("qr_generator_state") || "{}");
      if (Array.isArray(saved.history)) setHistory(saved.history);
      if (saved.appearance) {
        const { size: s, fg: f, bg: b, level: lv, includeMargin: im, logoUrl: lu, logoPct: lp } = saved.appearance;
        if (s) setSize(s);
        if (f) setFg(f);
        if (b) setBg(b);
        if (lv) setLevel(lv);
        if (typeof im === "boolean") setIncludeMargin(im);
        if (lu) setLogoUrl(lu);
        if (lp) setLogoPct(lp);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        "qr_generator_state",
        JSON.stringify({
          history,
          appearance: { size, fg, bg, level, includeMargin, logoUrl, logoPct },
        })
      );
    } catch {}
  }, [history, size, fg, bg, level, includeMargin, logoUrl, logoPct]);

  // When user hits “Generate”, just push to history (preview is always live)
  function onGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    const label =
      tab === "URL"
        ? "URL"
        : tab === "Text"
        ? "Text"
        : tab === "Wi-Fi"
        ? `Wi-Fi (${wifiEnc})`
        : "Contact";
    setHistory([{ value, at: Date.now(), label }, ...history.filter((h) => h.value !== value)].slice(0, 8));
  }

  const qrBoxRef = useRef<HTMLDivElement>(null);

  /* ---------- Export: copy/download ---------- */
  async function copyPng() {
    // Convert the rendered SVG to PNG and copy to clipboard
    const svg = qrBoxRef.current?.querySelector("svg");
    if (!svg) return alert("QR not ready yet");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canv = document.createElement("canvas");
    const pad = includeMargin ? Math.round(size * 0.08) : 0;

    canv.width = size + pad * 2;
    canv.height = size + pad * 2;

    const ctx = canv.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canv.width, canv.height);

    const img = new Image();
    img.onload = async () => {
      ctx.drawImage(img, pad, pad, size, size);

      // logo overlay
      if (logoUrl) {
        const logo = new Image();
        logo.crossOrigin = "anonymous";
        logo.onload = async () => {
          const side = (clamp(logoPct, 6, 30) / 100) * size;
          const x = pad + size / 2 - side / 2;
          const y = pad + size / 2 - side / 2;
          // white round “chip” background to keep scan quality
          ctx.fillStyle = "#ffffff";
          const r = 10;
          roundRect(ctx, x, y, side, side, r);
          ctx.fill();
          ctx.drawImage(logo, x, y, side, side);
          try {
            const blob = await new Promise<Blob | null>((res) => canv.toBlob(res, "image/png"));
            if (!blob) return alert("Could not create image");
            await (navigator as any).clipboard.write([new window.ClipboardItem({ "image/png": blob })]);
            alert("Copied PNG to clipboard!");
          } catch {
            alert("Copy failed. Try download instead.");
          }
        };
        logo.src = logoUrl;
      } else {
        try {
          const blob = await new Promise<Blob | null>((res) => canv.toBlob(res, "image/png"));
          if (!blob) return alert("Could not create image");
          await (navigator as any).clipboard.write([new window.ClipboardItem({ "image/png": blob })]);
          alert("Copied PNG to clipboard!");
        } catch {
          alert("Copy failed. Try download instead.");
        }
      }
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  }

  function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    const rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  function downloadPng() {
    const svg = qrBoxRef.current?.querySelector("svg");
    if (!svg) return alert("QR not ready yet");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canv = document.createElement("canvas");
    const pad = includeMargin ? Math.round(size * 0.08) : 0;
    canv.width = size + pad * 2;
    canv.height = size + pad * 2;
    const ctx = canv.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canv.width, canv.height);

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, pad, pad, size, size);

      if (logoUrl) {
        const logo = new Image();
        logo.crossOrigin = "anonymous";
        logo.onload = () => {
          const side = (clamp(logoPct, 6, 30) / 100) * size;
          const x = pad + size / 2 - side / 2;
          const y = pad + size / 2 - side / 2;
          ctx.fillStyle = "#ffffff";
          roundRect(ctx, x, y, side, side, 10);
          ctx.fill();
          ctx.drawImage(logo, x, y, side, side);
          canv.toBlob((b) => b && downloadBlob(b, `qr-${Date.now()}.png`), "image/png");
        };
        logo.src = logoUrl;
      } else {
        canv.toBlob((b) => b && downloadBlob(b, `qr-${Date.now()}.png`), "image/png");
      }
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  }

  function downloadSvg() {
    const svg = qrBoxRef.current?.querySelector("svg");
    if (!svg) return alert("QR not ready yet");
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    downloadBlob(blob, `qr-${Date.now()}.svg`);
  }

  /* ---------- UI ---------- */
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
          {/* Builder + Preview */}
          <section
            className="rounded-2xl border border-amber-200 bg-white/80 backdrop-blur
                       shadow-[0_2px_20px_rgba(253,230,138,0.25)] p-5"
          >
            <h1 className="text-3xl font-extrabold text-stone-900">QR Code Generator</h1>
            <p className="mt-1 text-stone-600">
              Create beautiful, scannable QR codes for URLs, Wi-Fi, contacts, and more—fully offline.
            </p>

            {/* Tabs */}
            <div className="mt-4 flex flex-wrap gap-2">
              {(["URL", "Text", "Wi-Fi", "Contact"] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-3 py-1.5 rounded-lg text-sm border ${
                    tab === t
                      ? "bg-rose-500 text-white border-rose-500"
                      : "bg-white/70 border-amber-200 text-stone-700 hover:bg-amber-50"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={onGenerate} className="mt-4 space-y-4">
              {tab === "URL" && (
                <div>
                  <label className="block text-sm text-stone-700 mb-1">URL</label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full rounded-lg border border-amber-200 bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-amber-300"
                  />
                </div>
              )}

              {tab === "Text" && (
                <div>
                  <label className="block text-sm text-stone-700 mb-1">Text</label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={3}
                    placeholder="Type any message…"
                    className="w-full rounded-lg border border-amber-200 bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-amber-300"
                  />
                </div>
              )}

              {tab === "Wi-Fi" && (
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-sm text-stone-700 mb-1">Network name (SSID)</label>
                    <input
                      value={ssid}
                      onChange={(e) => setSsid(e.target.value)}
                      className="w-full rounded-lg border border-amber-200 bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-amber-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-stone-700 mb-1">Password</label>
                    <input
                      value={pass}
                      onChange={(e) => setPass(e.target.value)}
                      className="w-full rounded-lg border border-amber-200 bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-amber-300"
                      disabled={wifiEnc === "nopass"}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-stone-700 mb-1">Encryption</label>
                    <select
                      value={wifiEnc}
                      onChange={(e) => setWifiEnc(e.target.value as any)}
                      className="w-full rounded-lg border border-amber-200 bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-amber-300"
                    >
                      <option value="WPA">WPA/WPA2</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">No password</option>
                    </select>
                  </div>
                  <label className="inline-flex items-center gap-2 text-sm text-stone-700 sm:col-span-2">
                    <input
                      type="checkbox"
                      checked={wifiHidden}
                      onChange={(e) => setWifiHidden(e.target.checked)}
                      className="h-4 w-4"
                    />
                    Hidden network
                  </label>
                </div>
              )}

              {tab === "Contact" && (
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-sm text-stone-700 mb-1">Full name</label>
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-lg border border-amber-200 bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-amber-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-stone-700 mb-1">Organization</label>
                    <input
                      value={org}
                      onChange={(e) => setOrg(e.target.value)}
                      className="w-full rounded-lg border border-amber-200 bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-amber-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-stone-700 mb-1">Phone</label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 555 123 4567"
                      className="w-full rounded-lg border border-amber-200 bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-amber-300"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm text-stone-700 mb-1">Email</label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-lg border border-amber-200 bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-amber-300"
                    />
                  </div>
                </div>
              )}

              {/* Appearance */}
              <div className="grid sm:grid-cols-2 gap-3 pt-2 border-t border-amber-200/60">
                <div>
                  <label className="block text-sm text-stone-700 mb-1">Size (px)</label>
                  <input
                    type="range"
                    min={128}
                    max={768}
                    step={16}
                    value={size}
                    onChange={(e) => setSize(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-xs text-stone-600 mt-1">{size}px</div>
                </div>
                <div>
                  <label className="block text-sm text-stone-700 mb-1">Error correction</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as any)}
                    className="w-full rounded-lg border border-amber-200 bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-amber-300"
                  >
                    <option value="L">L (low)</option>
                    <option value="M">M (medium)</option>
                    <option value="Q">Q (quartile)</option>
                    <option value="H">H (high)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-stone-700 mb-1">Foreground</label>
                  <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm text-stone-700 mb-1">Background</label>
                  <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} />
                </div>
                <label className="inline-flex items-center gap-2 text-sm text-stone-700 sm:col-span-2">
                  <input
                    type="checkbox"
                    checked={includeMargin}
                    onChange={(e) => setIncludeMargin(e.target.checked)}
                    className="h-4 w-4"
                  />
                  Include margin
                </label>

                {/* Logo */}
                <div className="sm:col-span-2 grid sm:grid-cols-[1fr_auto] gap-3 items-end">
                  <div>
                    <label className="block text-sm text-stone-700 mb-1">Center logo (URL)</label>
                    <input
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      placeholder="https://…/logo.png"
                      className="w-full rounded-lg border border-amber-200 bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-amber-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-stone-700 mb-1">Logo size</label>
                    <input
                      type="number"
                      min={6}
                      max={30}
                      value={logoPct}
                      onChange={(e) => setLogoPct(clamp(parseInt(e.target.value || "0"), 6, 30))}
                      className="w-24 rounded-lg border border-amber-200 bg-white/70 px-2 py-2 outline-none focus:ring-2 focus:ring-amber-300"
                    />
                    <div className="text-xs text-stone-500 mt-1">% of QR</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-white bg-rose-500 hover:bg-rose-400 disabled:opacity-50"
                  disabled={!value.trim()}
                >
                  Generate
                </button>
                <button
                  type="button"
                  onClick={copyPng}
                  className="px-3 py-1.5 rounded-lg border border-amber-200 text-stone-700 hover:bg-amber-50"
                  disabled={!value.trim()}
                >
                  Copy PNG
                </button>
                <button
                  type="button"
                  onClick={downloadPng}
                  className="px-3 py-1.5 rounded-lg border border-amber-200 text-stone-700 hover:bg-amber-50"
                  disabled={!value.trim()}
                >
                  Download PNG
                </button>
                <button
                  type="button"
                  onClick={downloadSvg}
                  className="px-3 py-1.5 rounded-lg border border-amber-200 text-stone-700 hover:bg-amber-50"
                  disabled={!value.trim()}
                >
                  Download SVG
                </button>
              </div>
            </form>

            {/* Preview */}
            <div className="mt-6">
              <div className="text-sm font-semibold text-stone-800 mb-2">Preview</div>
              <div
                className="relative inline-flex items-center justify-center rounded-2xl border border-amber-200 bg-white/70 p-4"
                ref={qrBoxRef}
                style={{ width: size + 32, height: size + 32 }}
              >
                {value ? (
                  <>
                    <QRCode
                      value={value}
                      size={size}
                      fgColor={fg}
                      bgColor={bg}
                      level={level}
                      className="rounded"
                    />
                    {logoUrl && (
                      <div
                        className="absolute rounded-lg overflow-hidden bg-white"
                        style={{
                          width: `${clamp(logoPct, 6, 30)}%`,
                          height: `${clamp(logoPct, 6, 30)}%`,
                          left: "50%",
                          top: "50%",
                          transform: "translate(-50%, -50%)",
                          boxShadow: "0 0 0 4px white",
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={logoUrl}
                          alt="logo"
                          className="w-full h-full object-contain"
                          crossOrigin="anonymous"
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-sm text-stone-500 px-6 py-16 text-center">
                    Enter details above to generate your QR
                  </div>
                )}
              </div>
            </div>

            {/* History */}
            {history.length > 0 && (
              <div className="mt-6">
                <div className="text-sm font-semibold text-stone-800 mb-2">Recent</div>
                <div className="grid sm:grid-cols-2 gap-2">
                  {history.map((h) => (
                    <button
                      key={`${h.at}-${h.value.slice(0, 8)}`}
                      onClick={() => {
                        // try to infer tab when loading a recent
                        if (h.value.startsWith("WIFI:")) setTab("Wi-Fi");
                        else if (h.value.startsWith("BEGIN:VCARD")) setTab("Contact");
                        else if (/^https?:\/\//i.test(h.value)) setTab("URL");
                        else setTab("Text");
                        // set fields
                        if (/^https?:\/\//i.test(h.value)) setUrl(h.value);
                        else if (h.value.startsWith("WIFI:")) {
                          // quick load SSID only (best-effort)
                          const m = /S:([^;]+);/.exec(h.value);
                          setSsid(m ? m[1].replace(/\\([\\;,:"])/g, "$1") : "");
                        } else if (h.value.startsWith("BEGIN:VCARD")) {
                          setFullName("");
                          setOrg("");
                          setEmail("");
                          setPhone("");
                        } else {
                          setText(h.value);
                        }
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg border border-amber-200 bg-white/60 hover:bg-amber-50/60"
                    >
                      <div className="text-xs text-stone-500">{h.label}</div>
                      <div className="truncate text-sm text-stone-800">{h.value}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Tips / Ideas */}
          <aside
            className="rounded-2xl border border-amber-200 bg-white/80 backdrop-blur
                       shadow-[0_2px_20px_rgba(253,230,138,0.25)] p-5"
          >
            <h2 className="text-xl font-semibold text-stone-900">Tips & Ideas</h2>
            <ul className="mt-3 space-y-3 text-stone-700 text-sm leading-relaxed">
              <li className="rounded-lg border border-blue-200/60 bg-blue-50/50 p-3">
                🎯 Use <b>Error correction “H”</b> if you plan to place a logo in the center, so scanners tolerate the obstruction.
              </li>
              <li className="rounded-lg border border-amber-200/60 bg-amber-50/50 p-3">
                🌈 High contrast helps: dark foreground on a light background scans best.
              </li>
              <li className="rounded-lg border border-emerald-200/60 bg-emerald-50/50 p-3">
                📶 Wi-Fi QR supports <b>WPA/WEP/no-password</b> and hidden networks. Share your café Wi-Fi in one tap.
              </li>
              <li className="rounded-lg border border-rose-200/60 bg-rose-50/50 p-3">
                👤 Contact QR uses a compact vCard. Add it to business cards or slide decks.
              </li>
            </ul>

            <div className="mt-5 text-xs text-stone-500">
              Pro tip: keep logos small (10–20%) and use the white chip background for reliable scans.
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
