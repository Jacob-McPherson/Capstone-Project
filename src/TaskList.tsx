import { useState, useRef, useEffect } from 'react';
import { 
  CheckCircle2, Circle, CircleDot, PlayCircle, Clock, 
  Trash2, ChevronDown, AlertCircle, Target, MoreVertical, Edit2, Save 
} from 'lucide-react';
import type { Quest } from './Home';

interface TaskListProps {
  quests: Quest[];
  onStatusChange: (id: number, status: Quest['status']) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, updates: Partial<Quest>) => void;
  isOwner: boolean;
}

export default function TaskList({ quests, onStatusChange, onDelete, onEdit, isOwner }: TaskListProps) {
  const [expandedTasks, setExpandedTasks] = useState<Set<number>>(new Set());
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  
  // Edit Form State
  const [editTitle, setEditTitle] = useState('');
  const [editDetails, setEditDetails] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editPriority, setEditPriority] = useState<Quest['priority']>('Medium');

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id); else newSet.add(id); 
      return newSet;
    });
  };

  // Force browser to parse as a real Date object to match local timezone
  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return null;
    const d = new Date(dateString);
    return `Due: ${d.toLocaleDateString()} at ${d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
  };

  const startEditing = (quest: Quest) => {
    setEditTitle(quest.questName);
    setEditDetails(quest.questDetails || '');
    setEditPriority(quest.priority);
    
    if (quest.dueDate) {
      // Convert UTC from database back into local YYYY-MM-DD format for the inputs
      const d = new Date(quest.dueDate);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      setEditDate(`${year}-${month}-${day}`);
      
      const hours = String(d.getHours()).padStart(2, '0');
      const mins = String(d.getMinutes()).padStart(2, '0');
      setEditTime(`${hours}:${mins}`);
    } else {
      setEditDate('');
      setEditTime('');
    }
    
    setEditingTaskId(quest.questID);
    setOpenMenuId(null);
  };

  const handleSaveEdit = (id: number) => {
    let finalDueDate = null;
    if (editDate) {
        const timeString = editTime || "23:59";
        const localDate = new Date(`${editDate}T${timeString}:00`);
        finalDueDate = localDate.toISOString();
    }

    onEdit(id, {
      questName: editTitle,
      questDetails: editDetails || "",
      priority: editPriority,
      dueDate: finalDueDate
    });

    setEditingTaskId(null);
  };

  if (quests.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
        <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">No tasks found. Time to add some!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {quests.map((quest) => {
        const isExpanded = expandedTasks.has(quest.questID);
        const hasDetails = quest.questDetails && quest.questDetails.trim().length > 0;
        const isEditing = editingTaskId === quest.questID;
        const isMenuOpen = openMenuId === quest.questID;

        if (isEditing) {
          return (
            <div key={`edit-${quest.questID}`} className="bg-white rounded-xl border-2 border-blue-400 shadow-md p-4 flex flex-col gap-3 animate-in fade-in duration-200 z-20 relative">
              <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} className="text-lg font-bold bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-500" placeholder="Quest Title" autoFocus />
              <textarea value={editDetails} onChange={e => setEditDetails(e.target.value)} className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-500 resize-none min-h-[60px]" placeholder="Quest Details (Optional)" />
              
              <div className="flex flex-wrap gap-2">
                <select value={editPriority} onChange={e => setEditPriority(e.target.value as any)} className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 outline-none">
                  <option value="Low">Low Priority</option><option value="Medium">Medium Priority</option><option value="High">High Priority</option>
                </select>
                <input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 outline-none" />
                <input type="time" value={editTime} onChange={e => setEditTime(e.target.value)} disabled={!editDate} className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 outline-none disabled:opacity-50" />
              </div>

              <div className="flex justify-end gap-2 mt-2 pt-3 border-t border-gray-100">
                <button onClick={() => setEditingTaskId(null)} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                <button onClick={() => handleSaveEdit(quest.questID)} className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5">
                  <Save className="w-4 h-4" /> Save
                </button>
              </div>
            </div>
          );
        }

        return (
          <div key={quest.questID} className={`bg-white rounded-xl border border-gray-200 shadow-sm transition-all hover:border-gray-300 relative group ${isMenuOpen ? 'z-50' : 'z-10'}`}>
            
            <div className="p-4 flex items-center justify-between gap-4 cursor-pointer" onClick={() => hasDetails && toggleExpand(quest.questID)}>
              <div className="flex items-center gap-4 flex-1">
                <button 
                  onClick={(e) => { e.stopPropagation(); onStatusChange(quest.questID, quest.status === 'Complete' ? 'Pending' : 'Complete'); }}
                  className="flex-shrink-0 transition-transform hover:scale-110 active:scale-95"
                >
                  {quest.status === 'Complete' ? <CheckCircle2 className="w-6 h-6 text-green-500" /> : 
                   quest.status === 'In-Progress' ? <CircleDot className="w-6 h-6 text-blue-500 hover:text-green-500" /> : 
                   <Circle className="w-6 h-6 text-gray-300 hover:text-green-500" />}
                </button>
                
                <div className="flex flex-col">
                  <span className={`font-semibold text-base transition-colors ${quest.status === 'Complete' ? 'line-through text-gray-400' : 'text-gray-900'}`}>{quest.questName}</span>
                  {quest.dueDate && (
                    <span className="text-xs text-gray-500 flex items-center gap-1.5 mt-1 font-medium"><Clock className="w-3.5 h-3.5" /> {formatDateTime(quest.dueDate)}</span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2 md:gap-3 flex-shrink-0">
                {quest.status !== 'Complete' && (
                  <button onClick={(e) => { e.stopPropagation(); onStatusChange(quest.questID, quest.status === 'In-Progress' ? 'Pending' : 'In-Progress'); }}
                    className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-md transition-all ${quest.status === 'In-Progress' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-gray-50 text-gray-500 hover:bg-blue-50 hover:text-blue-600 border border-transparent'}`}>
                    {quest.status === 'In-Progress' ? <CircleDot className="w-3.5 h-3.5 animate-pulse" /> : <PlayCircle className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{quest.status === 'In-Progress' ? 'Working' : 'Start'}</span>
                  </button>
                )}

                <div className="hidden md:flex items-center gap-2">
                  <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-md ${quest.priority === 'High' ? 'bg-red-50 text-red-600' : quest.priority === 'Medium' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                    <AlertCircle className="w-3 h-3" /> {quest.priority}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-600 border border-indigo-100">+{quest.XP} XP</span>
                </div>

                {hasDetails && (
                  <button onClick={(e) => { e.stopPropagation(); toggleExpand(quest.questID); }} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-md transition-colors">
                    <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                )}

                {isOwner && (
                  <div className="relative" ref={isMenuOpen ? menuRef : null}>
                    <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(isMenuOpen ? null : quest.questID); }} className="p-1.5 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors ml-1">
                      <MoreVertical className="w-5 h-5" />
                    </button>

                    {isMenuOpen && (
                      <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-xl border border-gray-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                        <button onClick={(e) => { e.stopPropagation(); startEditing(quest); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors text-left font-medium">
                          <Edit2 className="w-4 h-4" /> Edit Quest
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); onDelete(quest.questID); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left font-medium mt-0.5 border-t border-gray-50 pt-2">
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>

            {isExpanded && hasDetails && (
              <div className="px-14 pb-5 pt-1 bg-gray-50/50 border-t border-gray-100 animate-in slide-in-from-top-2 fade-in duration-200">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Quest Details</h4>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{quest.questDetails}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}