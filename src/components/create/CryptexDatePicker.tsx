"use client";

import { useState } from "react";

interface CryptexDatePickerProps {
  onDateChange: (date: string) => void;
}

export function CryptexDatePicker({ onDateChange }: CryptexDatePickerProps) {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear + 1);
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);

  const years = Array.from({ length: 10 }, (_, i) => currentYear + i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const handleChange = (newYear: number, newMonth: number, newDay: number) => {
    setYear(newYear);
    setMonth(newMonth);
    setDay(newDay);
    
    const dateStr = `${newYear}-${String(newMonth).padStart(2, "0")}-${String(newDay).padStart(2, "0")}`;
    onDateChange(dateStr);
  };

  return (
    <div className="cryptex-container">
      <div className="text-center mb-8">
        <h3 className="font-cinzel text-2xl text-stone-300 mb-2">
          부활의 날을 선택하세요
        </h3>
        <p className="text-stone-500 text-sm">
          크립텍스를 돌려 날짜를 맞추세요
        </p>
      </div>

      <div className="flex justify-center items-center gap-4 mb-8">
        {/* Year Cylinder */}
        <div className="cryptex-cylinder">
          <div className="cryptex-label">년</div>
          <select
            value={year}
            onChange={(e) => handleChange(Number(e.target.value), month, day)}
            className="cryptex-select"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Month Cylinder */}
        <div className="cryptex-cylinder">
          <div className="cryptex-label">월</div>
          <select
            value={month}
            onChange={(e) => handleChange(year, Number(e.target.value), day)}
            className="cryptex-select"
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {String(m).padStart(2, "0")}
              </option>
            ))}
          </select>
        </div>

        {/* Day Cylinder */}
        <div className="cryptex-cylinder">
          <div className="cryptex-label">일</div>
          <select
            value={day}
            onChange={(e) => handleChange(year, month, Number(e.target.value))}
            className="cryptex-select"
          >
            {days.map((d) => (
              <option key={d} value={d}>
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
            {year}.{String(month).padStart(2, "0")}.{String(day).padStart(2, "0")}
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
          box-shadow: 
            inset 0 2px 4px rgba(0, 0, 0, 0.5),
            0 4px 8px rgba(0, 0, 0, 0.3);
        }

        .cryptex-select:hover {
          border-color: var(--seal-gold);
          box-shadow: 
            inset 0 2px 4px rgba(0, 0, 0, 0.5),
            0 0 20px rgba(255, 215, 0, 0.3);
        }

        .cryptex-select:focus {
          outline: none;
          border-color: var(--seal-gold);
          box-shadow: 
            inset 0 2px 4px rgba(0, 0, 0, 0.5),
            0 0 30px rgba(255, 215, 0, 0.5);
        }
      `}</style>
    </div>
  );
}
