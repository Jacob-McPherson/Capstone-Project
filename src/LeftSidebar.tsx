import { LayoutDashboard, Calendar, Plus, Folder, User, Trash2, Settings } from 'lucide-react';
import type { Project } from './Home';

interface LeftSidebarProps {
  currentView: 'dashboard' | 'calendar' | 'settings';
  setCurrentView: (view: 'dashboard' | 'calendar' | 'settings') => void;
  onOpenProfile: () => void;
  projects: Project[];
  activeProject: number | null;
  setActiveProject: (id: number | null) => void;
  onCreateProject: () => void;
  onDeleteProject: (id: number, name: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

export default function LeftSidebar({ 
  currentView, setCurrentView, onOpenProfile, 
  projects, activeProject, setActiveProject, 
  onCreateProject, onDeleteProject,
  isMobileMenuOpen, setIsMobileMenuOpen
}: LeftSidebarProps) {
  
  // Helper function to close the mobile menu when a user taps any link
  const handleNavigation = (action: () => void) => {
    action();
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop (Darkens the screen behind the menu) */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* The Sidebar Container */}
      <div className={`w-64 bg-white border-r border-gray-200 h-screen flex flex-col fixed left-0 top-0 z-50 transform transition-transform duration-300 md:translate-x-0 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Top: Logo & Title */}
        <div className="p-6 flex items-center gap-3 border-b border-gray-100">
          <svg className="w-8 h-8 flex-shrink-0" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" fill="#2563EB" />
            <path d="M10 0V32" stroke="white" strokeWidth="2" />
            <path d="M0 22H32" stroke="white" strokeWidth="2" />
            <rect x="15" y="8" width="11" height="9" stroke="white" strokeWidth="2" rx="1" />
          </svg>
          <span className="text-xl font-bold tracking-tight text-gray-900">Blueprint</span>
        </div>

        {/* Middle: Navigation Links */}
        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-8">
          
          {/* Global Views */}
          <div className="flex flex-col gap-1">
            <button 
              onClick={() => handleNavigation(() => setCurrentView('dashboard'))}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>
            <button 
              onClick={() => handleNavigation(() => setCurrentView('calendar'))}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'calendar' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Calendar
            </button>
          </div>

          {/* Workspaces & Projects */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Projects</span>
              <button 
                onClick={() => handleNavigation(onCreateProject)}
                className="text-gray-400 hover:text-blue-600 transition-colors p-1 hover:bg-blue-50 rounded"
                title="New Project"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            {/* Personal Quests Button */}
            <button 
              onClick={() => handleNavigation(() => {
                setActiveProject(null);
                setCurrentView('dashboard');
              })}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeProject === null && currentView === 'dashboard' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <User className={`w-4 h-4 ${activeProject === null && currentView === 'dashboard' ? 'text-blue-500' : 'text-gray-400'}`} />
              Personal Quests
            </button>
            
            {/* Map through Database Projects */}
            {projects.map((project) => (
              <div 
                key={project.projectID} 
                className={`group flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  activeProject === project.projectID && currentView === 'dashboard' ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
                onClick={() => handleNavigation(() => {
                  setActiveProject(project.projectID);
                  setCurrentView('dashboard');
                })}
              >
                
                <div className="flex items-center gap-3 overflow-hidden">
                  <Folder className={`w-4 h-4 flex-shrink-0 ${activeProject === project.projectID && currentView === 'dashboard' ? 'text-blue-500' : 'text-gray-400'}`} />
                  <span className={`text-sm font-medium truncate ${activeProject === project.projectID && currentView === 'dashboard' ? 'text-gray-900' : 'text-gray-600'}`}>
                    {project.projectTitle}
                  </span>
                </div>

                {/* trash can hover to delete */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); 
                    onDeleteProject(project.projectID, project.projectTitle);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all flex-shrink-0"
                  title="Delete Project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: Settings & Profile */}
        <div className="p-4 border-t border-gray-100 flex flex-col gap-2">
          
          {/* Settings Button */}
          <button 
            onClick={() => handleNavigation(() => {
              setCurrentView('settings');
              setActiveProject(null);
            })}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentView === 'settings' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>

          {/* Profile Trigger */}
          <div 
            onClick={() => handleNavigation(onOpenProfile)}
            className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-xl cursor-pointer transition-colors"
          >
            <div className="flex items-center -space-x-3">
              <div className="w-8 h-8 bg-orange-400 rounded-full border-2 border-white shadow-sm z-10"></div>
              <div className="w-8 h-8 bg-cyan-400 rounded-full border-2 border-white shadow-sm"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-900 leading-none mb-1">Your Profile</span>
              <span className="text-xs font-medium text-blue-600 leading-none">Level 1 Student</span>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}