import React, { useRef } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { CsvIcon } from './icons/CsvIcon';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
  error: string | null;
  analysisMessage: string | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading, error, analysisMessage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onFileSelect(event.target.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Upload Marks</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <div 
                    className={`bg-white border-2 border-dashed border-gray-300 rounded-xl p-8 transition-colors duration-300 h-full flex flex-col justify-center text-center ${!isLoading && 'hover:border-indigo-500 cursor-pointer'}`}
                    onClick={!isLoading ? handleClick : undefined}
                    >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".csv,.xlsx"
                        disabled={isLoading}
                    />
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="bg-indigo-100 rounded-full p-4">
                            <UploadIcon className="w-10 h-10 text-indigo-600" />
                        </div>
                        <p className="text-lg font-semibold text-gray-700">
                            {analysisMessage || (isLoading ? 'Processing...' : 'Click to upload or drag and drop')}
                        </p>
                        <p className="text-sm text-gray-500">
                            CSV or XLSX files supported.
                        </p>
                    </div>
                </div>

                {isLoading && (
                    <div className="mt-6 flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 rounded-full bg-indigo-600 animate-bounce" style={{animationDelay: '0s'}}></div>
                        <div className="w-4 h-4 rounded-full bg-indigo-600 animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-4 h-4 rounded-full bg-indigo-600 animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                )}

                {error && (
                    <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                    </div>
                )}
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <CsvIcon className="w-6 h-6 mr-2 text-gray-500"/>
                    File Format Guide
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                    For best results, use a header row. Our AI will automatically detect the student name, learner ID, and subject columns.
                </p>
                <div className="text-left bg-gray-50 p-3 rounded-md shadow-sm overflow-x-auto border border-gray-200">
                    <pre className="text-xs text-gray-700"><code>
                    Student Name,Learner ID,Math,Science<br/>
                    Alice Johnson,S123,95,88<br/>
                    Bob Williams,S124,78,82<br/>
                    Charlie Brown,S125,65,70
                    </code></pre>
                </div>
            </div>
        </div>
    </div>
  );
};

export default FileUpload;