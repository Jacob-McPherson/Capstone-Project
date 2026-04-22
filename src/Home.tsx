import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import MinimalCalendar from "./MinimalCalendar";
import TaskList from "./TaskList";
import TaskForm from "./TaskForm";
import ProfileSidebar from "./ProfileSidebar";
import LeftSidebar from "./LeftSidebar";
import Archive from "./Archive";
import CreateProjectModal from "./CreateProjectModal";
import Settings from "./Settings";
import { Menu } from "lucide-react";

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

  // profile and modal popup state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);


  // navbar state
  const [currentView, setCurrentView] = useState<'dashboard' | 'calendar' | 'settings'>('dashboard');

  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<number | null>(null); // null makes dashboard set to personal quests
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
  const handleCreateProject = async (title: string) => {

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

  const handleDeleteProject = async (projectID: number, projectName: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you wish to delete "${projectName}"? This will also delete all quests within this project and cannot be undone.`);
    if (!confirmDelete) return;

    const { error } = await supabase
      .from('Projects')
      .delete()
      .eq('projectID', projectID);

    if (error) {
      console.error("Error deleting project:", error.message);
    } else {
      setProjects(projects.filter(p => p.projectID !== projectID));

      if (activeProject === projectID) {
        setActiveProject(null);
      }
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
        onCreateProject={() => setIsCreateProjectModalOpen(true)}
        onDeleteProject={handleDeleteProject}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* main content area */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-2">
            <svg className="w-7 h-7 flex-shrink-0" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="#2563EB" />
              <path d="M10 0V32" stroke="white" strokeWidth="2" />
              <path d="M0 22H32" stroke="white" strokeWidth="2" />
              <rect x="15" y="8" width="11" height="9" stroke="white" strokeWidth="2" rx="1" />
            </svg>
            <span className="text-lg font-bold text-gray-900">Blueprint</span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 ml-64 flex flex-col min-h-screen">

          {currentView === 'settings' && <Settings />}

          {currentView === 'dashboard' && (
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
          )}

          {currentView === 'calendar' && (
            <main className="flex-1 p-8 md:p-12 w-full">
              {/* full calendar will go here */}
              <h1 className="text-3xl font-bold">Full Calendar View under construction!</h1>
            </main>
          )}
        </div>
      </div>

      {/* profile sidebar overlay */}
      <ProfileSidebar
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      {/* create project modal */}
      <CreateProjectModal
        isOpen={isCreateProjectModalOpen}
        onClose={() => setIsCreateProjectModalOpen(false)}
        onCreate={handleCreateProject}
        existingProjects={projects}
      />
    </div>

  );
}
