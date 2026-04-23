import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Quest } from './Home';

interface FullCalendarProps {
  quests: Quest[];
}

export default function FullCalendar({ quests }: FullCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Height of each hour block in pixels (Stretch for breathing room)
  const HOUR_HEIGHT = 96;

  const getWeekDays = (date: Date) => {
    const days = [];
    const current = new Date(date);
    const day = current.getDay();
    const diff = current.getDate() - day + (day === 0 ? -6 : 1);
    current.setDate(diff);

    for (let i = 0; i < 7; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  };

  const weekDays = getWeekDays(currentDate);
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const prevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const nextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getTaskStyle = (dueDateString: string) => {
    const dateObj = new Date(dueDateString);
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    
    const topPosition = (hours + minutes / 60) * HOUR_HEIGHT;
    return { top: `${topPosition}px`, height: `${HOUR_HEIGHT}px` }; 
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] bg-gradient-to-br from-[#EAF6D9] via-[#F2EEF7] to-[#E3DDF0] rounded-3xl overflow-hidden shadow-sm animate-in fade-in duration-500 border border-gray-200/50 min-w-[300px]">
      
      <div className="pt-6 px-4 md:px-6 pb-2">
        <div className="flex items-center gap-4 mb-6">
          <span className="bg-white/60 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold text-gray-700 shadow-sm border border-white/50">
            {weekDays[0].getFullYear()}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            {monthNames[weekDays[0].getMonth()]}
          </h2>
        </div>

        <div className="flex items-center justify-between w-full mb-4">
          <button onClick={prevWeek} className="p-1 md:p-2 hover:bg-white/60 rounded-full transition-colors text-gray-800">
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
          </button>
          
          <div className="flex-1 flex justify-between gap-1 md:gap-2 mx-1 md:mx-6 overflow-x-auto hide-scrollbar">
            {weekDays.map((date, index) => {
              const isToday = new Date().toDateString() === date.toDateString();
              return (
                <div key={index} className={`flex-1 min-w-[45px] flex flex-col items-center justify-center py-2 md:py-3 rounded-xl md:rounded-2xl transition-all border border-transparent ${
                  isToday ? 'bg-white shadow-sm border-white/60 scale-105' : 'bg-black/5 hover:bg-white/40'
                }`}>
                  <span className={`text-xs md:text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-600'}`}>
                    {dayNames[index]}
                  </span>
                  <span className={`text-lg md:text-xl font-bold leading-none mt-1 ${isToday ? 'text-blue-700' : 'text-gray-900'}`}>
                    {date.getDate()}
                  </span>
                </div>
              );
            })}
          </div>

          <button onClick={nextWeek} className="p-1 md:p-2 hover:bg-white/60 rounded-full transition-colors text-gray-800">
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-t-3xl mx-2 md:mx-4 mt-2 mb-0 overflow-y-auto overflow-x-auto relative shadow-inner border-t border-l border-r border-gray-100">
        <div className="flex min-w-[600px] md:min-w-full">
          
          <div className="w-14 md:w-20 flex-shrink-0 border-r border-gray-100 bg-white z-20 sticky left-0">
            {hours.map((hour) => {
              const ampm = hour >= 12 ? 'pm' : 'am';
              const displayHour = hour % 12 || 12;
              return (
                <div key={hour} style={{ height: HOUR_HEIGHT }} className="flex items-start justify-end pr-2 md:pr-3 pt-2">
                  <span className="text-[10px] md:text-xs font-bold text-gray-800">
                    {displayHour} <span className="text-[8px] md:text-[10px] text-gray-400 font-medium">{ampm}</span>
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex-1 flex relative">
            <div className="absolute inset-0 pointer-events-none">
              {hours.map(hour => (
                <div key={hour} style={{ height: HOUR_HEIGHT }} className="border-b border-gray-300 w-full" />
              ))}
            </div>

            {weekDays.map((dayDate, dayIndex) => {
              const dayDateString = dayDate.toISOString().split('T')[0];
              const daysTasks = quests.filter(q => q.dueDate && q.dueDate.split('T')[0] === dayDateString);

              return (
                <div key={dayIndex} className="flex-1 border-r border-gray-100 relative min-w-[80px]">
                  {daysTasks.map(quest => {
                    if (!quest.dueDate) return null;
                    
                    const colorClasses = 
                      quest.priority === 'High' ? 'bg-[#FFD6D6] text-red-900 border-[#FFC2C2]' :
                      quest.priority === 'Medium' ? 'bg-[#FFF3CD] text-amber-900 border-[#FFE69C]' :
                      'bg-[#D1E7DD] text-teal-900 border-[#A3CFBB]';

                    return (
                      <div
                        key={quest.questID}
                        className={`absolute left-1 right-1 md:left-2 md:right-2 rounded-xl md:rounded-2xl p-2 md:p-3 border shadow-sm flex flex-col gap-1 overflow-hidden transition-all hover:scale-[1.02] hover:shadow-md hover:z-30 cursor-pointer ${colorClasses} ${quest.status === 'Complete' ? 'opacity-40 grayscale' : ''}`}
                        style={getTaskStyle(quest.dueDate)}
                      >
                        <h4 className="text-[10px] md:text-sm font-bold leading-tight">{quest.questName}</h4>
                        <div className="flex flex-col mt-auto">
                          <span className="text-[8px] md:text-xs font-bold opacity-70 flex items-center gap-1">
                            {new Date(quest.dueDate).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).toLowerCase()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}