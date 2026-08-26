"use client";

import React, { useEffect, useState, useRef } from "react";
import { Globe as GlobeIcon, LoaderCircle, Plus, Save, Trash2, MapPin, Navigation, ChevronDown, Search } from "lucide-react";
import type { GlobeMarker, GlobeArc, SiteContent } from "@/lib/site-content";
import { Globe } from "@/components/magicui/globe";
import { SkeletonGlobeEditor } from "./SkeletonLoader";

export interface CityPreset {
  name: string;
  country: string;
  code: string;
  location: [number, number];
}

export const WORLD_CITIES: CityPreset[] = [
  // North America
  { name: "New York", country: "United States", code: "NYC", location: [40.7128, -74.006] },
  { name: "San Francisco", country: "United States", code: "SF", location: [37.7749, -122.4194] },
  { name: "Los Angeles", country: "United States", code: "LA", location: [34.0522, -118.2437] },
  { name: "Chicago", country: "United States", code: "CHI", location: [41.8781, -87.6298] },
  { name: "Miami", country: "United States", code: "MIA", location: [25.7617, -80.1918] },
  { name: "Austin", country: "United States", code: "ATX", location: [30.2672, -97.7431] },
  { name: "Seattle", country: "United States", code: "SEA", location: [47.6062, -122.3321] },
  { name: "Boston", country: "United States", code: "BOS", location: [42.3601, -71.0589] },
  { name: "Toronto", country: "Canada", code: "TORONTO", location: [43.6532, -79.3832] },
  { name: "Vancouver", country: "Canada", code: "VANCOUVER", location: [49.2827, -123.1207] },
  { name: "Montreal", country: "Canada", code: "MONTREAL", location: [45.5017, -73.5673] },

  // Europe
  { name: "London", country: "United Kingdom", code: "LONDON", location: [51.5074, -0.1278] },
  { name: "Manchester", country: "United Kingdom", code: "MANCHESTER", location: [53.4808, -2.2426] },
  { name: "Paris", country: "France", code: "PARIS", location: [48.8566, 2.3522] },
  { name: "Berlin", country: "Germany", code: "BERLIN", location: [52.52, 13.405] },
  { name: "Frankfurt", country: "Germany", code: "FRANKFURT", location: [50.1109, 8.6821] },
  { name: "Munich", country: "Germany", code: "MUNICH", location: [48.1351, 11.582] },
  { name: "Amsterdam", country: "Netherlands", code: "AMSTERDAM", location: [52.3676, 4.9041] },
  { name: "Zurich", country: "Switzerland", code: "ZURICH", location: [47.3769, 8.5417] },
  { name: "Geneva", country: "Switzerland", code: "GENEVA", location: [46.2044, 6.1432] },
  { name: "Stockholm", country: "Sweden", code: "STOCKHOLM", location: [59.3293, 18.0686] },
  { name: "Dublin", country: "Ireland", code: "DUBLIN", location: [53.3498, -6.2603] },
  { name: "Madrid", country: "Spain", code: "MADRID", location: [40.4168, -3.7038] },
  { name: "Barcelona", country: "Spain", code: "BARCELONA", location: [41.3879, 2.1699] },
  { name: "Rome", country: "Italy", code: "ROME", location: [41.9028, 12.4964] },
  { name: "Milan", country: "Italy", code: "MILAN", location: [45.4642, 9.19] },
  { name: "Lisbon", country: "Portugal", code: "LISBON", location: [38.7223, -9.1393] },
  { name: "Vienna", country: "Austria", code: "VIENNA", location: [48.2082, 16.3738] },
  { name: "Brussels", country: "Belgium", code: "BRUSSELS", location: [50.8503, 4.3517] },
  { name: "Copenhagen", country: "Denmark", code: "COPENHAGEN", location: [55.6761, 12.5683] },
  { name: "Oslo", country: "Norway", code: "OSLO", location: [59.9139, 10.7522] },
  { name: "Helsinki", country: "Finland", code: "HELSINKI", location: [60.1699, 24.9384] },
  { name: "Warsaw", country: "Poland", code: "WARSAW", location: [52.2297, 21.0122] },
  { name: "Bucharest", country: "Romania", code: "BUCHAREST", location: [44.4268, 26.1025] },

  // Middle East
  { name: "Dubai", country: "United Arab Emirates", code: "DUBAI", location: [25.2048, 55.2708] },
  { name: "Abu Dhabi", country: "United Arab Emirates", code: "ABU DHABI", location: [24.4539, 54.3773] },
  { name: "Riyadh", country: "Saudi Arabia", code: "RIYADH", location: [24.7136, 46.6753] },
  { name: "Jeddah", country: "Saudi Arabia", code: "JEDDAH", location: [21.4858, 39.1925] },
  { name: "Doha", country: "Qatar", code: "DOHA", location: [25.2854, 51.531] },
  { name: "Tel Aviv", country: "Israel", code: "TEL AVIV", location: [32.0853, 34.7818] },

  // Asia & Pacific
  { name: "Tokyo", country: "Japan", code: "TOKYO", location: [35.6762, 139.6503] },
  { name: "Osaka", country: "Japan", code: "OSAKA", location: [34.6937, 135.5023] },
  { name: "Singapore", country: "Singapore", code: "SINGAPORE", location: [1.3521, 103.8198] },
  { name: "Hong Kong", country: "Hong Kong", code: "HONG KONG", location: [22.3193, 114.1694] },
  { name: "Seoul", country: "South Korea", code: "SEOUL", location: [37.5665, 126.978] },
  { name: "Taipei", country: "Taiwan", code: "TAIPEI", location: [25.033, 121.5654] },
  { name: "Sydney", country: "Australia", code: "SYDNEY", location: [-33.8688, 151.2093] },
  { name: "Melbourne", country: "Australia", code: "MELBOURNE", location: [-37.8136, 144.9631] },
  { name: "Brisbane", country: "Australia", code: "BRISBANE", location: [-27.4698, 153.0251] },
  { name: "Auckland", country: "New Zealand", code: "AUCKLAND", location: [-36.8485, 174.7633] },
  { name: "Dhaka", country: "Bangladesh", code: "DHAKA", location: [23.8103, 90.4125] },
  { name: "Bengaluru", country: "India", code: "BANGALORE", location: [12.9716, 77.5946] },
  { name: "Mumbai", country: "India", code: "MUMBAI", location: [19.076, 72.8777] },
  { name: "Delhi", country: "India", code: "DELHI", location: [28.6139, 77.209] },
  { name: "Bangkok", country: "Thailand", code: "BANGKOK", location: [13.7563, 100.5018] },
  { name: "Kuala Lumpur", country: "Malaysia", code: "KUALA LUMPUR", location: [3.139, 101.6869] },
  { name: "Jakarta", country: "Indonesia", code: "JAKARTA", location: [-6.2088, 106.8456] },

  // South America & Africa
  { name: "São Paulo", country: "Brazil", code: "SÃO PAULO", location: [-23.5505, -46.6333] },
  { name: "Rio de Janeiro", country: "Brazil", code: "RIO", location: [-22.9068, -43.1729] },
  { name: "Buenos Aires", country: "Argentina", code: "BUENOS AIRES", location: [-34.6037, -58.3816] },
  { name: "Santiago", country: "Chile", code: "SANTIAGO", location: [-33.4489, -70.6693] },
  { name: "Mexico City", country: "Mexico", code: "MEXICO CITY", location: [19.4326, -99.1332] },
  { name: "Cape Town", country: "South Africa", code: "CAPE TOWN", location: [-33.9249, 18.4241] },
  { name: "Johannesburg", country: "South Africa", code: "JOHANNESBURG", location: [-26.2041, 28.0473] },
  { name: "Cairo", country: "Egypt", code: "CAIRO", location: [30.0444, 31.2357] },
  { name: "Nairobi", country: "Kenya", code: "NAIROBI", location: [-1.2921, 36.8219] },
];

