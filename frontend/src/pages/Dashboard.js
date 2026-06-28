import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FaUsers, FaProjectDiagram, FaClock, FaDollarSign, FaCheckCircle, FaHourglassHalf, FaFileInvoice, FaArrowUp, FaChartLine, FaCalendarAlt } from 'react-icons/fa';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    clients: 0,
    projects: 0,
    totalHours: 0,
    pendingAmount: 0,
    totalPaid: 0
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [counters, setCounters] = useState({ clients: 0, projects: 0, hours: 0, amount: 0 });

  const isAdmin = user?.role === 'admin';
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientsRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/clients`, {
          headers: { 'x-auth-token': token }
        });
        const projectsRes = await axios.get(`${process.env.REACT_APP_API_URL}/api//projects`, {
          headers: { 'x-auth-token': token }
        });
        const timelogsRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/timelogs`, {
          headers: { 'x-auth-token': token }
        });
        const invoicesRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/invoices`, {
          headers: { 'x-auth-token': token }
        });

        const totalHours = timelogsRes.data.reduce((sum, log) => sum + log.hours, 0);
        
        let pendingAmount = 0;
        let totalPaid = 0;
        
        if (isAdmin) {
          pendingAmount = invoicesRes.data
            .filter(inv => inv.status === 'pending')
            .reduce((sum, inv) => sum + inv.amount, 0);
          totalPaid = invoicesRes.data
            .filter(inv => inv.status === 'paid')
            .reduce((sum, inv) => sum + inv.amount, 0);
        } else {
          pendingAmount = invoicesRes.data
            .filter(inv => inv.status === 'pending' && inv.clientId?._id === user?.id)
            .reduce((sum, inv) => sum + inv.amount, 0);
          totalPaid = invoicesRes.data
            .filter(inv => inv.status === 'paid' && inv.clientId?._id === user?.id)
            .reduce((sum, inv) => sum + inv.amount, 0);
        }

        // Calculate monthly completed projects
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyCompleted = new Array(12).fill(0);
        
        projectsRes.data.forEach(project => {
          if (project.status === 'completed' && project.updatedAt) {
            const date = new Date(project.updatedAt);
            const monthIndex = date.getMonth();
            monthlyCompleted[monthIndex]++;
          }
        });
        
        const chartData = months.map((month, index) => ({
          month: month,
          completed: monthlyCompleted[index]
        }));
        
        setMonthlyData(chartData);

        const ongoingProjectsCount = projectsRes.data.filter(p => p.status === 'ongoing').length;

        const newStats = {
          clients: clientsRes.data.length,
          projects: ongoingProjectsCount,
          totalHours: totalHours,
          pendingAmount: pendingAmount,
          totalPaid: totalPaid
        };
        setStats(newStats);
        animateCounters(newStats);
        setRecentProjects(projectsRes.data.slice(0, 4));
        setRecentInvoices(invoicesRes.data.slice(0, 4));
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, [token, isAdmin, user?.id]);

  const animateCounters = (targetStats) => {
    const duration = 800;
    const steps = 40;
    const stepTime = duration / steps;
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      setCounters({
        clients: Math.floor(progress * targetStats.clients),
        projects: Math.floor(progress * targetStats.projects),
        hours: Math.floor(progress * targetStats.totalHours),
        amount: Math.floor(progress * targetStats.pendingAmount)
      });
      if (currentStep >= steps) {
        setCounters({
          clients: targetStats.clients,
          projects: targetStats.projects,
          hours: targetStats.totalHours,
          amount: targetStats.pendingAmount
        });
        clearInterval(interval);
      }
    }, stepTime);
  };

  // Admin Cards with navigation links
  const adminCards = [
    { title: 'TOTAL CLIENTS', value: counters.clients, icon: <FaUsers />, bgGradient: 'from-blue-500 to-indigo-600', trend: '+12%', trendUp: true, subtitle: 'Total Clients', link: '/clients' },
    { title: 'ACTIVE PROJECTS', value: counters.projects, icon: <FaProjectDiagram />, bgGradient: 'from-emerald-500 to-teal-600', trend: '+8%', trendUp: true, subtitle: 'Ongoing Projects', link: '/projects' },
    { title: 'CLIENT LOG HOURS', value: counters.hours, icon: <FaClock />, bgGradient: 'from-purple-500 to-pink-600', trend: '+22%', trendUp: true, subtitle: 'Total Hours by Clients', link: '/timelogs' },
    { title: 'PENDING AMOUNT', value: `$${counters.amount || 0}`, icon: <FaDollarSign />, bgGradient: 'from-orange-500 to-red-600', trend: '-5%', trendUp: false, subtitle: 'Pending Payments', link: '/invoices' }
  ];

  // Client Cards with navigation links
  const clientCards = [
    { title: 'YOUR PROJECTS', value: counters.projects, icon: <FaProjectDiagram />, bgGradient: 'from-emerald-500 to-teal-600', trend: '+8%', trendUp: true, subtitle: 'Your Ongoing Projects', link: '/projects' },
    { title: 'YOUR HOURS', value: counters.hours, icon: <FaClock />, bgGradient: 'from-purple-500 to-pink-600', trend: '+22%', trendUp: true, subtitle: 'Hours Logged', link: '/timelogs' },
    { title: 'PENDING AMOUNT', value: `$${counters.amount || 0}`, icon: <FaDollarSign />, bgGradient: 'from-orange-500 to-red-600', trend: '-5%', trendUp: false, subtitle: 'Expected Payment', link: '/invoices' }
  ];

  const cards = isAdmin ? adminCards : clientCards;

  const pieData = [
    { name: 'Paid', value: stats.totalPaid || 0, color: '#10b981' },
    { name: 'Pending', value: stats.pendingAmount || 0, color: '#f59e0b' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 dark:border-indigo-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-6 py-8">
        
        {/* Header */}
        <div className="mb-10">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
                {isAdmin ? 'Welcome back! Here\'s your business overview' : 'Welcome back! Here\'s your project overview'}
              </p>
            </div>
            <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-2xl px-5 py-3 shadow-md border border-gray-100 dark:border-gray-700">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Live Updates</span>
              <FaCalendarAlt className="text-gray-400 dark:text-gray-500" />
            </div>
          </div>
        </div>

        {/* Cards - Clickable */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 ${isAdmin ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
          {cards.map((card, idx) => (
            <Link key={idx} to={card.link} className="block">
              <div
                className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${card.bgGradient} p-7 text-white cursor-pointer shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-150 group`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 group-hover:-translate-y-2 group-hover:translate-x-2 transition-all duration-300"></div>
                <div className="absolute bottom-0 left-0 w-28 h-28 bg-white/10 rounded-full -ml-8 -mb-8 group-hover:scale-150 group-hover:translate-y-2 group-hover:-translate-x-2 transition-all duration-300 delay-75"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-5">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl backdrop-blur-sm group-hover:scale-110 transition-transform duration-200">
                      {card.icon}
                    </div>
                    <div className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full ${card.trendUp ? 'bg-emerald-500/30 text-emerald-100' : 'bg-red-500/30 text-red-100'}`}>
                      {card.trendUp ? <FaArrowUp size={12} /> : <FaArrowUp size={12} className="rotate-180" />}
                      <span>{card.trend}</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium opacity-80 mb-1 uppercase tracking-wide">{card.title}</p>
                  <p className="text-5xl font-bold tracking-tight mb-2">{card.value}</p>
                  <p className="text-xs opacity-70">{card.subtitle}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Charts Section - Only for Admin */}
        {isAdmin && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            
            {/* Monthly Completed Projects Bar Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-7 border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-150">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                <FaChartLine className="text-indigo-500" />
                Monthly Completed Projects
              </h3>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.3} />
                  <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'white', border: 'none', borderRadius: '16px' }} />
                  <Bar dataKey="completed" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Invoice Distribution Pie Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-7 border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-150">
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1 flex items-center gap-2">
                  <FaFileInvoice className="text-purple-500" />
                  Invoice Distribution
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Paid vs Pending invoices</p>
              </div>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" labelLine={false} label={({ name, value, percent }) => `${name}: $${value} (${(percent * 100).toFixed(0)}%)`} outerRadius={110} innerRadius={60} fill="#8884d8" dataKey="value" paddingAngle={5}>
                    {pieData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} stroke="white" strokeWidth={2} />))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'white', border: 'none', borderRadius: '16px' }} />
                  <Legend formatter={(value) => <span className="text-gray-700 dark:text-gray-300">{value}</span>} wrapperStyle={{ paddingTop: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Recent Projects & Invoices */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Recent Projects */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-7 border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-150">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <FaProjectDiagram className="text-emerald-500" />
                Recent Projects
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Your latest projects</p>
            </div>
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div key={project._id} className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800 rounded-xl hover:shadow-md transition-all duration-150 cursor-pointer border border-gray-100 dark:border-gray-700">
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">{project.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Budget: ${project.budget}</p>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-semibold ${project.status === 'completed' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'}`}>
                    {project.status === 'completed' ? <FaCheckCircle className="inline mr-1.5" size={10} /> : <FaHourglassHalf className="inline mr-1.5" size={10} />}
                    {project.status}
                  </span>
                </div>
              ))}
              {recentProjects.length === 0 && (
                <div className="text-center py-12">
                  <FaProjectDiagram className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 dark:text-gray-500">No projects yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Invoices */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-7 border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-150">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <FaFileInvoice className="text-purple-500" />
                Recent Invoices
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Latest billing activity</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="p-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400">Project</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400">Amount</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInvoices.map((invoice) => (
                    <tr key={invoice._id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                      <td className="p-3 text-gray-800 dark:text-white">{invoice.projectId?.name}</td>
                      <td className="p-3 font-semibold text-gray-800 dark:text-white">${invoice.amount}</td>
                      <td className="p-3">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${invoice.status === 'paid' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'}`}>
                          {invoice.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {recentInvoices.length === 0 && (
                <div className="text-center py-12">
                  <FaFileInvoice className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 dark:text-gray-500">No invoices yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;