import { type Quest } from "./Home";

interface ArchiveProps {
    quests: Quest[];

}

export default function Archive({ quests }: ArchiveProps) {
    if (quests.length === 0) {
        return (
            <div className="flex items-center justify-center p-8 text-gray-400 bg-white rounded-xl border border-gray-100 border-dashed">
                No archived quests found.
            </div>
        );
    }
    
    return (
        <div className="flex flex-col gap-4">
            {quests.map(quest => (
                <QuestItem
                key={quest.questID}
                quest={quest}
                onDelete={() => {}}
                />
            ))}
        </div>
    );
}

function QuestItem({ quest, onDelete }: {
    quest: Quest;
    onDelete: () => void;
}) {
    return (
        <div className={`p-5 bg-white rounded-xl transition-all duration-200 shadow-sm border ${
            quest.status === 'Complete'
            ? 'border-green-100 opacity-60'
            : 'border-white hover:border-gray-200 hover:shadow-md'
        }`}>
        <div className="flex items-start gap-4">
            <div className="flex-1">
                <h3 className="text-lg font-semibold">{quest.questName}</h3>
                <p className="text-sm text-gray-500 mt-1">{quest.questDetails}</p>
            </div>
            <button onClick={onDelete} className="text-red-500 hover:text-red-700 transition colors">
                Delete
            </button>
        </div>
        </div>
    );
}