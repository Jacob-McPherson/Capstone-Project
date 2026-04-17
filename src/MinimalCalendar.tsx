import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { type Quest } from "./Home";

interface CalendarProps {
  quests: Quest[];
}

export default function MinimalCalendar({ quests }: CalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const today = new Date();

    const previousMonth = () => { setCurrentDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };
    const nextMonth = () => { setCurrentDate
        (new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const days = [];
    for ( let i = 0; i < firstDayOfMonth; i++) {
        days.push(<div key={`empty-${i}`} className="aspect-square" />);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear() &&
        day === today.getDate();

        // 1. formatting the curr claenadr to YYYY-MM-DD
        const currentYear = currentDate.getFullYear();
        const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
        const currentDayStr = String(day).padStart(2, '0');
        const dateString = `${currentYear}-${currentMonth}-${currentDayStr}`;

        // 2. counting how many quests are due on certain date
        const questsDueToday = quests.filter(q => q.dueDate === dateString && q.status !== 'Complete').length;

        // 3. heat map color logic
        let dayStyle = 'text-gray-700 hover:bg-gray-100 rounded-full cursor-pointer'; // default

        if (questsDueToday === 1) {
          dayStyle = 'bg-red-100 text-red-800 font-bold rounded-full cursor-pointer';
        } else if (questsDueToday === 2) {
          dayStyle = 'bg-red-300 text-red-900 font-bold rounded-full cursor-pointer';
        } else if (questsDueToday >= 3) {
          dayStyle = 'bg-red-600 text-white font-bold rounded-full cursor-pointer shadow-md';
        } else if (isToday) {
          dayStyle = 'border-2 border-blue-600 text-blue-600 font-bold rounded-full cursor-pointer';
        }

        days.push(
          <div key={day} className={`aspect-square flex items-center justify-center ${dayStyle}`}>
            {day}
          </div>
        );
    }
    return (
    <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm max-w-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-semibold text-gray-900">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={previousMonth} className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-600">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={nextMonth} className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-600">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map(day => (
          <div key={day} className="aspect-square flex items-center justify-center text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days}
      </div>
    </div>
  );
}