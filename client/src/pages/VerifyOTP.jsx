import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { KeyRound, ArrowRight } from 'lucide-react';

const VerifyOTP = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { verifyOTP, login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Get email from router state or fallback
    const email = location.state?.email || '';

    if (!email) {
        return (
            <div className="flex justify-center items-center min-h-screen p-8">
                <div className="glass-card w-full max-w-md p-10 text-center">
                    <p className="text-red-400 mb-4">No email found to verify.</p>
                    <Link to="/register" className="btn-primary inline-flex">Back to Register</Link>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await verifyOTP(email, otp);
            setSuccess('Email verified successfully! You can now log in.');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen p-8">
            <div className="glass-card w-full max-w-md p-10 animate-fade-in-up">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-2">Verify Email</h2>
                    <p className="text-slate-400">Enter the 6-digit code sent to <br/><span className="text-slate-200 font-medium">{email}</span></p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded-md mb-6 text-sm text-red-200">
                        {error}
                    </div>
                )}
                
                {success && (
                    <div className="bg-green-500/10 border-l-4 border-green-500 p-4 rounded-md mb-6 text-sm text-green-200">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Verification Code</label>
                        <div className="relative">
                            <KeyRound size={18} className="input-icon" />
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="123456"
                                maxLength={6}
                                className="input-with-icon text-center tracking-widest font-mono text-lg"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary w-full" disabled={!otp || otp.length < 6}>
                        Verify Account <ArrowRight size={18} />
                    </button>
                </form>

                <div className="text-center mt-8 text-sm text-slate-400">
                    <p>Didn't receive the code? Check your backend console.</p>
                </div>
            </div>
        </div>
    );
};

export default VerifyOTP;
