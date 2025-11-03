import React from 'react';
import { GraduationCapIcon } from './icons/GraduationCapIcon';

interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-3 mb-8">
                <div className="bg-gradient-to-tr from-purple-600 to-indigo-600 p-2 rounded-lg">
                <GraduationCapIcon className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">ReportCard Pro</h1>
            </div>
            {children}
        </div>
    );
};

export default AuthLayout;