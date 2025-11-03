import React, { useState } from 'react';
import { register } from '../services/authService';

interface RegisterProps {
    onRegister: () => void;
    onNavigateLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister, onNavigateLogin }) => {
    const [name, setName] = useState('');
    const [school, setSchool] = useState('');
    const [province, setProvince] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsLoading(true);

        if (password.length < 6) {
             setError("Password must be at least 6 characters long.");
             setIsLoading(false);
             return;
        }

        setTimeout(() => { // Simulate network delay
            const result = register({ id: '', name, email, school, province, password });
            if (result.success) {
                setSuccess(result.message);
                 setTimeout(() => {
                    onRegister();
                }, 2000);
            } else {
                setError(result.message);
            }
            setIsLoading(false);
        }, 500);
    };

    return (
        <div className="w-full max-w-sm">
            <div>
                <h2 className="text-3xl font-bold text-gray-900">Create a new account</h2>
                <p className="mt-2 text-sm text-gray-600">
                    Already have an account?{' '}
                    <button onClick={onNavigateLogin} className="font-medium text-indigo-600 hover:text-indigo-500">
                        Sign in
                    </button>
                </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                 <div className="rounded-md shadow-sm -space-y-px">
                     <div>
                        <label htmlFor="name" className="sr-only">Full Name</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Full Name"
                        />
                    </div>
                    <div>
                        <label htmlFor="school" className="sr-only">School Name</label>
                        <input
                            id="school"
                            name="school"
                            type="text"
                            autoComplete="organization"
                            required
                            value={school}
                            onChange={(e) => setSchool(e.target.value)}
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="School Name"
                        />
                    </div>
                     <div>
                        <label htmlFor="province" className="sr-only">Province</label>
                        <input
                            id="province"
                            name="province"
                            type="text"
                            autoComplete="address-level1"
                            required
                            value={province}
                            onChange={(e) => setProvince(e.target.value)}
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Province"
                        />
                    </div>
                    <div>
                        <label htmlFor="email-address-register" className="sr-only">Email address</label>
                        <input
                            id="email-address-register"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Email address"
                        />
                    </div>
                    <div>
                        <label htmlFor="password-for-register" className="sr-only">Password</label>
                        <input
                            id="password-for-register"
                            name="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Password (min. 6 characters)"
                        />
                    </div>
                </div>
                
                {error && <p className="text-sm text-red-600">{error}</p>}
                {success && <p className="text-sm text-green-600">{success}</p>}


                <div>
                    <button
                        type="submit"
                        disabled={isLoading || !!success}
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                    >
                        {isLoading ? 'Creating account...' : 'Create Account'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Register;