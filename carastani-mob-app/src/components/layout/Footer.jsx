import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Youtube,
    Send,
    MapPin,
    Phone,
    Mail,
    ChevronUp,
    Car,
    Shield,
    Clock,
    Award
} from 'lucide-react';
import BrandLogo from '../common/BrandLogo';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const footerRef = useRef(null);

    // Intersection Observer for fade-in animation
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (footerRef.current) {
            observer.observe(footerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Show scroll-to-top button
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 500);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            setIsSubscribed(true);
            setTimeout(() => setIsSubscribed(false), 3000);
            setEmail('');
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const quickLinks = [
        { name: 'Home', path: '/' },
        { name: 'Used Cars', path: '/used' },
        { name: 'Compare Cars', path: '/compare' },
        { name: 'Reviews', path: '/reviews' },
        { name: 'Careers', path: '/careers' },
        { name: 'Contact', path: '/contact' }
    ];

    const services = [
        { name: 'Car Comparison', icon: Car },
        { name: 'Price Analysis', icon: Award },
        { name: 'Quality Score', icon: Shield },
        { name: '24/7 Support', icon: Clock }
    ];

    const socialLinks = [
        { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:bg-blue-600' },
        { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:bg-sky-500' },
        { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500' },
        { icon: Linkedin, href: '#', label: 'LinkedIn', color: 'hover:bg-blue-700' },
        { icon: Youtube, href: '#', label: 'YouTube', color: 'hover:bg-red-600' }
    ];

    return (
        <>
            <footer
                ref={footerRef}
                className={`
                    relative bg-gradient-to-b from-[#0a1628] to-[#0d1f3c] text-white
                    transition-all duration-1000
                    ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                `}
            >
                {/* Animated gradient top border */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary animate-gradient-x" />

                {/* Main Footer Content */}
                <div className="container mx-auto px-6 md:px-12 pt-16 pb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                        {/* Brand Section */}
                        <div className="space-y-6">
                            <Link to="/" className="inline-block">
                                <BrandLogo size="lg" animated showTagline className="text-white" />
                            </Link>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                India's most trusted platform for comparing used car prices across multiple dealers.
                                Make smarter decisions with our CDQS™ scoring system.
                            </p>

                            {/* Social Links */}
                            <div className="flex gap-3">
                                {socialLinks.map((social, index) => (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        aria-label={social.label}
                                        className={`
                                            w-10 h-10 rounded-full bg-white/10 flex items-center justify-center
                                            transition-all duration-300 transform
                                            hover:scale-110 ${social.color}
                                            animate-fade-in
                                        `}
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <social.icon size={18} />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <span className="w-8 h-0.5 bg-accent rounded-full" />
                                Quick Links
                            </h4>
                            <ul className="space-y-3">
                                {quickLinks.map((link, index) => (
                                    <li
                                        key={link.name}
                                        className="animate-fade-in"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <Link
                                            to={link.path}
                                            className="group flex items-center text-gray-400 hover:text-white transition-colors duration-300"
                                        >
                                            <span className="w-0 group-hover:w-4 h-0.5 bg-accent mr-0 group-hover:mr-2 transition-all duration-300" />
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Download App */}
                        <div>
                            <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <span className="w-8 h-0.5 bg-accent rounded-full" />
                                Get the App
                            </h4>
                            <p className="text-gray-400 text-sm mb-4">
                                Download our app for the best car comparison experience on the go.
                            </p>

                            {/* App Store Buttons */}
                            <div className="space-y-3">
                                {/* Google Play */}
                                <a
                                    href="#"
                                    className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl px-4 py-3 transition-all duration-300 group"
                                >
                                    <div className="w-10 h-10 flex items-center justify-center">
                                        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
                                            <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Get it on</p>
                                        <p className="text-sm font-semibold text-white group-hover:text-accent transition-colors">Google Play</p>
                                    </div>
                                </a>

                                {/* App Store */}
                                <a
                                    href="#"
                                    className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl px-4 py-3 transition-all duration-300 group"
                                >
                                    <div className="w-10 h-10 flex items-center justify-center">
                                        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
                                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Download on the</p>
                                        <p className="text-sm font-semibold text-white group-hover:text-accent transition-colors">App Store</p>
                                    </div>
                                </a>
                            </div>

                            {/* Coming Soon Badge */}
                            <div className="mt-4 inline-flex items-center gap-2 bg-accent/10 text-accent text-xs px-3 py-1.5 rounded-full">
                                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></span>
                                Coming Soon
                            </div>
                        </div>

                        {/* Contact & Newsletter */}
                        <div className="space-y-6">
                            <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <span className="w-8 h-0.5 bg-accent rounded-full" />
                                Stay Connected
                            </h4>

                            {/* Contact Info */}
                            <div className="space-y-3 text-sm">
                                <a
                                    href="mailto:info@carastani.com"
                                    className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                                        <Mail size={14} className="text-accent" />
                                    </div>
                                    info@carastani.com
                                </a>
                                <a
                                    href="tel:+911234567890"
                                    className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                                        <Phone size={14} className="text-accent" />
                                    </div>
                                    +91 123 456 7890
                                </a>
                                <div className="flex items-center gap-3 text-gray-400">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                        <MapPin size={14} className="text-accent" />
                                    </div>
                                    Mumbai, Maharashtra
                                </div>
                            </div>

                            {/* Newsletter */}
                            <div className="pt-4">
                                <p className="text-sm text-gray-400 mb-3">Subscribe</p>
                                <form onSubmit={handleSubscribe} className="relative">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className="
                                            w-full bg-white/5 border border-white/10 rounded-xl
                                            px-4 py-3 pr-12 text-sm
                                            focus:outline-none focus:border-accent focus:bg-white/10
                                            transition-all duration-300
                                            placeholder:text-gray-500
                                        "
                                    />
                                    <button
                                        type="submit"
                                        className="
                                            absolute right-2 top-1/2 -translate-y-1/2
                                            w-8 h-8 rounded-lg bg-accent flex items-center justify-center
                                            hover:bg-accent/80 transition-all duration-300
                                            hover:scale-110 active:scale-95
                                            animate-pulse-subtle
                                        "
                                    >
                                        <Send size={14} />
                                    </button>
                                </form>
                                {isSubscribed && (
                                    <p className="text-xs text-primary mt-2 animate-fade-in">
                                        ✓ Thanks for subscribing!
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-white/10" />

                    {/* Bottom Section */}
                    <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-gray-500">
                            <p>© 2026 Carastani Technologies Pvt. Ltd. All rights reserved.</p>
                            <div className="flex gap-4">
                                <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                                <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                            </div>
                        </div>

                        {/* Language Toggle (decorative) */}
                        <div className="flex items-center gap-3 text-sm">
                            <span className="text-gray-500">Language:</span>
                            <button className="text-white font-medium">English</button>
                            <span className="text-gray-600">|</span>
                            <button className="text-gray-500 hover:text-white transition-colors">हिंदी</button>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Scroll to Top Button */}
            <button
                onClick={scrollToTop}
                className={`
                    fixed bottom-6 right-6 z-50
                    w-12 h-12 rounded-full bg-accent shadow-lg shadow-accent/30
                    flex items-center justify-center
                    transition-all duration-500
                    hover:scale-110 hover:shadow-accent/50
                    ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}
                `}
            >
                <ChevronUp size={24} className="animate-bounce" />
            </button>
        </>
    );
};

export default Footer;
