"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Clock, Globe, ShieldAlert, Sparkles, Video } from "lucide-react";
import { PixelCalendar, PixelCheck } from "./PixelIcons";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS_OF_WEEK = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

const WEEKDAY_SLOTS = [
  "09:30 AM",
  "11:00 AM",
  "01:30 PM",
  "03:00 PM",
  "04:30 PM",
  "06:00 PM",
  "07:30 PM",
];

const WEEKEND_SLOTS = [
  "11:00 AM",
  "01:00 PM",
  "03:30 PM",
  "05:00 PM",
];

interface InteractiveMeetingPickerProps {
  onSelect: (dateStr: string, timeSlot: string, clientTz: string) => void;
  initialDate?: string;
  initialTime?: string;
}

export function InteractiveMeetingPicker({
  onSelect,
  initialDate,
  initialTime,
}: InteractiveMeetingPickerProps) {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Timezones
  const [clientTz, setClientTz] = useState("UTC");
  const hostTz = "Asia/Dhaka";

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz) setClientTz(tz);
    } catch {}
  }, []);

  const [currentMonthDate, setCurrentMonthDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  // Default selected date is tomorrow
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    if (initialDate) {
      const parts = initialDate.split("-").map(Number);
      if (parts.length === 3) return new Date(parts[0], parts[1] - 1, parts[2]);
    }
    return tomorrow;
  });

  const [selectedTime, setSelectedTime] = useState<string>(
    initialTime || "11:00 AM"
  );

  const [busySlots, setBusySlots] = useState<string[]>([]);
  const [loadingBusy, setLoadingBusy] = useState(false);

  // Helper to format Date to YYYY-MM-DD
  function toDateString(d: Date): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Fetch booked/busy slots whenever selectedDate changes
  useEffect(() => {
    const dateStr = toDateString(selectedDate);
    let isMounted = true;
    setLoadingBusy(true);

    fetch(`/api/calendar/busy?date=${dateStr}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setBusySlots(data.busySlots || []);
          setLoadingBusy(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoadingBusy(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedDate]);

  // Convert client slot time to Host Time (Asia/Dhaka) for dual display
  function getHostEquivalentTime(slot: string, date: Date): string {
    try {
      const dateStr = toDateString(date);
      const [time, period] = slot.split(" ");
      const [hourStr, minStr] = time.split(":");
      let h = parseInt(hourStr, 10);
      const m = parseInt(minStr, 10);
      if (period === "PM" && h !== 12) h += 12;
      if (period === "AM" && h === 12) h = 0;

      // Construct client date object
      const clientDateObj = new Date(`${dateStr}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`);

      // Format in host timezone
      return new Intl.DateTimeFormat("en-US", {
        timeZone: hostTz,
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(clientDateObj);
    } catch {
      return slot;
    }
  }

  // Get available slots based on selected day (weekday vs weekend, etc.)
  function getAvailableSlots(date: Date): string[] {
    const dayOfWeek = date.getDay(); // 0 = Sun, 6 = Sat
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseSlots = isWeekend ? WEEKEND_SLOTS : WEEKDAY_SLOTS;

    // If selecting today, filter out passed hours
    const isToday =
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate();

    if (!isToday) return baseSlots;

    const currentHour = today.getHours();
    const currentMin = today.getMinutes();

    return baseSlots.filter((slot) => {
      const [time, period] = slot.split(" ");
      const [hourStr, minStr] = time.split(":");
      let h = parseInt(hourStr, 10);
      const m = parseInt(minStr, 10);
      if (period === "PM" && h !== 12) h += 12;
      if (period === "AM" && h === 12) h = 0;

      if (h > currentHour + 1) return true;
      if (h === currentHour + 1 && m > currentMin) return true;
      return false;
    });
  }

  const availableSlots = getAvailableSlots(selectedDate);

  // Sync to parent when selection changes
  useEffect(() => {
    const dateStr = toDateString(selectedDate);
    // If selected time is booked or not available, pick first unbooked slot
    let timeToUse = selectedTime;
    const unbookedSlots = availableSlots.filter((s) => !busySlots.includes(s));

    if (!availableSlots.includes(selectedTime) || busySlots.includes(selectedTime)) {
      if (unbookedSlots.length > 0) {
        timeToUse = unbookedSlots[0];
        setSelectedTime(timeToUse);
      }
    }
    onSelect(dateStr, timeToUse, clientTz);
  }, [selectedDate, selectedTime, busySlots, clientTz]);

  // Calendar calculations
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  function prevMonth() {
    // Prevent navigating before current month
    if (year === today.getFullYear() && month <= today.getMonth()) return;
    setCurrentMonthDate(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  }

  function handleDateClick(day: number) {
    const clicked = new Date(year, month, day);
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    if (clicked < startOfToday) return;
    setSelectedDate(clicked);
  }

  const isPrevDisabled =
    year === today.getFullYear() && month <= today.getMonth();

  const formattedSelectedFull = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(selectedDate);

  const hostTimeDisplay = getHostEquivalentTime(selectedTime, selectedDate);

  return (
    <div className="space-y-4">
      {/* Dual Timezone Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-[#080c08] border border-[#ffffff15] rounded-md text-[11px] font-mono">
        <div className="flex items-center gap-1.5 text-[#c8ff3d]">
          <Globe size={13} className="animate-spin-slow" />
          <span className="text-[#a4ada0]">Your Timezone:</span>
          <strong className="text-white">{clientTz}</strong>
        </div>
        <div className="flex items-center gap-1.5 text-[#a4ada0]">
          <span>Host Timezone:</span>
          <strong className="text-[#c8ff3d]">Asia/Dhaka (GMT+6)</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-[#080c08]/90 border border-[#c8ff3d33] rounded shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
        
        {/* Left Column: 8-Bit Interactive Month Calendar */}
        <div className="md:col-span-6 space-y-3">
          {/* Month Header & Controls */}
          <div className="flex items-center justify-between pb-2 border-b border-[#ffffff15]">
            <div className="flex items-center gap-2">
              <PixelCalendar size={16} className="text-[#c8ff3d]" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                {MONTH_NAMES[month]} {year}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={prevMonth}
                disabled={isPrevDisabled}
                className="p-1 text-[#a4ada0] hover:text-[#c8ff3d] disabled:opacity-30 disabled:cursor-not-allowed transition"
                title="Previous Month"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={nextMonth}
                className="p-1 text-[#a4ada0] hover:text-[#c8ff3d] transition"
                title="Next Month"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10px] font-bold text-[#838e7f]">
            {DAYS_OF_WEEK.map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Day Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* Blank leading days */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`blank-${i}`} className="h-8" />
            ))}

            {/* Days in Month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateObj = new Date(year, month, dayNum);
              const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
              const isPast = dateObj < startOfToday;
              const isSelected =
                dateObj.getFullYear() === selectedDate.getFullYear() &&
                dateObj.getMonth() === selectedDate.getMonth() &&
                dateObj.getDate() === selectedDate.getDate();
              const isTodayDate =
                dateObj.getFullYear() === today.getFullYear() &&
                dateObj.getMonth() === today.getMonth() &&
                dateObj.getDate() === today.getDate();

              return (
                <button
                  key={`day-${dayNum}`}
                  type="button"
                  disabled={isPast}
                  onClick={() => handleDateClick(dayNum)}
                  className={`h-8 rounded font-mono text-xs font-bold transition flex items-center justify-center relative ${
                    isSelected
                      ? "bg-[#c8ff3d] text-[#070a07] shadow-[0_0_12px_rgba(200,255,61,0.5)] scale-105 z-10"
                      : isPast
                      ? "text-[#475244] opacity-35 cursor-not-allowed"
                      : isTodayDate
                      ? "bg-[#162215] text-[#c8ff3d] border border-[#c8ff3d66] hover:bg-[#c8ff3d22]"
                      : "text-[#d0dad0] hover:bg-[#152014] hover:text-[#c8ff3d] border border-transparent"
                  }`}
                >
                  {dayNum}
                  {isTodayDate && !isSelected && (
                    <span className="absolute bottom-0.5 size-1 bg-[#c8ff3d] rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Date-Driven Available & Booked Time Slots */}
        <div className="md:col-span-6 space-y-3 md:pl-3 md:border-l border-[#ffffff15]">
          <div className="flex items-center justify-between pb-2 border-b border-[#ffffff15]">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
              <Clock size={15} className="text-[#c8ff3d]" />
              <span>Available Times</span>
              <span className="text-[#c8ff3d] text-[11px] font-normal">
                ({new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" }).format(selectedDate)})
              </span>
            </div>
            {loadingBusy && (
              <span className="text-[10px] font-mono text-[#c8ff3d] animate-pulse">
                Syncing calendar...
              </span>
            )}
          </div>

          <div className="text-[11px] text-[#a4ada0] font-mono">
            Times shown in your local time with host equivalent:
          </div>

          {/* Time Slot Buttons with Dual Timezone & Booked Status - Clean No-Scroll Grid */}
          <div className="grid grid-cols-2 gap-2">
            {availableSlots.map((slot) => {
              const isSelected = selectedTime === slot;
              const isBooked = busySlots.includes(slot);
              const hostEquiv = getHostEquivalentTime(slot, selectedDate);

              return (
                <button
                  key={slot}
                  type="button"
                  disabled={isBooked}
                  onClick={() => !isBooked && setSelectedTime(slot)}
                  className={`p-2 rounded text-left font-mono transition flex flex-col justify-center relative ${
                    isBooked
                      ? "bg-[#101410] border border-[#2d1b1b] text-[#717b6d] opacity-50 cursor-not-allowed"
                      : isSelected
                      ? "bg-[#c8ff3d] text-[#070a07] border-2 border-[#c8ff3d] shadow-[0_0_15px_rgba(200,255,61,0.4)]"
                      : "bg-[#0f170f] border border-[#ffffff15] text-white hover:border-[#c8ff3d] hover:bg-[#142013]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isBooked ? "line-through text-rose-400/80" : ""}`}>
                      {slot}
                    </span>
                    {isSelected && !isBooked && <PixelCheck size={13} className="text-[#070a07]" />}
                    {isBooked && (
                      <span className="text-[9px] px-1 py-0.2 bg-rose-950/80 border border-rose-800/80 text-rose-300 rounded font-bold">
                        BOOKED
                      </span>
                    )}
                  </div>
                  <div
                    className={`text-[10px] mt-0.5 ${
                      isSelected ? "text-[#203310] font-semibold" : "text-[#717b6d]"
                    }`}
                  >
                    ⚡ {hostEquiv} BST
                  </div>
                </button>
              );
            })}
          </div>

          {availableSlots.length === 0 && (
            <div className="p-4 bg-[#121912] border border-[#ffffff15] rounded text-center text-xs font-mono text-[#a4ada0]">
              No available discovery slots remaining for this date. Please choose another date.
            </div>
          )}

          <div className="pt-1 flex items-center gap-1.5 text-[10px] font-mono text-[#838e7f]">
            <Video size={12} className="text-[#c8ff3d]" />
            <span>Auto-generates private Google Meet video room.</span>
          </div>
        </div>
      </div>

      {/* Live Selection Summary Ribbon */}
      <div className="p-3 bg-[#111910] border border-[#c8ff3d44] rounded flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono shadow-[0_0_15px_rgba(200,255,61,0.08)]">
        <div className="flex items-center gap-2">
          <div className="size-5 rounded bg-[#c8ff3d] text-[#070a07] grid place-items-center font-bold text-[10px]">
            ✓
          </div>
          <div>
            <span className="text-[#a4ada0]">Selected Discovery Call:</span>{" "}
            <strong className="text-[#c8ff3d]">{formattedSelectedFull}</strong> at{" "}
            <strong className="text-white">{selectedTime}</strong>{" "}
            <span className="text-[#838e7f]">({clientTz})</span>
            {clientTz !== hostTz && (
              <span className="text-[#a4ada0] ml-1">
                / <strong className="text-[#c8ff3d]">{hostTimeDisplay} BST</strong> (Mehedi's Time)
              </span>
            )}
          </div>
        </div>
        <div className="self-end sm:self-auto px-2 py-0.5 bg-[#c8ff3d15] border border-[#c8ff3d33] rounded text-[10px] text-[#c8ff3d] font-bold">
          45 Min Session
        </div>
      </div>
    </div>
  );
}
