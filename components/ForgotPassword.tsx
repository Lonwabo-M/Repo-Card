import React, { useState } from 'react';

interface ForgotPasswordProps {
    onRequestReset: (email: string) => { success: boolean, message: string };
    onNavigateLogin: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onRequestReset, onNavigateLogin }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setIsLoading(true);
        setIsSubmitted(false);

        setTimeout(() => { // Simulate network delay
            const result = onRequestReset(email);
            if (result.success) {
                // The actual navigation happens in App.tsx after token is set
                // We show a generic message here for UX.
                setMessage("If an account with that email exists, a password reset process has been initiated.");
                setIsSubmitted(true);
            } else {
                // To prevent user enumeration, we still show a success-like message.
                // The actual error is handled internally.
                setMessage(result.message);
                setIsSubmitted(true);
            }
            setIsLoading(false);
        }, 500);
    };

    return (
        <div className="w-full max-w-sm">
            <div>
                <h2 className="text-3xl font-bold text-gray-900">Forgot Password</h2>
                <p className="mt-2 text-sm text-gray-600">
                    Enter your email and we'll (simulate) sending you a link to reset your password.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                 {!isSubmitted ? (
                    <>
                        <div className="rounded-md shadow-sm">
                            <label htmlFor="email-forgot" className="sr-only">Email address</label>
                            <input
                                id="email-forgot"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Email address"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                            >
                                {isLoading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </div>
                    </>
                 ) : (
                    <p className="text-sm text-green-600 text-center bg-green-50 p-3 rounded-md">{message}</p>
                 )}
            </form>
            <div className="mt-4 text-center">
                <button onClick={onNavigateLogin} className="font-medium text-sm text-indigo-600 hover:text-indigo-500">
                    &larr; Back to login
                </button>
            </div>
        </div>
    );
};

export default ForgotPassword;
