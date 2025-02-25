'use client'; // Make sure this is a client component

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import from next/navigation
import { toast } from 'react-hot-toast';

const ResetPassword = () => {
    const router = useRouter();
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { searchParams } = new URL(window.location.href);
        const token = searchParams.get('token'); // Get the token from the URL query parameters

        const response = await fetch('/api/auth/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, newPassword }),
        });

        if (response.ok) {
            toast.success('Password reset successfully!');
            router.push('/login'); // Redirect to login page
        } else {
            toast.error('Failed to reset password.');
        }
        setLoading(false);
    };

    return (
        <div className='flex h-screen justify-center items-center'>
            <div className="bg-slate-100 p-6 shadow-md rounded-lg mb-4 w-full max-w-md mx-auto">
                <h2 className="text-xl font-semibold mb-6 text-center">Reset Password</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 mb-1">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="outline outline-1 outline-slate-500 rounded-md p-2 w-full"
                            required
                        />
                    </div>
                    <button type="submit" className="bg-blue-600 text-center text-white rounded-md p-2 mt-4 w-full" disabled={loading}>
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
