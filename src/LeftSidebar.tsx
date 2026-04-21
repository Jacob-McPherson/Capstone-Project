import { LayoutDashboard, Calendar, Plus, Folder, User } from "lucide-react"
import type { Project } from "./Home";

interface LeftSidebarProps {
    currentView: 'dashboard' | 'calendar';
    setCurrentView: (view: 'dashboard' | 'calendar') => void;
    onOpenProfile: () => void;
    projects: Project[];
    activeProject: number | null;
    setActiveProject: (id: number | null) => void;
    onCreateProject: () => void;
}

export default function LeftSidebar({
    currentView, setCurrentView, onOpenProfile,
    projects, activeProject, setActiveProject, onCreateProject
}: LeftSidebarProps) {
    return (
        <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col fixed left-0 top-0">
            {/* logo and title */}
            <div className="p-6 flex items-center gap-3 border-b border-gray-100">
                <svg className="w-10 h-10 flex-shrink-0" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="32" height="32" rx="8" fill="#2563EB" />
                    <path d="M23 3.5V30" stroke="white" strokeWidth="2" />
                    <path d="M4 25H29.75" stroke="white" strokeWidth="2" />
                </svg>
                <span className="text-xl font-bold tracking-tight text-gray-900">Blueprint</span>
            </div>

            {/* middle: navigation links */}
            <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-8">
                <div className="flex flex-col gap-1">
                    <button
                        onClick={() => setCurrentView('dashboard')}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentView === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100 '
                            }`}
                    >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                    </button>
                    <button
                        onClick={() => setCurrentView('calendar')}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            currentView === 'calendar' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <Calendar className="w-4 h-4" />
                        Calendar
                    </button>
                </div>

                {/* workspaces and projects*/}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between px-3 mb-2">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Projects</span>
                        <button
                            onClick={onCreateProject}
                            className="text-gray-400 hover:text-blue-600 transition-colors p-1 hover:bg-blue-50 rounded"
                            title="New Project"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    <button
                        onClick={()=> setActiveProject(null)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            activeProject === null ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <User className={`w-4 h-4 ${
                            activeProject === null ? 'text-gray-900' : 'text-gray-400'
                        }`} />
                        Personal Quests
                    </button>
                    
                    {/* map through database projects */}
                    {projects.map((project) => (
                        <button
                            key={project.projectID}
                            onClick={() => setActiveProject(project.projectID)}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeProject === project.projectID ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
              }`}
              >
                <Folder className={`w-4 h-4 ${activeProject === project.projectID ? 'text-blue-500' : 'text-gray-400'}`} />
              {project.projectTitle}
              </button>
                    ))}
                </div>
            </div>

            {/* bottom profile and gameification hub trigger */}
            <div className="p-4 border-t border-gray-100">
                <div
                    onClick={onOpenProfile}
                    className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-xl cursor-pointer transition-colors"
                >
                    {/* profile avatar */}
                    <div className="flex items-center -space-x-3">
                        <div className="w-8 h-8 bg-orange-400 rounded-full border-2 border-white shadow-sm z-10"></div>
                        <div className="w-8 h-8 bg-cyan-400 rounded-full border-2 border-white shadow-sm"></div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">Your Profile</span>
                        <span className="text-xs font-medium text-gray-500">Level 1 Student</span>
                    </div>
                </div>
            </div>

        </div>
    );
}