'use client';

import React, { useRef } from 'react';
import { Section } from '../store/useAssignmentStore';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

interface Props {
  paperData: { sections: Section[] };
}

export const QuestionPaperView: React.FC<Props> = ({ paperData }) => {
  const paperRef = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    if (!paperRef.current) return;
    
    // Use html-to-image to support modern CSS color functions from Tailwind v4
    const imgData = await toPng(paperRef.current, { 
      pixelRatio: 2,
      backgroundColor: '#ffffff'
    });
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // For standard A4:
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const imgProps = (pdf as any).getImageProperties(imgData);
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    // If the image is longer than one page, jsPDF addImage will just scale it down or we can just stick it to 1 long page
    // Here we let it scale or just map it 
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
    pdf.save('generated-question-paper.pdf');
  };

  return (
    <div className="max-w-4xl mx-auto my-8">
      <div className="flex justify-end mb-4">
        <button 
          onClick={downloadPDF}
          className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition shadow-sm font-medium"
        >
          Download PDF
        </button>
      </div>

      <div 
        ref={paperRef}
        className="bg-white p-10 shadow-lg rounded-sm border border-gray-200 text-gray-900"
      >
        {/* Header / Student Info */}
        <div className="border-b-2 border-gray-800 pb-6 mb-8 text-center space-y-4">
          <h1 className="text-3xl font-bold uppercase tracking-wider">Assessment Test</h1>
          
          <div className="flex justify-between items-center text-sm font-medium pt-4">
            <div className="flex -items-center space-x-2 w-1/3">
              <span>Name:</span>
              <div className="border-b border-gray-400 flex-grow"></div>
            </div>
            <div className="flex items-center space-x-2 w-1/4">
              <span>Roll No:</span>
              <div className="border-b border-gray-400 flex-grow"></div>
            </div>
            <div className="flex items-center space-x-2 w-1/4">
              <span>Section:</span>
              <div className="border-b border-gray-400 flex-grow"></div>
            </div>
          </div>
        </div>

        {/* Paper Body */}
        <div className="space-y-10">
          {paperData.sections.map((sec, sIndex) => (
            <div key={sIndex} className="space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-bold underline decoration-2">{sec.sectionName}</h3>
                {sec.instructions && (
                  <p className="text-sm italic text-gray-600 mt-1">({sec.instructions})</p>
                )}
              </div>
              
              <div className="space-y-6 pt-4">
                {sec.questions.map((q, qIndex) => (
                  <div key={qIndex} className="flex gap-4 items-start pb-4 border-b border-gray-100 last:border-0 border-dashed">
                    <span className="font-bold text-lg min-w-[24px]">Q{qIndex + 1}.</span>
                    <div className="flex-grow">
                      <p className="text-base text-gray-800 leading-relaxed font-medium">
                        {q.questionText}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                          q.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                          q.difficulty === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {q.difficulty}
                        </span>
                      </div>
                    </div>
                    <div className="font-bold min-w-[60px] text-right">
                      [{q.marks} Marks]
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer */}
        <div className="mt-16 text-center text-gray-400 text-xs font-semibold">
          *** END OF PAPER ***
        </div>
      </div>
    </div>
  );
};
