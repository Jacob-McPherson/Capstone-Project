import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import MinimalCalendar from "./MinimalCalendar";
import TaskList from "./TaskList";
import TaskForm from "./TaskForm";
import ProfileSidebar from "./ProfileSidebar";
import LeftSidebar from "./LeftSidebar";
import Archive from "./Archive";

export interface Project {

  projectID: number;
  projectTitle: string;
}

export interface Quest {

  questID: number;
  questName: string;
  questDetails: string;
  status: 'Pending' | 'In-Progress' | 'Complete';
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string | null; // format : YYYY-MM-DD
  XP: number;
  projectID: number | null; // null for personal quests

}

export default function Home() {

  //tab state
  const [activeTab, setActiveTab] = useState<'All Tasks' | 'Pending' | 'In-Progress' | 'Complete'>('All Tasks');

  // database state
  const [quests, setQuests] = useState<Quest[]>([]);

  // profile popup state
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // navbar state
  const [currentView, setCurrentView] = useState<'dashboard' | 'calendar'>('dashboard');

  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<number | null>(null); // null makes dashboard set to personal quests

  // Fetch data from Supabase on page / component load
  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return; // not logged in

      const { data: questData } = await supabase
        .from('Quests')
        .select('*')
        .eq('user_id', user.id)
        .order('questID', { ascending: false });

      if (questData) setQuests(questData);

      // fetch projects
      const { data: projectData } = await supabase
        .from('Projects')
        .select('projectID, projectTitle')
        .eq('user_id', user.id)
        .order('projectID', { ascending: true });
      if (projectData) setProjects(projectData);
    };
    fetchData();
  }, []);

  // handler to create project
  const handleCreateProject = async () => {
    const title = window.prompt("Enter new project name:");
    if (!title || !title.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('Projects')
      .insert([{ user_id: user.id, projectTitle: title.trim() }])
      .select();

    if (error) {
      console.error("Error creating project:", error.message);
    } else if (data) {
      setProjects([...projects, data[0]]);
      setActiveProject(data[0].projectID);
    }
  };

  // creation handler: add new task screen
  const handleAddTask = (newQuest: Quest) => {
    setQuests([newQuest, ...quests]);
  };

  // update handler: change status of task in database and update database
  const handleStatusChange = async (id: number, newStatus: Quest['status']) => {
    setQuests(quests.map(q => q.questID === id ? { ...q, status: newStatus } : q));
    await supabase.from('Quests').update({ status: newStatus }).eq('questID', id);
  };

  // deletion handler
  const handleDelete = async (id: number) => {
    setQuests(quests.filter(q => q.questID !== id));
    await supabase.from('Quests').delete().eq('questID', id);
  };

  const displayedQuests = quests.filter(q => q.projectID === activeProject);

  const currentWorkspaceName = activeProject === null
    ? "Personal Quests"
    : projects.find(p => p.projectID === activeProject)?.projectTitle || "Project";

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-black flex">
      {/* Left Sidebar */}
      <LeftSidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenProfile={() => setIsProfileOpen(true)}
        projects={projects}
        activeProject={activeProject}
        setActiveProject={setActiveProject}
        onCreateProject={handleCreateProject}
      />

      {/* main content area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <main className="flex-1 p-8 md:p-12 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {/* Top section: for task form */}
            <TaskForm onAddTask={handleAddTask}
              activeProject={activeProject}
            />

            <div className="flex justify-betweem items-center mb-6 mt-2">
              <h2 className="text-xl font-bold">{currentWorkspaceName}</h2>
              <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1">Level 1 Student</span>
            </div>

            <div className="bg-gray-200 p-1 rounded-full flex items-center justify-between mb-6">
              {['All Tasks', 'Pending', 'In-Progress', 'Complete'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`flex-1 text-center py-2 text-sm font-medium rounded-full transition all ${activeTab === tab ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-800'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <TaskList
                quests={displayedQuests.filter(q => {
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
            <div className="mt-12">
              <h2 className="text-xl font-bold mb-4">Archived Quests</h2>
              <Archive quests={quests.filter(q => q.status === 'Complete')} /> // temp placement
            </div>
          </div>

          {/* right column */}
          <div className="md:col-span-1">
            <MinimalCalendar quests={displayedQuests} />
          </div>
        </main>
      </div>

      {/* profile sidebar overlay */}
      <ProfileSidebar
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

    </div>

  );
}
