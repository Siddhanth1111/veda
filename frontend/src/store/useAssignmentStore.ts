import { create } from 'zustand';

export interface Question {
  questionText: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  marks: number;
}

export interface Section {
  sectionName: string;
  instructions: string;
  questions: Question[];
}

export interface AssignmentData {
  title?: string;
  dueDate: string;
  questionTypes: string[];
  totalQuestions: number;
  totalMarks: number;
  additionalInstructions?: string;
}

interface AssignmentState {
  currentAssignmentId: string | null;
  status: 'idle' | 'pending' | 'processing' | 'completed' | 'failed';
  paperData: { sections: Section[] } | null;
  error: string | null;
  setAssignmentId: (id: string) => void;
  setStatus: (status: 'idle' | 'pending' | 'processing' | 'completed' | 'failed') => void;
  setPaperData: (data: { sections: Section[] }) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useAssignmentStore = create<AssignmentState>((set) => ({
  currentAssignmentId: null,
  status: 'idle',
  paperData: null,
  error: null,
  setAssignmentId: (id) => set({ currentAssignmentId: id }),
  setStatus: (status) => set({ status }),
  setPaperData: (data) => set({ paperData: data }),
  setError: (error) => set({ error }),
  reset: () => set({ currentAssignmentId: null, status: 'idle', paperData: null, error: null }),
}));
