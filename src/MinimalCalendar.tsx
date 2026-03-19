import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function MinimalCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const today = new Date();
    const isCurrentMonth = currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();

    const previousMonth = () => { setCurrentDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const nextMonth = () => { setCurrentDate
        (new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const days = [];
    for ( let i = 1; i < firstDayOfMonth + 1; i++) {
        days.push(<div key={`empty-${i}`} className="aspect-square" />);
    }
    for (let day =1; day <= daysInMonth; day++) {
        const isToday = isCurrentMonth && day === today.getDate();
        days.push(
            <div
                key={day}
                className={`aspect-square flex items-center justify-center text-sm
                    ${isToday
                        ? 'bg-blue-600 text-white rounded-full font medium'
                        : 'text-gray-700 hover:bg-gray-100 rounded-full cursor-pointer'
                    }
                    `}
                >
                    {day}
                </div>
        );
    }

    return (
        // still WIP, replacing some figma stuff with ol' regular tailwind.
        <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm max-w-md">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
        <h2 className="font-semibold text-gray-900">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex items-center gap-2">
          {/* Replaced <Button> with standard Tailwind buttons */}
          <button
            onClick={previousMonth}
            className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-600"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextMonth}
            className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-600"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map(day => (
          <div
            key={day}
            className="aspect-square flex items-center justify-center text-xs font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {days}
      </div>
    </div>
  );
}