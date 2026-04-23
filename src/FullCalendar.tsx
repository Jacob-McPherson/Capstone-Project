import { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import type { Quest } from './Home';

interface FullCalendarProps {
  quests: Quest[];
}

export default function FullCalendar({ quests }: FullCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // NEW: State to track which day the user clicked on
  const [selectedDate, setSelectedDate] = useState(new Date());
  
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
    
    // Shift selected date back a week too
    const newSelected = new Date(selectedDate);
    newSelected.setDate(selectedDate.getDate() - 7);
    setSelectedDate(newSelected);
  };

  const nextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);

    // Shift selected date forward a week too
    const newSelected = new Date(selectedDate);
    newSelected.setDate(selectedDate.getDate() + 7);
    setSelectedDate(newSelected);
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
    <div className="flex flex-col h-full w-full bg-gradient-to-br from-[#E2EF7E] via-[#D2D0D7] to-[#BCB7D9] overflow-hidden animate-in fade-in duration-500 min-w-[300px]">
      
      {/* HEADER */}
      <div className="pt-6 px-4 md:px-8 pb-4">
        <div className="flex items-center gap-4 mb-6">
          <span className="bg-white/60 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold text-gray-700 shadow-sm border border-white/50">
            {weekDays[0].getFullYear()}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            {monthNames[weekDays[0].getMonth()]}
          </h2>
          <span className="hidden sm:inline-block bg-black/10 px-4 py-2 rounded-full text-sm font-bold text-gray-700 ml-2 shadow-sm">
            Week
          </span>
        </div>

        <div className="flex items-center justify-between w-full">
          <button onClick={prevWeek} className="p-1 md:p-2 hover:bg-white/60 rounded-full transition-colors text-gray-800">
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
          </button>
          
          <div className="flex-1 flex justify-between gap-1 md:gap-2 mx-1 md:mx-6 overflow-x-auto hide-scrollbar">
            {weekDays.map((date, index) => {
              const isToday = new Date().toDateString() === date.toDateString();
              const isSelected = selectedDate.toDateString() === date.toDateString();
              
              return (
                <button 
                  key={index} 
                  onClick={() => setSelectedDate(date)}
                  className={`flex-1 min-w-[45px] flex flex-col items-center justify-center py-2 md:py-3 rounded-xl md:rounded-2xl transition-all border ${
                    isSelected ? 'bg-white shadow-md border-white/80 scale-105 z-10' : 
                    isToday ? 'bg-blue-50/50 border-transparent hover:bg-white/60' : 
                    'bg-black/5 border-transparent hover:bg-white/40'
                  }`}
                >
                  <span className={`text-xs md:text-sm font-medium ${isSelected || isToday ? 'text-blue-600' : 'text-gray-600'}`}>
                    {dayNames[index]}
                  </span>
                  <span className={`text-lg md:text-xl font-bold leading-none mt-1 ${isSelected ? 'text-blue-700' : isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                    {date.getDate()}
                  </span>
                </button>
              );
            })}
          </div>

          <button onClick={nextWeek} className="p-1 md:p-2 hover:bg-white/60 rounded-full transition-colors text-gray-800">
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
          </button>
        </div>
      </div>

      {/* BODY GRID - FIX: Fully contained with mx-6, mb-6, and rounded-3xl so it floats! */}
      <div className="flex-1 bg-white rounded-3xl mx-2 md:mx-6 mb-2 md:mb-6 mt-0 shadow-xl border border-gray-100 flex flex-col overflow-hidden">
        
        {/* Horizontal Scroll Wrapper (Keeps All-Day and Time Grid in sync) */}
        <div className="flex-1 flex flex-col overflow-x-auto overflow-y-hidden hide-scrollbar">
          
          {/* ALL DAY / UNTIMED ROW */}
          <div className="flex border-b border-gray-200 bg-gray-50/50 min-w-[600px] md:min-w-full z-30 relative shadow-sm">
            <div className="w-14 md:w-20 flex-shrink-0 border-r border-gray-200 flex items-center justify-end pr-2 md:pr-3 py-2">
              <span className="text-[10px] md:text-xs font-bold text-gray-500 text-right">All Day</span>
            </div>
            
            <div className="flex-1 flex">
              {weekDays.map((dayDate, dayIndex) => {
                const dayDateString = dayDate.toISOString().split('T')[0];
                
                // Grab tasks for this day that end exactly in "23:59:00" (Our untimed trick)
                const allDayTasks = quests.filter(q => 
                  q.dueDate && 
                  q.dueDate.split('T')[0] === dayDateString && 
                  q.dueDate.endsWith("23:59:00")
                );

                return (
                  <div key={`allday-${dayIndex}`} className="flex-1 border-r border-gray-100 p-1.5 relative min-w-[80px] flex flex-col gap-1 min-h-[40px]">
                    {allDayTasks.map(quest => (
                      <div 
                        key={quest.questID} 
                        className={`px-2 py-1.5 rounded-lg text-[10px] font-bold truncate border shadow-sm ${quest.status === 'Complete' ? 'opacity-40 grayscale' : 'bg-gray-100 text-gray-700 border-gray-200'}`}
                      >
                        {quest.questName}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>

          {/* VERTICAL SCROLL TIME GRID */}
          <div className="flex-1 overflow-y-auto relative min-w-[600px] md:min-w-full hide-scrollbar">
            <div className="flex relative pb-4">
              
              {/* TIME SIDEBAR */}
              <div className="w-14 md:w-20 flex-shrink-0 border-r border-gray-100 bg-white z-20">
                {hours.map((hour) => {
                  const ampm = hour >= 12 ? 'pm' : 'am';
                  const displayHour = hour % 12 || 12;
                  return (
                    <div key={hour} style={{ height: HOUR_HEIGHT }} className="flex items-start justify-end pr-2 md:pr-3 pt-2">
                      <span className="text-[10px] md:text-xs font-bold text-gray-800">
                        {displayHour} <span className="text-[8px] md:text-[10px] text-gray-800 font-medium">{ampm}</span>
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* TIMED TASKS GRID */}
              <div className="flex-1 flex relative">
                <div className="absolute inset-0 pointer-events-none">
                  {hours.map(hour => (
                    <div key={`line-${hour}`} style={{ height: HOUR_HEIGHT }} className="border-b border-gray-300 w-full" />
                  ))}
                </div>

                {weekDays.map((dayDate, dayIndex) => {
                  const dayDateString = dayDate.toISOString().split('T')[0];
                  
                  // Filter OUT the untimed tasks so they only appear in the top row
                  const timedTasks = quests.filter(q => 
                    q.dueDate && 
                    q.dueDate.split('T')[0] === dayDateString && 
                    !q.dueDate.endsWith("23:59:00")
                  );

                  return (
                    <div key={`col-${dayIndex}`} className="flex-1 border-r border-gray-100 relative min-w-[80px]">
                      {timedTasks.map(quest => {
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
        
      </div>
    </div>
  );
}