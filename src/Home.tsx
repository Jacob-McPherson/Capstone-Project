import { useState } from "react";
import { useEffect } from "react";
import { supabase } from "./lib/supabase";
import MinimalCalendar from "./MinimalCalendar";
import TaskList from "./TaskList";
import TaskForm from "./TaskForm";

export interface Quest {

  questID: number;
  questName: string;
  questDetails: string;
  status: 'Pending' | 'In-Progress' | 'Complete';
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string | null; // format : YYYY-MM-DD
  XP: number;

}

export default function Home() {

  const [activeTab, setActiveTab] = useState<'All Tasks' | 'Pending' | 'In-Progress' | 'Complete'>('All Tasks');
  
  const [quests, setQuests] = useState<Quest[]>([]);

  // Fetch quests from Supabase on page / component load
  useEffect(() => {
    const fetchMyQuests = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if(!user) return; // not logged in

      const { data, error } = await supabase
        .from('Quests')
        .select('*')
        .eq('user_id', user.id)
        .order('questID', {ascending: false });

        if (data) { setQuests(data)
        } else if (error) {
          console.error("Error fetching quests: ", error.message);
        }
    };
    fetchMyQuests();
  }, []);

  // creation handler: add new task screen
  const handleAddTask = (newQuest: Quest) => {
    setQuests([newQuest, ...quests]);
  };

  // update handler: change status of task in database and update database
  const handleStatusChange = async (id: number, newStatus: Quest['status']) => {
    setQuests(quests.map(q => q.questID === id ? { ...q, status: newStatus } : q));
    await supabase.from('Quests').update({ status: newStatus }).eq('questID', id);
    console.log(`Updated quest ${id} to status ${newStatus}`);
  };

  // deletion handler
  const handleDelete = async (id: number) => {
    setQuests(quests.filter(q => q.questID !== id));
    await supabase.from('Quests').delete().eq('questID', id);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-black">
      {/* Top Nav Bar */}
      <nav className="w-full bg-white border-b border-gray-200 px-6 py-3 flex items-center">
        {/* logo and title */}
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 bg-blue-600 rounded-md overflow-hidden flex items-end justify-end p-1">
            <div className="w-full h-full border-b-2 border-r-2 border-white absolute bottom-0.5 right-0.5"></div>
            <div className="w-full h-[1.5px] bg-white absolute top-1/2 left-0"></div>
            <div className="w-[1.5px] h-full bg-white absolute top-0 right-1/4"></div>
          </div>
          <span className="text-lg font-bold tracking-tight">Blueprint</span>
        </div>
      </nav>

      {/* main content area */}
      <main className="p-8 md:p-12 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {/* Top section: for task form */}
          <TaskForm onAddTask={handleAddTask} />

          <div className="flex justify-betweem items-center mb-6 mt-2">
            <h2 className="text-xl font-bold">Your Quests</h2>
            <span className="text-sm font-semibold text-blue-600 bg0blue-50 px-3 py-1">Level 1 Student</span>
          </div>

          <div className="bg-gray-200 p-1 rounded-full flex items-center justify-between mb-6">
            {['All Tasks', 'Pending', 'In-Progress', 'Complete'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 text-center py-2 text-sm font-medium rounded-full transition all ${
                  activeTab === tab ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <TaskList 
              quests={quests.filter(q => {
                if (activeTab === 'All Tasks') return true;
                if (activeTab === 'Pending') return q.status === 'Pending';
                if (activeTab === 'In-Progress') return q.status === 'In-Progress';
                if (activeTab === 'Complete') return q.status === 'Complete';
                return true;
              })}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          </div>
          
        </div>

        {/* right column */}
        <div className="md:col-span-1">
          <MinimalCalendar quests={quests} />
        </div>
      </main>
    </div>
  );
}