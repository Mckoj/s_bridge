import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarWidgetProps {
  color: "blue" | "purple" | "green";
}

export default function CalendarWidget({ color }: CalendarWidgetProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 15)); // Default to May 15, 2026 as in image
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2026, 4, 15));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  // Helper to get number of days in month
  const getDaysInMonth = (y: number, m: number) => {
    return new Date(y, m + 1, 0).getDate();
  };

  // Helper to get starting day of week for month (0 = Sunday, 1 = Monday...)
  const getStartDayOfMonth = (y: number, m: number) => {
    // We adjust so Monday is 0 and Sunday is 6
    const startDay = new Date(y, m, 1).getDay();
    return startDay === 0 ? 6 : startDay - 1;
  };

  const daysInMonth = getDaysInMonth(year, month);
  const startDay = getStartDayOfMonth(year, month);

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

  const calendarDays: { day: number; isCurrentMonth: boolean; date: Date }[] = [];

  // Fill in days from previous month
  for (let i = startDay - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    calendarDays.push({
      day: d,
      isCurrentMonth: false,
      date: new Date(prevYear, prevMonth, d),
    });
  }

  // Fill in current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      day: i,
      isCurrentMonth: true,
      date: new Date(year, month, i),
    });
  }

  // Fill in next month days to complete grid (usually 35 or 42 slots)
  const remainingSlots = calendarDays.length % 7 === 0 ? 0 : 7 - (calendarDays.length % 7);
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;

  for (let i = 1; i <= remainingSlots; i++) {
    calendarDays.push({
      day: i,
      isCurrentMonth: false,
      date: new Date(nextYear, nextMonth, i),
    });
  }

  // Handle month change
  const handlePrevMonth = () => {
    if (month === 0) {
      setCurrentDate(new Date(year - 1, 11, 15));
    } else {
      setCurrentDate(new Date(year, month - 1, 15));
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setCurrentDate(new Date(year + 1, 0, 15));
    } else {
      setCurrentDate(new Date(year, month + 1, 15));
    }
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  const activeColorStyles = {
    blue: {
      text: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-600 hover:bg-blue-700 text-white",
      bgHover: "hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-800",
      activeText: "text-blue-600 dark:text-blue-400 font-semibold"
    },
    purple: {
      text: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-600 hover:bg-purple-700 text-white",
      bgHover: "hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-600 dark:text-purple-400",
      border: "border-purple-200 dark:border-purple-800",
      activeText: "text-purple-600 dark:text-purple-400 font-semibold"
    },
    green: {
      text: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-600 hover:bg-emerald-700 text-white",
      bgHover: "hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-200 dark:border-emerald-800",
      activeText: "text-emerald-600 dark:text-emerald-400 font-semibold"
    },
  };

  const themeStyle = activeColorStyles[color];

  return (
    <div className="w-full">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
          {monthNames[month]} {year}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrevMonth}
            className="p-1 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 text-center gap-y-2 mb-2">
        {daysOfWeek.map((day) => (
          <span key={day} className="text-xs font-bold text-slate-400 dark:text-slate-500">
            {day}
          </span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 text-center gap-y-1 gap-x-1">
        {calendarDays.map((item, idx) => {
          const isSelected = selectedDate ? isSameDay(item.date, selectedDate) : false;
          
          return (
            <button
              key={idx}
              onClick={() => item.isCurrentMonth && setSelectedDate(item.date)}
              disabled={!item.isCurrentMonth}
              className={`h-8 w-8 mx-auto flex items-center justify-center rounded-xl text-xs font-semibold transition-all duration-150 ${
                !item.isCurrentMonth
                  ? "text-slate-300 dark:text-slate-700 cursor-default"
                  : isSelected
                  ? themeStyle.bg
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80"
              }`}
            >
              {item.day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
