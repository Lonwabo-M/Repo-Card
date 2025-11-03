export interface Subject {
  name: string;
  score: number; // This will be the "Final" score
  code: number;
}

export interface Student {
  id: string;
  name: string;
  learnerId: string;
  subjects: Subject[];
  comments: string;
  gradeLevel: string;
  year: number;
  term: string;
  dateIssued: string;
}

export interface ReportCardBatch {
  id: string;
  fileName: string;
  uploadDate: string;
  grade: string;
  className: string;
  students: Student[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  school: string;
  province: string;
  password?: string; // Only used for registration/updates, not stored in session
  resetToken?: string;
  resetTokenExpiry?: number;
}

export type AppState = 'homepage' | 'dashboard' | 'upload' | 'review' | 'class_reports' | 'login' | 'register' | 'forgot_password' | 'reset_password';