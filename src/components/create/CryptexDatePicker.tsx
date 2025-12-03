"use client";

import { useState } from "react";

interface CryptexDatePickerProps {
  onDateChange: (date: string) => void;
}

export function CryptexDatePicker({ onDateChange }: CryptexDatePickerProps) {
  // Get tomorrow's date as the minimum selectable date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(tomorrow.getFullYear());
  const [month, setMonth] = useState(tomorrow.getMonth() + 1);
  const [day, setDay] = useState(tomorrow.getDate());

  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const handleChange = (newYear: number, newMonth: number, newDay: number) => {
    // Validate that the selected date is not in the past
    const selectedDate = new Date(newYear, newMonth - 1, newDay);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // If selected date is today or in the past, set to tomorrow
    if (selectedDate <= today) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      newYear = tomorrow.getFullYear();
      newMonth = tomorrow.getMonth() + 1;
      newDay = tomorrow.getDate();
    }

    setYear(newYear);
    setMonth(newMonth);
    setDay(newDay);

    const dateStr = `${newYear}-${String(newMonth).padStart(2, "0")}-${String(
      newDay
    ).padStart(2, "0")}`;
    onDateChange(dateStr);
  };

  return (
    <div className="cryptex-container">
      <div className="text-center mb-8">
        <h3 className="font-cinzel text-2xl text-stone-300 mb-2">
          Choose the Resurrection Date
        </h3>
        <p className="text-stone-500 text-sm">
          Turn the cryptex to set the date
        </p>
        <p className="text-stone-400 text-xs mt-2 italic">
          * Past dates will automatically be set to tomorrow
        </p>
      </div>

      <div className="flex justify-center items-center gap-4 mb-8">
        {/* Year Cylinder */}
        <div className="cryptex-cylinder">
          <div className="cryptex-label">Year</div>
          <select
            value={year}
            onChange={(e) => handleChange(Number(e.target.value), month, day)}
            className="cryptex-select"
          >
            {years.map((y) => (
              <option key={y} value={y} className="text-black bg-white">
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Month Cylinder */}
        <div className="cryptex-cylinder">
          <div className="cryptex-label">Month</div>
          <select
            value={month}
            onChange={(e) => handleChange(year, Number(e.target.value), day)}
            className="cryptex-select"
          >
            {months.map((m) => (
              <option key={m} value={m} className="text-black bg-white">
                {String(m).padStart(2, "0")}
              </option>
            ))}
          </select>
        </div>

        {/* Day Cylinder */}
        <div className="cryptex-cylinder">
          <div className="cryptex-label">Day</div>
          <select
            value={day}
            onChange={(e) => handleChange(year, month, Number(e.target.value))}
            className="cryptex-select"
          >
            {days.map((d) => (
              <option key={d} value={d} className="text-black bg-white">
                {String(d).padStart(2, "0")}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Date Display */}
      <div className="text-center">
        <div className="inline-block bg-stone-900/60 border-2 border-[var(--seal-gold)] rounded-lg px-8 py-4">
          <div className="font-cinzel text-3xl text-[var(--seal-gold)] tracking-wider">
            {year}.{String(month).padStart(2, "0")}.
            {String(day).padStart(2, "0")}
          </div>
        </div>
      </div>

      <style jsx>{`
        .cryptex-cylinder {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .cryptex-label {
          font-family: var(--font-cinzel), serif;
          color: var(--stone-400);
          font-size: 0.875rem;
          letter-spacing: 0.1em;
        }

        .cryptex-select {
          appearance: none;
          background: linear-gradient(
            to bottom,
            rgba(41, 37, 36, 0.8),
            rgba(28, 25, 23, 0.9)
          );
          border: 3px solid rgba(120, 113, 108, 0.6);
          border-radius: 12px;
          color: var(--seal-gold);
          font-family: var(--font-cinzel), serif;
          font-size: 1.5rem;
          font-weight: 600;
          padding: 16px 12px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.5),
            0 4px 8px rgba(0, 0, 0, 0.3);
        }

        .cryptex-select:hover {
          border-color: var(--seal-gold);
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.5),
            0 0 20px rgba(255, 215, 0, 0.3);
        }

        .cryptex-select:focus {
          outline: none;
          border-color: var(--seal-gold);
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.5),
            0 0 30px rgba(255, 215, 0, 0.5);
        }
      `}</style>
    </div>
  );
}
