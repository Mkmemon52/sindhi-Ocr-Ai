
export interface QuestionPaperContent {
  institutionName: string;
  examName: string;
  subject: string;
  classGrade: string;
  totalMarks: string;
  timeAllowed: string;
  date: string;
  sections: Section[];
  // Styling properties
  mainTitleFontSize?: number;
}

export interface Section {
  title: string;
  instructions: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  marks?: string;
}

export type ProcessingStatus = 'idle' | 'uploading' | 'processing' | 'success' | 'error';
