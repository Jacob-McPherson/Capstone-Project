import { useState } from 'react';
import { CheckCircle2, Circle, Clock, Trash2, ChevronDown, AlertCircle, Target } from 'lucide-react';
import type { Quest } from './Home';

interface TaskListProps {
  quests: Quest[];
  onStatusChange: (id: number, status: Quest['status']) => void;
  onDelete: (id: number) => void;
}

export default function TaskList({ quests, onStatusChange, onDelete }: TaskListProps) {
  // 1. STATE: Keep track of which task IDs are currently expanded
  const [expandedTasks, setExpandedTasks] = useState<Set<number>>(new Set());

  // Helper to toggle the expanded state
  const toggleExpand = (id: number) => {
    setExpandedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id); // Close it if it's open
      } else {
        newSet.add(id); // Open it if it's closed
      }
      return newSet;
    });
  };

  // Converts "2026-04-28T15:00:00" to "Due: 2026-04-28 at 3:00 pm"
  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return null;
    const [datePart, timePart] = dateString.split('T');
    if (!timePart) return `Due: ${datePart}`;
    
    let [hours, minutes] = timePart.split(':');
    let h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'pm' : 'am';
    h = h % 12 || 12; 
    
    return `Due: ${datePart} at ${h}:${minutes} ${ampm}`;
  };

  // If there are no tasks, show a nice empty state
  if (quests.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
        <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">No quests found. Time to add some!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {quests.map((quest) => {
        // 2. LOGIC: Check if this specific task is expanded, and if it even has details to show
        const isExpanded = expandedTasks.has(quest.questID);
        const hasDetails = quest.questDetails && quest.questDetails.trim().length > 0;

        return (
          <div 
            key={quest.questID} 
            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all hover:border-gray-300"
          >
            {/* MAIN TASK ROW */}
            <div className="p-4 flex items-center justify-between gap-4 cursor-pointer" onClick={() => hasDetails && toggleExpand(quest.questID)}>
              
              {/* Left Side: Checkbox & Title */}
              <div className="flex items-center gap-4 flex-1">
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); // Don't expand the task when clicking the checkbox
                    onStatusChange(quest.questID, quest.status === 'Complete' ? 'Pending' : 'Complete');
                  }}
                  className="flex-shrink-0 transition-transform hover:scale-110 active:scale-95"
                >
                  {quest.status === 'Complete' ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-300 hover:text-blue-500" />
                  )}
                </button>
                
                <div className="flex flex-col">
                  <span className={`font-semibold text-base transition-colors ${quest.status === 'Complete' ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                    {quest.questName}
                  </span>
                  
                  {quest.dueDate && (
                    <span className="text-xs text-gray-500 flex items-center gap-1.5 mt-1 font-medium">
                      <Clock className="w-3.5 h-3.5" /> 
                      {formatDateTime(quest.dueDate)}
                    </span>
                  )}
                </div>
              </div>

              {/* Right Side: Badges & Controls */}
              <div className="flex items-center gap-3 flex-shrink-0">
                
                {/* Priority Badge */}
                <span className={`hidden sm:flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-md ${
                  quest.priority === 'High' ? 'bg-red-50 text-red-600' :
                  quest.priority === 'Medium' ? 'bg-orange-50 text-orange-600' :
                  'bg-blue-50 text-blue-600'
                }`}>
                  <AlertCircle className="w-3 h-3" />
                  {quest.priority}
                </span>

                {/* Expand Chevron (Only renders if there are details) */}
                {hasDetails && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(quest.questID);
                    }}
                    className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                )}

                {/* Delete Button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(quest.questID);
                  }}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors ml-1"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 3. EXPANDED DETAILS SECTION */}
            {/* Smoothly drops down if isExpanded is true */}
            {isExpanded && hasDetails && (
              <div className="px-14 pb-5 pt-1 bg-gray-50/50 border-t border-gray-100 animate-in slide-in-from-top-2 fade-in duration-200">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Quest Details</h4>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {quest.questDetails}
                </p>
              </div>
            )}

          </div>
        );
      })}
    </div>
  );
}