import React, { useState, useEffect } from 'react';
import { Student, Subject } from '../types';
import { calculateCode } from '../services/gradeService';
import { EditIcon } from './icons/EditIcon';
import { SaveIcon } from './icons/SaveIcon';

interface ReportCardProps {
  student: Student;
  onUpdate: (student: Student) => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ student, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableStudent, setEditableStudent] = useState<Student>(student);

  useEffect(() => {
    setEditableStudent(student);
  }, [student]);

  const handleSubjectChange = (subjectIndex: number, newScore: string) => {
    const score = parseInt(newScore, 10);
    const updatedSubjects = editableStudent.subjects.map((sub, i) => {
      if (i === subjectIndex) {
        return {
          ...sub,
          score: isNaN(score) ? 0 : score,
          code: isNaN(score) ? 0 : calculateCode(score),
        };
      }
      return sub;
    });
    setEditableStudent({ ...editableStudent, subjects: updatedSubjects });
  };
  
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditableStudent({ ...editableStudent, comments: e.target.value });
  };
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditableStudent({ ...editableStudent, name: e.target.value });
  };

  const handleLearnerIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditableStudent({ ...editableStudent, learnerId: e.target.value });
  };

  const handleSave = () => {
    onUpdate(editableStudent);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditableStudent(student);
    setIsEditing(false);
  };

  const studentData = isEditing ? editableStudent : student;

  // FIX: Update TDCenter to accept all standard `<td>` props, such as `colSpan`, to resolve type errors.
  const TDCenter = ({ children, className, ...rest }: React.ComponentProps<'td'>) => (
    <td className={`border border-black text-center p-1 ${className || ''}`} {...rest}>{children}</td>
  );
  
  // FIX: Replaced &nbsp; with a valid JSX expression to prevent parsing issues.
  const TDEmpty = () => <TDCenter>{'\u00A0'}</TDCenter>;
  
  // FIX: Update TDLeft to accept all standard `<td>` props for consistency.
  const TDLeft = ({ children, className, ...rest }: React.ComponentProps<'td'>) => (
    <td className={`border border-black p-1 ${className || ''}`} {...rest}>{children}</td>
  );

  return (
    <div id={`report-card-${student.id}`} className="report-card-printable bg-white rounded-lg shadow-md overflow-hidden relative font-sans text-gray-800 text-[10px] leading-tight">
      <div className="p-4 border border-black min-h-[800px]">
        {/* EDIT BUTTONS */}
        <div className="no-print absolute top-2 right-2 flex space-x-2">
            {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors bg-white bg-opacity-50 rounded p-1">
                <EditIcon className="w-4 h-4 mr-1" />
                Edit
                </button>
            ) : (
                <>
                    <button onClick={handleSave} className="flex items-center text-sm font-medium text-green-600 hover:text-green-800 transition-colors bg-white bg-opacity-50 rounded p-1">
                    <SaveIcon className="w-4 h-4 mr-1" />
                    Save
                    </button>
                    <button onClick={handleCancel} className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors bg-white bg-opacity-50 rounded p-1">
                        Cancel
                    </button>
                </>
            )}
        </div>
        
        {/* HEADER */}
        <header className="flex justify-between items-start mb-2">
            <div className="flex items-center space-x-2">
                <svg className="w-12 h-12" viewBox="0 0 100 100">
                    <rect width="100" height="100" fill="#333" />
                    <text x="50" y="55" fontFamily="Arial, sans-serif" fontSize="40" fill="white" textAnchor="middle">WCG</text>
                </svg>
                <div>
                    <p className="font-bold text-xs">Western Cape Government</p>
                    <p className="text-[9px]">Education</p>
                </div>
            </div>
            <div className="text-right">
                <p className="font-bold text-sm">MURRAY HIGH SCHOOL</p>
            </div>
        </header>

        {/* TITLE */}
        <div className="text-left my-2">
            <h2 className="font-bold text-sm">{studentData.year} TERM {studentData.term} REPORT CARD: GRADE {studentData.gradeLevel}</h2>
        </div>

        {/* STUDENT INFO */}
        <div className="grid grid-cols-1 text-xs mb-2 space-y-1">
            <div><span className="font-bold inline-block w-32">Date issued:</span> {studentData.dateIssued}</div>
            <div>
                <span className="font-bold inline-block w-32">Surname & Name of Learner:</span>
                {isEditing ? <input type="text" value={editableStudent.name} onChange={handleNameChange} className="ml-1 bg-slate-100 p-0.5 rounded border border-blue-300" /> : ` ${studentData.name}`}
            </div>
            <div><span className="font-bold inline-block w-32">Learner Cemis No:</span>
                {isEditing ? <input type="text" value={editableStudent.learnerId} onChange={handleLearnerIdChange} className="ml-1 bg-slate-100 p-0.5 rounded border border-blue-300" /> : ` ${studentData.learnerId}`}
            </div>
        </div>

        {/* PERFORMANCE TABLE */}
        <table className="w-full border-collapse border border-black mb-2">
            <thead>
                <tr className="font-bold bg-gray-200">
                    <TDCenter colSpan={7}>LEARNER PERFORMANCE</TDCenter>
                </tr>
                <tr className="font-bold bg-gray-200">
                    <td rowSpan={2} className="border border-black p-1 align-bottom">SUBJECTS</td>
                    <td colSpan={2} className="border border-black p-1 text-center">TERM 1</td>
                    <td colSpan={2} className="border border-black p-1 text-center">TERM 2</td>
                    <td colSpan={2} className="border border-black p-1 text-center">TERM 3</td>
                </tr>
                <tr className="font-bold bg-gray-200">
                    <TDCenter>%</TDCenter><TDCenter>Code</TDCenter>
                    <TDCenter>%</TDCenter><TDCenter>Code</TDCenter>
                    <TDCenter>%</TDCenter><TDCenter>Code</TDCenter>
                </tr>
            </thead>
            <tbody>
                {studentData.subjects.map((subject, index) => (
                    <tr key={index}>
                        <TDLeft>{subject.name}</TDLeft>
                        <TDEmpty /><TDEmpty />
                        <TDEmpty /><TDEmpty />
                        <TDCenter>
                            {isEditing ? (
                                <input type="number" value={subject.score} onChange={(e) => handleSubjectChange(index, e.target.value)} className="w-10 text-center bg-slate-100 rounded border border-blue-300 p-0.5" />
                            ) : subject.score}
                        </TDCenter>
                        <TDCenter>{subject.code || ''}</TDCenter>
                    </tr>
                ))}
            </tbody>
        </table>
        
        {/* DAYS ABSENT */}
        <table className="w-full border-collapse border border-black mb-2">
           <tbody>
                <tr>
                    <TDLeft>Days Absent</TDLeft>
                    <TDEmpty />
                    <TDEmpty />
                    <TDEmpty />
                </tr>
           </tbody>
        </table>

        {/* COMMENTS */}
        <div className="border border-black p-1 mb-2">
            <p className="font-bold">TERM {studentData.term} COMMENTS</p>
             {isEditing ? (
                <textarea value={editableStudent.comments} onChange={handleCommentChange} rows={2} className="w-full bg-slate-100 rounded border border-blue-300 p-1 text-xs" />
             ) : (
                <p className="h-8">{studentData.comments}</p>
             )}
        </div>
        
        {/* DATES & SIGNATURES from original template - keeping as is */}
        <div className="grid grid-cols-2 gap-x-8 text-xs mb-2">
            <div><span className="font-bold">School closes on:</span> 2022/12/14 <span className="italic">(Learners)</span></div>
            <div><span className="font-bold">Teacher:</span> ............................................</div>
            <div><span className="font-bold">School re-opens on:</span> 2023/01/18 <span className="italic">(Learners)</span></div>
            <div><span className="font-bold">Principal:</span> ..........................................</div>
            <div>&nbsp;</div>
            <div><span className="font-bold">Parent / Guardian:</span> ..................................</div>
        </div>

        {/* GUIDELINES */}
        <table className="w-full border-collapse border border-black mb-2">
            <thead className="bg-gray-200 font-bold text-center"><tr className="border border-black"><td colSpan={3} className="p-1">MINIMUM PROGRESSION GUIDELINES FOR GRADES 4-6</td></tr></thead>
            <tbody>
                <tr><TDLeft>Home Language</TDLeft><TDLeft>AND</TDLeft><TDLeft>Level 4 (50-59%)</TDLeft></tr>
                <tr><TDLeft>First Additional Language</TDLeft><TDLeft>AND</TDLeft><TDLeft>Level 3 (40-49%)</TDLeft></tr>
                <tr><TDLeft>Mathematics</TDLeft><TDLeft>AND</TDLeft><TDLeft>Level 3 (40-49%)</TDLeft></tr>
                <tr><TDLeft>Any 2 (two) other subjects</TDLeft><TDLeft>AND</TDLeft><TDLeft>Level 3 (40-49%)</TDLeft></tr>
            </tbody>
        </table>

        {/* CODING SYSTEM */}
        <div className="relative">
            <table className="w-full border-collapse border border-black">
                <thead className="bg-gray-200 font-bold text-center"><tr className="border border-black"><td colSpan={3} className="p-1">NATIONAL CODING SYSTEM GRADES 4-6</td></tr></thead>
                <tbody>
                    <tr className="font-bold bg-gray-100"><TDCenter>RATING CODE</TDCenter><TDLeft>DESCRIPTION OF COMPETENCE</TDLeft><TDCenter>PERCENTAGE</TDCenter></tr>
                    <tr><TDCenter>7</TDCenter><TDLeft>Outstanding Achievement</TDLeft><TDCenter>80 - 100%</TDCenter></tr>
                    <tr><TDCenter>6</TDCenter><TDLeft>Meritorious Achievement</TDLeft><TDCenter>70 - 79%</TDCenter></tr>
                    <tr><TDCenter>5</TDCenter><TDLeft>Substantial Achievement</TDLeft><TDCenter>60 - 69%</TDCenter></tr>
                    <tr><TDCenter>4</TDCenter><TDLeft>Adequate Achievement</TDLeft><TDCenter>50 - 59%</TDCenter></tr>
                    <tr><TDCenter>3</TDCenter><TDLeft>Moderate Achievement</TDLeft><TDCenter>40 - 49%</TDCenter></tr>
                    <tr><TDCenter>2</TDCenter><TDLeft>Elementary Achievement</TDLeft><TDCenter>30 - 39%</TDCenter></tr>
                    <tr><TDCenter>1</TDCenter><TDLeft>Not achieved</TDLeft><TDCenter>0 - 29%</TDCenter></tr>
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;