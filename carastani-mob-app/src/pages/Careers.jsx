import React, { useState } from 'react';
import {
    Briefcase,
    MapPin,
    Clock,
    DollarSign,
    Users,
    Rocket,
    Heart,
    Coffee,
    ChevronRight,
    Send,
    CheckCircle,
    Star,
    Building,
    Laptop,
    GraduationCap,
    X
} from 'lucide-react';

// Job openings data
const jobOpenings = [
    {
        id: 1,
        title: 'Senior Frontend Developer',
        department: 'Engineering',
        location: 'Mumbai, India',
        type: 'Full-time',
        experience: '4-6 years',
        salary: '₹18-25 LPA',
        description: 'Build and maintain our React-based web applications. Work with modern tools like TypeScript, Tailwind CSS, and GraphQL.',
        requirements: [
            'Strong proficiency in React.js and modern JavaScript',
            'Experience with state management (Redux, Zustand)',
            'Familiarity with RESTful APIs and GraphQL',
            'Understanding of responsive design principles'
        ]
    },
    {
        id: 2,
        title: 'Backend Engineer',
        department: 'Engineering',
        location: 'Remote',
        type: 'Full-time',
        experience: '3-5 years',
        salary: '₹15-22 LPA',
        description: 'Design and develop scalable backend services using Spring Boot and microservices architecture.',
        requirements: [
            'Strong Java/Spring Boot experience',
            'Experience with PostgreSQL and MongoDB',
            'Knowledge of Docker and Kubernetes',
            'Understanding of CI/CD pipelines'
        ]
    },
    {
        id: 3,
        title: 'UI/UX Designer',
        department: 'Design',
        location: 'Mumbai, India',
        type: 'Full-time',
        experience: '2-4 years',
        salary: '₹10-16 LPA',
        description: 'Create beautiful, intuitive user interfaces and experiences for our car comparison platform.',
        requirements: [
            'Proficiency in Figma and Adobe Creative Suite',
            'Strong portfolio showcasing web/mobile design',
            'Understanding of design systems',
            'Experience with user research and testing'
        ]
    },
    {
        id: 4,
        title: 'Data Analyst',
        department: 'Analytics',
        location: 'Bangalore, India',
        type: 'Full-time',
        experience: '2-3 years',
        salary: '₹8-14 LPA',
        description: 'Analyze car market data and provide insights to improve our pricing algorithms and recommendations.',
        requirements: [
            'Strong SQL and Python skills',
            'Experience with data visualization tools',
            'Understanding of statistical analysis',
            'Knowledge of automotive industry is a plus'
        ]
    },
    {
        id: 5,
        title: 'Content Writer',
        department: 'Marketing',
        location: 'Remote',
        type: 'Full-time',
        experience: '1-3 years',
        salary: '₹5-8 LPA',
        description: 'Create engaging content about cars, reviews, and buying guides for our platform.',
        requirements: [
            'Excellent written English skills',
            'Passion for automobiles',
            'Experience with SEO writing',
            'Ability to meet deadlines'
        ]
    }
];

const benefits = [
    { icon: Heart, title: 'Health Insurance', description: 'Comprehensive health coverage for you and your family' },
    { icon: Coffee, title: 'Flexible Hours', description: 'Work when you\'re most productive' },
    { icon: Laptop, title: 'Remote Work', description: 'Work from home or our modern offices' },
    { icon: GraduationCap, title: 'Learning Budget', description: '₹50,000 annual learning allowance' },
    { icon: Rocket, title: 'Growth Path', description: 'Clear career progression and mentorship' },
    { icon: Users, title: 'Team Events', description: 'Regular team outings and celebrations' }
];

