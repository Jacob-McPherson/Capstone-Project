import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY as string

// console.log('SUPABASE URL:', supabaseUrl)  // added for testing  Do not add back !!!
// console.log('SUPABASE KEY:', supabaseKey)  // added for testing  Do not add back !!!

export const supabase = createClient(supabaseUrl, supabaseKey)


// keeping this here in case i did something wrong
// <main className="flex-1 p-8 md:p-12 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-8">
//           <div className="md:col-span-2">
//             {/* Top section: for task form */}
//             <TaskForm onAddTask={handleAddTask}
//               activeProject={activeProject}
//             />

//             <div className="flex justify-betweem items-center mb-6 mt-2">
//               <h2 className="text-xl font-bold">{currentWorkspaceName}</h2>
//               <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1">Level 1 Student</span>
//             </div>

//             <div className="bg-gray-200 p-1 rounded-full flex items-center justify-between mb-6">
//               {['All Tasks', 'Pending', 'In-Progress', 'Complete'].map(tab => (
//                 <button
//                   key={tab}
//                   onClick={() => setActiveTab(tab as any)}
//                   className={`flex-1 text-center py-2 text-sm font-medium rounded-full transition all ${activeTab === tab ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-800'
//                     }`}
//                 >
//                   {tab}
//                 </button>
//               ))}
//             </div>

//             <div className="flex flex-col gap-4">
//               <TaskList
//                 quests={displayedQuests.filter(q => {
//                   if (activeTab === 'All Tasks') return true;
//                   if (activeTab === 'Pending') return q.status === 'Pending';
//                   if (activeTab === 'In-Progress') return q.status === 'In-Progress';
//                   if (activeTab === 'Complete') return q.status === 'Complete';
//                   return true;
//                 })}
//                 onStatusChange={handleStatusChange}
//                 onDelete={handleDelete}
//               />
//             </div>
//             <div className="mt-12">
//               <h2 className="text-xl font-bold mb-4">Archived Quests</h2>
//               <Archive quests={quests.filter(q => q.status === 'Complete')} /> // temp placement
//             </div>
//           </div>

//           {/* right column */}
//           <div className="md:col-span-1">
//             <MinimalCalendar quests={displayedQuests} />
//           </div>
//         </main>