import { Request, Response } from 'express';
import { Assignment } from '../models/Assignment';
import { addGenerationJob } from '../workers/queue';
import { z } from 'zod';

const createAssignmentSchema = z.object({
  title: z.string().optional(),
  dueDate: z.string(),
  questionTypes: z.array(z.string()).min(1),
  totalQuestions: z.number().positive(),
  totalMarks: z.number().positive(),
  additionalInstructions: z.string().optional(),
  documentImage: z.string().optional()
});

export const createAssignment = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = createAssignmentSchema.parse(req.body);
    
    const assignment = new Assignment({
      ...validatedData,
      status: 'pending'
    });
    
    await assignment.save();
    
    // Add to BullMQ queue
    await addGenerationJob(assignment._id.toString());
    
    res.status(201).json({ success: true, assignmentId: assignment._id });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, errors: error.issues });
      return;
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAssignmentInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      res.status(404).json({ success: false, message: 'Not found' });
      return;
    }
    
    res.status(200).json({ success: true, data: assignment });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllAssignments = async (req: Request, res: Response): Promise<void> => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: assignments });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAssignment = async (req: Request, res: Response): Promise<void> => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) {
      res.status(404).json({ success: false, message: 'Not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
