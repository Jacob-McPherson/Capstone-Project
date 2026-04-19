import { X, User } from 'lucide-react';

interface ProfileSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ProfileSidebar({ isOpen, onClose }: ProfileSidebarProps) {
    return (
        <>
            {/* Sidebar function will close when clicked outside. also this classname is just for the chud blurry dark background and yes we are chuds*/ }
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Actual sidebar content */ }
            <div
                className={`fixed inset-y-0 right-0 w-80 sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* header */ }
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800">Your Profile</h2>
                    <button 
                        onClick={onClose} 
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* scrollable content area */ }
                <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-8">

                    {/* profile avatar and title section */ }
                    <div className="flex flex-col items-center text-center gap-3">
                        <div className="w-32 h-32 bg-gradient-to-br from-[#E0F9B5] to-[#A4B5F9] rounded-full border-4 border-white shadow-lgflex items-center justify-center">
                            {/* save this area for the pixel art avatar */ }
                            <User className="w-12 h-12 text-blue-600/50" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">Student Name</h3>
                            <p className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-block mt-2">Level 1 Student</p>
                        </div>
                    </div>

                    {/* gameification / completion bar requirement # 5 */ }
                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                        <div className="flex justify-between text-sm font-bold text-gray-700 mb-2">
                            <span>Total XP</span>
                            <span className="text-blue-600">350 / 1000</span>
                        </div>
                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                            {/* progress bar fill wait for real dataflow from database for math */ }
                            <div className="h-full bg-blue-500 rounded-full w-[35%] transition-all duration-1000"></div>
                        </div>
                        <p className="text-xs text-gray-400 mt-3 text-center font-medium">Complete more quests to reach Level 2!</p>
                    </div>

                    {/* group members section*/ }
                    <div>
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Project Members</h4>
                        <div className="flex flex-col gap-3">
                            {/* member item temporary mock data */ }
                            {/* mock person 1 */ }
                            <div className="flex items-center gap-4 p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">I</div>
                                <span className="font-medium text-gray-700">Isaac</span>
                            </div>
                            {/* mock person 2 */ }
                            <div className="flex items-center gap-4 p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 font-bold">J</div>
                                <span className="font-medium text-gray-700">John</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}