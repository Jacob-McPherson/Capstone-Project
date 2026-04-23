import { useState } from 'react';
import { Plus, Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import { supabase } from './lib/supabase';
import type { Quest } from './Home';

interface TaskFormProps {
    onAddTask: (task: Quest) => void;
    activeProject: number | null;
}

export default function TaskForm({ onAddTask, activeProject }: TaskFormProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<Quest['priority']>('Medium');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!title.trim()) return;

        setIsSubmitting(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setIsSubmitting(false); return; }

        let finalDueDate = null;
        if (date) {
            const timeString = time || "23:59";
            finalDueDate = `${date}T${timeString}:00`;
        }

        const { data, error } = await supabase
            .from('Quests')
            .insert([{
                user_id: user.id, 
                projectID: activeProject, 
                questName: title.trim(),
                questDetails: description.trim() || "", 
                status: 'Pending',
                priority: priority, 
                XP: 50, 
                dueDate: finalDueDate
            }])
            .select();

        if (error) console.error("Error adding task: ", error.message);
        else if (data) {
            onAddTask(data[0] as Quest);
            setTitle(''); setDescription(''); setPriority('Medium'); setDate(''); setTime('');
        }
        setIsSubmitting(false);
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8 ">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="What needs to be done?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-gray-100 text-gray-900 placeholder-gray-500 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    required
                />
                <input
                    type="text"
                    placeholder="Quest description (optional)..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-gray-100 text-gray-900 placeholder-gray-500 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />

                <div className="flex flex-wrap items-center justify-between gap-4 mt-2 pt-4 border-t border-gray-50">
                    <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto flex-1">
                        
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 sm:py-1.5 rounded-lg border border-gray-200 w-full sm:w-auto min-w-[140px]">
                            <AlertCircle className="w-5 h-5 flex-shrink-0 text-gray-400" />
                            <select value={priority} onChange={(e) => setPriority(e.target.value as any)} className="bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer w-full">
                                <option value="Low">Low Priority</option>
                                <option value="Medium">Medium Priority</option>
                                <option value="High">High Priority</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 sm:py-1.5 rounded-lg border border-gray-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all w-full sm:w-auto">
                            <CalendarIcon className={`w-5 h-5 flex-shrink-0 ${date ? 'text-blue-500' : 'text-gray-400'}`} />
                            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer w-full" />
                        </div>

                        <div className={`flex items-center gap-2 px-3 py-2 sm:py-1.5 rounded-lg border transition-all w-full sm:w-auto ${date ? 'bg-gray-50 border-gray-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500' : 'bg-gray-50/50 border-transparent opacity-50'}`}>
                            <Clock className={`w-5 h-5 flex-shrink-0 ${time ? 'text-blue-500' : 'text-gray-400'}`} />
                            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} disabled={!date} className="bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer disabled:cursor-not-allowed w-full" />
                        </div>
                    </div>

                    <button type="submit" className="flex items-center justify-center bg-black hover:bg-gray-800 text-white px-5 py-3 sm:py-2.5 rounded-lg transition-colors font-medium text-sm w-full sm:w-auto flex-shrink-0 mt-2 sm:mt-0" disabled={!title.trim() || isSubmitting}>
                        <Plus className="w-5 h-5 mr-2 flex-shrink-0" />
                        {isSubmitting ? 'Adding...' : 'Add Task'}
                    </button>
                </div>
            </form>
        </div>
    )
}