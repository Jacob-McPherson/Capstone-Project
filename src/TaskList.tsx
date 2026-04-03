import { Trash2, Clock, CheckCircle2, Circle } from "lucide-react";
import { useState } from "react";

//we need to define task or quest
export interface Task {
    id: string
    title: string;
    description?: string;
    status: 'todo' | 'in-progress' | 'done';
    priority: 'low' | 'medium' | 'high';
    createdAt: string;

}

// 2. main list component
export default function TaskList() {
    //some dummy data to test this out, NOTICE THIS BEFORE WORKING FURTHER TO INTEGRATE TO THE DATABASE THIS MAY LEAVE SOME STUFF OUT FROM THE ERD DIAGRAM
    const [tasks, setTasks] = useState<Task[]>([
        {
            id: '1',
            title: 'Finish React Project',
            description: 'Complete the task management app using React and Tailwind CSS.',
            status: 'in-progress',
            priority: 'high',
            createdAt: new Date().toISOString(),
        },
        {
            id: '2',
            title: 'Study for exams',
            status: 'todo',
            priority: 'medium',
            createdAt: new Date().toISOString(),
        },
    ]);

    // now logic to handle clicking the checkmark
    const handleStatuschange = (id: string, newStatus: Task['status']) => {
        setTasks(tasks.map(task => task.id === id ? { ...task, status: newStatus } : task));
    };

    // deleting tasks
    const handleDelete = (id: string) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    return (
        <div className="flex flex-col gap-4">
            {tasks.map(task => (
                <TaskItem
                    key={task.id}
                    task={task}
                    onStatusChange={handleStatuschange}
                    onDelete={handleDelete}
                    />
            ))}
        </div>
    );
}

// componenet for individual tasks item
function TaskItem({ task, onStatusChange, onDelete }: {
    task: Task;
    onStatusChange: (id: string, status: Task['status']) => void;
    onDelete: (id: string) => void;
}) {
    const priorityColors = {
        low: 'bg-blue-50 text0blue-700 border-blue-200',
        medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        high: 'bg-red-50 text-red-700 border-red-200',
    };

    const statusIcons = {
        todo: <Circle className="w-5 h-5 text-gray-400" />,
        'in-progress': <Clock className="w-5 h-5 text-yellow-600" />,
        done: <CheckCircle2 className="w-5 h-5 text-green-600" />,
    };

    const nextStatus = {
        todo: 'in-progress' as const,
        'in-progress': 'done' as const,
        done: 'todo' as const,
    };

    return (
        // now replacing card with tailwind div
        <div className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
                <button
                    onClick={() => onStatusChange(task.id, nextStatus[task.status])}
                    className="mt-1 hover:scale-110 transition-transofmr"
                    >
                    {statusIcons[task.status]}
                </button>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className={`font-medium ${task.status === 'done' ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                            {task.title}
                        </h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${priorityColors[task.priority]}`}>
                            {task.priority.toUpperCase()}
                        </span>
                    </div>
                    {task.description && (
                        <p className={`text-sm mb-2 ${task.status === 'done' ? 'line through text-gray-400' : 'text-gray-600'}`}>
                            {task.description}
                        </p>
                    )}
                    <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-gray-400">
                            {new Date(task.createdAt).toLocaleDateString()}
                        </span>
                        <button
                            onClick={() => onDelete(task.id)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}