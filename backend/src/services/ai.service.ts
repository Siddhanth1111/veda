import { model } from '../config/gemini';

export const generateQuestionPaperPrompt = (
  types: string[], 
  count: number, 
  marks: number, 
  instructions: string
) => {
  return `You are an expert academic evaluator. Create a well-structured question paper based on the following criteria:
- Types of questions: ${types.join(', ')}
- Total number of questions: ${count}
- Total Marks: ${marks}
- Additional Instructions: ${instructions || 'None'}

Format the output strictly as a JSON object with the following structure:
{
  "sections": [
    {
      "sectionName": "Section A",
      "instructions": "Attempt all questions.",
      "questions": [
        {
          "questionText": "What is ...?",
          "difficulty": "Easy",
          "marks": 5
        }
      ]
    }
  ]
}

Ensure the sum of "marks" for all questions matches the total marks (${marks}), and the total number of questions matches ${count}. Use exactly the keys specified above. Do not include markdown formatting like \`\`\`json. Output ONLY valid JSON.`;
};

export const generatePaperContent = async (
  types: string[], 
  count: number, 
  marks: number, 
  instructions: string,
  documentImage?: string
) => {
  const geminiModel = model();
  let prompt = generateQuestionPaperPrompt(types, count, marks, instructions);
  
  if (documentImage) {
    prompt += `\n\nAlso, reference the uploaded document for context while strictly keeping to the requested question types and total marks. Base some questions on the uploaded materials if appropriate.`;
  }
  
  const requestContent: any[] = [prompt];
  
  if (documentImage) {
    // Expect documentImage to be a data URL like "data:image/jpeg;base64,/9j/4..."
    const mimeTypeMatch = documentImage.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
    const mimeType = mimeTypeMatch && mimeTypeMatch.length ? mimeTypeMatch[1] : 'image/jpeg';
    const base64Data = documentImage.split(',')[1];
    
    if (base64Data) {
      requestContent.push({
        inlineData: {
          data: base64Data,
          mimeType
        }
      });
    }
  }

  const result = await geminiModel.generateContent(requestContent);
  const response = result.response;
  const text = response.text();
  
  try {
    let cleanedText = text;
    const startIndex = cleanedText.indexOf('{');
    const endIndex = cleanedText.lastIndexOf('}');
    
    if (startIndex !== -1 && endIndex !== -1) {
      cleanedText = cleanedText.substring(startIndex, endIndex + 1);
    }
    
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Failed to parse AI response:", text);
    throw new Error("AI returned malformed JSON");
  }
};
