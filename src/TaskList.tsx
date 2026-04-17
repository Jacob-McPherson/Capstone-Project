import { Trash2, Clock, CheckCircle2, Circle } from "lucide-react";
import { type Quest } from "./Home";

interface TaskListProps {
    quests: Quest[];
    onStatusChange: (id: number, status: Quest['status']) => void;
    onDelete: (id: number) => void;
}

export default function TaskList({ quests, onStatusChange, onDelete }: TaskListProps) {
  if (quests.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-400 bg-white rounded-xl border border-gray-100 border-dashed">
        No quests found in this category.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {quests.map(quest => (
        <QuestItem 
          key={quest.questID} 
          quest={quest} 
          onStatusChange={onStatusChange} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
}

// Individual quest card component
function QuestItem({ quest, onStatusChange, onDelete }: { 
  quest: Quest; 
  onStatusChange: (id: number, status: Quest['status']) => void; 
  onDelete: (id: number) => void }) {
    
    const statusIcons = {
        'todo': <Circle className="w-6 h-6 text-gray-300 hover:text-blue-500 transition colors" />,
        'in-progress': <Clock className="w-6 h-6 text-yellow-500" />,
        'done': <CheckCircle2 className="w-6 h-6 text-green-600" />,
    };

    const nextStatus = {
        'todo': 'in-progress' as const,
        'in-progress': 'done' as const,
        'done': 'todo' as const,
    };

    return (
    <div className={`p-5 bg-white rounded-xl transition-all duration-200 shadow-sm border ${
      quest.status === 'done' 
        ? 'border-green-100 opacity-60' 
        : 'border-white hover:border-gray-200 hover:shadow-md'
      }`}
    >
      <div className="flex items-start gap-4">
        <button
          onClick={() => onStatusChange(quest.questID, nextStatus[quest.status])}
          className="mt-0.5 flex-shrink-0 active:scale-95 transition-transform"
        >
          {statusIcons[quest.status]}
        </button>
        
        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            
            {/* Quest details -title- with conditional styling for completed tasks */}
            <h3 className={`text-lg font-medium tracking-tight ${
              quest.status === 'done' ? 'line-through text-gray-400' : 'text-gray-900'}`}>
              {quest.questName}
            </h3>

            {/* XP badge */}
            <span className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-[#F0F4F8] text-blue-600 border border-blue-100">
              +{quest.XP} XP
            </span>
          </div>
          
          {/* Due date and delete button row */}
          <div className="flex items-center justify-between mt-3">
            <span className={`text-sm font-medium ${
              quest.status === 'done' ? 'text-gray-400' : 'text-red-600'
              }`}>
                {quest.dueDate ? `Due: ${quest.dueDate}` : 'No due date'}
            </span>
            
            <button
              onClick={() => onDelete(quest.questID)}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
              title="Delete Quest"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}