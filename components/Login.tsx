import React, { useState } from 'react';
import { login } from '../services/authService';
import { User } from '../types';

interface LoginProps {
    onLogin: (user: User) => void;
    onNavigateRegister: () => void;
    onNavigateForgotPassword: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onNavigateRegister, onNavigateForgotPassword }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        setTimeout(() => { // Simulate network delay
            const result = login(email, password);
            if (result.success && result.user) {
                onLogin(result.user);
            } else {
                setError(result.message);
            }
            setIsLoading(false);
        }, 500);
    };

    return (
        <div className="w-full max-w-sm">
            <div>
                <h2 className="text-3xl font-bold text-gray-900">Sign in to your account</h2>
                <p className="mt-2 text-sm text-gray-600">
                    Or{' '}
                    <button onClick={onNavigateRegister} className="font-medium text-indigo-600 hover:text-indigo-500">
                        create a new account
                    </button>
                </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="rounded-md shadow-sm -space-y-px">
                    <div>
                        <label htmlFor="email-address" className="sr-only">Email address</label>
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Email address"
                        />
                    </div>
                    <div>
                        <label htmlFor="password-for-login" className="sr-only">Password</label>
                        <input
                            id="password-for-login"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Password"
                        />
                    </div>
                </div>

                 <div className="flex items-center justify-end">
                    <div className="text-sm">
                        <button onClick={onNavigateForgotPassword} type="button" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Forgot your password?
                        </button>
                    </div>
                </div>
                
                {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                <div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                    >
                        {isLoading ? 'Signing in...' : 'Sign in'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;