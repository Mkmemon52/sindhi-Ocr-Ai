
import React from 'react';
import { QuestionPaperContent } from '../types';

interface PaperPreviewProps {
  content: QuestionPaperContent;
}

export const PaperPreview: React.FC<PaperPreviewProps> = ({ content }) => {
  const mainTitleStyle = {
    fontSize: `${content.mainTitleFontSize || 22}px`,
  };

  const hasHeaderContent = content.institutionName || content.examName || content.classGrade || content.subject || content.date;

  return (
    <div 
      id="printable-area" 
      className="bg-white shadow-2xl mx-auto w-full max-w-[210mm] min-h-[297mm] p-[15mm] border border-gray-100 print:shadow-none print:border-none flex flex-col overflow-hidden text-black font-formal-serif" 
      dir="ltr"
    >
      {/* Institution Name */}
      {content.institutionName && (
        <div className="text-center">
          <h1 
            style={mainTitleStyle}
            className="font-bold uppercase tracking-tight text-black leading-tight"
          >
            {content.institutionName}
          </h1>
        </div>
      )}

      {/* Exam Name */}
      {content.examName && (
        <div className="text-center mt-1">
          <h2 className="text-xl font-bold text-black">
            {content.examName}
          </h2>
        </div>
      )}

      {/* Info Row: Verbatim values only (no hardcoded labels) */}
      {(content.classGrade || content.subject || content.date) && (
        <div className="flex justify-between items-baseline text-lg font-bold mt-4 px-1">
          <div className="flex-1 text-left whitespace-nowrap">
            {content.classGrade}
          </div>
          <div className="flex-1 text-center whitespace-nowrap">
            {content.subject}
          </div>
          <div className="flex-1 text-right whitespace-nowrap">
            {content.date}
          </div>
        </div>
      )}

      {/* Double Line Divider - Shows only if there is header info above it */}
      {hasHeaderContent && (
        <div className="double-line-divider"></div>
      )}

      {/* Marks and Time */}
      {(content.totalMarks || content.timeAllowed) && (
        <div className="flex justify-end gap-6 text-sm font-bold mb-4 italic mt-1" dir="rtl">
          {content.totalMarks && <span>{content.totalMarks}</span>}
          {content.timeAllowed && <span>{content.timeAllowed}</span>}
        </div>
      )}

      {/* Questions Section - Verbatim RTL */}
      <div className="space-y-8 flex-1 mt-4" dir="rtl">
        {content.sections && content.sections.length > 0 ? (
          content.sections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-4">
              {section.title && (
                <div className="flex justify-between items-baseline border-b border-black/10 pb-1">
                  <h3 className="text-xl font-bold sindhi-text text-black">
                    {section.title}
                  </h3>
                  {section.instructions && (
                    <span className="text-base italic sindhi-text text-black/70 font-medium mr-4">
                      {section.instructions}
                    </span>
                  )}
                </div>
              )}

              <div className="space-y-6 pr-2">
                {section.questions && section.questions.map((q, qIdx) => (
                  <div key={qIdx} className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <p className="sindhi-text text-2xl leading-tight text-justify flex-1 whitespace-pre-wrap text-black">
                        {q.text}
                      </p>
                    </div>
                    {q.marks && (
                      <span className="text-base font-bold text-black whitespace-nowrap pt-1">
                        {q.marks}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : null}
      </div>
    </div>
  );
};
