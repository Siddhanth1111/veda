import 'dotenv/config';
import { generatePaperContent } from './src/services/ai.service';
(async () => {
    try {
        console.log('Testing AI generation...');
        const res = await generatePaperContent(['MCQ'], 2, 10, '');
        console.log('Success:', res);
    } catch (e: any) {
        console.error('Error:', e.message);
    }
})();