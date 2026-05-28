import { Schema, model, Document } from 'mongoose';

export interface IAssignment extends Document {
  title?: string;
  dueDate: Date;
  questionTypes: string[];
  totalQuestions: number;
  totalMarks: number;
  additionalInstructions?: string;
  documentImage?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  generatedPaper?: any;
  createdAt: Date;
}

const assignmentSchema = new Schema<IAssignment>({
  title: { type: String, default: 'Generated Assignment' },
  dueDate: { type: Date, required: true },
  questionTypes: { type: [String], required: true },
  totalQuestions: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  additionalInstructions: { type: String },
  documentImage: { type: String },
  status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
  generatedPaper: { type: Schema.Types.Mixed },
}, { timestamps: true });

export const Assignment = model<IAssignment>('Assignment', assignmentSchema);
