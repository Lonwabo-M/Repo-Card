import React, { useState } from 'react';

interface ResetPasswordProps {
    onResetPassword: (password: string) => { success: boolean, message: string };
    onNavigateLogin: () => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ onResetPassword, onNavigateLogin }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }
        
        setIsLoading(true);

        setTimeout(() => { // Simulate network delay
            const result = onResetPassword(password);
            if (result.success) {
                setSuccess(result.message + " Redirecting to login...");
                setTimeout(() => {
                    onNavigateLogin();
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
                <h2 className="text-3xl font-bold text-gray-900">Reset Your Password</h2>
                <p className="mt-2 text-sm text-gray-600">
                    Enter your new password below.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="rounded-md shadow-sm -space-y-px">
                    <div>
                        <label htmlFor="new-password" className="sr-only">New Password</label>
                        <input
                            id="new-password"
                            name="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="New Password"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
                        <input
                            id="confirm-password"
                            name="confirmPassword"
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Confirm New Password"
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
                        {isLoading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ResetPassword;
