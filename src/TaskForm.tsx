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
        if (!title.trim()) return; // require title

        setIsSubmitting(true);

        // get secure user id from auth
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setIsSubmitting(false);
            return;
        }

        let finalDueDate = null;
        if (date) {
            // If no time is selected, default to 11:59 PM
            const timeString = time || "23:59";
            finalDueDate = `${date} at ${timeString}`;
        }

        // insert task to supabase
        const { data, error } = await supabase
            .from('Quests')
            .insert([
                {
                    user_id: user.id,
                    projectID: activeProject,
                    questName: title.trim(),
                    questDetails: description.trim() || null,
                    status: 'Pending',
                    priority: priority,
                    XP: 50,
                    dueDate: finalDueDate
                }
            ])
            .select();

        if (error) {
            console.error("Error adding taks: ", error.message);
        } else if (data) {
            // sends new task to home to update UI
            onAddTask(data[0] as Quest);

            // reset form
            setTitle('');
            setDescription('');
            setPriority('Medium');
            setDate('');
            setTime('');
        }

        setIsSubmitting(false);
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8 ">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                {/* title input */}
                <input
                    type="text"
                    placeholder="What needs to be done?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-gray-200/70 text-gray-900 placeholder-gray-500 rounded-lg px-4 py-2.5 focus:outline-none focus:rin-2 focus:ring-blue-500 transition-all"
                    required
                />

                {/* description input */}
                <input
                    type="text"
                    placeholder="Quest description (optional)..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-gray-200/70 text-gray-900 placeholder-gray-500 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />

                {/* bottom row controls */}
                <div className="flex flex-wrap items-center justify-between gap-4 mt-2 pt-4 border-t border-gray-50">
                    <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                        <AlertCircle className="w-5 h-5 text-gray-400" />
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as any)}
                                className="bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer"
                            >
                                <option value="Low">Low Priority</option>
                                <option value="Medium">Medium Priority</option>
                                <option value="High">High Priority</option>
                            </select>
                        </div>

                        {/* date picker */}
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition all">
                            <CalendarIcon className={`w-5 h-5 ${date ? 'text-blue-500' : 'text-gray-400'}`} />
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer"
                            />
                        </div>

                        {/* time picker only enabled if a date is selected */}
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${date ? 'bg-gray-50 border-gray-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500' : 'bg-gray-50/50 border-transparent opacity-50'
                            }`}>
                            <Clock className={`w-5 h-5 ${time ? 'text-blue-500' : 'text-gray-400'}`} />
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                disabled={!date}
                                className="bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer disabled:cursor-not-allowed"
                            />
                        </div>
                    </div>

                    {/* submit button */}
                    <button
                        type="submit"
                        className="flex items-center bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg transition-colors font-medium text-sm"
                        disabled={!title.trim() || isSubmitting}
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        {isSubmitting ? 'Adding...' : 'Add Task'}
                    </button>
                </div>
            </form>
        </div>
    )
}
