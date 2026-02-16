import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Eye, EyeOff, AlertCircle, CheckCircle, Mail, Lock } from 'lucide-react';
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
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back!</h2>
                            <p className="text-gray-600">Login successful. Redirecting you...</p>
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

                            <h2 className="text-3xl font-bold mb-2 text-gray-900">Welcome back!</h2>
                            <p className="text-gray-500 mb-8">Sign in to continue to your account</p>

                            {/* Error Message */}
                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 animate-shake">
                                    <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                                    <div>
                                        <p className="text-red-700 font-medium text-sm">{error}</p>
                                        <p className="text-red-500 text-xs mt-1">Please check your credentials and try again.</p>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
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
                                            className={`w-full border rounded-xl px-4 py-3.5 pl-12 focus:outline-none focus:ring-2 transition-all ${error ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-accent/20 focus:border-accent'
                                                }`}
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Password</label>
                                        <a href="#" className="text-xs text-accent hover:underline">Forgot password?</a>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            placeholder="Enter your password"
                                            className={`w-full border rounded-xl px-4 py-3.5 pl-12 pr-12 focus:outline-none focus:ring-2 transition-all ${error ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-accent/20 focus:border-accent'
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
                                </div>

                                {/* Remember Me */}
                                <div className="flex items-center">
                                    <input
                                        id="remember"
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded"
                                    />
                                    <label htmlFor="remember" className="ml-2 block text-sm text-gray-600">
                                        Keep me signed in for 30 days
                                    </label>
                                </div>

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
                                            Signing in...
                                        </>
                                    ) : (
                                        'Sign In'
                                    )}
                                </button>
                            </form>

                            {/* Divider - SSO temporarily disabled */}
                            {/* <div className="flex items-center gap-4 my-8">
                                <div className="flex-1 h-px bg-gray-200"></div>
                                <span className="text-xs text-gray-400 uppercase">or continue with</span>
                                <div className="flex-1 h-px bg-gray-200"></div>
                            </div> */}

                            {/* Social Login - SSO temporarily disabled */}
                            {/* <div className="grid grid-cols-2 gap-4">
                                <button className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                                    <span className="text-sm font-medium text-gray-700">Google</span>
                                </button>
                                <button className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                    <img src="https://www.svgrepo.com/show/448234/facebook.svg" alt="Facebook" className="w-5 h-5" />
                                    <span className="text-sm font-medium text-gray-700">Facebook</span>
                                </button>
                            </div> */}

                            {/* Sign Up Link */}
                            <div className="mt-8 text-center text-sm text-gray-600">
                                Don't have an account?{' '}
                                <Link to="/signup" className="text-accent font-semibold hover:underline">
                                    Create one now
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Right Side - Image */}
            <div className="hidden md:block w-1/2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-accent/80 z-10"></div>
                <img
                    src="https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200&auto=format&fit=crop"
                    alt="Car Interior"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-white p-12">
                    <h3 className="text-4xl font-bold mb-4 text-center">Find Your Perfect Ride</h3>
                    <p className="text-lg text-white/80 text-center max-w-md">
                        Join thousands of happy customers who found their dream car with Carastani
                    </p>
                    <div className="mt-8 flex gap-8">
                        <div className="text-center">
                            <p className="text-3xl font-bold">10K+</p>
                            <p className="text-sm text-white/70">Happy Users</p>
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

export default Login;
