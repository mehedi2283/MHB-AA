"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Clock, Video } from "lucide-react";
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
  onSelect: (dateStr: string, timeSlot: string) => void;
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

  // Helper to format Date to YYYY-MM-DD
  function toDateString(d: Date): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
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
    // If selected time is not in available slots, pick first available
    let timeToUse = selectedTime;
    if (!availableSlots.includes(selectedTime) && availableSlots.length > 0) {
      timeToUse = availableSlots[0];
      setSelectedTime(timeToUse);
    }
    onSelect(dateStr, timeToUse);
  }, [selectedDate, selectedTime]);

  // Calendar calculations
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  function prevMonth() {
    // Prevent navigating before current month
    const minMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const prev = new Date(year, month - 1, 1);
    if (prev >= minMonth) {
      setCurrentMonthDate(prev);
    }
  }

  function nextMonth() {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  }

  const isMinMonth =
    year === today.getFullYear() && month === today.getMonth();

  return (
    <div className="border border-[#c8ff3d33] bg-[#070a07] rounded-lg p-4 space-y-4">
      {/* Top Controls: Calendar & Time Grid */}
      <div className="grid md:grid-cols-2 gap-6 items-start">
        {/* Left: Interactive Calendar View */}
        <div className="space-y-3 bg-[#0d120d] border border-[#ffffff12] rounded-lg p-3.5">
          {/* Month & Navigation */}
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <PixelCalendar size={14} className="text-[#c8ff3d]" />
              {MONTH_NAMES[month]} {year}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={prevMonth}
                disabled={isMinMonth}
                className={`p-1.5 rounded border border-[#ffffff15] text-white transition ${
                  isMinMonth
                    ? "opacity-25 cursor-not-allowed"
                    : "hover:bg-[#1a2419] hover:border-[#c8ff3d] hover:text-[#c8ff3d]"
                }`}
                aria-label="Previous Month"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                type="button"
                onClick={nextMonth}
                className="p-1.5 rounded border border-[#ffffff15] text-white hover:bg-[#1a2419] hover:border-[#c8ff3d] hover:text-[#c8ff3d] transition"
                aria-label="Next Month"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center font-mono text-[9px] font-bold text-[#a4ada0] pb-1 border-b border-[#ffffff10]">
            {DAYS_OF_WEEK.map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center font-mono text-xs">
            {/* Empty slots before first day */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="h-8" />
            ))}

            {/* Days of Month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateObj = new Date(year, month, dayNum);

              // Check if date is in the past (before tomorrow)
              const isPast =
                dateObj <
                new Date(today.getFullYear(), today.getMonth(), today.getDate());

              const isSelected =
                selectedDate.getFullYear() === year &&
                selectedDate.getMonth() === month &&
                selectedDate.getDate() === dayNum;

              return (
                <button
                  key={dayNum}
                  type="button"
                  disabled={isPast}
                  onClick={() => {
                    setSelectedDate(new Date(year, month, dayNum));
                  }}
                  className={`h-8 rounded flex items-center justify-center font-bold text-xs transition relative select-none ${
                    isPast
                      ? "opacity-20 cursor-not-allowed text-[#717b6d]"
                      : isSelected
                      ? "bg-[#c8ff3d] text-black font-extrabold border border-white shadow-[0_0_10px_rgba(200,255,61,0.6)]"
                      : "text-white bg-[#101610] border border-[#ffffff10] hover:border-[#c8ff3d] hover:text-[#c8ff3d] hover:bg-[#162015]"
                  }`}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Dynamic Time Slots Grid for Selected Date */}
        <div className="space-y-3 bg-[#0d120d] border border-[#ffffff12] rounded-lg p-3.5 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between border-b border-[#ffffff10] pb-2">
              <span className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Clock size={14} className="text-[#c8ff3d]" />
                Available Times
              </span>
              <span className="text-[10px] font-mono text-[#c8ff3d]">
                {selectedDate.toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>

            <p className="text-[10px] text-[#a4ada0] mt-1.5 mb-3 font-mono">
              Slots adjusted for your timezone:
            </p>

            {/* Time Slot Pill Buttons */}
            {availableSlots.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {availableSlots.map((slot) => {
                  const isSlotSelected = selectedTime === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`px-3 py-2 rounded text-xs font-mono font-bold transition flex items-center justify-between border ${
                        isSlotSelected
                          ? "bg-[#c8ff3d] text-black border-white shadow-[0_0_8px_rgba(200,255,61,0.5)]"
                          : "bg-[#101610] text-[#e8eee2] border-[#ffffff12] hover:border-[#c8ff3d] hover:text-[#c8ff3d]"
                      }`}
                    >
                      <span>{slot}</span>
                      {isSlotSelected && <PixelCheck size={12} />}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-[#a4ada0] font-mono">
                No slots left for this date. Please select another day.
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-[#ffffff10] flex items-center gap-1.5 text-[10px] font-mono text-[#a4ada0]">
            <Video size={12} className="text-[#c8ff3d]" />
            <span>Google Meet video link will be sent automatically.</span>
          </div>
        </div>
      </div>

      {/* Selected Meeting Summary Bar */}
      <div className="p-3 bg-[#131b13] border border-[#c8ff3d44] rounded text-xs font-mono text-[#c8ff3d] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <PixelCheck size={14} className="text-[#c8ff3d]" />
          <span>
            Selected:{" "}
            <strong className="text-white">
              {selectedDate.toLocaleDateString(undefined, {
                weekday: "long",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </strong>{" "}
            at <strong className="text-white">{selectedTime}</strong>
          </span>
        </div>
        <span className="text-[10px] text-[#a4ada0] bg-[#00000040] px-2 py-0.5 rounded border border-[#ffffff10]">
          45 Min Discovery Call
        </span>
      </div>

      {/* Hidden inputs to feed native form submission */}
      <input type="hidden" name="meetingDate" value={toDateString(selectedDate)} />
      <input type="hidden" name="meetingTime" value={selectedTime} />
    </div>
  );
}
