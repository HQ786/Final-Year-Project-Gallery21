// pages/forgot-password.js

'use client'

import { useState } from 'react';
import { toast } from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Email submitted:", email); // Log email before sending

    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      toast.success('Check your email for a password reset link.');
    } else {
      toast.error('Failed to send password reset email.');
    }
  };


  return (
    <div className='flex h-screen justify-center items-center'>
      <div className="bg-slate-100 p-6 shadow-md rounded-lg mb-4 w-full max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-6 text-center">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className="outline outline-1 outline-slate-500 rounded-md p-2 w-full"
              required
            />

          </div>
          <button type="submit" className="bg-blue-600 text-center text-white rounded-md p-2 mt-4 w-full">
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
