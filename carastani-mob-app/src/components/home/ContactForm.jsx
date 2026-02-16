import React, { useState } from 'react';
import { Send, MapPin, Phone, Mail, ArrowRight, Sparkles } from 'lucide-react';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [focusedField, setFocusedField] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="py-20 px-6 md:px-12 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
            {/* Section Header with Animation */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
                    <Sparkles size={16} className="text-primary" />
                    <span className="text-sm text-primary font-medium">We're Here to Help</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Touch</span>
                </h2>
                <p className="text-gray-600 max-w-xl mx-auto">Have a question or need assistance? Our team is ready to help you find your perfect ride.</p>
            </div>

            <div className="max-w-6xl mx-auto">
                <div className="bg-secondary rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[550px] relative">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                    {/* Left Side - Info Cards */}
                    <div className="md:w-2/5 relative p-8 md:p-10 text-white flex flex-col justify-center">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/95 to-primary/80"></div>

                        <div className="relative z-10">
                            <h3 className="text-3xl font-bold mb-3">Let's Start a Conversation</h3>
                            <p className="text-gray-300 mb-10">We respond within 24 hours</p>

                            <div className="space-y-6">
                                {/* Contact Cards with Hover Effect */}
                                <div className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-accent/50 transition-all duration-300 cursor-pointer">
                                    <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
                                        <MapPin size={20} className="text-accent group-hover:text-black" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-wider">Visit Us</p>
                                        <p className="font-medium">123 Carastani Plaza, Mumbai</p>
                                    </div>
                                </div>

                                <div className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-accent/50 transition-all duration-300 cursor-pointer">
                                    <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
                                        <Phone size={20} className="text-accent group-hover:text-black" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-wider">Call Us</p>
                                        <p className="font-medium">+91 98765 43210</p>
                                    </div>
                                </div>

                                <div className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-accent/50 transition-all duration-300 cursor-pointer">
                                    <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
                                        <Mail size={20} className="text-accent group-hover:text-black" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-wider">Email Us</p>
                                        <p className="font-medium">hello@carastani.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="md:w-3/5 p-8 md:p-12 bg-white relative z-10">
                        <form className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className={`relative transition-all duration-300 ${focusedField === 'name' ? 'scale-[1.02]' : ''}`}>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('name')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="Your Name"
                                        className="w-full bg-gray-50 border-2 border-transparent rounded-xl p-4 text-gray-800 focus:outline-none focus:border-primary focus:bg-white transition-all duration-300"
                                    />
                                </div>
                                <div className={`relative transition-all duration-300 ${focusedField === 'email' ? 'scale-[1.02]' : ''}`}>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="Email Address"
                                        className="w-full bg-gray-50 border-2 border-transparent rounded-xl p-4 text-gray-800 focus:outline-none focus:border-primary focus:bg-white transition-all duration-300"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className={`relative transition-all duration-300 ${focusedField === 'phone' ? 'scale-[1.02]' : ''}`}>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('phone')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="Phone Number"
                                        className="w-full bg-gray-50 border-2 border-transparent rounded-xl p-4 text-gray-800 focus:outline-none focus:border-primary focus:bg-white transition-all duration-300"
                                    />
                                </div>
                                <div className={`relative transition-all duration-300 ${focusedField === 'subject' ? 'scale-[1.02]' : ''}`}>
                                    <select
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('subject')}
                                        onBlur={() => setFocusedField(null)}
                                        className="w-full bg-gray-50 border-2 border-transparent rounded-xl p-4 text-gray-800 focus:outline-none focus:border-primary focus:bg-white transition-all duration-300 appearance-none cursor-pointer"
                                    >
                                        <option value="">How can we help?</option>
                                        <option value="buying">Looking to Buy</option>
                                        <option value="selling">Looking to Sell</option>
                                        <option value="comparison">Car Comparison</option>
                                        <option value="support">General Support</option>
                                    </select>
                                </div>
                            </div>
                            <div className={`relative transition-all duration-300 ${focusedField === 'message' ? 'scale-[1.01]' : ''}`}>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('message')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Tell us more about your query..."
                                    rows="4"
                                    className="w-full bg-gray-50 border-2 border-transparent rounded-xl p-4 text-gray-800 focus:outline-none focus:border-primary focus:bg-white transition-all duration-300 resize-none"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="group w-full md:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 hover:gap-5"
                            >
                                <Send size={18} />
                                Send Message
                                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Bottom Banner */}
            <div className="mt-20 relative h-72 rounded-3xl overflow-hidden max-w-6xl mx-auto group">
                <img
                    src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1200&auto=format&fit=crop"
                    alt="Highway"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent flex items-center p-8 md:p-16">
                    <div className="max-w-xl">
                        <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Ready to Find Your <span className="text-accent">Dream Car?</span>
                        </h3>
                        <p className="text-gray-300 mb-6">Join thousands of happy customers who found their perfect ride with Carastani</p>
                        <button
                            onClick={() => window.location.href = '/used'}
                            className="inline-flex items-center gap-2 bg-accent hover:bg-red-600 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:gap-4"
                        >
                            Start Exploring
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactForm;
