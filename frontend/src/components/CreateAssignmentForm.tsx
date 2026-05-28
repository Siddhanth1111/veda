'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAssignmentStore, AssignmentData } from '../store/useAssignmentStore';
import { CloudUpload, Calendar, X, Plus, Mic, ArrowRight, ArrowLeft } from 'lucide-react';

interface QType {
  id: string;
  type: string;
  count: number;
  marks: number;
}

export const CreateAssignmentForm = () => {
  const router = useRouter();
  const setAssignmentId = useAssignmentStore((state) => state.setAssignmentId);
  const setStatus = useAssignmentStore((state) => state.setStatus);
  
  const [loading, setLoading] = useState(false);
  const [showTitleModal, setShowTitleModal] = useState(false);
  
  // High-fidelity state based on UI
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  
  const [questionTypes, setQuestionTypes] = useState<QType[]>([
    { id: '1', type: 'Multiple Choice Questions', count: 4, marks: 1 },
    { id: '2', type: 'Short Questions', count: 3, marks: 2 },
    { id: '3', type: 'Diagram/Graph-Based Questions', count: 5, marks: 5 },
    { id: '4', type: 'Numerical Problems', count: 5, marks: 5 },
  ]);

  const totalQuestions = useMemo(() => questionTypes.reduce((acc, curr) => acc + curr.count, 0), [questionTypes]);
  const totalMarks = useMemo(() => questionTypes.reduce((acc, curr) => acc + (curr.count * curr.marks), 0), [questionTypes]);

  const availableOptions = [
    'Multiple Choice Questions',
    'Short Questions',
    'Long Questions',
    'Diagram/Graph-Based Questions',
    'Numerical Problems',
    'Case Study',
  ];

  const handleQTypeChange = (id: string, field: keyof QType, value: string | number) => {
    setQuestionTypes(prev => prev.map(qt => qt.id === id ? { ...qt, [field]: value } : qt));
  };

  const removeQType = (id: string) => {
    if(questionTypes.length === 1) return;
    setQuestionTypes(prev => prev.filter(qt => qt.id !== id));
  };

  const addQType = () => {
    setQuestionTypes(prev => [
      ...prev, 
      { id: Date.now().toString(), type: 'Multiple Choice Questions', count: 1, marks: 1 }
    ]);
  };

  const handleFinalSubmit = async () => {
    if(!title.trim()) {
      alert("Please enter a title for the assignment.");
      return;
    }
    
    setLoading(true);

    try {
      const payload = {
        title: title,
        dueDate: dueDate || new Date().toISOString().split('T')[0],
        questionTypes: questionTypes.map(q => q.type), // Backend expects string array
        totalQuestions: totalQuestions,
        totalMarks: totalMarks,
        additionalInstructions: additionalInstructions,
        documentImage: uploadedFile
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (data.success) {
        setAssignmentId(data.assignmentId);
        setStatus('pending');
        setShowTitleModal(false);
        router.push(`/assignment/${data.assignmentId}`);
      } else {
        alert(JSON.stringify(data.errors || data.message));
      }
    } catch (error) {
      console.error(error);
      alert('Failed to create assignment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full pb-20 mt-4 relative bg-gray-50">
      {/* Header Context built into the outer area */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
          Create Assignment
        </h2>
        <p className="text-sm text-gray-500 mt-1 pl-4.5">Set up a new assignment for your students</p>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-1 bg-gray-800 rounded-full"></div>
        <div className="flex-1 h-1 bg-gray-300 rounded-full"></div>
        <div className="flex-1 h-1 bg-gray-300 rounded-full"></div>
      </div>

      <div className="bg-[#f0f2f5] p-6 rounded-3xl shadow-md border border-gray-200 max-w-4xl mx-auto">
        <h3 className="text-lg font-bold text-gray-900">Assignment Details</h3>
        <p className="text-xs text-gray-500 mb-8 mt-1">Basic information about your assignment</p>

        {/* Upload Area */}
        <label className="border border-dashed border-gray-300 bg-white rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition relative">
          <input 
            type="file" 
            accept="image/jpeg, image/png"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                if (file.size > 10 * 1024 * 1024) {
                  alert("File size exceeds 10MB");
                  return;
                }
                const reader = new FileReader();
                reader.onloadend = () => {
                  setUploadedFile(reader.result as string);
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          {uploadedFile ? (
             <div className="flex flex-col items-center">
                <CloudUpload className="mx-auto h-6 w-6 text-green-500 mb-3" />
                <p className="text-sm font-semibold text-green-700 mb-1">Image selected!</p>
                <p className="text-xs text-gray-500 mb-4">Click to change</p>
             </div>
          ) : (
             <>
                <CloudUpload className="mx-auto h-6 w-6 text-gray-800 mb-3" />
                <p className="text-sm font-semibold text-gray-800 mb-1">Choose a file or drag & drop it here</p>
                <p className="text-xs text-gray-400 mb-4">JPEG, PNG, upto 10MB</p>
                <div className="px-5 py-2 text-xs font-semibold rounded-full border border-gray-200 bg-[#f9fafb] text-gray-700 hover:bg-gray-100 transition">
                  Browse Files
                </div>
             </>
          )}
        </label>
        <p className="text-center text-xs text-gray-500 mt-3 font-medium">Upload images of your preferred document/image</p>

        {/* Due Date */}
        <div className="mt-8">
          <label className="block text-sm text-gray-800 font-bold mb-2">Due Date</label>
          <div className="relative">
            <input 
              type="date"
              className="w-full bg-[#f9fafb] border border-gray-200 text-gray-600 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-300"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
            />
          </div>
        </div>

        {/* Question Types */}
        <div className="mt-8">
          <div className="flex text-xs font-bold text-gray-800 mb-3 pl-2 pr-[200px]">
            <div className="flex-1">Question Type</div>
            <div className="w-28 text-center -ml-8">No. of Questions</div>
            <div className="w-24 text-center ml-12">Marks</div>
          </div>

          <div className="space-y-3">
            {questionTypes.map((qt) => (
              <div key={qt.id} className="flex flex-wrap md:flex-nowrap items-center gap-3">
                <div className="flex-1 min-w-[200px] flex px-4 py-2 border border-gray-200 rounded-full bg-white items-center justify-between shadow-sm">
                  <select 
                    className="w-full bg-transparent text-sm font-semibold text-gray-700 outline-none cursor-pointer appearance-none"
                    value={qt.type}
                    onChange={(e) => handleQTypeChange(qt.id, 'type', e.target.value)}
                  >
                    {availableOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <svg className="w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
                
                <button 
                  type="button"
                  onClick={() => removeQType(qt.id)} 
                  className="text-gray-400 hover:text-red-500 px-1"
                  disabled={questionTypes.length === 1}
                >
                  <X className="w-4 h-4" />
                </button>
                
                <div className="flex items-center justify-between w-[120px] px-2 py-2 bg-white border border-gray-200 rounded-full shadow-sm">
                  <button type="button" onClick={() => handleQTypeChange(qt.id, 'count', Math.max(1, qt.count - 1))} className="text-gray-400 hover:text-gray-800 w-8 flex justify-center">�</button>
                  <span className="text-sm font-bold w-4 text-center">{qt.count}</span>
                  <button type="button" onClick={() => handleQTypeChange(qt.id, 'count', qt.count + 1)} className="text-gray-400 hover:text-gray-800 w-8 flex justify-center">+</button>
                </div>
                
                <div className="flex items-center justify-between w-[120px] px-2 py-2 bg-white border border-gray-200 rounded-full shadow-sm">
                  <button type="button" onClick={() => handleQTypeChange(qt.id, 'marks', Math.max(1, qt.marks - 1))} className="text-gray-400 hover:text-gray-800 w-8 flex justify-center">�</button>
                  <span className="text-sm font-bold w-4 text-center">{qt.marks}</span>
                  <button type="button" onClick={() => handleQTypeChange(qt.id, 'marks', qt.marks + 1)} className="text-gray-400 hover:text-gray-800 w-8 flex justify-center">+</button>
                </div>
              </div>
            ))}
          </div>

          <button 
            type="button" 
            onClick={addQType}
            className="flex items-center gap-2 text-xs font-bold w-fit text-gray-800 mt-4 px-2 hover:opacity-80 transition"
          >
            <div className="w-6 h-6 rounded-full bg-gray-800 text-white flex items-center justify-center">
              <Plus className="w-4 h-4"/>
            </div>
            Add Question Type
          </button>
        </div>

        {/* Totals */}
        <div className="text-right text-xs font-bold text-gray-800 space-y-1 mt-8 mb-6">
          <p>Total Questions : {totalQuestions}</p>
          <p>Total Marks : {totalMarks}</p>
        </div>

        {/* Additional Instructions */}
        <div className="relative">
          <label className="block text-sm font-bold text-gray-800 mb-2">Additional Information (For better output)</label>
          <textarea 
            className="w-full bg-[#f9fafb] border border-gray-200 rounded-[20px] px-5 py-4 text-sm font-medium resize-none focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-300 min-h-[100px]"
            placeholder="e.g Generate a question paper for 3 hour exam duration..."
            value={additionalInstructions}
            onChange={e => setAdditionalInstructions(e.target.value)}
          />
          <div className="absolute right-4 bottom-4 text-gray-600 bg-white p-1.5 rounded-full shadow-sm border border-gray-100 cursor-pointer">
            <Mic className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center max-w-4xl mx-auto mt-6">
        <button 
          onClick={() => router.push('/')}
          className="flex items-center gap-2 px-6 py-3 bg-white text-gray-800 border border-gray-200 text-sm font-bold rounded-full shadow-sm hover:bg-gray-50 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Previous
        </button>
        <button 
          onClick={() => setShowTitleModal(true)}
          className="flex items-center gap-2 px-8 py-3 bg-[#1d1e20] text-white text-sm font-bold rounded-full shadow-sm hover:bg-black transition"
        >
          Next <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Title Modal Popup */}
      {showTitleModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in zoom-in duration-200">
          <div className="bg-white p-8 rounded-[24px] w-[90%] max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-2 text-gray-900">Name Your Assignment</h3>
            <p className="text-sm text-gray-500 mb-6 font-medium">Give a clear title to identify your created assessment.</p>
            
            <input 
              autoFocus
              type="text"
              placeholder="e.g. Midterm: Physics 101"
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 text-gray-800 text-base font-medium rounded-xl mb-6 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleFinalSubmit()}
            />
            
            <div className="flex justify-end gap-3 mt-4">
              <button 
                onClick={() => setShowTitleModal(false)} 
                className="px-6 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-full transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleFinalSubmit} 
                disabled={loading} 
                className="px-8 py-2.5 flex items-center gap-2 bg-[#1d1e20] text-white rounded-full font-bold shadow-md hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                )}
                {loading ? 'Creating...' : 'Create Assignment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
