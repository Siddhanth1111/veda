'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { socket } from '@/lib/socket';
import { useAssignmentStore } from '@/store/useAssignmentStore';
import { QuestionPaperView } from '@/components/QuestionPaperView';

export default function AssignmentPage() {
  const { id } = useParams();
  const { status, setStatus, paperData, setPaperData } = useAssignmentStore();
  const [loadingMsg, setLoadingMsg] = useState('Fetching status...');

  useEffect(() => {
    if (!id) return;
    
    socket.connect();

    const checkInitialStatus = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/assignments/${id}`);
        const data = await res.json();
        
        if (data.success) {
          setStatus(data.data.status);
          if (data.data.status === 'completed' && data.data.generatedPaper) {
            setPaperData(data.data.generatedPaper);
          } else {
            setLoadingMsg('Paper is currently generating in background queue...');
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    checkInitialStatus();

    socket.on('paperUpdate', (update: any) => {
      if (update.assignmentId === id) {
        setStatus(update.status);
        if (update.status === 'completed' && update.paper) {
          setPaperData(update.paper);
        }
      }
    });

    return () => {
      socket.off('paperUpdate');
      socket.disconnect();
    };
  }, [id, setStatus, setPaperData]);

  if (status === 'completed' && paperData) {
    return (
      <main className="min-h-screen bg-gray-50 py-10 relative">
        <div className="absolute top-8 left-8 z-50">
          <button 
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-800 border border-gray-200 text-sm font-bold rounded-full shadow-sm hover:bg-gray-50 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Go to Home
          </button>
        </div>
        <QuestionPaperView paperData={paperData} />
      </main>
    );
  }

  if (status === 'failed') {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 text-red-500 font-medium">
        Failed to generate the paper. Please try again.
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center flex-col bg-gray-50 space-y-4">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-700 font-medium animate-pulse">{loadingMsg}</p>
    </main>
  );
}
