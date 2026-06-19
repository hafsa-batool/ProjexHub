import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaProjectDiagram, FaClock, FaFileInvoice, FaArrowRight, FaCheckCircle, FaChartLine, FaShieldAlt, FaStar, FaStarHalfAlt, FaPlay, FaRocket, FaTimes } from 'react-icons/fa';

const Home = () => {
  const [showDemo, setShowDemo] = useState(false);

  const features = [
    { icon: <FaUsers className="text-4xl text-blue-500" />, title: 'Client Management', desc: 'Invite and manage all your clients in one place', bg: 'bg-blue-50' },
    { icon: <FaProjectDiagram className="text-4xl text-emerald-500" />, title: 'Project Tracking', desc: 'Track projects with budget and deadlines', bg: 'bg-emerald-50' },
    { icon: <FaClock className="text-4xl text-purple-500" />, title: 'Time Logging', desc: 'Log working hours for each project', bg: 'bg-purple-50' },
    { icon: <FaFileInvoice className="text-4xl text-red-500" />, title: 'Smart Invoicing', desc: 'Generate and manage invoices easily', bg: 'bg-red-50' }
  ];

  const stats = [
    { value: '500+', label: 'Active Users', icon: <FaUsers className="text-blue-500 text-2xl" /> },
    { value: '2,000+', label: 'Projects Completed', icon: <FaProjectDiagram className="text-emerald-500 text-2xl" /> },
    { value: '50,000+', label: 'Hours Logged', icon: <FaClock className="text-purple-500 text-2xl" /> },
    { value: '98%', label: 'Satisfaction Rate', icon: <FaStar className="text-yellow-500 text-2xl" /> }
  ];

  const testimonials = [
    { name: 'Sarah Ahmed', role: 'Freelance Designer', text: 'ProjexHub has completely transformed how I manage my clients. The interface is beautiful and intuitive!', image: 'https://randomuser.me/api/portraits/women/1.jpg' },
    { name: 'Ali Raza', role: 'Agency Owner', text: 'The best project management tool I have ever used. Simple yet powerful. Highly recommended!', image: 'https://randomuser.me/api/portraits/men/2.jpg' }
  ];

  const screenshots = [
    { src: '/screenshots/dashboard.png', title: 'Dashboard', desc: 'Overview of all your business metrics' },
    { src: '/screenshots/clients.png', title: 'Clients Page', desc: 'Manage all your clients in one place' },
    { src: '/screenshots/projects.png', title: 'Projects Page', desc: 'Track projects with budget and deadlines' },
    { src: '/screenshots/timelogs.png', title: 'Time Logs', desc: 'Log working hours for each project' },
    { src: '/screenshots/invoices.png', title: 'Invoices', desc: 'Generate and manage invoices easily' },
    { src: '/screenshots/blockchain.png', title: 'Blockchain Audit', desc: 'Tamper-proof records on blockchain' }
  ];

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      
      {/* ========== TEXTURED BACKGROUND WITH MOVEMENT ========== */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950/90 to-purple-950/90"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '30px 30px'
        }}></div>
        <div className="absolute inset-0 opacity-[0.08]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '250px 250px',
          animation: 'slowNoise 30s infinite alternate ease-in-out'
        }}></div>
        <div className="absolute top-0 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-floatOrb1"></div>
        <div className="absolute bottom-0 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-floatOrb2"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl animate-floatOrb3"></div>
        <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-floatOrb4"></div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-[100%] w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-45 animate-shimmerSlow"></div>
          <div className="absolute -inset-[100%] w-[200%] h-[200%] bg-gradient-to-l from-transparent via-indigo-500/5 to-transparent -rotate-12 animate-shimmerReverse"></div>
        </div>
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}></div>
      </div>

      <style>{`
        @keyframes slowNoise {
          0% { opacity: 0.06; transform: scale(1); }
          100% { opacity: 0.12; transform: scale(1.03); }
        }
        @keyframes floatOrb1 {
          0% { transform: translate(0%, 0%) scale(1); opacity: 0.2; }
          50% { transform: translate(8%, 12%) scale(1.3); opacity: 0.35; }
          100% { transform: translate(-5%, 8%) scale(0.9); opacity: 0.2; }
        }
        @keyframes floatOrb2 {
          0% { transform: translate(0%, 0%) scale(1); opacity: 0.2; }
          50% { transform: translate(-12%, -8%) scale(1.4); opacity: 0.35; }
          100% { transform: translate(6%, -6%) scale(0.95); opacity: 0.2; }
        }
        @keyframes floatOrb3 {
          0% { transform: translate(0%, 0%) scale(1); opacity: 0.15; }
          50% { transform: translate(15%, -10%) scale(1.2); opacity: 0.3; }
          100% { transform: translate(-8%, 12%) scale(0.9); opacity: 0.15; }
        }
        @keyframes floatOrb4 {
          0% { transform: translate(0%, 0%) scale(1); opacity: 0.1; }
          50% { transform: translate(-10%, 15%) scale(1.25); opacity: 0.25; }
          100% { transform: translate(12%, -8%) scale(0.85); opacity: 0.1; }
        }
        @keyframes shimmerSlow {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }
        @keyframes shimmerReverse {
          0% { transform: translateX(100%) translateY(-100%) rotate(-12deg); }
          100% { transform: translateX(-100%) translateY(100%) rotate(-12deg); }
        }
        .animate-floatOrb1 { animation: floatOrb1 20s infinite alternate ease-in-out; }
        .animate-floatOrb2 { animation: floatOrb2 25s infinite alternate ease-in-out; }
        .animate-floatOrb3 { animation: floatOrb3 28s infinite alternate ease-in-out; }
        .animate-floatOrb4 { animation: floatOrb4 22s infinite alternate ease-in-out; }
        .animate-shimmerSlow { animation: shimmerSlow 18s infinite linear; }
        .animate-shimmerReverse { animation: shimmerReverse 22s infinite linear; }
        @keyframes floatText {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float-text {
          animation: floatText 5s ease-in-out infinite;
        }
        @keyframes shimmerText {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .animate-shimmerText {
          animation: shimmerText 4s linear infinite;
        }
      `}</style>

      {/* Screenshots Modal */}
      {showDemo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowDemo(false)}>
          <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-3xl">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">ProjexHub Demo</h2>
                <p className="text-gray-500 mt-1">See how ProjexHub works</p>
              </div>
              <button onClick={() => setShowDemo(false)} className="p-2 hover:bg-gray-100 rounded-full transition">
                <FaTimes className="text-2xl text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-8">
              {screenshots.map((screenshot, idx) => (
                <div key={idx} className="border border-gray-200 rounded-2xl p-4 hover:shadow-lg transition">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{screenshot.title}</h3>
                  <p className="text-gray-500 mb-4">{screenshot.desc}</p>
                  <div className="bg-gray-100 rounded-xl overflow-hidden">
                    <img 
                      src={screenshot.src} 
                      alt={screenshot.title}
                      className="w-full h-auto"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/1200x600/1e1b4b/indigo?text=ProjexHub+Preview";
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-center rounded-b-3xl">
              <Link to="/register" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition">
                Get Started Now
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/40 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2 group transition-transform hover:scale-105">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <FaProjectDiagram className="text-white text-xl" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                ProjexHub
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-white/70 hover:text-white transition px-4 py-2 rounded-lg hover:bg-white/10 font-medium">
                Login
              </Link>
              <Link to="/register" className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition shadow-md font-semibold">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 lg:pt-32 lg:pb-24">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-indigo-200 px-5 py-2 rounded-full text-sm font-semibold mb-6 border border-white/20">
              <FaRocket className="text-sm" /> The Ultimate Solution
            </div>
            <h1 className="text-6xl lg:text-8xl font-extrabold mb-6 tracking-tight animate-float-text">
              <span className="bg-gradient-to-r from-white via-indigo-300 to-purple-300 bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmerText">
                ProjexHub
              </span>
            </h1>
            <p className="text-2xl lg:text-3xl font-semibold text-white mb-4 drop-shadow-lg">
              Manage Your Business Like a Pro
            </p>
            <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto drop-shadow">
              Track clients, manage projects, log hours, and generate invoices — all in one beautiful platform.
            </p>
            <div className="flex flex-wrap gap-5 justify-center">
              <Link to="/register" className="group inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                Start Free Trial <FaArrowRight className="group-hover:translate-x-1 transition" />
              </Link>
              <button 
                onClick={() => setShowDemo(true)}
                className="inline-flex items-center gap-2 border border-white/30 bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/20 hover:border-white/50 transition-all duration-300"
              >
                <FaPlay /> Watch Demo
              </button>
            </div>
          </div>
          
          {/* ========== DASHBOARD PREVIEW CARD WITH REAL SCREENSHOT ========== */}
          <div className="mt-20 max-w-4xl mx-auto group">
            <div className="relative transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur-2xl opacity-40 group-hover:opacity-60 transition duration-500 animate-pulse"></div>
              <div className="relative bg-black/40 backdrop-blur-md rounded-3xl shadow-2xl p-2 border border-white/20">
                <img 
                  src="/screenshots/dashboard.png" 
                  alt="ProjexHub Dashboard Preview"
                  className="w-full h-auto rounded-2xl"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/1200x600/1e1b4b/indigo?text=ProjexHub+Dashboard+Preview%0A(Add+screenshot+to+/public/screenshots/dashboard.png)";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-black/20 backdrop-blur-sm border-y border-white/10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center group hover:scale-105 transition">
                <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center">{stat.icon}</div>
                <p className="text-3xl md:text-4xl font-bold text-white">{stat.value}</p>
                <p className="text-indigo-200 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Everything You Need to Succeed</h2>
            <p className="text-xl text-indigo-200">Powerful features designed to streamline your workflow</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="group bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center border border-white/20">
                <div className={`w-20 h-20 ${feature.bg} rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-indigo-100">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role-Based Access Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-800/80 to-purple-900/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center text-white mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Smart Role-Based Access</h2>
            <p className="text-xl text-indigo-100">Different views for different users — complete control and security</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white text-center hover:bg-white/20 transition transform hover:scale-105 duration-300 border border-white/20">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">👑</div>
              <h3 className="text-2xl font-bold mb-2">Admin Dashboard</h3>
              <p className="text-indigo-100">Complete control — manage all clients, projects, and invoices</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white text-center hover:bg-white/20 transition transform hover:scale-105 duration-300 border border-white/20">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">👤</div>
              <h3 className="text-2xl font-bold mb-2">Client Dashboard</h3>
              <p className="text-indigo-100">View only your own projects, hours, and invoices</p>
            </div>
          </div>
        </div>
      </section>

      {/* Blockchain Section */}
      <section className="py-20 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-purple-500/20 backdrop-blur-md text-purple-200 px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-purple-500/30">
                <FaShieldAlt /> Blockchain Enhanced
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Tamper-Proof Security</h2>
              <p className="text-lg text-indigo-100 mb-6">All invoices and audit trails are stored on blockchain — ensuring transparency, security, and trust.</p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <div className="flex items-center gap-2"><FaCheckCircle className="text-green-400" /><span className="text-white">Immutable Invoices</span></div>
                <div className="flex items-center gap-2"><FaCheckCircle className="text-green-400" /><span className="text-white">Audit Trail</span></div>
                <div className="flex items-center gap-2"><FaCheckCircle className="text-green-400" /><span className="text-white">Payment History</span></div>
              </div>
            </div>
            <div className="flex-1">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 text-center border border-white/20 transform hover:scale-105 transition duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">
                  <FaChartLine className="text-white text-3xl" />
                </div>
                <p className="text-indigo-100 font-medium">Every transaction is permanently recorded on blockchain</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Loved by Businesses Worldwide</h2>
            <p className="text-xl text-indigo-200">See what our users have to say</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 duration-300 border border-white/20">
                <div className="flex items-center gap-3 mb-4">
                  <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover border-2 border-indigo-400" />
                  <div><p className="font-semibold text-white">{testimonial.name}</p><p className="text-sm text-indigo-200">{testimonial.role}</p></div>
                </div>
                <div className="flex gap-1 text-yellow-400 mb-3"><FaStar /><FaStar /><FaStar /><FaStar /><FaStarHalfAlt /></div>
                <p className="text-indigo-100 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-700 to-purple-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Transform Your Business?</h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">Join thousands of satisfied users and start managing your projects efficiently</p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
            Get Started For Free <FaArrowRight />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 backdrop-blur-md text-gray-400 py-12 border-t border-white/10">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center gap-8 mb-6">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <Link to="/login" className="hover:text-white transition">Login</Link>
            <Link to="/register" className="hover:text-white transition">Register</Link>
          </div>
          <p className="text-white/60">© 2025 ProjexHub. All rights reserved.</p>
          <p className="text-sm mt-2 text-white/40">Secure • Reliable • Blockchain Powered</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;