import React, { useState, useCallback, useEffect } from 'react';
import { Student, AppState, ReportCardBatch, User } from './types';
import { calculateCode } from './services/gradeService';
import { getBatches, saveBatches } from './services/storageService';
import { getCurrentUser, login, register, logout, requestPasswordReset, resetPassword } from './services/authService';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import FileUpload from './components/FileUpload';
import ReportCardList from './components/ReportCardList';
import Homepage from './components/Homepage';
import ClassReports from './components/ClassReports';
import Login from './components/Login';
import Register from './components/Register';
import AuthLayout from './components/AuthLayout';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import { GoogleGenAI, Type } from "@google/genai";

// Let TypeScript know Papa, XLSX, jsPDF, and html2canvas are available globally
declare var Papa: any;
declare var XLSX: any;
declare var html2canvas: any;
declare var jspdf: any;
declare var JSZip: any;


const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [appState, setAppState] = useState<AppState>('homepage');
  const [batches, setBatches] = useState<ReportCardBatch[]>([]);
  const [activeBatchId, setActiveBatchId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisMessage, setAnalysisMessage] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
        setCurrentUser(user);
        setAppState('dashboard');
        setBatches(getBatches(user.id));
    }
  }, []);

  const handleFileParse = useCallback((file: File) => {
    if (!currentUser) {
      setError("You must be logged in to upload files.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisMessage('Reading file...');

    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            let text: string;
            
            const fileExtension = file.name.split('.').pop()?.toLowerCase();
            if (fileExtension === 'xlsx') {
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                text = XLSX.utils.sheet_to_csv(worksheet);
            } else {
                text = e.target?.result as string;
            }

            if (!text) {
                throw new Error("File is empty or could not be read.");
            }

            const lines = text.split('\n');
            const snippet = lines.slice(0, 5).join('\n');

            setAnalysisMessage('Analyzing file structure with AI...');
            
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Analyze the following CSV snippet and filename to identify key metadata.

Filename: "${file.name}"
CSV Snippet:
---
${snippet}
---

Identify the columns for student names, learner IDs, and subjects. Also, determine the overall grade and class identifier (e.g., "Grade 9", "Class A") for this entire file. The grade/class information might be in the filename or within the data columns.

Return a JSON object with the exact column header for the student's name, the learner ID, an array of the exact column headers for the subjects, the grade, and the class name. The JSON should follow this schema: { "nameColumn": string, "learnerIdColumn": string, "subjectColumns": string[], "grade": string, "className": string }. For example, if the grade is 9 and class is 'H', return { "grade": "9", "className": "H" }. If the filename is "Grade 10A Marks.csv", return { "grade": "10", "className": "A" }.`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            nameColumn: { type: Type.STRING, description: "The header of the column containing student names." },
                            learnerIdColumn: { type: Type.STRING, description: "The header of the column containing the learner's unique ID." },
                            subjectColumns: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of headers for the columns containing subject scores." },
                            grade: { type: Type.STRING, description: "The grade number for the students in this file, e.g., '9', '10'." },
                            className: { type: Type.STRING, description: "The class identifier for the students in this file, e.g., 'A', 'H', 'Science'." }
                        },
                        required: ["nameColumn", "learnerIdColumn", "subjectColumns", "grade", "className"]
                    }
                }
            });

            const jsonStr = response.text.trim();
            const { nameColumn, learnerIdColumn, subjectColumns, grade, className } = JSON.parse(jsonStr);

            setAnalysisMessage('Parsing data...');

            Papa.parse(text, {
                header: true,
                skipEmptyLines: true,
                complete: (results: { data: any[], errors: any[], meta: any }) => {
                    if (results.errors.length > 0) {
                        setError('Error parsing data. Please check the file format.');
                        setIsLoading(false);
                        setAnalysisMessage(null);
                        return;
                    }

                    if(!results.meta.fields.includes(nameColumn) || !results.meta.fields.includes(learnerIdColumn) || !subjectColumns.every((sc: string) => results.meta.fields.includes(sc))) {
                        setError('The structure identified by the AI does not match the file headers. Please check your file.');
                        setIsLoading(false);
                        setAnalysisMessage(null);
                        return;
                    }
                    
                    const parsedStudents: Student[] = results.data.map((row: any, index: number) => {
                      const studentName = row[nameColumn];
                      const learnerId = row[learnerIdColumn];
                      if (!studentName || !learnerId) return null;

                      const subjects = subjectColumns.map((subjectName: string) => {
                        const score = parseInt(row[subjectName], 10);
                        return {
                          name: subjectName,
                          score: isNaN(score) ? 0 : score,
                          code: isNaN(score) ? 0 : calculateCode(score),
                        };
                      });
                      
                      const currentDate = new Date();

                      return {
                        id: `${Date.now()}-${index}`,
                        name: studentName,
                        learnerId: learnerId,
                        subjects: subjects,
                        comments: 'Achieved',
                        gradeLevel: `${grade} ${className}`,
                        term: '3',
                        year: currentDate.getFullYear(),
                        dateIssued: currentDate.toLocaleDateString('en-CA'),
                      };
                    }).filter(Boolean) as Student[];

                    const newBatch: ReportCardBatch = {
                      id: Date.now().toString(),
                      fileName: file.name,
                      uploadDate: new Date().toISOString(),
                      grade,
                      className,
                      students: parsedStudents
                    };

                    const updatedBatches = [...batches, newBatch];
                    setBatches(updatedBatches);
                    saveBatches(currentUser!.id, updatedBatches);

                    setActiveBatchId(newBatch.id);
                    setAppState('review');
                    setIsLoading(false);
                    setAnalysisMessage(null);
                },
                error: (err: Error) => {
                    setError(`An error occurred during parsing: ${err.message}`);
                    setIsLoading(false);
                    setAnalysisMessage(null);
                }
            });

        } catch (e: any) {
            console.error(e);
            let errorMessage = 'An AI analysis error occurred. Please try again or check your file format.';
            if (e.message.includes("JSON.parse")) {
                errorMessage = "The AI failed to return a valid file structure. Please ensure your file has clear headers and try again.";
            }
            setError(errorMessage);
            setIsLoading(false);
            setAnalysisMessage(null);
        }
    };

    reader.onerror = () => {
        setError('Failed to read the file.');
        setIsLoading(false);
        setAnalysisMessage(null);
    };

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (fileExtension === 'xlsx' || fileExtension === 'csv') {
        setAppState('upload');
        if (fileExtension === 'xlsx') {
            reader.readAsArrayBuffer(file);
        } else {
            reader.readAsText(file);
        }
    } else {
        setError('Unsupported file type. Please upload a CSV or XLSX file.');
        setIsLoading(false);
        setAnalysisMessage(null);
    }
  }, [batches, currentUser]);

  const handleUpdateStudent = useCallback((updatedStudent: Student) => {
    if (!activeBatchId || !currentUser) return;

    const updatedBatches = batches.map(batch => {
      if (batch.id === activeBatchId) {
        const updatedStudents = batch.students.map(s => s.id === updatedStudent.id ? updatedStudent : s);
        return { ...batch, students: updatedStudents };
      }
      return batch;
    });

    setBatches(updatedBatches);
    saveBatches(currentUser.id, updatedBatches);
  }, [activeBatchId, batches, currentUser]);
  
  const handleNavigation = (state: AppState) => {
    setError(null);
    setAnalysisMessage(null);
    if(state !== 'review') {
        setActiveBatchId(null);
    }
    setAppState(state);
  }

  const handleViewBatch = (batchId: string) => {
    setActiveBatchId(batchId);
    setAppState('review');
  }

  const handleDeleteBatch = (batchId: string) => {
    if (!currentUser) return;
    if (window.confirm("Are you sure you want to delete this report card batch? This action cannot be undone.")) {
      const updatedBatches = batches.filter(b => b.id !== batchId);
      setBatches(updatedBatches);
      saveBatches(currentUser.id, updatedBatches);
      if (activeBatchId === batchId) {
        setActiveBatchId(null);
        setAppState('class_reports');
      }
    }
  }

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setBatches(getBatches(user.id));
    setAppState('dashboard');
  }

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    setBatches([]);
    setAppState('login');
  }

  const handleRequestPasswordReset = (email: string) => {
    const result = requestPasswordReset(email);
    if (result.success && result.token) {
      setResetToken(result.token);
      setAppState('reset_password');
      return { success: true, message: "A (simulated) password reset link has been sent." };
    }
    return result;
  };

  const handleResetPassword = (password: string) => {
    if (!resetToken) return { success: false, message: "No reset token found." };
    return resetPassword(resetToken, password);
  };

  const renderContent = () => {
    if (appState === 'homepage') {
      return <Homepage onGetStarted={() => handleNavigation('login')} />;
    }

    if (!currentUser) {
      return (
        <AuthLayout>
          {appState === 'login' && <Login onLogin={handleLogin} onNavigateRegister={() => setAppState('register')} onNavigateForgotPassword={() => setAppState('forgot_password')} />}
          {appState === 'register' && <Register onRegister={() => setAppState('login')} onNavigateLogin={() => setAppState('login')} />}
          {appState === 'forgot_password' && <ForgotPassword onRequestReset={handleRequestPasswordReset} onNavigateLogin={() => setAppState('login')} />}
          {appState === 'reset_password' && <ResetPassword onResetPassword={handleResetPassword} onNavigateLogin={() => setAppState('login')} />}
        </AuthLayout>
      );
    }

    const activeBatch = batches.find(b => b.id === activeBatchId);
    
    let mainContent;
    switch (appState) {
        case 'dashboard':
            mainContent = <Dashboard batches={batches} />;
            break;
        case 'class_reports':
            mainContent = <ClassReports batches={batches} onViewBatch={handleViewBatch} onDeleteBatch={handleDeleteBatch} />;
            break;
        case 'upload':
            mainContent = <FileUpload onFileSelect={handleFileParse} isLoading={isLoading} error={error} analysisMessage={analysisMessage} />;
            break;
        case 'review':
             if (!activeBatch) {
                mainContent = (
                    <div className="text-center py-10">
                        <h2 className="text-2xl font-bold text-slate-700">No report cards selected.</h2>
                        <p className="text-slate-500 mt-2">Go to the Class Reports tab to view a batch or upload a new file.</p>
                        <button 
                            onClick={() => handleNavigation('class_reports')}
                            className="mt-6 bg-indigo-600 text-white font-semibold py-2 px-5 rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                        >
                            Go to Class Reports
                        </button>
                    </div>
                );
            } else {
              mainContent = <ReportCardList 
                  students={activeBatch.students} 
                  fileName={activeBatch.fileName} 
                  onUpdateStudent={handleUpdateStudent}
                />;
            }
            break;
        default:
             mainContent = <Dashboard batches={batches} />;
    }

    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar 
          activeState={appState} 
          onNavigate={handleNavigation} 
          batchCount={batches.length}
          user={currentUser}
          onLogout={handleLogout}
        />
        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
            {mainContent}
        </main>
      </div>
    );
  }

  return renderContent();
};

export default App;