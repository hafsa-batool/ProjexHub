import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation, useInView } from 'framer-motion';
import { 
  FaUsers, FaProjectDiagram, FaClock, FaFileInvoice, 
  FaArrowRight, FaCheckCircle, FaChartLine, FaShieldAlt, 
  FaStar, FaPlay, FaRocket, FaTimes,
} from 'react-icons/fa';

// 🔥 Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -80 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 80 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } }
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const floatingAnimation = {
  y: [0, -12, 0],
  transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
};

const Home = () => {
  const [showDemo, setShowDemo] = useState(false);
  const [counters, setCounters] = useState({ users: 0, projects: 0, hours: 0, satisfaction: 0 });

  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  useEffect(() => {
    const targetStats = { users: 500, projects: 2000, hours: 50000, satisfaction: 98 };
    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;
    let currentStep = 0;
    
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      setCounters({
        users: Math.floor(progress * targetStats.users),
        projects: Math.floor(progress * targetStats.projects),
        hours: Math.floor(progress * targetStats.hours),
        satisfaction: Math.floor(progress * targetStats.satisfaction)
      });
      if (currentStep >= steps) {
        setCounters(targetStats);
        clearInterval(interval);
      }
    }, stepTime);
    
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: <FaUsers className="text-4xl text-blue-500" />, title: 'Client Management', desc: 'Invite and manage all your clients in one place', bg: 'bg-blue-50' },
    { icon: <FaProjectDiagram className="text-4xl text-emerald-500" />, title: 'Project Tracking', desc: 'Track projects with budget and deadlines', bg: 'bg-emerald-50' },
    { icon: <FaClock className="text-4xl text-purple-500" />, title: 'Time Logging', desc: 'Log working hours for each project', bg: 'bg-purple-50' },
    { icon: <FaFileInvoice className="text-4xl text-red-500" />, title: 'Smart Invoicing', desc: 'Generate and manage invoices easily', bg: 'bg-red-50' }
  ];

  const stats = [
    { value: counters.users + '+', label: 'Active Users', icon: <FaUsers className="text-blue-500 text-2xl" /> },
    { value: counters.projects + '+', label: 'Projects Completed', icon: <FaProjectDiagram className="text-emerald-500 text-2xl" /> },
    { value: counters.hours + '+', label: 'Hours Logged', icon: <FaClock className="text-purple-500 text-2xl" /> },
    { value: counters.satisfaction + '%', label: 'Satisfaction Rate', icon: <FaStar className="text-yellow-500 text-2xl" /> }
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
      `}</style>

      {/* Screenshots Modal */}
      {showDemo && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" 
          onClick={() => setShowDemo(false)}
        >
          <motion.div 
            initial={{ scale: 0.8, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto" 
            onClick={(e) => e.stopPropagation()}
          >
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
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="border border-gray-200 rounded-2xl p-4 hover:shadow-lg transition"
                >
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
                </motion.div>
              ))}
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-center rounded-b-3xl">
              <Link to="/register" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition">
                Get Started Now
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Fixed Navbar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 w-full z-50 bg-black/40 backdrop-blur-xl border-b border-white/10 shadow-2xl"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2 group transition-transform hover:scale-105">
              <motion.div 
                whileHover={{ rotate: [0, -10, 10, -5, 5, 0] }}
                transition={{ duration: 0.5 }}
                className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg"
              >
                <FaProjectDiagram className="text-white text-xl" />
              </motion.div>
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
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 lg:pt-32 lg:pb-24">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
            className="text-center max-w-5xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-indigo-200 px-5 py-2 rounded-full text-sm font-semibold mb-6 border border-white/20">
              <FaRocket className="text-sm animate-pulse" /> The Ultimate Solution
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp}
              className="text-6xl lg:text-8xl font-extrabold mb-6 tracking-tight"
            >
              <span className="bg-gradient-to-r from-white via-indigo-300 to-purple-300 bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmerText">
                ProjexHub
              </span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-2xl lg:text-3xl font-semibold text-white mb-4 drop-shadow-lg">
              Manage Your Business Like a Pro
            </motion.p>
            
            <motion.p variants={fadeInUp} className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto drop-shadow">
              Track clients, manage projects, log hours, and generate invoices — all in one beautiful platform.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-5 justify-center">
              <Link to="/register" className="group inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                Start Free Trial <FaArrowRight className="group-hover:translate-x-1 transition" />
              </Link>
              <button 
                onClick={() => setShowDemo(true)}
                className="inline-flex items-center gap-2 border border-white/30 bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/20 hover:border-white/50 transition-all duration-300"
              >
                <FaPlay className="animate-pulse" /> Watch Demo
              </button>
            </motion.div>
          </motion.div>
          
          {/* Dashboard Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-20 max-w-4xl mx-auto group"
          >
            <motion.div 
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="relative"
            >
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
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section with Animated Counters */}
      <motion.section 
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={staggerChildren}
        className="py-16 bg-black/20 backdrop-blur-sm border-y border-white/10"
      >
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx} 
                variants={fadeInUp}
                whileHover={{ scale: 1.08, y: -4 }}
                transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                className="text-center group"
              >
                <motion.div 
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.4 }}
                  className="w-12 h-12 mx-auto mb-3 flex items-center justify-center"
                >
                  {stat.icon}
                </motion.div>
                <motion.p 
                  className="text-3xl md:text-4xl font-bold text-white"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 + idx * 0.15, type: 'spring', damping: 10, stiffness: 100 }}
                >
                  {stat.value}
                </motion.p>
                <p className="text-indigo-200 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerChildren}
        className="py-20 bg-black/20 backdrop-blur-sm"
      >
        <div className="container mx-auto px-6">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Everything You Need to Succeed</h2>
            <p className="text-xl text-indigo-200">Powerful features designed to streamline your workflow</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx} 
                variants={fadeInUp}
                whileHover={{ 
                  scale: 1.05, 
                  y: -8,
                  boxShadow: "0 20px 40px rgba(99, 102, 241, 0.3)"
                }}
                transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                className="group bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 text-center border border-white/20"
              >
                <motion.div 
                  whileHover={{ rotate: [0, -8, 8, -4, 4, 0], scale: 1.15 }}
                  transition={{ duration: 0.5 }}
                  className={`w-20 h-20 ${feature.bg} rounded-2xl flex items-center justify-center mx-auto mb-5`}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-indigo-100">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Role-Based Access Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerChildren}
        className="py-20 bg-gradient-to-br from-indigo-800/80 to-purple-900/80 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div variants={fadeInUp} className="text-center text-white mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Smart Role-Based Access</h2>
            <p className="text-xl text-indigo-100">Different views for different users — complete control and security</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              { emoji: '👑', title: 'Admin Dashboard', desc: 'Complete control — manage all clients, projects, and invoices' },
              { emoji: '👤', title: 'Client Dashboard', desc: 'View only your own projects, hours, and invoices' }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                variants={fadeInUp}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.2)' }}
                transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white text-center border border-white/20"
              >
                <motion.div 
                  whileHover={{ scale: 1.2, rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.4 }}
                  className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
                >
                  {item.emoji}
                </motion.div>
                <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                <p className="text-indigo-100">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Blockchain Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerChildren}
        className="py-20 bg-black/20 backdrop-blur-sm"
      >
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div variants={fadeInLeft} className="flex-1 text-center lg:text-left">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="inline-flex items-center gap-2 bg-purple-500/20 backdrop-blur-md text-purple-200 px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-purple-500/30"
              >
                <FaShieldAlt className="animate-pulse" /> Blockchain Enhanced
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Tamper-Proof Security</h2>
              <p className="text-lg text-indigo-100 mb-6">All invoices and audit trails are stored on blockchain — ensuring transparency, security, and trust.</p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                {['Immutable Invoices', 'Audit Trail', 'Payment History'].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2"
                  >
                    <FaCheckCircle className="text-green-400 animate-pulse" />
                    <span className="text-white">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div 
              variants={fadeInRight}
              whileHover={{ scale: 1.05, rotate: [0, 1, -1, 0] }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              <motion.div 
                animate={floatingAnimation}
                className="bg-white/10 backdrop-blur-md rounded-3xl p-8 text-center border border-white/20"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">
                  <FaChartLine className="text-white text-3xl" />
                </div>
                <p className="text-indigo-100 font-medium">Every transaction is permanently recorded on blockchain</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerChildren}
        className="py-20 bg-black/20 backdrop-blur-sm"
      >
        <div className="container mx-auto px-6">
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Loved by Businesses Worldwide</h2>
            <p className="text-xl text-indigo-200">See what our users have to say</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, idx) => (
              <motion.div 
                key={idx}
                variants={fadeInUp}
                whileHover={{ 
                  scale: 1.03, 
                  y: -4,
                  boxShadow: "0 20px 40px rgba(99, 102, 241, 0.2)"
                }}
                transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20"
              >
                <div className="flex items-center gap-3 mb-4">
                  <motion.img 
                    whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.3 }}
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full object-cover border-2 border-indigo-400" 
                  />
                  <div><p className="font-semibold text-white">{testimonial.name}</p><p className="text-sm text-indigo-200">{testimonial.role}</p></div>
                </div>
                <motion.div 
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', damping: 10, stiffness: 100 }}
                  className="flex gap-1 text-yellow-400 mb-3"
                >
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i === 4 ? 'text-yellow-400/60' : 'text-yellow-400'} />
                  ))}
                </motion.div>
                <p className="text-indigo-100 italic">"{testimonial.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerChildren}
        className="py-20 bg-gradient-to-r from-indigo-700 to-purple-800 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <motion.div 
          animate={floatingAnimation}
          className="absolute top-10 right-10 text-9xl opacity-10"
        >
          🚀
        </motion.div>
        <motion.div 
          animate={floatingAnimation}
          transition={{ delay: 1, duration: 5 }}
          className="absolute bottom-10 left-10 text-8xl opacity-10"
        >
          ⚡
        </motion.div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Business?
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied users and start managing your projects efficiently
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Link to="/register" className="group inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              Get Started For Free <FaArrowRight className="group-hover:translate-x-1 transition" />
            </Link>
          </motion.div>
        </div>
      </motion.section>

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