'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { TopNavbar } from '@/components/TopNavbar';
import { AssignmentCard, Assignment } from '@/components/AssignmentCard';
import { Search, Filter, Plus } from 'lucide-react';
import { useAssignmentStore } from '@/store/useAssignmentStore';

export default function AssignmentsList() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const { setAssignmentId } = useAssignmentStore();

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/assignments');
      const data = await res.json();
      if (data.success) {
        setAssignments(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this assignment?')) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/assignments/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setAssignments(prev => prev.filter(a => a._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
    setOpenDropdown(null);
  };

  const handleView = (id: string) => {
    setAssignmentId(id);
    router.push(`/assignment/${id}`);
    setOpenDropdown(null);
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex font-sans">
      <Sidebar />
      
      <div className="flex-1 flex flex-col pt-4 px-6 pb-20 relative overflow-hidden h-screen overflow-y-auto">
        <TopNavbar />

        {/* Header Content */}
        <div className="mt-8 mb-6 ml-2">
          <div className="flex items-center gap-2 mb-1">
             <div className="w-3 h-3 rounded-full bg-green-400"></div>
             <h1 className="text-2xl font-black text-gray-900 tracking-tight">Assignments</h1>
          </div>
          <p className="text-sm font-semibold text-gray-400 ml-5">Manage and create assignments for your classes.</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-full shadow-[0_2px_15px_rgba(0,0,0,0.02)] p-2 flex items-center mb-8 border border-gray-100">
          <button className="flex items-center gap-2 text-gray-400 font-bold text-sm px-6 py-2 border-r border-gray-100 hover:text-gray-600">
            <Filter className="w-4 h-4" /> Filter By
          </button>
          <div className="flex-1 flex items-center gap-3 px-6 text-gray-400">
            <Search className="w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search Assignment" 
              className="w-full bg-transparent outline-none text-sm font-semibold text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Cards Grid */}
        {loading ? (
            <div className="p-10 flex justify-center"><div className="w-10 h-10 border-4 border-[#1d1e20] border-t-transparent rounded-full animate-spin"></div></div>
        ) : assignments.length === 0 ? (
            <div className="text-center font-bold text-gray-400 mt-20">No assignments found.</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {assignments.map((assignment) => (
              <AssignmentCard 
                key={assignment._id}
                assignment={assignment}
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
                handleView={handleView}
                handleDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Floating Create Button */}
        <div className="fixed bottom-10 left-[calc(50%+8rem)] transform -translate-x-1/2 z-20 shadow-2xl rounded-full">
          <button onClick={() => router.push('/create-assignment')} className="bg-[#1d1e20] text-white px-7 py-3.5 rounded-full font-bold flex items-center gap-2 hover:bg-black transition-all shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
            <Plus className="w-5 h-5" /> Create Assignment
          </button>
        </div>
      </div>
    </div>
  );
}