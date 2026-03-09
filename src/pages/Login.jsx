import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Eye, EyeOff, AlertCircle, CheckCircle, Mail, Lock, ArrowLeft } from 'lucide-react';
import { loginUser } from '../services/authService';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError(''); // Clear error when user types
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Basic validation
        if (!formData.email) {
            setError('Please enter your email address');
            return;
        }
        if (!formData.password) {
            setError('Please enter your password');
            return;
        }

        setLoading(true);

        try {
            const result = await loginUser(formData.email, formData.password);

            if (result.success) {
                setSuccess(true);
                // Show success animation then redirect
                setTimeout(() => {
                    navigate('/');
                }, 1500);
            } else {
                setError(result.message || 'Invalid credentials. Please try again.');
            }
        } catch (err) {
            setError('Something went wrong. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-8 overflow-hidden bg-black">
            {/* Back to Home Button */}
            <Link 
                to="/" 
                className="absolute top-6 left-6 sm:top-8 sm:left-8 z-50 flex items-center gap-2 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/10 transition-all duration-300 group"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-300" />
                <span className="text-xs font-bold tracking-wider uppercase">Home</span>
            </Link>
            {/* Cinematic Background */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=2000&auto=format&fit=crop"
                    alt="Luxury Car Interior"
                    className="w-full h-full object-cover scale-105 animate-slow-zoom"
                />
                {/* Multi-layer gradient overlay for depth and readability */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40"></div>
                <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
            </div>

            {/* Central Glass Card */}
            <div className="relative z-10 w-full max-w-[420px] pt-8">
                {/* Logo/Brand Floating Above */}
                <div className="text-center mb-8 animate-slide-down animate-float">
                    <Link to="/" className="text-4xl font-black tracking-tighter text-white inline-flex items-center gap-1 drop-shadow-2xl">
                        <span className="text-accent">Car</span>astani
                    </Link>
                    <p className="text-white/60 text-sm mt-2 font-medium tracking-wide">Premium Car Ecosystem</p>
                </div>

                {/* The Glass Form Container */}
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-fade-in-up animate-float-delayed">
                    {/* Subtle glow effect behind form */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-accent/20 blur-3xl rounded-full opacity-50 pointer-events-none"></div>

                    {/* Success State */}
                    {success ? (
                        <div className="text-center animate-fade-in py-8">
                            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                                <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
                                <CheckCircle className="text-green-400 relative z-10" size={40} />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Welcome back!</h2>
                            <p className="text-white/60">Login successful. Redirecting you...</p>
                            <div className="mt-8 flex justify-center">
                                <div className="w-12 h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="mb-8 text-center">
                                <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
                                <p className="text-white/50 text-sm mt-1.5">Enter your credentials to continue</p>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 animate-shake backdrop-blur-md">
                                    <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
                                    <div>
                                        <p className="text-white font-medium text-sm drop-shadow-md">{error}</p>
                                        <p className="text-red-200/70 text-xs mt-1">Please check your credentials and try again.</p>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Email Field */}
                                <div className="group animate-fade-in-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
                                    <label className="block text-[11px] font-bold text-white/60 uppercase tracking-wider mb-2 ml-1">Email address</label>
                                    <div className="relative">
                                        <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${error ? 'text-red-400' : 'text-white/40 group-focus-within:text-accent'}`} size={18} />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="you@example.com"
                                            className={`w-full bg-white/5 border rounded-2xl px-4 py-3.5 pl-12 text-white placeholder-white/30 
                                                focus:outline-none focus:bg-white/10 transition-all duration-300
                                                ${error 
                                                    ? 'border-red-500/50 focus:border-red-500 focus:shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
                                                    : 'border-white/10 hover:border-white/20 focus:border-accent/50 focus:shadow-[0_0_15px_rgba(var(--color-accent),0.2)]'
                                                }`}
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div className="group animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                                    <div className="flex justify-between items-center mb-2 ml-1">
                                        <label className="block text-[11px] font-bold text-white/60 uppercase tracking-wider">Password</label>
                                        <a href="#" className="text-[11px] text-accent hover:text-accent-light transition-colors">Forgot?</a>
                                    </div>
                                    <div className="relative">
                                        <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${error ? 'text-red-400' : 'text-white/40 group-focus-within:text-accent'}`} size={18} />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            placeholder="••••••••"
                                            className={`w-full bg-white/5 border rounded-2xl px-4 py-3.5 pl-12 pr-12 text-white placeholder-white/30 
                                                focus:outline-none focus:bg-white/10 transition-all duration-300 tracking-widest
                                                ${error 
                                                    ? 'border-red-500/50 focus:border-red-500 focus:shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
                                                    : 'border-white/10 hover:border-white/20 focus:border-accent/50 focus:shadow-[0_0_15px_rgba(var(--color-accent),0.2)]'
                                                }`}
                                            disabled={loading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Remember Me */}
                                <div className="flex items-center ml-1 animate-fade-in-up opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
                                    <div className="relative flex items-center">
                                        <input
                                            id="remember"
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-white/20 bg-white/5 checked:border-accent checked:bg-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all duration-200"
                                        />
                                        <CheckCircle className="absolute left-0 top-0 h-4 w-4 pointer-events-none opacity-0 peer-checked:opacity-100 text-black scale-50 peer-checked:scale-100 transition-all duration-200" />
                                    </div>
                                    <label htmlFor="remember" className="ml-3 block text-xs text-white/60 cursor-pointer hover:text-white/80 transition-colors">
                                        Keep me signed in
                                    </label>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`
                                        w-full font-bold py-4 rounded-2xl transition-all duration-300 mt-2
                                        flex items-center justify-center gap-2 overflow-hidden relative group
                                        animate-fade-in-up opacity-0
                                        ${loading
                                            ? 'bg-white/10 text-white/40 cursor-not-allowed'
                                            : 'bg-accent text-black hover:bg-[#eab308] hover:shadow-[0_0_30px_rgba(var(--color-accent),0.3)] hover:scale-[1.02] active:scale-[0.98]'
                                        }
                                    `}
                                    style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}
                                >
                                    {/* Shimmer effect */}
                                    {!loading && <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-shimmer"></div>}
                                    
                                    <span className="relative z-10 flex items-center gap-2 text-sm uppercase tracking-wider">
                                        {loading ? (
                                            <>
                                                <Loader2 className="animate-spin" size={18} />
                                                Authenticating...
                                            </>
                                        ) : (
                                            'Sign In'
                                        )}
                                    </span>
                                </button>
                            </form>

                            {/* Sign Up Link */}
                            <div className="mt-8 pt-6 border-t border-white/10 text-center text-xs text-white/50">
                                Don't have an account?{' '}
                                <Link to="/signup" className="text-accent font-bold hover:text-white transition-colors ml-1 uppercase tracking-wider">
                                    Create one now
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Custom Animations */}
            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
                    20%, 40%, 60%, 80% { transform: translateX(4px); }
                }
                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes slide-down {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slide-down {
                    animation: slide-down 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes slow-zoom {
                    from { transform: scale(1.05); }
                    to { transform: scale(1); }
                }
                .animate-slow-zoom {
                    animation: slow-zoom 20s ease-out forwards;
                }
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .animate-float-delayed {
                    animation: float 6s ease-in-out 3s infinite;
                }
            `}</style>
        </div>
    );
};

export default Login;