function findCityByCoordinates(lat: number, lon: number): CityPreset | undefined {
  return WORLD_CITIES.find(
    (c) => Math.abs(c.location[0] - lat) < 0.05 && Math.abs(c.location[1] - lon) < 0.05
  );
}

function findCityByName(name: string): CityPreset | undefined {
  return WORLD_CITIES.find((c) => c.name.toLowerCase() === name.toLowerCase());
}

function CustomCitySelect({
  value,
  onChange,
  placeholder = "Choose a City",
}: {
  value: string;
  onChange: (cityName: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCity = WORLD_CITIES.find((c) => c.name === value);

  const filtered = WORLD_CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.country.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full min-h-[43px] h-[43px] flex items-center justify-between bg-[#0b0c0a] hover:bg-[#0e0f0c] border border-[#34362f] hover:border-[#494c42] focus:border-[#c8ff3d] focus:ring-1 focus:ring-[#c8ff3d]/30 rounded px-3 py-2.5 text-left text-xs font-mono transition cursor-pointer"
      >
        <span className={selectedCity ? "text-white font-medium truncate" : "text-[#5f685c] truncate"}>
          {selectedCity ? `${selectedCity.name}, ${selectedCity.country} (${selectedCity.code})` : placeholder}
        </span>
        <ChevronDown size={14} className={`text-[#838e7f] flex-shrink-0 ml-1.5 transition-transform ${open ? "rotate-180 text-[#c8ff3d]" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 mt-1.5 bg-[#0c120c] border border-white/[0.15] rounded shadow-2xl backdrop-blur-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <input
            type="text"
            placeholder="Search city, country or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#141b14] border border-white/[0.1] rounded px-2.5 py-1.5 text-xs font-mono text-white placeholder:text-[#5f685c] focus:border-[#c8ff3d] focus:outline-none mb-1.5"
            autoFocus
          />
          <div className="max-h-48 overflow-y-auto scrollbar-none space-y-0.5">
            {filtered.map((city) => {
              const isSelected = city.name === value;
              return (
                <button
                  key={city.name}
                  type="button"
                  onClick={() => {
                    onChange(city.name);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-mono transition text-left cursor-pointer ${
                    isSelected ? "bg-[#182617] text-[#c8ff3d] font-bold" : "text-[#a4ada0] hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  <span className="truncate">{city.name}, {city.country}</span>
                  <span className="text-[10px] opacity-60 flex-shrink-0 ml-2">({city.code})</span>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className="p-3 text-center text-xs font-mono text-[#838e7f]">
                No cities matching "{search}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function GlobeContentEditor() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [busy, setBusy] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/site-content")
      .then(async (response) => {
        const data = await response.json();
        setContent(response.ok ? data : data.defaults);
        setMessage(response.ok ? "" : data.error);
      })
      .finally(() => setBusy(false));
  }, []);

  const markers: GlobeMarker[] = content?.globeMarkers || [];
  const arcs: GlobeArc[] = content?.globeArcs || [];

  function handleCitySelect(index: number, cityName: string) {
    const selectedCity = WORLD_CITIES.find((c) => c.name === cityName);
    if (!selectedCity) return;

    setContent((prev) => {
      if (!prev) return prev;
      const nextMarkers = [...(prev.globeMarkers || [])];
      nextMarkers[index] = {
        ...nextMarkers[index],
        name: selectedCity.code || selectedCity.name.toUpperCase(),
        location: selectedCity.location,
      };
      return { ...prev, globeMarkers: nextMarkers };
    });
  }

  function updateMarker(index: number, patch: Partial<GlobeMarker>) {
    setContent((prev) => {
      if (!prev) return prev;
      const nextMarkers = [...(prev.globeMarkers || [])];
      nextMarkers[index] = { ...nextMarkers[index], ...patch };
      return { ...prev, globeMarkers: nextMarkers };
    });
  }

  function addMarker() {
    setContent((prev) => {
      if (!prev) return prev;
      // Default to Dubai or London
      const defaultPreset = WORLD_CITIES[0]; // New York
      const newMarker: GlobeMarker = {
        id: `city-${Date.now()}`,
        name: defaultPreset.code,
        sub: "Client System",
        location: defaultPreset.location,
        size: 0.038,
      };
      return { ...prev, globeMarkers: [...(prev.globeMarkers || []), newMarker] };
    });
  }

  function removeMarker(index: number) {
    setContent((prev) => {
      if (!prev) return prev;
      const nextMarkers = (prev.globeMarkers || []).filter((_, i) => i !== index);
      return { ...prev, globeMarkers: nextMarkers };
    });
  }

  function handleRouteCitySelect(
    index: number,
    type: "from" | "to",
    cityName: string
  ) {
    const selected = WORLD_CITIES.find((c) => c.name === cityName);
    if (!selected) return;

    setContent((prev) => {
      if (!prev) return prev;
      const nextArcs = [...(prev.globeArcs || [])];
      const current = nextArcs[index];

      const fromCoord = type === "from" ? selected.location : current.from;
      const toCoord = type === "to" ? selected.location : current.to;

      const fromCityObj = type === "from" ? selected : findCityByCoordinates(fromCoord[0], fromCoord[1]);
      const toCityObj = type === "to" ? selected : findCityByCoordinates(toCoord[0], toCoord[1]);

      const fromLabel = fromCityObj ? fromCityObj.code : "CITY A";
      const toLabel = toCityObj ? toCityObj.code : "CITY B";

      nextArcs[index] = {
        ...current,
        [type]: selected.location,
        label: `${fromLabel} → ${toLabel}`,
      };
      return { ...prev, globeArcs: nextArcs };
    });
  }

  function updateArc(index: number, patch: Partial<GlobeArc>) {
    setContent((prev) => {
      if (!prev) return prev;
      const nextArcs = [...(prev.globeArcs || [])];
      nextArcs[index] = { ...nextArcs[index], ...patch };
      return { ...prev, globeArcs: nextArcs };
    });
  }

  function addArc() {
    setContent((prev) => {
      if (!prev) return prev;
      const cityA = WORLD_CITIES[0]; // New York
      const cityB = WORLD_CITIES[11]; // London
      const newArc: GlobeArc = {
        id: `arc-${Date.now()}`,
        label: `${cityA.code} → ${cityB.code}`,
        from: cityA.location,
        to: cityB.location,
      };
      return { ...prev, globeArcs: [...(prev.globeArcs || []), newArc] };
    });
  }

  function removeArc(index: number) {
    setContent((prev) => {
      if (!prev) return prev;
      const nextArcs = (prev.globeArcs || []).filter((_, i) => i !== index);
      return { ...prev, globeArcs: nextArcs };
    });
  }

  async function save() {
    if (!content) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/site-content", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(content),
      });
      const data = await response.json();
      setMessage(response.ok ? "3D Globe client locations saved & published live!" : data.error);
    } catch {
      setMessage("Failed to save changes.");
    } finally {
      setBusy(false);
    }
  }

  if (!content || (busy && !content)) {
    return <SkeletonGlobeEditor />;
  }

  return (
    <div className="admin-page admin-page-wide">
      <header className="admin-page-header">
        <div>
          <div className="admin-kicker">3D Visual / Clients</div>
          <h1>3D Globe & Client Locations</h1>
          <p>Select client cities from the dropdown to automatically position pins and orbital flight arcs on the 3D globe.</p>
        </div>
        <button className="admin-button admin-button-primary" onClick={save} disabled={busy}>
          {busy ? <LoaderCircle className="animate-spin" size={15} /> : <Save size={15} />}
          Save & Publish
        </button>
      </header>

      {message && <div className="admin-notice" role="status">{message}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Smart City & Route Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Client City Pins */}
          <section className="admin-panel p-5">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
              <div className="flex items-center gap-3">
                <MapPin className="text-[var(--acid)]" size={19} />
                <div>
                  <h2 className="text-base font-bold text-white tracking-wide">Client City Pins</h2>
                  <p className="text-xs text-white/50">{markers.length} active client locations</p>
                </div>
              </div>
              <button
                type="button"
                onClick={addMarker}
                className="admin-button flex items-center gap-1.5 text-xs py-1.5 px-3 bg-[var(--acid)] text-[#090c08] font-bold rounded shadow-[0_0_12px_rgba(200,255,61,0.25)] hover:bg-[#d4ff55]"
              >
                <Plus size={14} /> Add City Pin
              </button>
            </div>

            <div className="space-y-3.5">
              {markers.map((marker, index) => {
                const matchingCity =
                  findCityByCoordinates(marker.location[0], marker.location[1]) ||
                  findCityByName(marker.name);
                const selectedValue = matchingCity ? matchingCity.name : "";

                return (
                  <div
                    key={marker.id || index}
                    className="p-4 rounded bg-black/40 border border-white/[0.08] relative group transition-all duration-200 hover:border-[var(--acid)]/40 hover:bg-black/60"
                  >
                    <div className="flex items-center justify-between mb-3.5">
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-[var(--acid)] shadow-[0_0_6px_var(--acid)]" />
                        <span className="text-xs font-mono font-bold text-[var(--acid)]">
                          PIN #{String(index + 1).padStart(2, "0")} · {marker.name || "UNTITLED"}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMarker(index)}
                        className="text-white/40 hover:text-red-400 p-1 transition-colors"
                        title="Remove city pin"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-end">
                      {/* City Dropdown - Automatically sets Lat/Lon */}
                      <div className="admin-field text-xs">
                        <span>Select City (Autosets Coordinates)</span>
                        <CustomCitySelect
                          value={selectedValue}
                          onChange={(cityName) => handleCitySelect(index, cityName)}
                          placeholder="-- Choose a City --"
                        />
                      </div>

                      {/* Subtitle / Project Name */}
                      <label className="admin-field text-xs">
                        <span>Subtitle / Project Name</span>
                        <input
                          type="text"
                          className="admin-input text-xs font-mono h-[43px] min-h-[43px]"
                          value={marker.sub || ""}
                          placeholder="e.g. Gazi AI Engine, Lead Pipeline"
                          onChange={(e) => updateMarker(index, { sub: e.target.value })}
                        />
                      </label>

                      {/* Display Label Override */}
                      <label className="admin-field text-xs sm:col-span-2">
                        <span>Custom Badge Label (Optional Override)</span>
                        <input
                          type="text"
                          className="admin-input text-xs font-mono h-[43px] min-h-[43px]"
                          value={marker.name}
                          placeholder="e.g. DUBAI, NYC"
                          onChange={(e) => updateMarker(index, { name: e.target.value.toUpperCase() })}
                        />
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section 2: Connected Orbital Route Arcs */}
          <section className="admin-panel p-5">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
              <div className="flex items-center gap-3">
                <Navigation className="text-[var(--acid)]" size={19} />
                <div>
                  <h2 className="text-base font-bold text-white tracking-wide">Connected Route Arcs</h2>
                  <p className="text-xs text-white/50">{arcs.length} orbital connection arcs</p>
                </div>
              </div>
              <button
                type="button"
                onClick={addArc}
                className="admin-button flex items-center gap-1.5 text-xs py-1.5 px-3 bg-[var(--acid)] text-[#090c08] font-bold rounded shadow-[0_0_12px_rgba(200,255,61,0.25)] hover:bg-[#d4ff55]"
              >
                <Plus size={14} /> Add Route
              </button>
            </div>

            <div className="space-y-3.5">
              {arcs.map((arc, index) => {
                const fromCity = findCityByCoordinates(arc.from[0], arc.from[1]);
                const toCity = findCityByCoordinates(arc.to[0], arc.to[1]);

                return (
                  <div
                    key={arc.id || index}
                    className="p-4 rounded bg-black/40 border border-white/[0.08] relative group transition-all duration-200 hover:border-[var(--acid)]/40 hover:bg-black/60"
                  >
                    <div className="flex items-center justify-between mb-3.5">
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-[var(--acid)] shadow-[0_0_6px_var(--acid)]" />
                        <span className="text-xs font-mono font-bold text-[var(--acid)]">
                          ROUTE #{String(index + 1).padStart(2, "0")} · {arc.label || "UNTITLED"}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeArc(index)}
                        className="text-white/40 hover:text-red-400 p-1 transition-colors"
                        title="Remove route"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-end">
                        {/* From City Dropdown */}
                        <div className="admin-field text-xs">
                          <span>From Origin City</span>
                          <CustomCitySelect
                            value={fromCity ? fromCity.name : ""}
                            onChange={(cityName) => handleRouteCitySelect(index, "from", cityName)}
                            placeholder="-- Choose Origin City --"
                          />
                        </div>

                        {/* To City Dropdown */}
                        <div className="admin-field text-xs">
                          <span>To Destination City</span>
                          <CustomCitySelect
                            value={toCity ? toCity.name : ""}
                            onChange={(cityName) => handleRouteCitySelect(index, "to", cityName)}
                            placeholder="-- Choose Destination City --"
                          />
                        </div>
                      </div>

                      {/* Route Tag Label */}
                      <label className="admin-field text-xs">
                        <span>Route Tag Label</span>
                        <input
                          type="text"
                          className="admin-input text-xs font-mono h-[43px] min-h-[43px]"
                          value={arc.label}
                          placeholder="e.g. NYC → LONDON"
                          onChange={(e) => updateArc(index, { label: e.target.value })}
                        />
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right Column: Live Interactive 3D Preview */}
        <div className="lg:col-span-5 sticky top-6 space-y-4">
          <section className="admin-panel p-5 flex flex-col items-center border border-[var(--acid)]/25 shadow-[0_0_30px_rgba(200,255,61,0.08)]">
            <div className="w-full flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
              <span className="text-xs font-mono font-bold text-[var(--acid)] flex items-center gap-1.5">
                <GlobeIcon size={15} /> LIVE 3D PREVIEW
              </span>
              <span className="text-[10px] text-white/50 font-mono bg-white/5 px-2 py-0.5 rounded">60 FPS WebGL</span>
            </div>

            <div className="w-full aspect-square max-w-[360px] flex items-center justify-center relative my-2">
              <Globe markers={markers} arcs={arcs} className="scale-95" />
            </div>

            <div className="w-full p-3 rounded bg-black/40 border border-white/[0.06] text-center mt-3">
              <p className="text-[11px] text-white/70 leading-relaxed">
                ✨ <strong>Instant Live Sync:</strong> Selecting any city above automatically updates the 3D coordinates and renders the pin & arc in real-time.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
