interface NavbarProps {
    currentView: 'dashboard' | 'calendar';
    setCurrentView: (view: 'dashboard' | 'calendar') => void;
    onOpenProfile: () => void;
}

export default function Navbar({ currentView, setCurrentView, onOpenProfile }: NavbarProps) {
    return (
        <nav className="w-full bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">

            {/* Left side - Logo and title */}
            <div className="flex items-center gap-3">
                <svg className="w-10 h-10 flex-shrink-0" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="32" height="32" rx="8" fill="#2563EB" />

                    <path d="M23 3.5V30" stroke="white" strokeWidth="2" />
                    <path d="M4 25H29.75" stroke="white" strokeWidth="2" />

                </svg>
                <span className="text-3xl font-bold tracking-tight">Blueprint</span>
            </div>

            { /* Right side - Navigation links and profile button */}
            <div className="flex bg-gray-100 p-1 rounded-lg">
                <button
                    onClick={() => setCurrentView('dashboard')}
                    className={`px=4 py-1.5 rounded-md text-sm font-medium transition-all ${currentView === 'dashboard' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-900'
                        }`}
                >
                    Dashboard
                </button>
                <button
                    onClick={() => setCurrentView('calendar')}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${currentView === 'calendar' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-900'
                        }`}
                >
                    Calendar
                </button>
            </div>

            {/* profile trigger */}
            <div
                className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity p-2 rounded-lg hover:bg-gray-100"
                onClick={onOpenProfile}
            >
                <div className="w-8 h-8 bg-orange-400 rounded-full border-2 border-white shadow-sm"></div>
                <div className="w-8 h-8 bg-cyan-400 rounded-full border-2 border-white shadow-sm -ml-4"></div>
            </div>

        </nav>
    );
}