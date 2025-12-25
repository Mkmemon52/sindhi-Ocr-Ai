
import React, { useState, useRef } from 'react';
import { Download, FileText, RotateCcw, CheckCircle, AlertCircle, Edit3, Save, HelpCircle, Zap, Type as TypeIcon } from 'lucide-react';
import { Uploader } from './components/Uploader';
import { PaperPreview } from './components/PaperPreview';
import { geminiService } from './services/geminiService';
import { QuestionPaperContent, ProcessingStatus, Section } from './types';

// Helper to compress image before uploading - slightly lower res for faster upload but enough for OCR
const compressImage = (base64: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 1000; // Optimized width for Flash speed
      let width = img.width;
      let height = img.height;

      if (width > MAX_WIDTH) {
        height *= MAX_WIDTH / width;
        width = MAX_WIDTH;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.7)); 
    };
  });
};

export default function App() {
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [content, setContent] = useState<QuestionPaperContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const processingRef = useRef<boolean>(false);

  const handleUpload = async (file: File) => {
    if (processingRef.current) return;
    
    setStatus('processing');
    setError(null);
    processingRef.current = true;
    
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const rawBase64 = reader.result as string;
        const compressedBase64 = await compressImage(rawBase64);
        
        // Flash is fast, so 30s timeout is sufficient
        const timeoutId = setTimeout(() => {
          if (processingRef.current) {
            setError("The transcription process timed out. Please try a smaller or clearer image.");
            setStatus('error');
            processingRef.current = false;
          }
        }, 30000);

        try {
          const result = await geminiService.processImage(compressedBase64);
          clearTimeout(timeoutId);
          setContent({ ...result, mainTitleFontSize: 22 });
          setStatus('success');
        } catch (err: any) {
          clearTimeout(timeoutId);
          setError(err.message || 'Processing failed. Ensure image has clear text.');
          setStatus('error');
        } finally {
          processingRef.current = false;
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Upload failed.');
      setStatus('error');
      processingRef.current = false;
    }
  };

  const updateHeader = (field: keyof QuestionPaperContent, value: any) => {
    if (!content) return;
    setContent({ ...content, [field]: value });
  };

  const updateSection = (index: number, field: keyof Section, value: any) => {
    if (!content) return;
    const newSections = [...content.sections];
    newSections[index] = { ...newSections[index], [field]: value };
    setContent({ ...content, sections: newSections });
  };

  const handlePrint = () => {
    setTimeout(() => { window.print(); }, 100);
  };

  const handleReset = () => {
    setStatus('idle');
    setContent(null);
    setError(null);
    setIsEditing(false);
    processingRef.current = false;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-30 print:hidden shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg shadow-blue-100 shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 leading-none">SindhiPaper AI</h1>
              <p className="text-[10px] text-blue-600 mt-1 uppercase tracking-widest font-black flex items-center gap-1">
                <Zap className="w-2.5 h-2.5 fill-current" /> Verbatim Mode
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {status === 'success' && content && (
              <>
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl transition-all ${isEditing ? 'bg-green-600 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {isEditing ? <><Save className="w-4 h-4" /> Save</> : <><Edit3 className="w-4 h-4" /> Edit Paper</>}
                </button>
                <div className="h-6 w-px bg-slate-200"></div>
                <button 
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  Save as PDF
                </button>
                <button onClick={handleReset} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                  <RotateCcw className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
        {!content && (status === 'idle' || status === 'error') && (
          <div className="max-w-3xl mx-auto mt-8 space-y-10">
            <div className="text-center space-y-4">
              <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Sindhi Paper <span className="text-blue-600">Verbatim</span>
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
                Upload image of handwritten or printed paper. We transcribe exactly what is there.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-6 flex gap-4 animate-in fade-in zoom-in shadow-sm">
                <AlertCircle className="w-6 h-6 text-red-600 shrink-0 mt-1" />
                <div className="space-y-3">
                  <h4 className="font-bold text-red-900">Error</h4>
                  <p className="text-red-700 text-sm leading-relaxed">{error}</p>
                  <button onClick={handleReset} className="text-sm font-black text-red-900 hover:underline">RETRY</button>
                </div>
              </div>
            )}
            
            <Uploader onUpload={handleUpload} isLoading={false} />
            
            <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 flex gap-4 items-start">
              <HelpCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-bold">Important Instructions:</p>
                <ul className="list-disc ml-4 mt-2 space-y-1 opacity-80">
                  <li>No image? No problem. Leave it blank and type manually.</li>
                  <li>OCR focuses on the 52-letter Sindhi alphabet.</li>
                  <li>Labels like "Class:" only appear if written in the image.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {status === 'processing' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-in fade-in">
            <div className="relative">
              <div className="w-32 h-32 border-8 border-blue-100 rounded-full"></div>
              <div className="absolute inset-0 w-32 h-32 border-8 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap className="w-10 h-10 text-blue-600 animate-pulse fill-current" />
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-black text-slate-800 tracking-tight">Transcribing...</h3>
              <p className="text-slate-500 max-w-md mx-auto font-bold uppercase text-xs tracking-widest">
                Analyzing dots and script details
              </p>
            </div>
          </div>
        )}

        {content && status === 'success' && (
          <div className={`grid lg:grid-cols-[1fr_${isEditing ? '480px' : '380px'}] gap-8 mt-4 animate-in fade-in slide-in-from-bottom-8 duration-500`}>
            <div className="bg-slate-200/50 p-4 md:p-12 rounded-[2.5rem] border border-slate-300 shadow-inner overflow-auto flex justify-center">
              <PaperPreview content={content} />
            </div>

            <div className="space-y-6 print:hidden">
              {isEditing ? (
                <div className="bg-white p-6 rounded-3xl border-2 border-slate-300 shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto">
                  <h3 className="text-xl font-bold text-slate-900 border-b pb-4 flex items-center gap-2">
                    <Edit3 className="w-5 h-5 text-blue-600" /> Manual Data Entry
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs uppercase font-bold text-slate-700 block mb-1">Institution Name</label>
                      <input 
                        className="w-full p-3 bg-white border-2 border-slate-300 rounded-xl text-lg font-bold text-black focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                        value={content.institutionName} 
                        onChange={(e) => updateHeader('institutionName', e.target.value)}
                        placeholder="Enter school name..."
                      />
                    </div>

                    <div className="p-4 bg-blue-50 border-2 border-blue-100 rounded-2xl space-y-3">
                      <div className="flex items-center gap-2 font-bold text-blue-900 text-sm">
                        <TypeIcon className="w-4 h-4" />
                        Title Font Size
                      </div>
                      <input 
                        type="range" 
                        min="14" 
                        max="60" 
                        step="1"
                        className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        value={content.mainTitleFontSize || 22}
                        onChange={(e) => updateHeader('mainTitleFontSize', parseInt(e.target.value))}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs uppercase font-bold text-slate-700 block mb-1">Exam Name</label>
                      <input 
                        className="w-full p-3 bg-white border-2 border-slate-300 rounded-xl text-lg text-black focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm font-bold"
                        value={content.examName} 
                        onChange={(e) => updateHeader('examName', e.target.value)}
                        placeholder="e.g. Annual Exam 2024"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs uppercase font-bold text-slate-700 block mb-1">Class Info</label>
                        <input className="w-full p-3 bg-white border-2 border-slate-300 rounded-xl text-black font-bold" value={content.classGrade} onChange={(e) => updateHeader('classGrade', e.target.value)} placeholder="Class: VIII" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs uppercase font-bold text-slate-700 block mb-1">Subject Info</label>
                        <input className="w-full p-3 bg-white border-2 border-slate-300 rounded-xl text-black font-bold" value={content.subject} onChange={(e) => updateHeader('subject', e.target.value)} placeholder="Subject: Sindhi" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs uppercase font-bold text-slate-700 block mb-1">Date Info</label>
                        <input className="w-full p-3 bg-white border-2 border-slate-300 rounded-xl text-black font-bold" value={content.date} onChange={(e) => updateHeader('date', e.target.value)} placeholder="Date: 12-05-2024" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs uppercase font-bold text-slate-700 block mb-1">Marks</label>
                        <input className="w-full p-3 bg-white border-2 border-slate-300 rounded-xl text-black font-bold" value={content.totalMarks} onChange={(e) => updateHeader('totalMarks', e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs uppercase font-bold text-slate-700 block mb-1">Time</label>
                        <input className="w-full p-3 bg-white border-2 border-slate-300 rounded-xl text-black font-bold" value={content.timeAllowed} onChange={(e) => updateHeader('timeAllowed', e.target.value)} />
                      </div>
                    </div>
                    
                    {content.sections.map((sec, sIdx) => (
                      <div key={sIdx} className="pt-4 border-t-2 border-slate-100 space-y-4">
                        <label className="text-xs uppercase font-bold text-slate-700 block mb-1">Question Text</label>
                        {sec.questions.map((q, qIdx) => (
                          <div key={qIdx} className="space-y-1 p-3 bg-slate-50 border-r-4 border-slate-300 rounded-lg">
                             <textarea 
                              className="w-full p-3 bg-white border-2 border-slate-300 rounded-xl sindhi-text text-xl text-black min-h-[80px]"
                              dir="rtl"
                              value={q.text} 
                              onChange={(e) => {
                                const newQs = [...sec.questions];
                                newQs[qIdx] = { ...newQs[qIdx], text: e.target.value };
                                updateSection(sIdx, 'questions', newQs);
                              }}
                             />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => setIsEditing(false)}
                    className="w-full py-4 bg-green-600 text-white font-black rounded-2xl shadow-xl hover:bg-green-700 transition-all flex items-center justify-center gap-2 sticky bottom-0 z-10"
                  >
                    <CheckCircle className="w-5 h-5" />
                    APPLY DATA
                  </button>
                </div>
              ) : (
                <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-xl space-y-6">
                  <div className="bg-blue-50 p-4 rounded-2xl flex items-center gap-3 text-blue-700">
                    <CheckCircle className="w-6 h-6 shrink-0" />
                    <span className="font-black text-lg">Verbatim Result Ready</span>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                      Review the verbatim output. You can edit any missing text manually.
                    </p>
                    
                    <button 
                      onClick={handlePrint}
                      className="w-full py-4 bg-blue-600 text-white rounded-[1.25rem] font-black text-xl flex items-center justify-center gap-3 hover:bg-blue-700 shadow-2xl shadow-blue-300 transition-all active:scale-95"
                    >
                      <Download className="w-6 h-6" />
                      SAVE AS PDF
                    </button>

                    <button 
                      onClick={() => setIsEditing(true)}
                      className="w-full py-3 bg-white text-slate-700 border-2 border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit3 className="w-4 h-4 text-blue-500" />
                      Edit Content
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
