export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-black">
      {/* Top Navigation Bar */}
      <nav className="w-full bg-white border-b border-gray-200 px-6 py-3 flex items-center">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 bg-blue-600 rounded-md overflow-hidden flex items-end justify-end p-1">
            <div className="w-full h-full border-b-2 border-r-2 border-white absolute bottom-0.5 right-0.5"></div>
            <div className="w-full h-[1.5px] bg-white absolute top-1/2 left-0"></div>
            <div className="w-[1.5px] h-full bg-white absolute top-0 right-1/4"></div>
          </div>
          <span className="text-lg font-bold tracking-tight">Blueprint</span>
        </div>
      </nav>

      {/* Main Content Area (Placeholders matching your wireframe) */}
      <main className="p-12 relative h-[80vh]">
        {/* Placeholder Circle */}
        <div className="w-24 h-24 bg-gray-300 rounded-full absolute top-12 left-24"></div>
        
        {/* Placeholder Rectangle */}
        <div className="w-64 h-32 bg-gray-300 absolute bottom-12 left-1/3"></div>
      </main>
    </div>
  );
}