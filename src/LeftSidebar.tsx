import { useState, useEffect } from 'react';
import { LayoutDashboard, Calendar, Settings, Plus, Folder, Trash2, X, Target } from 'lucide-react';
import { supabase } from './lib/supabase';
import { calculateLevel } from './lib/xpMath';
import { getActiveAvatar } from './lib/avatars';
import type { Project } from './Home';

interface LeftSidebarProps {
  currentView: 'dashboard' | 'calendar' | 'settings';
  setCurrentView: (view: 'dashboard' | 'calendar' | 'settings') => void;
  onOpenProfile: () => void;
  projects: Project[];
  activeProject: number | null;
  setActiveProject: (id: number | null) => void;
  onCreateProject: () => void;
  onDeleteProject: (id: number, title: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

export default function LeftSidebar({
  currentView, setCurrentView, onOpenProfile, projects, activeProject, setActiveProject,
  onCreateProject, onDeleteProject, isMobileMenuOpen, setIsMobileMenuOpen
}: LeftSidebarProps) {
  
  const [currentUser, setCurrentUser] = useState<{username: string, level: number, title: string} | null>(null);
  const [teamAvatars, setTeamAvatars] = useState<string[]>([]);

  useEffect(() => {
    const fetchSidebarData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase.from('Profiles').select('username, avatar_lineage').eq('id', user.id).maybeSingle();
      const { data: myQuests } = await supabase.from('Quests').select('XP').eq('user_id', user.id).eq('status', 'Complete');
      
      let myTotalXP = 0;
      if (myQuests) myTotalXP = myQuests.reduce((sum, q) => sum + (q.XP || 0), 0);

      const myStats = calculateLevel(myTotalXP);
      const myAvatar = getActiveAvatar(profile?.avatar_lineage || 'knight', myTotalXP);

      setCurrentUser({
        username: profile?.username || 'User',
        level: myStats.level,
        title: myStats.title
      });

      if (!activeProject) {
        setTeamAvatars([myAvatar.url]); 
        return;
      }

      const { data: projectData } = await supabase.from('Projects').select('user_id').eq('projectID', activeProject).maybeSingle();
      const { data: membersData } = await supabase.from('ProjectMembers').select('user_id').eq('project_id', activeProject);

      const userIds = new Set<string>();
      if (projectData?.user_id) userIds.add(projectData.user_id);
      if (membersData) membersData.forEach(m => userIds.add(m.user_id));
      userIds.add(user.id); 

      const idsArray = Array.from(userIds);
      
      const { data: teamProfiles } = await supabase.from('Profiles').select('id, avatar_lineage').in('id', idsArray);
      const { data: teamQuests } = await supabase.from('Quests').select('user_id, XP').in('user_id', idsArray).eq('status', 'Complete');

      const xpMap: Record<string, number> = {};
      if (teamQuests) {
        teamQuests.forEach(q => { xpMap[q.user_id] = (xpMap[q.user_id] || 0) + (q.XP || 0); });
      }

      let urls: string[] = [myAvatar.url];

      if (teamProfiles) {
        teamProfiles.forEach(p => {
          if (p.id !== user.id) {
            const pXp = xpMap[p.id] || 0;
            const pAvatar = getActiveAvatar(p.avatar_lineage || 'knight', pXp);
            urls.push(pAvatar.url);
          }
        });
      }
      setTeamAvatars(urls);
    };

    fetchSidebarData();
  }, [activeProject]);

  return (
    <>
      {isMobileMenuOpen && <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />}

      <aside className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 p-4 md:p-6 flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <svg className="w-8 h-8 flex-shrink-0" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="#2563EB" />
              <path d="M23 3.5V30" stroke="white" strokeWidth="2" />
              <path d="M4 25H29.75" stroke="white" strokeWidth="2" />
            </svg>
            <span className="text-xl font-bold text-gray-900 tracking-tight">Blueprint</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden p-2 text-gray-400 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-2 mb-8">
          <button onClick={() => { setCurrentView('dashboard'); setIsMobileMenuOpen(false); }} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-colors ${currentView === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </button>
          <button onClick={() => { setCurrentView('calendar'); setIsMobileMenuOpen(false); }} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-colors ${currentView === 'calendar' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Calendar className="w-5 h-5" /> Calendar
          </button>
        </nav>

        <div className="flex-1 overflow-y-auto hide-scrollbar">
          <div className="flex items-center justify-between mb-3 px-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Workspaces</h3>
            <button onClick={onCreateProject} className="p-1 hover:bg-gray-100 rounded-md text-gray-400 hover:text-gray-600 transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <button onClick={() => { setActiveProject(null); setIsMobileMenuOpen(false); }} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeProject === null ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}>
              <Target className="w-4 h-4" /> Personal Quests
            </button>
            
            {projects.map(project => (
              <div key={project.projectID} className={`group flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${activeProject === project.projectID ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}>
                <button onClick={() => { setActiveProject(project.projectID); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 text-sm font-medium flex-1 truncate text-left">
                  <Folder className={`w-4 h-4 flex-shrink-0 ${activeProject === project.projectID ? 'text-blue-500' : 'text-gray-400'}`} />
                  <span className="truncate">{project.projectTitle}</span>
                </button>
                <button onClick={() => onDeleteProject(project.projectID, project.projectTitle)} className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-100 flex flex-col gap-2">
          <button onClick={() => { setCurrentView('settings'); setIsMobileMenuOpen(false); }} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-colors ${currentView === 'settings' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Settings className="w-5 h-5" /> Settings
          </button>
          
          <button onClick={() => { onOpenProfile(); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl transition-colors text-left border border-transparent hover:border-gray-200 group">
            
            <div className="flex -space-x-3 rtl:space-x-reverse ml-1">
              {teamAvatars.length > 0 ? (
                <>
                  {teamAvatars.slice(0, 2).map((url, i) => (
                    <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-gray-100 overflow-hidden shadow-sm transition-transform group-hover:scale-105 ${i === 0 ? 'z-20' : 'z-10'}`}>
                      <img src={url} className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {teamAvatars.length > 2 && (
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 shadow-sm z-0">
                      +{teamAvatars.length - 2}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 animate-pulse shadow-sm"></div>
              )}
            </div>

            <div className="flex flex-col flex-1 truncate">
              {currentUser ? (
                <>
                  <span className="text-sm font-bold text-gray-900 leading-tight truncate">@{currentUser.username}</span>
                  <span className="text-xs font-semibold text-blue-600 truncate">Level {currentUser.level} {currentUser.title}</span>
                </>
              ) : (
                <>
                  <span className="text-sm font-bold text-gray-400 leading-tight truncate">Loading...</span>
                  <span className="text-xs font-semibold text-gray-300 truncate">Fetching stats</span>
                </>
              )}
            </div>
          </button>

        </div>
      </aside>
    </>
  );
}