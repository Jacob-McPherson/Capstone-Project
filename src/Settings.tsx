import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { AVATAR_DATA } from './lib/avatars';
import { Save, User, Settings as SettingsIcon } from 'lucide-react';

export default function Settings() {
  const [selectedLineage, setSelectedLineage] = useState<string>('knight');
  const [username, setUsername] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('Profiles').select('username, avatar_lineage').eq('id', user.id).maybeSingle();
        if (data) {
          if (data.avatar_lineage) setSelectedLineage(data.avatar_lineage);
          if (data.username) setUsername(data.username);
        }
      }
    };
    loadProfile();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase.from('Profiles').update({ 
        avatar_lineage: selectedLineage,
        username: username 
      }).eq('id', user.id);

      if (error) {
        console.error("Error saving settings:", error.message);
        setSaveMessage('Error saving settings. Try again.');
      } else {
        setSaveMessage('Settings saved successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
      }
    }
    setIsSaving(false);
  };

  return (
    <main className="flex-1 p-4 md:p-8 lg:p-12 w-full max-w-5xl mx-auto overflow-y-auto hide-scrollbar">
      <div className="flex items-center gap-3 mb-8">
        <SettingsIcon className="w-8 h-8 text-gray-800" />
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
      </div>
      
      <div className="flex flex-col gap-8 pb-12">
        
        {/* SECTION 1: AVATAR LINEAGE */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-500" />
              Choose Your Avatar Lineage
            </h2>
            <p className="text-gray-500 mt-1 text-sm">Your avatar will evolve as you gain XP and level up.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(AVATAR_DATA).map(([key, data]) => (
              <div 
                key={key}
                onClick={() => setSelectedLineage(key)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedLineage === key ? 'border-blue-500 bg-blue-50/50 shadow-md scale-[1.02]' : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gray-200 overflow-hidden flex-shrink-0 border border-gray-300">
                    <img src={data.stages[0].url} alt={data.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{data.name}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1">{data.stages[0].description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: PROFILE DETAILS (USERNAME) */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">Profile Details</h2>
            <p className="text-gray-500 mt-1 text-sm">Update your username and how you appear to your team.</p>
          </div>

          <div className="max-w-md">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
            
            {/* FIX: Restored the '@' input styling and helper text! */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                placeholder="username"
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">Only letters, numbers, and underscores allowed.</p>
          </div>
        </div>

        {/* MASTER SAVE BUTTON */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 mt-2">
          {saveMessage && (
            <span className={`text-sm font-bold ${saveMessage.includes('Error') ? 'text-red-500' : 'text-green-500'} animate-in fade-in`}>
              {saveMessage}
            </span>
          )}
          
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-bold transition-transform active:scale-95 shadow-lg w-full sm:w-auto disabled:opacity-50 disabled:active:scale-100"
          >
            <Save className="w-5 h-5" />
            {isSaving ? 'Saving...' : 'Save All Preferences'}
          </button>
        </div>

      </div>
    </main>
  );
}