import React from 'react';
import { GraduationCapIcon } from './icons/GraduationCapIcon';
import { AiIcon } from './icons/AiIcon';
import { PenIcon } from './icons/PenIcon';
import { ZipIcon } from './icons/ZipIcon';

interface HomepageProps {
  onGetStarted: () => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string; delay: string }> = ({ icon, title, description, delay }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 opacity-0 animate-fadeInUp" style={{ animationDelay: delay }}>
        <div className="bg-indigo-100 text-indigo-600 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
            {icon}
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
);


const Homepage: React.FC<HomepageProps> = ({ onGetStarted }) => {
  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <header className="absolute top-0 left-0 right-0 z-20 p-6">
        <div className="container mx-auto flex justify-start items-center">
            <div className="flex items-center space-x-2">
                <div className="bg-gradient-to-tr from-purple-600 to-indigo-600 p-2 rounded-lg">
                    <GraduationCapIcon className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-800">ReportCard Pro</h1>
            </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 overflow-hidden">
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    {/* Left side: Text */}
                    <div className="md:w-1/2 text-center md:text-left">
                        <h1 className="font-poppins text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-4 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                            Generate Student Report Cards, Instantly.
                        </h1>
                        <p className="max-w-xl mx-auto md:mx-0 text-lg text-gray-500 mb-8 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                            An elegant, AI-powered platform to automatically generate, review, and edit student report cards from your existing Excel or CSV files.
                        </p>
                        <button
                            onClick={onGetStarted}
                            className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-indigo-700 transform hover:scale-105 transition-all duration-300 animate-fadeInUp"
                            style={{ animationDelay: '0.5s' }}
                        >
                            Get Started for Free
                        </button>
                    </div>
                    {/* Right side: Image */}
                    <div className="md:w-1/2 mt-10 md:mt-0 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                        <div className="relative">
                           <div className="absolute -top-4 -right-4 w-full h-full bg-purple-200 rounded-2xl transform rotate-3"></div>
                            <img 
                                src="https://images.pexels.com/photos/8617967/pexels-photo-8617967.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                                alt="Teacher with a diverse group of students in a classroom" 
                                className="rounded-2xl shadow-2xl relative z-10 w-full object-cover h-full" 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
        
        {/* Features Section */}
        <section className="py-24 px-4 bg-white">
            <div className="container mx-auto">
                 <h2 className="text-3xl font-bold text-center text-gray-800 mb-12 opacity-0 animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
                    A Smarter Way to Work
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <FeatureCard
                        icon={<AiIcon className="w-6 h-6" />}
                        title="Intelligent Parsing"
                        description="No more strict templates. Our AI automatically understands your CSV or XLSX file structure, identifying names, IDs, and subjects for you."
                        delay="0.7s"
                    />
                    <FeatureCard
                        icon={<PenIcon className="w-6 h-6" />}
                        title="Intuitive Editing"
                        description="Quickly review and edit every detail. Update scores, modify comments, and correct names in a clean, user-friendly interface."
                        delay="0.9s"
                    />
                    <FeatureCard
                        icon={<ZipIcon className="w-6 h-6" />}
                        title="Professional Exports"
                        description="Generate print-ready PDFs for individual students or download all reports at once as an organized ZIP folder."
                        delay="1.1s"
                    />
                </div>
            </div>
        </section>
      </main>

      <footer className="bg-gray-100 text-center py-6">
        <div className="container mx-auto">
            <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} ReportCard Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;