const Careers = () => {
    const [selectedJob, setSelectedJob] = useState(null);
    const [showApplication, setShowApplication] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        experience: '',
        resumeLink: '',
        coverLetter: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleApply = (job) => {
        setSelectedJob(job);
        setShowApplication(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => {
            setShowApplication(false);
            setSubmitted(false);
            setFormData({ name: '', email: '', phone: '', experience: '', resumeLink: '', coverLetter: '' });
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-secondary via-secondary to-primary py-24 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/30 rounded-full blur-3xl"></div>
                </div>

                <div className="container mx-auto px-6 md:px-12 relative z-10">
                    <div className="max-w-3xl">
                        <span className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-semibold mb-6">
                            <Briefcase size={16} />
                            We're Hiring!
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                            Build the Future of
                            <span className="text-accent"> Car Buying</span>
                        </h1>
                        <p className="text-xl text-white/80 mb-8 leading-relaxed">
                            Join our passionate team and help millions of Indians find their perfect car.
                            We're building India's most trusted car comparison platform.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <a
                                href="#openings"
                                className="bg-accent hover:bg-accent/90 text-black font-bold px-8 py-4 rounded-full flex items-center gap-2 transition-all hover:gap-4"
                            >
                                View Open Positions
                                <ChevronRight size={20} />
                            </a>
                            <div className="flex items-center gap-3 text-white/80">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary border-2 border-white flex items-center justify-center text-sm font-bold">
                                            {String.fromCharCode(64 + i)}
                                        </div>
                                    ))}
                                </div>
                                <span>25+ team members</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Join Us */}
            <section className="py-20 px-6 md:px-12">
                <div className="container mx-auto">
                    <div className="text-center mb-12">
                        <span className="text-primary text-sm font-semibold uppercase tracking-widest">Benefits</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Why Join Carastani?</h2>
                        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
                            We believe happy employees build great products. Here's what we offer.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {benefits.map((benefit, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl hover:border-primary/20 transition-all duration-300 group"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <benefit.icon size={24} className="text-primary" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h3>
                                <p className="text-gray-600 text-sm">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Open Positions */}
            <section id="openings" className="py-20 px-6 md:px-12 bg-white">
                <div className="container mx-auto">
                    <div className="text-center mb-12">
                        <span className="text-primary text-sm font-semibold uppercase tracking-widest">Opportunities</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Open Positions</h2>
                        <p className="text-gray-600 mt-3">Find your next career move with us</p>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-4">
                        {jobOpenings.map((job) => (
                            <div
                                key={job.id}
                                className="bg-gray-50 rounded-2xl p-6 hover:bg-white hover:shadow-lg border border-transparent hover:border-gray-100 transition-all duration-300 cursor-pointer group"
                                onClick={() => setSelectedJob(selectedJob?.id === job.id ? null : job)}
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
                                                {job.department}
                                            </span>
                                            <span className="bg-accent/10 text-accent text-xs font-semibold px-3 py-1 rounded-full">
                                                {job.type}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                                            {job.title}
                                        </h3>
                                        <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <MapPin size={14} /> {job.location}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock size={14} /> {job.experience}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <DollarSign size={14} /> {job.salary}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleApply(job); }}
                                        className="bg-secondary hover:bg-primary text-white font-semibold px-6 py-3 rounded-full flex items-center gap-2 transition-all"
                                    >
                                        Apply Now
                                        <Send size={16} />
                                    </button>
                                </div>

                                {/* Expanded Details */}
                                {selectedJob?.id === job.id && (
                                    <div className="mt-6 pt-6 border-t border-gray-200 animate-fade-in">
                                        <p className="text-gray-600 mb-4">{job.description}</p>
                                        <h4 className="font-semibold text-gray-900 mb-2">Requirements:</h4>
                                        <ul className="space-y-2">
                                            {job.requirements.map((req, i) => (
                                                <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                                                    <CheckCircle size={16} className="text-primary mt-0.5 flex-shrink-0" />
                                                    {req}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Culture Section */}
            <section className="py-20 px-6 md:px-12 bg-gradient-to-br from-gray-900 to-secondary text-white">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="text-accent text-sm font-semibold uppercase tracking-widest">Our Culture</span>
                            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">
                                More Than Just a Workplace
                            </h2>
                            <p className="text-gray-300 mb-6 leading-relaxed">
                                At Carastani, we foster a culture of innovation, collaboration, and continuous learning.
                                We believe in empowering our team members to take ownership and make an impact.
                            </p>
                            <div className="space-y-4">
                                {['Transparent communication', 'No micromanagement', 'Results-oriented culture', 'Work-life balance'].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                                            <CheckCircle size={14} className="text-black" />
                                        </div>
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/10 rounded-2xl p-6 text-center">
                                <p className="text-4xl font-bold text-accent">25+</p>
                                <p className="text-gray-400 text-sm mt-1">Team Members</p>
                            </div>
                            <div className="bg-white/10 rounded-2xl p-6 text-center">
                                <p className="text-4xl font-bold text-accent">4.8</p>
                                <p className="text-gray-400 text-sm mt-1">Glassdoor Rating</p>
                            </div>
                            <div className="bg-white/10 rounded-2xl p-6 text-center">
                                <p className="text-4xl font-bold text-accent">3</p>
                                <p className="text-gray-400 text-sm mt-1">Office Locations</p>
                            </div>
                            <div className="bg-white/10 rounded-2xl p-6 text-center">
                                <p className="text-4xl font-bold text-accent">∞</p>
                                <p className="text-gray-400 text-sm mt-1">Growth Potential</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Application Modal */}
            {showApplication && selectedJob && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Apply for {selectedJob.title}</h3>
                                <p className="text-gray-500 text-sm">{selectedJob.department} • {selectedJob.location}</p>
                            </div>
                            <button
                                onClick={() => setShowApplication(false)}
                                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {submitted ? (
                            <div className="p-12 text-center">
                                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle size={40} className="text-green-500" />
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 mb-2">Application Submitted!</h4>
                                <p className="text-gray-600">We'll get back to you within 3-5 business days.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                            placeholder="john@email.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Phone *</label>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Years of Experience *</label>
                                    <select
                                        required
                                        value={formData.experience}
                                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    >
                                        <option value="">Select experience</option>
                                        <option value="0-1">0-1 years</option>
                                        <option value="1-3">1-3 years</option>
                                        <option value="3-5">3-5 years</option>
                                        <option value="5-8">5-8 years</option>
                                        <option value="8+">8+ years</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Resume Link (Google Drive/Dropbox) *</label>
                                    <input
                                        type="url"
                                        required
                                        value={formData.resumeLink}
                                        onChange={(e) => setFormData({ ...formData, resumeLink: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="https://drive.google.com/..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Cover Letter (Optional)</label>
                                    <textarea
                                        rows={4}
                                        value={formData.coverLetter}
                                        onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                                        placeholder="Tell us why you're interested in this role..."
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
                                >
                                    Submit Application
                                    <Send size={18} />
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Careers;
