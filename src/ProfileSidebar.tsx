import { useState, useEffect } from "react";
import { X, User, Users, Target, Trophy } from 'lucide-react';
import { supabase } from "./lib/supabase";
import { calculateLevel } from "./lib/xpMath"; // Importing your teammate's math logic!

interface ProfileSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    activeProject: number | null;
}

export default function ProfileSidebar({ isOpen, onClose, activeProject }: ProfileSidebarProps) {
    const [teammates, setTeammates] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState<string>('');

    // XP States initialized with the default Level 1 "Undergrad" status
    const [userStats, setUserStats] = useState({
        level: 1,
        title: "Undergrad",
        currentXP: 0,
        nextLevelXP: 500,
        percentage: 0
    });

    useEffect(() => {
        const fetchProfileData = async () => {
            setIsLoading(true);

            // 1. GET PERSONAL USERNAME & CALCULATE XP
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                // Get Username
                const { data: profile } = await supabase
                    .from('Profiles')
                    .select('username')
                    .eq('id', user.id)
                    .maybeSingle();

                if (profile?.username) {
                    setUsername(profile.username);
                }

                // Calculate Total XP from Completed Quests
                const { data: completedQuests } = await supabase
                    .from('Quests')
                    .select('XP')
                    .eq('user_id', user.id)
                    .eq('status', 'Complete');

                let totalXP = 0;
                if (completedQuests) {
                    totalXP = completedQuests.reduce((sum, quest) => sum + (quest.XP || 0), 0);
                }

                // Run the math!
                const stats = calculateLevel(totalXP);
                setUserStats({
                    level: stats.level,
                    title: stats.title,
                    currentXP: stats.currentXP,
                    nextLevelXP: stats.nextLevelXP,
                    percentage: stats.progressPercentage
                });
            }

            // 2. FETCH PROJECT TEAMMATES
            if (!activeProject) {
                setTeammates([]);
                setIsLoading(false);
                return;
            }

            const { data: projectData } = await supabase
                .from('Projects')
                .select('user_id')
                .eq('projectID', activeProject)
                .maybeSingle();

            const { data: membersData } = await supabase
                .from('ProjectMembers')
                .select('user_id')
                .eq('project_id', activeProject);

            const userIds: string[] = [];
            if (projectData?.user_id) userIds.push(projectData.user_id);
            if (membersData) membersData.forEach(m => userIds.push(m.user_id));

            if (userIds.length > 0) {
                const { data: profiles } = await supabase
                    .from('Profiles')
                    .select('username')
                    .in('id', userIds);

                if (profiles) {
                    const usernames = profiles.map(p => p.username).sort();
                    setTeammates(usernames);
                }
            }
            setIsLoading(false);
        };

        if (isOpen) {
            fetchProfileData();
        }
    }, [isOpen, activeProject]);

    return (
        <>
            {/* Mobile Dark Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Slide-out Panel */}
            <div className={`fixed right-0 top-0 h-screen w-100 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h2 className="text-xl font-bold text-gray-800">Your Profile</h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 flex flex-col gap-8 overflow-y-auto h-full pb-24 hide-scrollbar">

                    {/* User Stats Profile */}
                    <div className="flex flex-col items-center text-center gap-2">
                        <div className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-full border-4 border-white shadow-lg mb-2 flex items-center justify-center">
                            <User className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">@{username}</h3>
                            {/* DYNAMIC LEVEL AND TITLE */}
                            <p className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-block mt-2">
                                Level {userStats.level} {userStats.title}
                            </p>
                        </div>
                    </div>

                    {/* DYNAMIC GAMIFICATION BAR */}
                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                        <div className="flex justify-between text-sm font-bold text-gray-700 mb-2">
                            <span className="flex items-center gap-1.5"><Trophy className="w-4 h-4 text-orange-500" /> Total XP</span>
                            <span className="text-blue-600">{userStats.currentXP} / {userStats.nextLevelXP}</span>
                        </div>
                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${userStats.percentage}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-gray-400 mt-3 text-center font-medium">
                            {userStats.level === 5 ? "Max Level Reached!" : `Complete quests to reach Level ${userStats.level + 1}!`}
                        </p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Group Members Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Users className="w-6 h-6 text-gray-400" />
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
                            <div className="flex flex-col gap-2">
                                {teammates.map((memberUsername, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center border-2 border-white shadow-sm font-bold text-indigo-600">
                                            {memberUsername.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="font-semibold text-gray-700 text-md">@{memberUsername}</span>
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