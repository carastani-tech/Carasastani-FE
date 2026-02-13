import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Eye, EyeOff, AlertCircle, CheckCircle, User, Mail, Lock } from 'lucide-react';
import { signupUser } from '../services/authService';

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
        <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Left Side - Form */}
            <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
                <div className="max-w-md w-full mx-auto">
                    {/* Success State */}
                    {success ? (
                        <div className="text-center animate-fade-in">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                                <CheckCircle className="text-green-500" size={40} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Carastani!</h2>
                            <p className="text-gray-600">Account created successfully. Redirecting...</p>
                            <div className="mt-4 flex justify-center">
                                <div className="w-8 h-1 bg-green-500 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Logo/Brand */}
                            <div className="mb-8">
                                <Link to="/" className="text-3xl font-bold">
                                    <span className="text-accent">Car</span>astani
                                </Link>
                            </div>

                            <h2 className="text-3xl font-bold mb-2 text-gray-900">Get Started Now</h2>
                            <p className="text-gray-500 mb-8">Create your account to find your dream car</p>

                            {/* Email Exists Message */}
                            {emailExists && (
                                <div className="mb-6 p-5 bg-amber-50 border border-amber-200 rounded-xl animate-fade-in">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Mail className="text-amber-600" size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-amber-800 font-semibold text-base mb-1">Account Already Exists</h4>
                                            <p className="text-amber-700 text-sm mb-3">
                                                An account with this email is already registered. Would you like to sign in instead?
                                            </p>
                                            <Link
                                                to="/login"
                                                className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm"
                                            >
                                                Sign In to Your Account
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Error Message */}
                            {error && !emailExists && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 animate-shake">
                                    <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                                    <div>
                                        <p className="text-red-700 font-medium text-sm">{error}</p>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Name Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Enter your full name"
                                            className={`w-full border rounded-xl px-4 py-3.5 pl-12 focus:outline-none focus:ring-2 transition-all ${fieldErrors.name
                                                ? 'border-red-300 focus:ring-red-200'
                                                : 'border-gray-200 focus:ring-accent/20 focus:border-accent'
                                                }`}
                                            disabled={loading}
                                        />
                                    </div>
                                    {fieldErrors.name && (
                                        <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>
                                    )}
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="you@example.com"
                                            className={`w-full border rounded-xl px-4 py-3.5 pl-12 focus:outline-none focus:ring-2 transition-all ${fieldErrors.email
                                                ? 'border-red-300 focus:ring-red-200'
                                                : 'border-gray-200 focus:ring-accent/20 focus:border-accent'
                                                }`}
                                            disabled={loading}
                                        />
                                    </div>
                                    {fieldErrors.email && (
                                        <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
                                    )}
                                </div>

                                {/* Password Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            placeholder="Create a strong password"
                                            className={`w-full border rounded-xl px-4 py-3.5 pl-12 pr-12 focus:outline-none focus:ring-2 transition-all ${fieldErrors.password
                                                ? 'border-red-300 focus:ring-red-200'
                                                : 'border-gray-200 focus:ring-accent/20 focus:border-accent'
                                                }`}
                                            disabled={loading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    {fieldErrors.password && (
                                        <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
                                    )}
                                </div>

                                {/* Terms & Conditions */}
                                <div className={`flex items-start p-3 rounded-lg transition-all ${termsError ? 'bg-red-50 border border-red-200' : ''
                                    }`}>
                                    <input
                                        id="terms"
                                        type="checkbox"
                                        checked={agreeTerms}
                                        onChange={handleTermsChange}
                                        className={`h-4 w-4 mt-0.5 rounded transition-all ${termsError
                                            ? 'border-red-500 text-red-500 focus:ring-red-500'
                                            : 'border-gray-300 text-accent focus:ring-accent'
                                            }`}
                                    />
                                    <label htmlFor="terms" className={`ml-2 block text-sm ${termsError ? 'text-red-700' : 'text-gray-600'
                                        }`}>
                                        I agree to the{' '}
                                        <a href="#" className={`underline font-medium ${termsError ? 'text-red-700' : 'text-accent'
                                            }`}>
                                            terms & policy
                                        </a>
                                    </label>
                                </div>
                                {termsError && (
                                    <p className="text-red-500 text-xs -mt-3">You must accept the terms & policy to continue</p>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`
                                        w-full font-bold py-4 rounded-xl transition-all duration-300
                                        flex items-center justify-center gap-2
                                        ${loading
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-primary hover:bg-teal-800 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]'
                                        }
                                        text-white
                                    `}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            Creating account...
                                        </>
                                    ) : (
                                        'Create Account'
                                    )}
                                </button>
                            </form>

                            {/* Sign In Link */}
                            <div className="mt-8 text-center text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link to="/login" className="text-accent font-semibold hover:underline">
                                    Sign in
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Right Side - Image */}
            <div className="hidden md:block w-1/2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/80 to-primary/80 z-10"></div>
                <img
                    src="https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=1200&auto=format&fit=crop"
                    alt="Red Sports Car"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-white p-12">
                    <h3 className="text-4xl font-bold mb-4 text-center">Start Your Journey</h3>
                    <p className="text-lg text-white/80 text-center max-w-md">
                        Join thousands of car enthusiasts and find your perfect ride today
                    </p>
                    <div className="mt-8 flex gap-8">
                        <div className="text-center">
                            <p className="text-3xl font-bold">Free</p>
                            <p className="text-sm text-white/70">To Join</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold">5K+</p>
                            <p className="text-sm text-white/70">Cars Listed</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold">50+</p>
                            <p className="text-sm text-white/70">Cities</p>
                        </div>
                    </div>
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
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out;
                }
            `}</style>
        </div>
    );
};

export default Signup;
