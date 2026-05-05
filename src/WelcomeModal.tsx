import { useState } from 'react';
import { supabase } from './lib/supabase';
import { AVATAR_DATA } from './lib/avatars';
import { Sparkles, ArrowRight } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onComplete: (username: string) => void;
}

export default function WelcomeModal({ isOpen, onComplete }: WelcomeModalProps) {
  const [username, setUsername] = useState('');
  const [selectedLineage, setSelectedLineage] = useState<string>('knight');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!username.trim()) {
      setError('A username is required to begin your journey.');
      return;
    }
    
    const validUsernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!validUsernameRegex.test(username.trim())) {
      setError('Username can only contain letters, numbers, and underscores.');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error("Could not find logged in user.");
      }

      // 1. Check if username exists
      const { data: existingUser } = await supabase
        .from('Profiles')
        .select('username')
        .eq('username', username.trim())
        .neq('id', user.id)
        .maybeSingle();

      if (existingUser) {
        setError('That username is already taken by another adventurer.');
        setIsSaving(false);
        return;
      }

      // 2. Save the profile using UPSERT instead of UPDATE
      const { error: updateError } = await supabase
        .from('Profiles')
        .upsert({ 
          id: user.id, // must pass the ID when upserting!
          username: username.trim(),
          avatar_lineage: selectedLineage,
          updated_at: new Date().toISOString()
        });

      if (updateError) {
        console.error("Database error during profile upsert:", updateError);
        setError(`Database Error: ${updateError.message}`);
        setIsSaving(false);
      } else {
        onComplete(username.trim());
      }
    } catch (err: any) {
      console.error("Caught a crash:", err);
      setError("Something went completely wrong. Check the console.");
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center text-white relative overflow-hidden">
          <Sparkles className="absolute top-4 right-4 w-24 h-24 text-white opacity-10" />
          <h2 className="text-3xl font-bold mb-2">Welcome to Blueprint</h2>
          <p className="text-blue-100">Before you begin your first quest, we need to set up your profile.</p>
        </div>

        <div className="p-8 overflow-y-auto hide-scrollbar flex flex-col gap-8">
          
          {/* Username Section */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Choose Your Username</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(''); }}
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl pl-9 pr-4 py-3 text-lg font-medium text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all"
                placeholder="hero_name"
                autoFocus
              />
            </div>
            {error && <p className="text-red-500 text-sm font-bold mt-2 animate-in slide-in-from-top-1">{error}</p>}
          </div>

          {/* Avatar Lineage Section */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Select Your Lineage</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(AVATAR_DATA).map(([key, data]) => (
                <div 
                  key={key}
                  onClick={() => setSelectedLineage(key)}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                    selectedLineage === key ? 'border-blue-500 bg-blue-50 shadow-md scale-[1.02]' : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0 border border-gray-300">
                    <img src={data.stages[0].url} alt={data.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{data.name}</h3>
                    <p className="text-xs text-gray-500 truncate">{data.stages[0].title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={isSaving || !username.trim()}
            className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-8 py-3.5 rounded-xl font-bold transition-all disabled:opacity-50 disabled:active:scale-100 active:scale-95 shadow-lg"
          >
            {isSaving ? 'Creating Profile...' : 'Enter Blueprint'}
            {!isSaving && <ArrowRight className="w-5 h-5" />}
          </button>
        </div>

      </div>
    </div>
  );
}