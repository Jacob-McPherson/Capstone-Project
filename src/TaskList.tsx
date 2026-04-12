import { Trash2, Clock, CheckCircle2, Circle } from "lucide-react";
import { type Quest } from "./Home";

interface TaskListProps {
    quests: Quest[];
    onStatusChange: (id: string, status: Quest['Status']) => void;
    onDelete: (id: string) => void;
}

export default function TaskList({ quests, onStatusChange, onDelete }: TaskListProps) {
  return (
    <div className="flex flex-col gap-4">
      {quests.map(quest => (
        <QuestItem 
          key={quest.QuestID} 
          quest={quest} 
          onStatusChange={onStatusChange} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
}

function QuestItem({ quest, onStatusChange, onDelete }: { quest: Quest; onStatusChange: (id: string, status: Quest['Status']) => void; onDelete: (id: string) => void }) {
    const statusIcons = {
        todo: <Circle className="w-5 h-5 text-gray-400" />,
        'in-progress': <Clock className="w-5 h-5 text-yellow-500" />,
        done: <CheckCircle2 className="w-5 h-5 text-green-600" />,
    };

    const nextStatus = {
        todo: 'in-progress' as const,
        'in-progress': 'done' as const,
        done: 'todo' as const,
    };

    return (
    <div className={`p-4 bg-white rounded-xl border transition-shadow ${quest.Status === 'done' ? 'border-green-200 bg-green-50/50' : 'border-gray-200 hover:shadow-md'}`}>
      <div className="flex items-start gap-3">
        <button
          onClick={() => onStatusChange(quest.QuestID, nextStatus[quest.Status])}
          className="mt-1 hover:scale-110 transition-transform"
        >
          {statusIcons[quest.Status]}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className={`font-medium ${quest.Status === 'done' ? 'line-through text-gray-400' : 'text-gray-900'}`}>
              {quest.Details}
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-purple-50 text-purple-700 border-purple-200">
              +{quest.XP} XP
            </span>
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <span className={`text-xs font-medium ${quest.Status === 'done' ? 'text-gray-400' : 'text-red-600'}`}>
              Due: {quest.DueDate}
            </span>
            
            <button
              onClick={() => onDelete(quest.QuestID)}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}