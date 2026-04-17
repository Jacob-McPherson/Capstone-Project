import { useState } from 'react';
import { Plus } from 'lucide-react';
import { supabase } from './lib/supabase';
import type { Quest } from './Home';

interface TaskFormProps {
    onAddTask: (task: Quest) => void;
}

export default function TaskForm({ onAddTask }: TaskFormProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<Quest['priority']>('Medium');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!title.trim()) return; // require title

        // get secure user id from auth
        const { data: { user } } = await supabase.auth.getUser();
        if(!user) {
            alert('You must be logged in to add a task. ');
            return;
        }

        // insert task to supabase
        const { data, error } = await supabase
            .from('Quests')
            .insert([
                {
                    user_id: user.id,
                    questName: title.trim(),
                    questDetails: description.trim() || null,
                    status: 'todo',
                    priority: priority,
                    XP: 50, // defautl value can be changed later
                    dueDate: null // default for untimed tasks
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
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8 w-full">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input 
                    type="text"
                    placeholder="Task"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-gray-200/70 text-gray-900 placeholder-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:rin-2 focus:ring-blue-500 transition-all"
                />
                <input
                    type="text"
                    placeholder="Description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-gray-200/70 text-gray-900 placeholder-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <div className="flex items-center justify-between mt-1">
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as Quest['priority'])}
                        className="bg-gray-200/70 text-gray-800 rounded-lg px-4 py-2 focus:outline-none cursor-pointer"
                    >
                        <option value="Low">Importance: Low</option>
                        <option value="Medium">Importance: Medium</option>
                        <option value="High">Importance: High</option>
                    </select>
                    <button type="submit" className="flex items-center bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg transition-colors font-medium text-sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Task
                    </button>
                </div>
            </form>
        </div>
    )
}