import { useState, useEffect } from "react";
import { X, Users, Target } from 'lucide-react';
import { supabase } from "./lib/supabase";

interface ProfileSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    activeProject: number | null;
}

export default function ProfileSidebar({ isOpen, onClose, activeProject }: ProfileSidebarProps) {
    const [teammates, setTeammates] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchTeammates = async () => {
            if (!activeProject) {
                setTeammates([]);
                return;
            }

            setIsLoading(true);

            // get project owner ID
            const { data: projectData } = await supabase
                .from('Projects')
                .select('user_id')
                .eq('projectID', activeProject)
                .maybeSingle();

            // get guest id or group members whatever
            const { data: membersData } = await supabase
                .from('ProjectMembers')
                .select('user_id')
                .eq('project_id', activeProject);

            // combine into one array
            const userIds: string[] = [];
            if (projectData?.user_id) userIds.push(projectData.user_id);
            if (membersData) membersData.forEach(m => userIds.push(m.user_id));

            // ask profile table for usernames of all guests
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
            fetchTeammates();
        }
    }, [isOpen, activeProject]);
    return (
        <>
            {/* Sidebar function will close when clicked outside. also this classname is just for the chud blurry dark background and yes we are chuds*/}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Actual sidebar content */}
            <div className={`fixed right-0 top-0 h-screen w-100 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>

                {/* header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h2 className="text-xl font-bold text-gray-800">Your Profile</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* scrollable content area */}
                <div className="p-6 flex flex-col gap-8 overflow-y-auto h-full pb-24">

                    {/* profile avatar and title section */}
                    <div className="flex flex-col items-center text-center gap-3">
                        <div className="w-32 h-32 bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-full border-4 border-white shadow-lg mb-4 flex items-center justify-center">
                            {/* save this area for the pixel art avatar */}
                            <Users className="w-18 h-18 text-white" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">Student Name</h3>
                            <p className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-block mt-2">Level 1 Student</p>
                        </div>
                    </div>

                    {/* gameification / completion bar requirement # 5 */}
                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                        <div className="flex justify-between text-sm font-bold text-gray-700 mb-2">
                            <span>Total XP</span>
                            <span className="text-blue-600">350 / 1000</span>
                        </div>
                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                            {/* progress bar fill wait for real dataflow from database for math */}
                            <div className="h-full bg-blue-500 rounded-full w-[35%] transition-all duration-1000"></div>
                        </div>
                        <p className="text-xs text-gray-400 mt-3 text-center font-medium">Complete more quests to reach Level 2!</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* group members section*/}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Users className="w-5 h-5 text-gray-400" />
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                                {activeProject ? "Project Team" : "Solo Mode"}
                            </h3>
                        </div>

                        {!activeProject ? (
                            <div className="bg-gray-50 rounded-xl p-4 text-center border border-dashed border-gray-200">
                                <Target className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">You are currently viewing your Personal Quests</p>
                            </div>
                        ) : isLoading ? (
                            <div className="flex justify-center p-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {teammates.map((username, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center border-2 border-white shadow-sm font-bold text-indigo-600">
                                            {username.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="font-semibold text-gray-700 text-sm">@{username}</span>
                                    </div>
                                ))}

                                {teammates.length === 1 && (
                                    <p className="text-xs text-gray-400 text-center mt-2"> You are the only one in the project.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}