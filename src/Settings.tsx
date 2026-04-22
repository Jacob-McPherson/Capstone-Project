import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { User, Save, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Settings() {
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('Profiles')
        .select('username')
        .eq('id', user.id)
        .maybeSingle();

      if (data && data.username) {
        setUsername(data.username);
      }
    };
    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    const cleanUsername = username.trim().toLowerCase();

    if (cleanUsername.length < 3) {
      setStatus('error');
      setMessage('Username must be at least 3 characters long.');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // upsert updates if exists, inserts if not. We also update the updated_at timestamp to know when they last changed their profile
    const { error } = await supabase
      .from('Profiles')
      .upsert({ 
        id: user.id, 
        username: cleanUsername,
        updated_at: new Date().toISOString()
      });

    if (error) {
      setStatus('error');
      // if not uniqe. supabase returns a 23505 error
      if (error.code === '23505') {
        setMessage('That username is already taken. Try another one!');
      } else {
        setMessage('Error saving profile: ' + error.message);
      }
    } else {
      setStatus('success');
      setMessage('Profile updated successfully!');
    }
  };

  return (
    <div className="p-8 md:p-12 max-w-4xl mx-auto w-full animate-in fade-in duration-300">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-500 mt-2">Manage your public profile and preferences.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Profile Section Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Public Profile</h2>
            <p className="text-sm text-gray-500">This is how other users will see you when inviting you to projects.</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-8">
          <div className="max-w-md">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Username
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-gray-400 font-medium">@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setStatus('idle'); // Reset status when typing
                }}
                placeholder="john_doe"
                className="w-full bg-gray-50 text-gray-900 rounded-xl pl-8 pr-4 py-3 outline-none border border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">Only letters, numbers, and underscores.</p>
          </div>

          {/* Status Messages */}
          {status === 'error' && (
            <div className="flex items-center gap-2 mt-4 text-red-600 bg-red-50 p-3 rounded-lg text-sm font-medium">
              <AlertCircle className="w-4 h-4" /> {message}
            </div>
          )}
          {status === 'success' && (
            <div className="flex items-center gap-2 mt-4 text-emerald-600 bg-emerald-50 p-3 rounded-lg text-sm font-medium">
              <CheckCircle2 className="w-4 h-4" /> {message}
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-100">
            <button
              type="submit"
              disabled={status === 'loading'}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
            >
              <Save className="w-4 h-4" />
              {status === 'loading' ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}