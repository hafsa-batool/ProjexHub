import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaEnvelope, FaPhone, FaBuilding, FaProjectDiagram, FaDollarSign, FaCalendarAlt, FaTrash, FaPlus, FaCheckCircle, FaHourglassHalf, FaCheck, FaTimes } from 'react-icons/fa';

const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectForm, setProjectForm] = useState({ 
    name: '', 
    description: '', 
    budget: '', 
    deadline: ''
  });

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user?.role === 'admin';
  const isClient = user?.role === 'client';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientRes = await axios.get(`http://localhost:5000/api/clients/${id}`, {
          headers: { 'x-auth-token': token }
        });
        setClient(clientRes.data);

        const projectsRes = await axios.get(`http://localhost:5000/api/projects/client/${id}`, {
          headers: { 'x-auth-token': token }
        });
        setProjects(projectsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, token]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/projects', 
        { ...projectForm, clientId: id },
        { headers: { 'x-auth-token': token } }
      );
      setProjects([res.data, ...projects]);
      setShowProjectForm(false);
      setProjectForm({ name: '', description: '', budget: '', deadline: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Delete this project?')) {
      try {
        await axios.delete(`http://localhost:5000/api/projects/${projectId}`, {
          headers: { 'x-auth-token': token }
        });
        setProjects(projects.filter(p => p._id !== projectId));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleRespondToProject = async (projectId, accept) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/projects/${projectId}/respond`, 
        { accept },
        { headers: { 'x-auth-token': token } }
      );
      alert(res.data.msg);
      const projectsRes = await axios.get(`http://localhost:5000/api/projects/client/${id}`, {
        headers: { 'x-auth-token': token }
      });
      setProjects(projectsRes.data);
    } catch (err) {
      alert(err.response?.data?.msg || 'Something went wrong');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Client not found</h2>
          <button onClick={() => navigate('/clients')} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-xl">
            Back to Clients
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        
        <button
          onClick={() => navigate('/clients')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition mb-6"
        >
          <FaArrowLeft /> Back to Clients
        </button>

        {/* Client Info Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {client.name?.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{client.name}</h1>
              <p className="text-gray-500 dark:text-gray-400">{client.company || 'Independent'}</p>
              <div className="flex flex-wrap gap-4 mt-2">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <FaEnvelope className="text-blue-500" />
                  <span>{client.email}</span>
                </div>
                {client.phone && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <FaPhone className="text-green-500" />
                    <span>{client.phone}</span>
                  </div>
                )}
                {client.company && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <FaBuilding className="text-purple-500" />
                    <span>{client.company}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <FaProjectDiagram className="text-blue-500" />
              Projects ({projects.length})
            </h2>
            {isAdmin && (
              <button
                onClick={() => setShowProjectForm(!showProjectForm)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition"
              >
                <FaPlus /> Add Project
              </button>
            )}
          </div>

          {/* Add Project Form - ONLY FOR ADMIN */}
          {isAdmin && showProjectForm && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">New Project for {client.name}</h3>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Project Name *"
                    className="p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800"
                    value={projectForm.name}
                    onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Budget *"
                    className="p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800"
                    value={projectForm.budget}
                    onChange={(e) => setProjectForm({ ...projectForm, budget: e.target.value })}
                    required
                  />
                  <textarea
                    placeholder="Description"
                    rows="2"
                    className="p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800"
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  />
                  <input
                    type="date"
                    className="p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800"
                    value={projectForm.deadline}
                    onChange={(e) => setProjectForm({ ...projectForm, deadline: e.target.value })}
                  />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="px-6 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition">
                    Create Project
                  </button>
                  <button type="button" onClick={() => setShowProjectForm(false)} className="px-6 py-2 border border-gray-300 rounded-xl hover:bg-gray-100 transition">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Projects List */}
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <FaProjectDiagram className="text-5xl text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No projects yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project) => (
                <div key={project._id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition">
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-white text-lg">{project.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{project.description?.substring(0, 100)}</p>
                    <div className="flex flex-wrap gap-3 mt-2">
                      <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <FaDollarSign className="text-green-500" /> ${project.budget}
                      </span>
                      {project.deadline && (
                        <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                          <FaCalendarAlt className="text-purple-500" /> {new Date(project.deadline).toLocaleDateString()}
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        project.status === 'completed' ? 'bg-green-100 text-green-600' : 
                        project.status === 'pending_acceptance' ? 'bg-purple-100 text-purple-600' :
                        project.status === 'rejected' ? 'bg-red-100 text-red-600' :
                        'bg-yellow-100 text-yellow-600'
                      }`}>
                        {project.status === 'completed' && <><FaCheckCircle className="inline mr-1" size={10} /> Completed</>}
                        {project.status === 'pending_acceptance' && <>⏳ Awaiting Approval</>}
                        {project.status === 'rejected' && <>❌ Budget Rejected</>}
                        {project.status === 'ongoing' && <><FaHourglassHalf className="inline mr-1" size={10} /> Ongoing</>}
                      </span>
                    </div>
                    
                    {/* ✅ ACCEPT/REJECT BUTTONS FOR CLIENT */}
                    {isClient && project.status === 'pending_acceptance' && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleRespondToProject(project._id, true)}
                          className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition flex items-center gap-1"
                        >
                          <FaCheck /> Accept (${project.budget})
                        </button>
                        <button
                          onClick={() => handleRespondToProject(project._id, false)}
                          className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition flex items-center gap-1"
                        >
                          <FaTimes /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                  {isAdmin && (
                    <button onClick={() => handleDeleteProject(project._id)} className="text-red-500 hover:text-red-700 transition mt-2">
                      <FaTrash />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDetail;