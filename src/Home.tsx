import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { Menu, UserPlus } from "lucide-react";

// Components
import MinimalCalendar from "./MinimalCalendar";
import FullCalendar from "./FullCalendar"; // <-- Added Full Calendar
import TaskList from "./TaskList";
import TaskForm from "./TaskForm";
import ProfileSidebar from "./ProfileSidebar";
import LeftSidebar from "./LeftSidebar";
import CreateProjectModal from "./CreateProjectModal";
import Settings from "./Settings";
import InviteModal from "./InviteModal";

export interface Project { projectID: number; projectTitle: string; }
export interface Quest {
  questID: number; questName: string; questDetails: string;
  status: 'Pending' | 'In-Progress' | 'Complete';
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string | null; XP: number; projectID: number | null;
}

export default function Home() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'calendar' | 'settings'>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'All Tasks' | 'Pending' | 'In-Progress' | 'Complete'>('All Tasks');
  const [quests, setQuests] = useState<Quest[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: questData } = await supabase.from('Quests').select('*').order('questID', { ascending: false });
      if (questData) setQuests(questData);
      const { data: projectData } = await supabase.from('Projects').select('projectID, projectTitle').order('projectID', { ascending: true });
      if (projectData) setProjects(projectData);
    };
    fetchData();
  }, []);

  const handleCreateProject = async (title: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data, error } = await supabase.from('Projects').insert([{ user_id: user.id, projectTitle: title }]).select();
    if (error) console.error("Error creating project:", error.message);
    else if (data) { setProjects([...projects, data[0]]); setActiveProject(data[0].projectID); }
  };

  const handleDeleteProject = async (projectID: number, projectName: string) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${projectName}"?`);
    if (!confirmDelete) return;
    const { error } = await supabase.from('Projects').delete().eq('projectID', projectID);
    if (!error) {
      setProjects(projects.filter(p => p.projectID !== projectID));
      if (activeProject === projectID) setActiveProject(null);
    }
  };

  const handleAddTask = (newQuest: Quest) => setQuests([newQuest, ...quests]);

  const handleStatusChange = async (id: number, newStatus: Quest['status']) => {
    setQuests(quests.map(q => q.questID === id ? { ...q, status: newStatus } : q));
    await supabase.from('Quests').update({ status: newStatus }).eq('questID', id);
  };

  const handleDelete = async (id: number) => {
    setQuests(quests.filter(q => q.questID !== id));
    await supabase.from('Quests').delete().eq('questID', id);
  };

  const displayedQuests = quests.filter(q => q.projectID === activeProject);
  const currentWorkspaceName = activeProject === null ? "Personal Quests" : projects.find(p => p.projectID === activeProject)?.projectTitle || "Project";

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-black flex">
      <LeftSidebar currentView={currentView} setCurrentView={setCurrentView} onOpenProfile={() => setIsProfileOpen(true)} projects={projects} activeProject={activeProject} setActiveProject={setActiveProject} onCreateProject={() => setIsCreateProjectOpen(true)} onDeleteProject={handleDeleteProject} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

      <div className="flex-1 md:ml-64 flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-2">
            <svg className="w-8 h-8 flex-shrink-0" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="#2563EB" />
              <path d="M23 3.5V30" stroke="white" strokeWidth="2" />
              <path d="M4 25H29.75" stroke="white" strokeWidth="2" />
            </svg>
            <span className="text-lg font-bold text-gray-900">Blueprint</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"><Menu className="w-6 h-6" /></button>
        </div>

        {currentView === 'settings' && <Settings />}

        {currentView === 'calendar' && (
          <main className="flex-1 w-full h-screen p-2 md:p-4 lg:p-6 bg-gray-50">
            <FullCalendar quests={quests} />
          </main>
        )}

        {currentView === 'dashboard' && (
          <main className="flex-1 p-4 md:p-12 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <TaskForm onAddTask={handleAddTask} activeProject={activeProject} />
              <div className="flex justify-between items-center mb-6 mt-2">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-bold">{currentWorkspaceName}</h2>
                  {activeProject !== null && (
                    <button onClick={() => setIsInviteModalOpen(true)} className="flex items-center gap-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
                      <UserPlus className="w-4 h-4" /> Invite
                    </button>
                  )}
                </div>
                <span className="hidden sm:inline-block text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-md">Level 1 Student</span>
              </div>
              <div className="bg-gray-200 p-1 rounded-full flex items-center justify-between mb-6 overflow-x-auto hide-scrollbar">
                {['All Tasks', 'Pending', 'In-Progress', 'Complete'].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab as any)} className={`flex-1 min-w-[90px] text-center py-2 text-sm font-medium rounded-full transition-all ${activeTab === tab ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-800'}`}>
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
            </div>
            
            {/* STICKY CALENDAR FIX & UNHIDDEN ON MOBILE */}
            <div className="lg:col-span-1 w-full flex justify-center lg:justify-end mt-8 lg:mt-0 h-fit sticky top-24 pb-8">
              <MinimalCalendar quests={displayedQuests} />
            </div>
          </main>
        )}
      </div>

      <ProfileSidebar isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} activeProject={activeProject} />
      <CreateProjectModal isOpen={isCreateProjectOpen} onClose={() => setIsCreateProjectOpen(false)} onCreate={handleCreateProject} existingProjects={projects} />
      <InviteModal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} activeProjectID={activeProject} />
    </div>
  );
}