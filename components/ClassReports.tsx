import React, { useMemo } from 'react';
import { ReportCardBatch } from '../types';
import { TrashIcon } from './icons/TrashIcon';

interface ClassReportsProps {
    batches: ReportCardBatch[];
    onViewBatch: (batchId: string) => void;
    onDeleteBatch: (batchId: string) => void;
}

const ClassReports: React.FC<ClassReportsProps> = ({ batches, onViewBatch, onDeleteBatch }) => {
    const groupedBatches = useMemo(() => {
        const groups: { [grade: string]: ReportCardBatch[] } = {};
        batches.forEach(batch => {
            const gradeKey = `Grade ${batch.grade}`;
            if (!groups[gradeKey]) {
                groups[gradeKey] = [];
            }
            groups[gradeKey].push(batch);
        });
        // Sort batches within each group by class name
        Object.keys(groups).forEach(gradeKey => {
            groups[gradeKey].sort((a, b) => a.className.localeCompare(b.className));
        });
        return groups;
    }, [batches]);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Class Reports</h1>
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4">All Report Card Batches</h2>
                {batches.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <p>Your uploaded report card batches will appear here.</p>
                        <p className="text-sm mt-1">Go to "Upload Marks" to get started.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {Object.entries(groupedBatches).sort(([gradeA], [gradeB]) => gradeA.localeCompare(gradeB)).map(([grade, classBatches]: [string, ReportCardBatch[]]) => (
                            <div key={grade}>
                                <h3 className="text-lg font-semibold text-gray-700 mb-2 border-b pb-2">{grade}</h3>
                                <div className="space-y-3">
                                    {classBatches.map(batch => (
                                        <div key={batch.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border hover:bg-gray-100 transition-colors">
                                            <div>
                                                <p className="font-semibold text-gray-800">
                                                    Class {batch.className}
                                                    <span className="ml-2 text-sm font-normal text-gray-500">({batch.students.length} students)</span>
                                                </p>
                                                <p className="text-xs text-gray-500">{batch.fileName} - Uploaded on {new Date(batch.uploadDate).toLocaleDateString()}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => onViewBatch(batch.id)} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">View Batch &rarr;</button>
                                                <button onClick={() => onDeleteBatch(batch.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors" aria-label={`Delete batch ${batch.fileName}`}>
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClassReports;
