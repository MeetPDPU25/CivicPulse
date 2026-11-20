import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import { 
  HardHat, 
  MapPin, 
  Phone, 
  Calendar, 
  CheckCircle2, 
  Wrench, 
  Upload, 
  X, 
  ExternalLink,
  AlertCircle,
  Clock
} from 'lucide-react';

export default function StaffDashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Resolution modal state
  const [resolvingTask, setResolvingTask] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [proofImage, setProofImage] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);
  const [submittingResolution, setSubmittingResolution] = useState(false);
  const [resolutionError, setResolutionError] = useState('');

  const fetchTasks = () => {
    setLoading(true);
    api.get('/staff/tasks')
      .then(res => setTasks(res.data.tasks || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleStartProgress = async (taskId) => {
    try {
      await api.patch(`/staff/tasks/${taskId}/progress`, {
        status: 'IN PROGRESS',
        comment: 'Field crew arrived on site. Repair operations initiated.'
      });
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProofImage(file);
      setProofPreview(URL.createObjectURL(file));
      setResolutionError('');
    }
  };

  const handleSubmitResolution = async (e) => {
    e.preventDefault();
    if (!resolutionNotes.trim()) {
      return setResolutionError('Please enter a brief description of the repair work done.');
    }

    setSubmittingResolution(true);
    setResolutionError('');

    try {
      const formData = new FormData();
      formData.append('resolution_notes', resolutionNotes);
      if (proofImage) {
        formData.append('resolution_image', proofImage);
      }

      const res = await api.post(`/staff/tasks/${resolvingTask.complaint_id}/resolve`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setResolvingTask(null);
        setResolutionNotes('');
        setProofImage(null);
        setProofPreview(null);
        fetchTasks();
      }
    } catch (err) {
      setResolutionError(err.response?.data?.message || 'Failed to submit resolution');
    } finally {
      setSubmittingResolution(false);
    }
  };

  const total = tasks.length;
  const pending = tasks.filter(t => ['ASSIGNED', 'IN PROGRESS'].includes(t.status)).length;
  const completed = tasks.filter(t => ['RESOLVED', 'CLOSED'].includes(t.status)).length;

  return (
    <div className="space-y-8 py-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <HardHat className="w-4 h-4" />
            Field Operations Desk
          </span>
          <h1 className="text-2xl font-extrabold mt-1">Officer {user?.name}</h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Department: <span className="font-semibold text-white">{user?.department_name || 'Municipal Field Operations'}</span>
          </p>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Assigned Tasks</span>
            <HardHat className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">{total}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-amber-600 text-xs font-bold uppercase tracking-wider">
            <span>Active / In Progress</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-amber-600 mt-2">{pending}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-emerald-600 text-xs font-bold uppercase tracking-wider">
            <span>Completed Repairs</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-emerald-600 mt-2">{completed}</div>
        </div>
      </div>

      {/* Task Queue List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Assigned Field Tasks Queue</h3>
            <p className="text-xs text-slate-500">Grievances assigned to you by municipal triage officers</p>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs">Loading assigned tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            No active complaints assigned to your account right now.
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map(task => (
              <div 
                key={task.complaint_id}
                className="p-5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-slate-50/50 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      {task.tracking_id}
                    </span>
                    <PriorityBadge priority={task.priority} />
                    <StatusBadge status={task.status} />
                  </div>

                  <h4 className="text-base font-bold text-slate-900">{task.title}</h4>
                  
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {task.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2">
                    <span className="flex items-center gap-1 text-slate-700 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                      {task.location_address}
                    </span>
                    {task.latitude && (
                      <a
                        href={`https://www.google.com/maps?q=${task.latitude},${task.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        Navigate on Maps <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    <span className="flex items-center gap-1 text-slate-600">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      Citizen: {task.citizen_name} ({task.citizen_phone || 'No phone'})
                    </span>
                  </div>
                </div>

                {/* Action Buttons for Field Staff */}
                <div className="flex items-center gap-2 flex-shrink-0 pt-3 lg:pt-0 border-t lg:border-0 border-slate-100">
                  {task.status === 'ASSIGNED' && (
                    <button
                      onClick={() => handleStartProgress(task.complaint_id)}
                      className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      Start Work (In Progress)
                    </button>
                  )}

                  {task.status === 'IN PROGRESS' && (
                    <button
                      onClick={() => {
                        setResolvingTask(task);
                        setResolutionNotes('');
                        setProofImage(null);
                        setProofPreview(null);
                        setResolutionError('');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Upload Proof & Resolve
                    </button>
                  )}

                  {['RESOLVED', 'CLOSED'].includes(task.status) && (
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Repair Completed
                    </span>
                  )}

                  <Link
                    to={`/track/${task.tracking_id}`}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                  >
                    Details
                  </Link>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* RESOLUTION & PROOF-OF-WORK MODAL (Slides 4, 5, 8) */}
      {resolvingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {resolvingTask.tracking_id}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">Submit Proof-of-Work & Mark Resolved</h3>
              </div>
              <button
                onClick={() => setResolvingTask(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {resolutionError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs">
                {resolutionError}
              </div>
            )}

            <form onSubmit={handleSubmitResolution} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Proof-of-Work Completion Photo *
                </label>
                <label className="border-2 border-dashed border-slate-300 hover:border-emerald-400 rounded-xl p-5 block text-center cursor-pointer bg-slate-50 hover:bg-emerald-50/20 transition-colors">
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                  <span className="font-semibold text-slate-700 block">
                    {proofImage ? proofImage.name : 'Select or capture photo of fixed issue'}
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">Required for citizen sign-off</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {proofPreview && (
                  <div className="mt-3 relative w-32 h-24 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                    <img src={proofPreview} alt="Proof Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Resolution Notes & Materials Used *
                </label>
                <textarea
                  required
                  rows={3}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="e.g. Pothole leveled with asphalt cold mix and compacted. Street cleared of all repair debris."
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white text-xs"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setResolvingTask(null)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingResolution}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {submittingResolution ? 'Submitting Resolution...' : 'Mark as Resolved'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
