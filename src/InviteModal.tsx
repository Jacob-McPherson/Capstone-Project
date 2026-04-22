import { useState } from 'react';
import { X, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from './lib/supabase';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProjectID: number | null;
}

export default function InviteModal({ isOpen, onClose, activeProjectID }: InviteModalProps) {
  const [inviteeUsername, setInviteeUsername] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  if (!isOpen || !activeProjectID) return null;

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    const cleanUsername = inviteeUsername.trim().toLowerCase();

    // 1. Find the user ID for this username in the Profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('Profiles')
      .select('id')
      .eq('username', cleanUsername)
      .maybeSingle();

    if (profileError || !profileData) {
      setStatus('error');
      setMessage(`Could not find a user with the username @${cleanUsername}`);
      return;
    }

    // 2. Add them to the ProjectMembers table
    const { error: inviteError } = await supabase
      .from('ProjectMembers')
      .insert([{ project_id: activeProjectID, user_id: profileData.id }]);

    if (inviteError) {
      setStatus('error');
      if (inviteError.code === '23505') {
        setMessage('That user is already in this project!');
      } else {
        setMessage('Failed to invite user.');
      }
    } else {
      setStatus('success');
      setMessage(`Successfully added @${cleanUsername} to the project!`);
      setInviteeUsername('');
      setTimeout(() => {
        onClose();
        setStatus('idle');
        setMessage('');
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">Invite Teammate</h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleInvite} className="p-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Teammate's Username</label>
          <div className="relative">
            <span className="absolute left-4 top-3 text-gray-400 font-medium">@</span>
            <input
              type="text"
              value={inviteeUsername}
              onChange={(e) => { setInviteeUsername(e.target.value); setStatus('idle'); }}
              placeholder="isaac_t"
              autoFocus
              className="w-full bg-gray-50 text-gray-900 rounded-lg pl-8 pr-4 py-3 outline-none border focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {status === 'error' && <p className="text-red-500 flex items-center gap-1 text-sm mt-3"><AlertCircle className="w-4 h-4"/> {message}</p>}
          {status === 'success' && <p className="text-emerald-600 flex items-center gap-1 text-sm mt-3"><CheckCircle2 className="w-4 h-4"/> {message}</p>}

          <div className="flex justify-end gap-3 mt-8">
            <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
            <button type="submit" disabled={status === 'loading'} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
              {status === 'loading' ? 'Inviting...' : 'Send Invite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}