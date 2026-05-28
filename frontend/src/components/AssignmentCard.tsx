'use client';

import React from 'react';
import { MoreVertical } from 'lucide-react';

export interface Assignment {
  _id: string;
  title: string;
  dueDate: string;
  createdAt: string;
  status: string;
}

interface AssignmentCardProps {
  assignment: Assignment;
  openDropdown: string | null;
  setOpenDropdown: (id: string | null) => void;
  handleView: (id: string) => void;
  handleDelete: (id: string) => void;
}

export function AssignmentCard({ assignment, openDropdown, setOpenDropdown, handleView, handleDelete }: AssignmentCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col justify-between h-[200px]">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-black text-gray-900 tracking-tight">{assignment.title || 'Untitled Assignment'}</h3>
        <div className="relative">
          <button 
            onClick={() => setOpenDropdown(openDropdown === assignment._id ? null : assignment._id)} 
            className="text-gray-400 hover:bg-gray-50 p-2 rounded-full transition"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          
          {openDropdown === assignment._id && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)}></div>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 py-2 animate-in fade-in zoom-in duration-150">
                <button 
                  onClick={() => handleView(assignment._id)} 
                  className="w-full text-left px-5 py-2.5 text-sm font-bold text-gray-800 hover:bg-gray-50 transition"
                >
                  View Assignment
                </button>
                <button 
                  onClick={() => handleDelete(assignment._id)} 
                  className="w-full text-left px-5 py-2.5 text-sm font-bold text-[#e11d48] hover:bg-red-50 transition"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="flex justify-between items-center text-sm font-bold mt-auto">
        <div className="text-gray-400">Assigned on : <span className="text-gray-500">{formatDate(assignment.createdAt)}</span></div>
        <div className="text-gray-400">Due : <span className="text-gray-500">{formatDate(assignment.dueDate)}</span></div>
      </div>
    </div>
  );
}
