import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaProjectDiagram, FaDollarSign, FaCalendarAlt, FaInfoCircle, FaCheckCircle, FaHourglassHalf, FaTimes, FaCheck } from 'react-icons/fa';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', budget: '', deadline: '', clientId: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user?.role === 'admin';
  const isClient = user?.role === 'client';

  const fetchProjects = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/projects`, {
        headers: { 'x-auth-token': token }
      });
      setProjects(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }, [token]);

  const fetchClients = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/clients`, {
        headers: { 'x-auth-token': token }
      });
      setClients(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  useEffect(() => {
    fetchProjects();
    fetchClients();
  }, [fetchProjects, fetchClients]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await axios.put(`${process.env.REACT_APP_API_URL}/api/projects/${editingProject._id}`, formData, {
          headers: { 'x-auth-token': token }
        });
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/projects`, formData, {
  headers: { 'x-auth-token': token }
});
      }
      setFormData({ name: '', description: '', budget: '', deadline: '', clientId: '' });
      setShowForm(false);
      setEditingProject(null);
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/projects/${id}`, {
          headers: { 'x-auth-token': token }
        });
        fetchProjects();
      } catch (err) {
        console.error(err);
      }
    }
  };

 const handleEdit = (project) => {
  setEditingProject(project);
  setFormData({
    name: project.name,
    description: project.description || '',
    budget: project.budget,
    deadline: project.deadline?.split('T')[0] || '',
    clientId: project.clientId?._id || project.clientId
  });
  setShowForm(true);
};
  const handleRespondToProject = async (e, projectId, accept) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/projects/${projectId}/respond`, 
        { accept },
        { headers: { 'x-auth-token': token } }
      );
      alert(res.data.msg);
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.msg || 'Something went wrong');
    }
  };

  const handleMarkAsCompleted = async (projectId) => {
    if (window.confirm('Are you sure you want to mark this project as completed? An invoice will be created automatically.')) {
      setUpdating(true);
      try {
        const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/projects/${projectId}/complete`, 
          {},
          { headers: { 'x-auth-token': token } }
        );
        alert(res.data.msg);
        fetchProjects();
      } catch (err) {
        alert(err.response?.data?.msg || 'Failed to update project status');
      } finally {
        setUpdating(false);
      }
    }
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.clientId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed':
        return { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', icon: <FaCheckCircle className="inline mr-1.5" size={10} />, label: 'Completed' };
      case 'pending_acceptance':
        return { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400', icon: <FaHourglassHalf className="inline mr-1.5" size={10} />, label: 'Awaiting Approval' };
      case 'rejected':
        return { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', icon: <FaTimes className="inline mr-1.5" size={10} />, label: 'Budget Rejected' };
      default:
        return { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400', icon: <FaHourglassHalf className="inline mr-1.5" size={10} />, label: 'Ongoing' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500 dark:border-green-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Projects
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your client projects</p>
          </div>
          {isAdmin && (
            <button
              onClick={() => { setShowForm(!showForm); setEditingProject(null); setFormData({ name: '', description: '', budget: '', deadline: '', clientId: '' }); }}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-150"
            >
              <FaPlus /> Add Project
            </button>
          )}
        </div>

        <div className="relative mb-6">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search projects by name or client..."
            className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <AnimatePresence>
          {isAdmin && showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6 overflow-hidden"
            >
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                {editingProject ? <FaEdit className="text-blue-500" /> : <FaPlus className="text-green-500" />}
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Project Name *" className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-white" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                  <select className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-white" value={formData.clientId} onChange={(e) => setFormData({ ...formData, clientId: e.target.value })} required>
                    <option value="">Select Client *</option>
                    {clients.map(client => <option key={client._id} value={client._id}>{client.name}</option>)}
                  </select>
                  <textarea placeholder="Description" rows="3" className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-white" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                  <input type="number" placeholder="Budget *" className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-white" value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value })} required />
                  <input type="date" placeholder="Deadline" className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-white" value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} />
                  {}
                  <input
                    type="date"
                    placeholder="Deadline"
                    min={new Date().toISOString().split('T')[0]}  // 🟢 TODAY OR FUTURE ONLY
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300">Cancel</button>
                  <button type="submit" className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg transition">{editingProject ? 'Update Project' : 'Save Project'}</button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const statusBadge = getStatusBadge(project.status);
            const isCompleted = project.status === 'completed';
            const isOngoing = project.status === 'ongoing';
            const isOverdue = project.isOverdue && !isCompleted;  // ✅ Overdue flag from backend
            
            return (
              <div key={project._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-150">
                <div className={`p-4 text-white ${
                  project.status === 'completed' ? 'bg-gradient-to-r from-green-500 to-green-600' : 
                  project.status === 'pending_acceptance' ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
                  project.status === 'rejected' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                  'bg-gradient-to-r from-yellow-500 to-orange-500'
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{project.name}</h3>
                      <p className="text-sm opacity-90">{project.clientId?.name}</p>
                    </div>
                    {isAdmin && (
                      <div className="flex gap-2">
                        {!isCompleted && (
                          <button onClick={() => handleEdit(project)} className="p-2 hover:bg-white/20 rounded-lg transition">
                            <FaEdit />
                          </button>
                        )}
                        <button onClick={() => handleDelete(project._id)} className="p-2 hover:bg-white/20 rounded-lg transition">
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  {project.description && (
                    <div className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                      <FaInfoCircle className="text-blue-500 mt-1" />
                      <span className="text-sm">{project.description.substring(0, 100)}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <FaDollarSign className="text-green-500" />
                    <span className="text-sm font-semibold">Budget: ${project.budget}</span>
                  </div>
                  {project.deadline && (
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                      <FaCalendarAlt className="text-purple-500" />
                      <span className="text-sm">Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="mt-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge.bg} ${statusBadge.text}`}>
                      {statusBadge.icon}
                      {statusBadge.label}
                    </span>
                    {}
                    {isOverdue && (
                      <span className="ml-2 px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                        ⚠️ Overdue
                      </span>
                    )}
                  </div>
                  
                  {/* ACCEPT/REJECT BUTTONS for pending projects */}
                  {isClient && project.status === 'pending_acceptance' && (
                    <div className="flex gap-2 mt-3">
                      <button onClick={(e) => handleRespondToProject(e, project._id, true)} className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition flex items-center gap-1">
                        <FaCheck /> Accept (${project.budget})
                      </button>
                      <button onClick={(e) => handleRespondToProject(e, project._id, false)} className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition flex items-center gap-1">
                        <FaTimes /> Reject
                      </button>
                    </div>
                  )}
                  
                  {/* MARK AS COMPLETED BUTTON for ongoing projects (Client only) */}
                  {isClient && isOngoing && (
                    <button
                      onClick={() => handleMarkAsCompleted(project._id)}
                      disabled={updating}
                      className="w-full mt-3 px-3 py-2 bg-emerald-500 text-white rounded-lg text-sm hover:bg-emerald-600 transition flex items-center justify-center gap-1 disabled:opacity-50"
                    >
                      <FaCheckCircle /> {updating ? 'Updating...' : 'Mark as Completed'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <FaProjectDiagram className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No projects found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;