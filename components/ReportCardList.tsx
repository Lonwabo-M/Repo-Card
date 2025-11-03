import React, { useState } from 'react';
import { Student } from '../types';
import ReportCard from './ReportCard';
import { PdfIcon } from './icons/PdfIcon';
import DownloadModal from './DownloadModal';

// Add global declarations for required libraries
declare var jspdf: any;
declare var html2canvas: any;
declare var JSZip: any;

interface ReportCardListProps {
  students: Student[];
  fileName: string;
  onUpdateStudent: (student: Student) => void;
}

const ReportCardList: React.FC<ReportCardListProps> = ({ students, fileName, onUpdateStudent }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingMessage, setGeneratingMessage] = useState('Generating PDF(s)...');

  const generatePdfBlob = async (student: Student): Promise<Blob | null> => {
    const { jsPDF } = jspdf;
    const reportCardElement = document.getElementById(`report-card-${student.id}`);

    if (reportCardElement) {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const margin = 10;

        const canvas = await html2canvas(reportCardElement, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        
        const imgProps = pdf.getImageProperties(imgData);
        const imgWidth = pdfWidth - margin * 2;
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
        return pdf.output('blob');
    }
    return null;
  };

  const downloadBlob = (blob: Blob, fileName: string) => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const handleDownloadRequest = async (studentId: string | 'all') => {
    setIsModalOpen(false);
    setIsGenerating(true);

    try {
        if (studentId === 'all') {
            setGeneratingMessage('Generating ZIP file...');
            const zip = new JSZip();

            for (const student of students) {
                const pdfBlob = await generatePdfBlob(student);
                if (pdfBlob) {
                    const outputFileName = `report-card-${student.name.replace(/\s+/g, '_')}.pdf`;
                    zip.file(outputFileName, pdfBlob);
                }
            }
            
            const zipBlob = await zip.generateAsync({ type: "blob" });
            const zipFileName = `report-cards-${fileName.split('.')[0] || 'all'}.zip`;
            downloadBlob(zipBlob, zipFileName);

        } else {
            setGeneratingMessage('Generating PDF...');
            const studentToPrint = students.find(s => s.id === studentId);
            if (studentToPrint) {
                const pdfBlob = await generatePdfBlob(studentToPrint);
                if (pdfBlob) {
                  const outputFileName = `report-card-${studentToPrint.name.replace(/\s+/g, '_')}.pdf`;
                  downloadBlob(pdfBlob, outputFileName);
                }
            } else {
                 console.warn("Selected student not found for PDF generation.");
            }
        }

    } catch (error) {
        console.error("Error generating file(s):", error);
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <div>
      {isGenerating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-xl text-center flex flex-col items-center">
                <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="font-semibold text-lg mt-4">{generatingMessage}</p>
                <p className="text-slate-500 mt-1">This may take a moment.</p>
            </div>
        </div>
      )}

      <div className="no-print flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Review Cards</h1>
            <p className="text-gray-500 mt-1">
                Displaying {students.length} records from <span className="font-medium text-indigo-600">{fileName}</span>
            </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
          >
            <PdfIcon className="w-5 h-5 mr-2" />
            Download
          </button>
        </div>
      </div>

      {isModalOpen && (
        <DownloadModal
          students={students}
          onClose={() => setIsModalOpen(false)}
          onDownload={handleDownloadRequest}
          isGenerating={isGenerating}
        />
      )}

      <div className="printable-grid grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
        {students.map(student => (
          <div key={student.id}>
            <ReportCard 
              student={student}
              onUpdate={onUpdateStudent}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportCardList;