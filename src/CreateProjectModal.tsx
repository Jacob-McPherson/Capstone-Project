import { useState } from 'react';
import { X, FolderPlus } from 'lucide-react';
import type { Project } from './Home';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string) => void;
  existingProjects: Project[];
}

export default function CreateProjectModal({ isOpen, onClose, onCreate, existingProjects }: CreateProjectModalProps) {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  // modal wont render if it is not open
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    
    if (!trimmedTitle) {
      setError('Project name cannot be empty.');
      return;
    }

    // DUPLICATE CHECK: Does this exact name already exist (ignoring capital letters)?
    const isDuplicate = existingProjects.some(
      (p) => p.projectTitle.toLowerCase() === trimmedTitle.toLowerCase()
    );

    if (isDuplicate) {
      setError('You already have a project with this name.');
      return;
    }

    // successfull and calls onCreate handler in home
    onCreate(trimmedTitle);
    setTitle('');
    setError('');
    onClose();
  };

  const handleClose = () => {
    setTitle('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
      
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">New Project</h2>
          </div>
          <button 
            onClick={handleClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* body form */}
        <form onSubmit={handleSubmit} className="p-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Project Name
          </label>
          <input
            type="text"
            placeholder="e.g., Capstone Project"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setError(''); // Clear error when they start typing
            }}
            autoFocus
            className={`w-full bg-gray-50 text-gray-900 placeholder-gray-400 rounded-lg px-4 py-3 outline-none border transition-all focus:ring-2 focus:ring-blue-500 ${
              error ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
            }`}
          />
          
          {error && <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-lg transition-colors"
            >
              Create Project
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}