import { Worker, Job } from 'bullmq';
import { redisConnection } from '../config/redis';
import { Assignment } from '../models/Assignment';
import { generatePaperContent } from '../services/ai.service';
import { getIo } from '../sockets/socketManager';

export const startWorker = () => {
  const worker = new Worker('paper-generation', async (job: Job) => {
    const { assignmentId } = job.data;
    const io = getIo();
    
    try {
      const assignment = await Assignment.findById(assignmentId);
      if (!assignment) throw new Error('Assignment not found');

      assignment.status = 'processing';
      await assignment.save();
      
      io.emit('paperUpdate', { assignmentId, status: 'processing' });

      const parsedPaper = await generatePaperContent(
        assignment.questionTypes,
        assignment.totalQuestions,
        assignment.totalMarks,
        assignment.additionalInstructions || '',
        assignment.documentImage
      );

      assignment.generatedPaper = parsedPaper;
      assignment.status = 'completed';
      await assignment.save();

      io.emit('paperUpdate', { assignmentId, status: 'completed', paper: parsedPaper });
      
    } catch (error: any) {
      console.error(`Job failed for assignment ${assignmentId}:`, error);
      
      await Assignment.findByIdAndUpdate(assignmentId, { status: 'failed' });
      io.emit('paperUpdate', { assignmentId, status: 'failed', error: error.message });
      throw error;
    }
  }, { connection: redisConnection as any });

  worker.on('completed', job => {
    console.log(`Job with id ${job.id} has been completed`);
  });

  worker.on('failed', (job, err) => {
    console.error(`Job with id ${job?.id} has failed with ${err.message}`);
  });
};
