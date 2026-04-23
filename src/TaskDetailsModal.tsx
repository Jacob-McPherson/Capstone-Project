import { X, Clock, AlertCircle, Trophy } from 'lucide-react';
import type { Quest } from './Home';

interface TaskDetailsModalProps {
  quest: Quest | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TaskDetailsModal({ quest, isOpen, onClose }: TaskDetailsModalProps) {
  if (!isOpen || !quest) return null;

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "No specific time";
    const [datePart, timePart] = dateString.split('T');
    if (!timePart) return datePart;
    
    let [hours, minutes] = timePart.split(':');
    let h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12; 
    return `${datePart} at ${h}:${minutes} ${ampm}`;
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header Ribbon */}
        <div className={`h-3 w-full ${
          quest.priority === 'High' ? 'bg-red-400' : 
          quest.priority === 'Medium' ? 'bg-amber-400' : 'bg-teal-400'
        }`} />

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-900 leading-tight pr-4">{quest.questName}</h2>
            <button onClick={onClose} className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full transition-colors flex-shrink-0">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg ${
              quest.priority === 'High' ? 'bg-red-50 text-red-700 border border-red-100' : 
              quest.priority === 'Medium' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 
              'bg-teal-50 text-teal-700 border border-teal-100'
            }`}>
              <AlertCircle className="w-4 h-4" /> {quest.priority} Priority
            </span>
            <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
              <Trophy className="w-4 h-4" /> +{quest.XP} XP
            </span>
            <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-gray-50 text-gray-700 border border-gray-200">
              <Clock className="w-4 h-4" /> {formatDateTime(quest.dueDate)}
            </span>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Quest Details</h3>
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              {quest.questDetails || <span className="italic text-gray-400">No details provided for this quest.</span>}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}