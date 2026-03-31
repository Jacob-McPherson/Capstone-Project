import { useState } from "react";
import MinimalCalendar from "./MinimalCalendar";
import TaskList from "./TaskList";

export interface Quest {

  QuestID: string;
  Details: string;
  Status: 'todo' | 'in-progress' | 'done';
  DueDate: string; // formate : YYYY-MM-DD
  XP: number;

}

export default function Home() {

  const [quests, setQuests] = useState<Quest[]>([
    {
      QuestID: '1',
      Details: 'Finish Capstone Project',
      Status: 'in-progress',
      DueDate: '2026-04-22',
      XP: 50,
    },
    {
      QuestID: '2',
      Details: 'Study for Finals',
      Status: 'in-progress',
      DueDate: '2026-05-26',
      XP: 100,
    },
    {
      QuestID: '3',
      Details: 'Complete ERD revisions',
      Status: 'todo',
      DueDate: '2026-04-10',
      XP: 75,
    }
  ]);

  const handleStatusChange = (id: string, newStatus: Quest['Status']) => {
    setQuests(quests.map(q => q.QuestID === id ? { ...q, Status: newStatus } : q));
  };

  const handleDelete = (id: string) => {
    setQuests(quests.filter(q => q.QuestID !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-black">
      {/* Top Nav Bar */}
      <nav className="w-full bg-white border-b border-gray-200 px-6 py-3 flex items-center">
        {/* logo and title */}
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 bg-blue-600 rounded-md overflow-hidden flex items-end justify-end p-1">
            <div className="w-full h-full border-b-2 border-r-2 border-white absolute bottom-0.5 right-0.5"></div>
            <div className="w-full h-[1.5px] bg-white absolute top-1/2 left-0"></div>
            <div className="w-[1.5px] h-full bg-white absolute top-0 right-1/4"></div>
          </div>
          <span className="text-lg font-bold tracking-tight">Blueprint</span>
        </div>
      </nav>

      {/* main content area */}
      <main className="p-8 md:p-12 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* left column SAVE THIS SPOT FOR TASKS*/}
        <div className="md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Your Quests</h2>
            <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1">Level 1 Student</span>
          </div>

          <TaskList
            quests={quests}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        </div>

        {/* right column */}
        <div className="md:col-span-1">
          <MinimalCalendar quests={quests} />
        </div>
      </main>
    </div>
  );
}