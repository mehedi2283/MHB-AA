"use client";

import React, { useEffect, useState } from "react";
import { Globe as GlobeIcon, LoaderCircle, Plus, Save, Trash2, MapPin, Navigation } from "lucide-react";
import type { GlobeMarker, GlobeArc, SiteContent } from "@/lib/site-content";
import { Globe } from "@/components/magicui/globe";

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
      const newMarker: GlobeMarker = {
        id: `city-${Date.now()}`,
        name: "NEW CITY",
        sub: "Client System",
        location: [23.8103, 90.4125], // Default Dhaka, Bangladesh
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
      const newArc: GlobeArc = {
        id: `arc-${Date.now()}`,
        label: "CITY A → CITY B",
        from: [40.7128, -74.006],
        to: [51.5074, -0.1278],
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
      setMessage(response.ok ? "3D Globe client data saved & live!" : data.error);
    } catch {
      setMessage("Failed to save changes.");
    } finally {
      setBusy(false);
    }
  }

  if (!content || (busy && !content)) {
    return (
      <div className="admin-loader">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="admin-page admin-page-wide">
      <header className="admin-page-header">
        <div>
          <div className="admin-kicker">3D Visual / Locations</div>
          <h1>Global Clients & 3D Globe</h1>
          <p>Manage all client pins, locations, subtitles, and telemetry flight arcs shown on the 3D globe.</p>
        </div>
        <button className="admin-button admin-button-primary" onClick={save} disabled={busy}>
          {busy ? <LoaderCircle className="animate-spin" size={15} /> : <Save size={15} />}
          Save & Publish
        </button>
      </header>

      {message && <div className="admin-notice" role="status">{message}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Form Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Client City Markers */}
          <section className="admin-panel">
            <div className="admin-section-heading flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <MapPin className="text-[var(--acid)]" size={18} />
                <div>
                  <h2 className="text-base font-bold">Client City Pins</h2>
                  <p className="text-xs text-white/50">{markers.length} interactive locations active</p>
                </div>
              </div>
              <button
                type="button"
                onClick={addMarker}
                className="admin-button flex items-center gap-1 text-xs py-1.5 px-3 bg-[var(--acid)] text-[#090c08] font-bold rounded"
              >
                <Plus size={14} /> Add City
              </button>
            </div>

            <div className="space-y-4 pt-4">
              {markers.map((marker, index) => (
                <div
                  key={marker.id || index}
                  className="p-3.5 rounded bg-black/40 border border-white/[0.08] relative group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-[var(--acid)]">
                      #{String(index + 1).padStart(2, "0")} · {marker.name || "UNTITLED"}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeMarker(index)}
                      className="text-white/40 hover:text-red-400 p-1 transition-colors"
                      title="Remove city"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="admin-field text-xs">
                      <span>City Name</span>
                      <input
                        type="text"
                        className="admin-input text-xs py-1.5"
                        value={marker.name}
                        placeholder="e.g. DUBAI"
                        onChange={(e) => updateMarker(index, { name: e.target.value })}
                      />
                    </label>

                    <label className="admin-field text-xs">
                      <span>Subtitle / Project</span>
                      <input
                        type="text"
                        className="admin-input text-xs py-1.5"
                        value={marker.sub || ""}
                        placeholder="e.g. Real Estate AI"
                        onChange={(e) => updateMarker(index, { sub: e.target.value })}
                      />
                    </label>

                    <label className="admin-field text-xs">
                      <span>Latitude (North/South)</span>
                      <input
                        type="number"
                        step="any"
                        className="admin-input text-xs py-1.5"
                        value={marker.location[0]}
                        onChange={(e) =>
                          updateMarker(index, {
                            location: [parseFloat(e.target.value) || 0, marker.location[1]],
                          })
                        }
                      />
                    </label>

                    <label className="admin-field text-xs">
                      <span>Longitude (East/West)</span>
                      <input
                        type="number"
                        step="any"
                        className="admin-input text-xs py-1.5"
                        value={marker.location[1]}
                        onChange={(e) =>
                          updateMarker(index, {
                            location: [marker.location[0], parseFloat(e.target.value) || 0],
                          })
                        }
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2: Connected Telemetry Arcs */}
          <section className="admin-panel">
            <div className="admin-section-heading flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <Navigation className="text-[var(--acid)]" size={18} />
                <div>
                  <h2 className="text-base font-bold">Connected Route Arcs</h2>
                  <p className="text-xs text-white/50">{arcs.length} orbital arcs active</p>
                </div>
              </div>
              <button
                type="button"
                onClick={addArc}
                className="admin-button flex items-center gap-1 text-xs py-1.5 px-3 bg-[var(--acid)] text-[#090c08] font-bold rounded"
              >
                <Plus size={14} /> Add Route
              </button>
            </div>

            <div className="space-y-4 pt-4">
              {arcs.map((arc, index) => (
                <div
                  key={arc.id || index}
                  className="p-3.5 rounded bg-black/40 border border-white/[0.08] relative group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-[var(--acid)]">
                      Route #{String(index + 1).padStart(2, "0")} · {arc.label || "UNTITLED"}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeArc(index)}
                      className="text-white/40 hover:text-red-400 p-1 transition-colors"
                      title="Remove route"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <label className="admin-field text-xs">
                      <span>Route Label</span>
                      <input
                        type="text"
                        className="admin-input text-xs py-1.5"
                        value={arc.label}
                        placeholder="e.g. NYC → LONDON"
                        onChange={(e) => updateArc(index, { label: e.target.value })}
                      />
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                      <label className="admin-field text-xs">
                        <span>From (Lat, Lon)</span>
                        <div className="grid grid-cols-2 gap-1">
                          <input
                            type="number"
                            step="any"
                            className="admin-input text-xs py-1"
                            value={arc.from[0]}
                            placeholder="Lat"
                            onChange={(e) =>
                              updateArc(index, {
                                from: [parseFloat(e.target.value) || 0, arc.from[1]],
                              })
                            }
                          />
                          <input
                            type="number"
                            step="any"
                            className="admin-input text-xs py-1"
                            value={arc.from[1]}
                            placeholder="Lon"
                            onChange={(e) =>
                              updateArc(index, {
                                from: [arc.from[0], parseFloat(e.target.value) || 0],
                              })
                            }
                          />
                        </div>
                      </label>

                      <label className="admin-field text-xs">
                        <span>To (Lat, Lon)</span>
                        <div className="grid grid-cols-2 gap-1">
                          <input
                            type="number"
                            step="any"
                            className="admin-input text-xs py-1"
                            value={arc.to[0]}
                            placeholder="Lat"
                            onChange={(e) =>
                              updateArc(index, {
                                to: [parseFloat(e.target.value) || 0, arc.to[1]],
                              })
                            }
                          />
                          <input
                            type="number"
                            step="any"
                            className="admin-input text-xs py-1"
                            value={arc.to[1]}
                            placeholder="Lon"
                            onChange={(e) =>
                              updateArc(index, {
                                to: [arc.to[0], parseFloat(e.target.value) || 0],
                              })
                            }
                          />
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Live Interactive 3D Preview */}
        <div className="lg:col-span-5 sticky top-6 space-y-4">
          <section className="admin-panel p-4 flex flex-col items-center">
            <div className="w-full flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
              <span className="text-xs font-mono font-bold text-[var(--acid)] flex items-center gap-1.5">
                <GlobeIcon size={14} /> LIVE 3D PREVIEW
              </span>
              <span className="text-[10px] text-white/40">Real-time WebGL</span>
            </div>

            <div className="w-full aspect-square max-w-[360px] flex items-center justify-center relative">
              <Globe markers={markers} arcs={arcs} className="scale-95" />
            </div>

            <p className="text-[11px] text-white/50 text-center mt-3">
              Drag to spin & tilt. Any additions or edits to pins & arcs above update this live 3D preview instantly.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
