import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Eye, EyeOff, AlertCircle, CheckCircle, User, Mail, Lock, ArrowLeft } from 'lucide-react';
import { signupUser } from '../services/authService';
import SEO from '../components/common/SEO';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [termsError, setTermsError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [emailExists, setEmailExists] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
        setFieldErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleTermsChange = (e) => {
        setAgreeTerms(e.target.checked);
        if (e.target.checked) {
            setTermsError(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setEmailExists(false);
        setFieldErrors({});
        setTermsError(false);

        // Validation
        const errors = {};

        if (!formData.name.trim()) {
            errors.name = 'Name is required';
        } else if (formData.name.trim().length < 2) {
            errors.name = 'Name must be at least 2 characters';
        }

        if (!formData.email) {
            errors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        if (!agreeTerms) {
            setTermsError(true);
        }

        if (Object.keys(errors).length > 0 || !agreeTerms) {
            setFieldErrors(errors);
            if (!agreeTerms) {
                setError('You must agree to the terms & policy to create an account.');
            }
            return;
        }

        setLoading(true);

        try {
            const result = await signupUser(formData.name, formData.email, formData.password);

            if (result.success) {
                setSuccess(true);
                // Show success animation then redirect to home (already logged in)
                setTimeout(() => {
                    navigate('/');
                }, 1500);
            } else {
                // Check if it's an email exists error
                if (result.errorType === 'EMAIL_EXISTS') {
                    setEmailExists(true);
                    setError('');
                } else {
                    setEmailExists(false);
                    setError(result.message || 'Signup failed. Please try again.');
                }
            }
        } catch (err) {
            setError('Something went wrong. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-8 overflow-hidden bg-black">
            <SEO 
                title="Sign Up" 
                description="Create a free Carastani account to unlock premium features like saving your favorite cars and receiving personalized recommendations." 
            />
            {/* Back to Home Button */}
            <Link 
                to="/" 
                className="absolute top-6 left-6 sm:top-8 sm:left-8 z-50 flex items-center gap-2 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/10 transition-all duration-300 group animate-fade-in"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-300" />
                <span className="text-xs font-bold tracking-wider uppercase">Home</span>
            </Link>
            {/* Cinematic Background */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=2000&auto=format&fit=crop"
                    alt="Luxury Sports Car"
                    className="w-full h-full object-cover scale-105 animate-slow-zoom"
                />
                {/* Multi-layer gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40"></div>
                <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
            </div>

            {/* Central Glass Card */}
            <div className="relative z-10 w-full max-w-[420px] pt-8">
                {/* Logo/Brand Floating Above */}
                <div className="text-center mb-6 animate-slide-down animate-float">
                    <Link to="/" className="text-4xl font-black tracking-tighter text-white inline-flex items-center gap-1 drop-shadow-2xl">
                        <span className="text-accent">Car</span>astani
                    </Link>
                    <p className="text-white/60 text-sm mt-2 font-medium tracking-wide">Start Your Journey</p>
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
                            <h2 className="text-2xl font-bold text-white mb-2">Welcome to Carastani!</h2>
                            <p className="text-white/60">Account created. Redirecting you...</p>
                            <div className="mt-8 flex justify-center">
                                <div className="w-12 h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="mb-6 text-center">
                                <h1 className="text-2xl font-bold text-white">Create Account</h1>
                            </div>

                            {/* Email Exists Message */}
                            {emailExists && (
                                <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl animate-fade-in backdrop-blur-md">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Mail className="text-amber-400" size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-white font-semibold text-sm mb-1 drop-shadow-md">Account Already Exists</h4>
                                            <p className="text-amber-200/70 text-xs mb-3">
                                                An account with this email is already registered.
                                            </p>
                                            <Link
                                                to="/login"
                                                className="inline-flex items-center gap-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-white font-medium px-4 py-2 rounded-xl transition-all duration-300 text-xs tracking-wider uppercase"
                                            >
                                                Sign In Instead
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Error Message */}
                            {error && !emailExists && (
                                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 animate-shake backdrop-blur-md">
                                    <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
                                    <div>
                                        <p className="text-white font-medium text-sm drop-shadow-md">{error}</p>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Name Field */}
                                <div className="group animate-fade-in-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
                                    <label className="block text-[11px] font-bold text-white/60 uppercase tracking-wider mb-2 ml-1">Full Name</label>
                                    <div className="relative">
                                        <User className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${fieldErrors.name ? 'text-red-400' : 'text-white/40 group-focus-within:text-accent'}`} size={18} />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Enter your full name"
                                            className={`w-full bg-white/5 border rounded-2xl px-4 py-3 pl-12 text-white placeholder-white/30 
                                                focus:outline-none focus:bg-white/10 transition-all duration-300
                                                ${fieldErrors.name 
                                                    ? 'border-red-500/50 focus:border-red-500 focus:shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
                                                    : 'border-white/10 hover:border-white/20 focus:border-accent/50 focus:shadow-[0_0_15px_rgba(var(--color-accent),0.2)]'
                                                }`}
                                            disabled={loading}
                                        />
                                    </div>
                                    {fieldErrors.name && (
                                        <p className="text-red-400 text-[10px] mt-1 ml-1">{fieldErrors.name}</p>
                                    )}
                                </div>

                                {/* Email Field */}
                                <div className="group animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                                    <label className="block text-[11px] font-bold text-white/60 uppercase tracking-wider mb-2 ml-1">Email address</label>
                                    <div className="relative">
                                        <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${fieldErrors.email ? 'text-red-400' : 'text-white/40 group-focus-within:text-accent'}`} size={18} />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="you@example.com"
                                            className={`w-full bg-white/5 border rounded-2xl px-4 py-3 pl-12 text-white placeholder-white/30 
                                                focus:outline-none focus:bg-white/10 transition-all duration-300
                                                ${fieldErrors.email 
                                                    ? 'border-red-500/50 focus:border-red-500 focus:shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
                                                    : 'border-white/10 hover:border-white/20 focus:border-accent/50 focus:shadow-[0_0_15px_rgba(var(--color-accent),0.2)]'
                                                }`}
                                            disabled={loading}
                                        />
                                    </div>
                                    {fieldErrors.email && (
                                        <p className="text-red-400 text-[10px] mt-1 ml-1">{fieldErrors.email}</p>
                                    )}
                                </div>

                                {/* Password Field */}
                                <div className="group animate-fade-in-up opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
                                    <label className="block text-[11px] font-bold text-white/60 uppercase tracking-wider mb-2 ml-1">Password</label>
                                    <div className="relative">
                                        <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${fieldErrors.password ? 'text-red-400' : 'text-white/40 group-focus-within:text-accent'}`} size={18} />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            placeholder="••••••••"
                                            className={`w-full bg-white/5 border rounded-2xl px-4 py-3 pl-12 pr-12 text-white placeholder-white/30 
                                                focus:outline-none focus:bg-white/10 transition-all duration-300 tracking-widest
                                                ${fieldErrors.password 
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
                                    {fieldErrors.password && (
                                        <p className="text-red-400 text-[10px] mt-1 ml-1">{fieldErrors.password}</p>
                                    )}
                                </div>

                                {/* Terms & Conditions */}
                                <div className={`flex items-start p-3 mt-2 rounded-xl transition-all animate-fade-in-up opacity-0 ${termsError ? 'bg-red-500/10 border border-red-500/20' : ''}`} style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
                                    <div className="relative flex items-center mt-0.5">
                                        <input
                                            id="terms"
                                            type="checkbox"
                                            checked={agreeTerms}
                                            onChange={handleTermsChange}
                                            className={`peer h-4 w-4 cursor-pointer appearance-none rounded border transition-all duration-200 focus:outline-none focus:ring-2
                                                ${termsError
                                                    ? 'border-red-400 bg-red-400/20 checked:bg-red-500 focus:ring-red-500/30'
                                                    : 'border-white/20 bg-white/5 checked:border-accent checked:bg-accent focus:ring-accent/30'
                                                }`}
                                        />
                                        <CheckCircle className="absolute left-0 top-0 h-4 w-4 pointer-events-none opacity-0 peer-checked:opacity-100 text-black scale-50 peer-checked:scale-100 transition-all duration-200" />
                                    </div>
                                    <label htmlFor="terms" className={`ml-3 block text-[11px] leading-tight cursor-pointer transition-colors ${termsError ? 'text-red-200/90' : 'text-white/60 hover:text-white/80'}`}>
                                        I agree to the {' '}
                                        <a href="#" className={`font-bold transition-colors ${termsError ? 'text-red-400 hover:text-red-300' : 'text-accent hover:text-accent-light'}`}>
                                            terms & policy
                                        </a>
                                    </label>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`
                                        w-full font-bold py-4 rounded-2xl transition-all duration-300 mt-4
                                        flex items-center justify-center gap-2 overflow-hidden relative group
                                        animate-fade-in-up opacity-0
                                        ${loading
                                            ? 'bg-white/10 text-white/40 cursor-not-allowed'
                                            : 'bg-accent text-black hover:bg-[#eab308] hover:shadow-[0_0_30px_rgba(var(--color-accent),0.3)] hover:scale-[1.02] active:scale-[0.98]'
                                        }
                                    `}
                                    style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
                                >
                                    {/* Shimmer effect */}
                                    {!loading && <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-shimmer"></div>}
                                    
                                    <span className="relative z-10 flex items-center gap-2 text-sm uppercase tracking-wider">
                                        {loading ? (
                                            <>
                                                <Loader2 className="animate-spin" size={18} />
                                                Creating account...
                                            </>
                                        ) : (
                                            'Create Account'
                                        )}
                                    </span>
                                </button>
                            </form>

                            {/* Sign In Link */}
                            <div className="mt-6 pt-5 border-t border-white/10 text-center text-xs text-white/50">
                                Already have an account?{' '}
                                <Link to="/login" className="text-accent font-bold hover:text-white transition-colors ml-1 uppercase tracking-wider">
                                    Sign in
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

export default Signup;
