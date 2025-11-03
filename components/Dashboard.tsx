import React, { useMemo } from 'react';
import { ReportCardBatch } from '../types';
import { TotalIcon } from './icons/TotalIcon';
import { DraftIcon } from './icons/DraftIcon';
import { ReviewedIcon } from './icons/ReviewedIcon';
import { FinalizedIcon } from './icons/FinalizedIcon';

interface DashboardProps {
    batches: ReportCardBatch[];
}

const StatCard: React.FC<{ title: string; value: number | string; note: string; icon: React.ReactNode; color: string }> = ({ title, value, note, icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex justify-between items-start">
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-4xl font-bold text-gray-800 mt-2">{value}</p>
            <p className="text-xs text-gray-400 mt-1">{note}</p>
        </div>
        <div className={`rounded-full p-3 ${color}`}>
            {icon}
        </div>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ batches }) => {
    const studentCount = useMemo(() => batches.reduce((sum, batch) => sum + batch.students.length, 0), [batches]);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Report Cards" 
                    value={studentCount} 
                    note="Across all batches" 
                    icon={<TotalIcon className="w-6 h-6 text-blue-600" />}
                    color="bg-blue-100"
                />
                <StatCard 
                    title="Draft" 
                    value={studentCount} 
                    note="Needs review" 
                    icon={<DraftIcon className="w-6 h-6 text-orange-600" />}
                    color="bg-orange-100"
                />
                <StatCard 
                    title="Reviewed" 
                    value="0" 
                    note="Ready to finalize" 
                    icon={<ReviewedIcon className="w-6 h-6 text-indigo-600" />}
                    color="bg-indigo-100"
                />
                <StatCard 
                    title="Finalized" 
                    value="0" 
                    note="Completed" 
                    icon={<FinalizedIcon className="w-6 h-6 text-green-600" />}
                    color="bg-green-100"
                />
            </div>
        </div>
    );
};

export default Dashboard;