import { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, Clock, AlertCircle, Folder, FileText } from 'lucide-react';
import { supabase } from './lib/supabase';
import type { Quest, Project } from './Home';

interface CalendarTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Quest) => void;
  activeProject: number | null;
  projects: Project[];
}

export default function CalendarTaskModal({ isOpen, onClose, onAddTask, activeProject, projects }: CalendarTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [priority, setPriority] = useState<Quest['priority']>('Medium');
  const [selectedProject, setSelectedProject] = useState<string>('personal');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedProject(activeProject ? activeProject.toString() : 'personal');
    }
  }, [isOpen, activeProject]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return; // no date requirement

    setIsSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setIsSubmitting(false); return; }

    // Only construct a date string if they actually picked a date
    let finalDueDate = null;
    if (date) {
      const timeString = time || "23:59";
      finalDueDate = `${date}T${timeString}:00`;
    }
    
    const finalProjectID = selectedProject === 'personal' ? null : parseInt(selectedProject);

    const { data, error } = await supabase
      .from('Quests')
      .insert([{
        user_id: user.id, 
        projectID: finalProjectID, 
        questName: title.trim(),
        questDetails: description.trim() || "", 
        status: 'Pending', 
        priority: priority, 
        XP: 50, 
        dueDate: finalDueDate
      }])
      .select();

    if (error) {
      console.error("Error adding task:", error.message);
    } else if (data) {
      onAddTask(data[0] as Quest);
      setTitle(''); setDescription(''); setDate(''); setTime(''); setPriority('Medium');
      onClose();
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      
      <div className="bg-[#1C1C1C] w-full max-w-2xl rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
        
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-full transition-colors z-10">
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 md:p-10 flex flex-col gap-6">
          
          <div>
            <h3 className="text-gray-400 font-medium mb-2 text-sm uppercase tracking-wider">New Quest</h3>
            <input
              type="text"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              className="w-full bg-transparent text-white placeholder-white/20 text-3xl md:text-4xl font-bold outline-none border-b border-white/10 focus:border-white/30 pb-3 transition-colors"
            />
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/5 focus-within:border-white/20 transition-colors">
            <div className="flex items-center gap-2 mb-2 text-gray-400">
              <FileText className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Details</span>
            </div>
            <textarea
              placeholder="Add quest details, links, or notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-transparent text-gray-300 placeholder-gray-600 text-sm outline-none resize-none min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="flex items-center gap-3 bg-white/5 px-4 py-3.5 rounded-xl border border-white/5 focus-within:border-white/20 transition-colors">
              <Folder className="w-5 h-5 text-blue-400" />
              <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)} className="bg-transparent text-white outline-none w-full cursor-pointer appearance-none text-sm font-medium">
                <option value="personal" className="bg-[#2A2A2A]">Personal Quests</option>
                {projects.map(p => (
                  <option key={p.projectID} value={p.projectID} className="bg-[#2A2A2A]">
                    {p.projectTitle}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 bg-white/5 px-4 py-3.5 rounded-xl border border-white/5 focus-within:border-white/20 transition-colors">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              <select value={priority} onChange={(e) => setPriority(e.target.value as any)} className="bg-transparent text-white outline-none w-full cursor-pointer appearance-none text-sm font-medium">
                <option value="Low" className="bg-[#2A2A2A]">Low Priority</option>
                <option value="Medium" className="bg-[#2A2A2A]">Medium Priority</option>
                <option value="High" className="bg-[#2A2A2A]">High Priority</option>
              </select>
            </div>

            <div className="flex items-center gap-3 bg-white/5 px-4 py-3.5 rounded-xl border border-white/5 focus-within:border-white/20 transition-colors">
              <CalendarIcon className="w-5 h-5 text-emerald-400" />
              {/* FIX: Removed the 'required' attribute */}
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-transparent text-white outline-none w-full cursor-pointer color-scheme-dark text-sm font-medium" />
            </div>

            <div className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-colors ${date ? 'bg-white/5 border-white/5 focus-within:border-white/20' : 'bg-white/5 border-transparent opacity-40'}`}>
              <Clock className="w-5 h-5 text-purple-400" />
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} disabled={!date} className="bg-transparent text-white outline-none w-full cursor-pointer color-scheme-dark text-sm font-medium disabled:cursor-not-allowed" />
            </div>

          </div>

          <button 
            onClick={handleSubmit} 
            disabled={!title.trim() || isSubmitting}
            className="w-full mt-4 bg-white text-black hover:bg-gray-200 py-4 rounded-xl text-base font-bold transition-transform active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2 shadow-lg"
          >
            {isSubmitting ? 'Creating Quest...' : 'Create Quest'}
          </button>

        </div>
      </div>
    </div>
  );
}