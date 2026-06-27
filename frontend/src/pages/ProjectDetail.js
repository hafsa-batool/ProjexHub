import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaInfoCircle, FaCheckCircle, FaHourglassHalf, FaFlagCheckered, FaEdit } from 'react-icons/fa';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user?.role === 'admin';
  const isClient = user?.role === 'client';

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api//api/projects/${id}`, {
          headers: { 'x-auth-token': token }
        });
        setProject(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id, token]);

  // Client marks project as completed - auto creates invoice
  const handleMarkAsCompleted = async () => {
    if (window.confirm('Are you sure you want to mark this project as completed? An invoice will be created automatically.')) {
      setUpdating(true);
      try {
        const res = await axios.put(`${process.env.REACT_APP_API_URL}/api//api/projects/${id}/complete`, 
          {},
          { headers: { 'x-auth-token': token } }
        );
        setProject(res.data.project);
        alert(res.data.msg);
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.msg || 'Failed to update project status');
      } finally {
        setUpdating(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Project not found</h2>
          <button
            onClick={() => navigate('/projects')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        
        {/* Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition"
          >
            <FaArrowLeft /> Back
          </button>
        </div>

        {/* Project Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{project.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  project.status === 'completed' 
                    ? 'bg-green-100 text-green-600' 
                    : project.status === 'pending_acceptance'
                    ? 'bg-purple-100 text-purple-600'
                    : project.status === 'rejected'
                    ? 'bg-red-100 text-red-600'
                    : 'bg-yellow-100 text-yellow-600'
                }`}>
                  {project.status === 'completed' ? <FaCheckCircle className="inline mr-1" /> : <FaHourglassHalf className="inline mr-1" />}
                  {project.status === 'completed' ? 'Completed' : 
                   project.status === 'pending_acceptance' ? 'Awaiting Approval' :
                   project.status === 'rejected' ? 'Rejected' : 'Ongoing'}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              {/* ✅ Edit Button - Only for Admin, and only if project is NOT completed */}
              {isAdmin && project.status !== 'completed' && (
                <Link
                  to={`/projects/edit/${project._id}`}
                  className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition flex items-center gap-2"
                >
                  <FaEdit /> Edit Project
                </Link>
              )}
              {/* Client: Mark as Completed Button - Only if status is ongoing */}
              {isClient && project.status === 'ongoing' && (
                <button
                  onClick={handleMarkAsCompleted}
                  disabled={updating}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition flex items-center gap-2 disabled:opacity-50"
                >
                  <FaFlagCheckered /> {updating ? 'Updating...' : 'Mark as Completed'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Project Details Only - No Client Information Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <FaInfoCircle className="text-blue-500" />
            Project Details
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500 dark:text-gray-400">Description</label>
              <p className="text-gray-800 dark:text-white mt-1">{project.description || 'No description provided'}</p>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Budget</label>
                <p className="text-xl font-bold text-green-600">${project.budget}</p>
              </div>
              {project.deadline && (
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Deadline</label>
                  <p className="text-lg font-semibold text-gray-800 dark:text-white">
                    {new Date(project.deadline).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Created At */}
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Created on: {new Date(project.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;