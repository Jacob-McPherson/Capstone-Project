interface NavbarProps {
    currentView: 'dashboard' | 'calendar';
    setCurrentView: (view: 'dashboard' | 'calendar') => void;
    onOpenProfile: () => void;
}

export default function Navbar({ currentView, setCurrentView, onOpenProfile }: NavbarProps) {
    return (
        <nav className="w-full bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">

            {/* Left side - Logo and title */ }
            <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 bg-blue-600 rounded-md overflow-hidden flex items-end justify-end p-1">
                    <div className="w-full h-full border-b-2 border-r-2 border-white absolute bottom-0.5 right-0.5"></div>
                    <div className="w-full h-[1.5px] bg-white absolute top-1/2 left-0"></div>
                    <div className="w-[1.5px] h-full bg-white absolute top-0 right-1/4"></div>
                </div>
                <span className="text-lg font-bold tracking-tight">Blueprint</span>
            </div>
            
            { /* Right side - Navigation links and profile button */ }
            <div className="flex bg-gray-100 p-1 rounded-lg">
                <button
                    onClick={() => setCurrentView('dashboard')}
                    className={`px=4 py-1.5 rounded-md text-sm font-medium transition-all ${
                        currentView === 'dashboard' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-900'
                    }`}
                >
                    Dashboard
                </button>
                <button
                    onClick={() => setCurrentView('calendar')}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                        currentView === 'calendar' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-900'
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