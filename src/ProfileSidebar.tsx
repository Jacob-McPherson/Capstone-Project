import { useState, useEffect } from "react";
import { X, User, Users, Target, Trophy, UserMinus, Crown } from 'lucide-react';
import { supabase } from "./lib/supabase";
import { calculateLevel } from "./lib/xpMath";

interface ProfileSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    activeProject: number | null;
}

// NEW: We need to store the ID so we can delete them!
interface TeamMember {
    id: string;
    username: string;
    isOwner: boolean;
}

export default function ProfileSidebar({ isOpen, onClose, activeProject }: ProfileSidebarProps) {
    const [teammates, setTeammates] = useState<TeamMember[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState<string>('');
    const [isProjectOwner, setIsProjectOwner] = useState(false);
    
    const [userStats, setUserStats] = useState({
      level: 1, title: "Undergrad", currentXP: 0, nextLevelXP: 500, percentage: 0
    });

    useEffect(() => {
        const fetchProfileData = async () => {
            setIsLoading(true);

            const { data: { user } } = await supabase.auth.getUser()
            
            if (user) {
                const { data: profile } = await supabase.from('Profiles').select('username').eq('id', user.id).maybeSingle();
                if (profile?.username) setUsername(profile.username);

                const { data: completedQuests } = await supabase.from('Quests').select('XP').eq('user_id', user.id).eq('status', 'Complete');
                let totalXP = 0;
                if (completedQuests) {
                  totalXP = completedQuests.reduce((sum, quest) => sum + (quest.XP || 0), 0);
                }
                
                const stats = calculateLevel(totalXP);
                setUserStats({
                  level: stats.level, title: stats.title, currentXP: stats.currentXP, nextLevelXP: stats.nextLevelXP, percentage: stats.progressPercentage
                });
            }

            if (!activeProject) {
                setTeammates([]);
                setIsProjectOwner(false);
                setIsLoading(false);
                return; 
            }

            // get all ids
            const { data: projectData } = await supabase.from('Projects').select('user_id').eq('projectID', activeProject).maybeSingle();
            const { data: membersData } = await supabase.from('ProjectMembers').select('user_id').eq('project_id', activeProject);

            // Check if the current user is the owner
            if (projectData?.user_id && user?.id === projectData.user_id) {
                setIsProjectOwner(true);
            } else {
                setIsProjectOwner(false);
            }

            const allMembers: {id: string, isOwner: boolean}[] = [];
            if (projectData?.user_id) allMembers.push({id: projectData.user_id, isOwner: true});
            if (membersData) membersData.forEach(m => allMembers.push({id: m.user_id, isOwner: false}));

            if (allMembers.length > 0) {
                const { data: profiles } = await supabase.from('Profiles').select('id, username').in('id', allMembers.map(m => m.id));
                    
                if (profiles) {
                    // Map profiles to our new Object structure
                    const mappedTeammates = profiles.map(p => {
                        const match = allMembers.find(m => m.id === p.id);
                        return { id: p.id, username: p.username, isOwner: match?.isOwner || false };
                    }).sort((a, b) => {
                        if (a.isOwner) return -1; // Owner always at top
                        return a.username.localeCompare(b.username);
                    });
                    
                    setTeammates(mappedTeammates);
                }
            }
            setIsLoading(false);
        };

        if (isOpen) {
            fetchProfileData();
        }
    }, [isOpen, activeProject]);

    const handleRemoveMember = async (memberId: string, memberUsername: string) => {
        if (!activeProject) return;
        
        const confirm = window.confirm(`Are you sure you want to remove @${memberUsername} from this project?`);
        if (!confirm) return;

        const { error } = await supabase
            .from('ProjectMembers')
            .delete()
            .eq('project_id', activeProject)
            .eq('user_id', memberId);

        if (!error) {
            // Instantly remove them from the UI list
            setTeammates(teammates.filter(t => t.id !== memberId));
        } else {
            console.error("Failed to remove member:", error.message);
        }
    };

    return (
        <>
            {isOpen && <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />}

            <div className={`fixed right-0 top-0 h-screen w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h2 className="text-xl font-bold text-gray-800">Your Profile</h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 flex flex-col gap-8 overflow-y-auto flex-1 hide-scrollbar">
                    
                    <div className="flex flex-col items-center text-center gap-2">
                        <div className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-full border-4 border-white shadow-lg mb-2 flex items-center justify-center">
                            <User className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">@{username}</h3>
                            <p className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-block mt-2">
                              Level {userStats.level} {userStats.title}
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                        <div className="flex justify-between text-sm font-bold text-gray-700 mb-2">
                            <span className="flex items-center gap-1.5"><Trophy className="w-4 h-4 text-orange-500"/> Total XP</span>
                            <span className="text-blue-600">{userStats.currentXP} / {userStats.nextLevelXP}</span>
                        </div>
                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-1000 ease-out" style={{ width: `${userStats.percentage}%` }}></div>
                        </div>
                        <p className="text-xs text-gray-400 mt-3 text-center font-medium">
                          {userStats.level === 5 ? "Max Level Reached!" : `Complete quests to reach Level ${userStats.level + 1}!`}
                        </p>
                    </div>

                    <hr className="border-gray-100" />

                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Users className="w-7 h-7 text-gray-400" />
                            <h3 className="text-md font-bold text-gray-400 uppercase tracking-wider">
                                {activeProject ? "Project Team" : "Solo Mode"}
                            </h3>
                        </div>

                        {!activeProject ? (
                            <div className="bg-gray-50 rounded-xl p-4 text-center border border-dashed border-gray-200">
                                <Target className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">You are currently viewing your Personal Quests.</p>
                            </div>
                        ) : isLoading ? (
                            <div className="flex justify-center p-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2 pb-12">
                                {teammates.map((member) => (
                                    <div key={member.id} className="group flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center border-2 border-white shadow-sm font-bold text-indigo-600">
                                                {member.username.charAt(0).toUpperCase()}
                                                {member.isOwner && (
                                                    <div className="absolute -top-1 -right-1 bg-amber-400 rounded-full p-0.5 border border-white shadow-sm">
                                                        <Crown className="w-3 h-3 text-white" />
                                                    </div>
                                                )}
                                            </div>
                                            <span className="font-semibold text-gray-700 text-md">@{member.username}</span>
                                        </div>

                                        {/* remove button only available for owner */}
                                        {isProjectOwner && !member.isOwner && (
                                            <button 
                                                onClick={() => handleRemoveMember(member.id, member.username)}
                                                className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-white hover:bg-red-500 rounded-md transition-all flex-shrink-0"
                                                title="Remove Member"
                                            >
                                                <UserMinus className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                
                                {teammates.length === 1 && (
                                    <p className="text-sm text-gray-400 text-center mt-2">You are the only one in this project.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}