import React, { useState } from 'react';
import { Student } from '../types';
import { CloseIcon } from './icons/CloseIcon';

interface DownloadModalProps {
  students: Student[];
  onClose: () => void;
  onDownload: (studentId: string | 'all') => void;
  isGenerating: boolean;
}

const DownloadModal: React.FC<DownloadModalProps> = ({ students, onClose, onDownload, isGenerating }) => {
  const [selectionType, setSelectionType] = useState<'all' | 'single'>('all');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students.length > 0 ? students[0].id : '');

  const handleDownloadClick = () => {
    if (isGenerating) return;

    if (selectionType === 'all') {
      onDownload('all');
    } else {
      if (selectedStudentId) {
        onDownload(selectedStudentId);
      }
    }
  };
  
  return (
    <div className="no-print fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" aria-modal="true" role="dialog">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-slate-800">Download Options</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600" aria-label="Close">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input 
                type="radio" 
                name="download-option" 
                className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                checked={selectionType === 'all'}
                onChange={() => setSelectionType('all')}
              />
              <span className="text-slate-700 font-medium">Download All Reports</span>
            </label>
          </div>
          <div>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input 
                type="radio" 
                name="download-option" 
                className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                checked={selectionType === 'single'}
                onChange={() => setSelectionType('single')}
              />
              <span className="text-slate-700 font-medium">Select a Specific Report</span>
            </label>
            {selectionType === 'single' && (
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="mt-3 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                aria-label="Select student"
              >
                {students.map(student => (
                  <option key={student.id} value={student.id}>{student.name}</option>
                ))}
              </select>
            )}
          </div>
        </div>
        <div className="px-6 py-4 bg-slate-50 rounded-b-lg flex justify-end space-x-3">
          <button
            onClick={onClose}
            type="button"
            className="bg-white text-slate-700 font-semibold py-2 px-4 rounded-lg border border-slate-300 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleDownloadClick}
            type="button"
            disabled={isGenerating || (selectionType === 'single' && !selectedStudentId)}
            className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 disabled:bg-red-300 disabled:cursor-not-allowed w-36 text-center"
          >
            {isGenerating ? 'Generating...' : 'Download PDF'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadModal;