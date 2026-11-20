import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Wrench, 
  UserCheck, 
  Building2, 
  X,
  ExternalLink,
  AlertCircle
} from 'lucide-react';

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [allStaff, setAllStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');

  // Triage Modal state
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [triageData, setTriageData] = useState({
    status: '',
    priority: '',
    department_id: '',
    assigned_staff_id: '',
    comment: ''
  });
  const [triaging, setTriaging] = useState(false);
  const [triageError, setTriageError] = useState('');

  const fetchComplaints = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (categoryFilter) params.append('category', categoryFilter);
    if (statusFilter) params.append('status', statusFilter);
    if (priorityFilter) params.append('priority', priorityFilter);
    if (deptFilter) params.append('department_id', deptFilter);

    api.get(`/admin/complaints?${params.toString()}`)
      .then(res => setComplaints(res.data.complaints || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // Load directory (departments & staff)
    api.get('/admin/directory')
      .then(res => {
        setDepartments(res.data.departments || []);
        setAllStaff(res.data.staff || []);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchComplaints();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, categoryFilter, statusFilter, priorityFilter, deptFilter]);

  const openTriageModal = (complaint) => {
    setSelectedComplaint(complaint);
    setTriageData({
      status: complaint.status,
      priority: complaint.priority,
      department_id: complaint.department_id || '',
      assigned_staff_id: complaint.assigned_staff_id || '',
      comment: ''
    });
    setTriageError('');
  };

  const handleTriageSubmit = async (e) => {
    e.preventDefault();
    setTriaging(true);
    setTriageError('');

    try {
      const res = await api.patch(`/admin/complaints/${selectedComplaint.complaint_id}/triage`, triageData);
      if (res.data.success) {
        setSelectedComplaint(null);
        fetchComplaints();
      }
    } catch (err) {
      setTriageError(err.response?.data?.message || 'Failed to update complaint');
    } finally {
      setTriaging(false);
    }
  };

  // Filter staff by selected department in modal
  const departmentStaff = allStaff.filter(s => {
    if (!triageData.department_id) return true;
    return s.department_id === parseInt(triageData.department_id);
  });

  return (
    <div className="space-y-6 py-6">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Complaints Management & Triage</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review grievances, assign departments and field crews, and adjust priority.
          </p>
        </div>
        <div className="text-xs font-semibold text-slate-600 bg-white px-3 py-2 rounded-xl border border-slate-200">
          Showing <span className="text-blue-600 font-bold">{complaints.length}</span> Records
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          
          {/* Search */}
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search ID, title, citizen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            <option value="Road Damage & Potholes">Road Damage & Potholes</option>
            <option value="Garbage & Waste Dumping">Garbage & Waste Dumping</option>
            <option value="Streetlight & Electrical Issues">Streetlight & Electrical</option>
            <option value="Water Supply & Drainage Issues">Water & Drainage</option>
            <option value="Other">Other</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="UNDER REVIEW">Under Review</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Department Filter */}
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Departments</option>
            {departments.map(d => (
              <option key={d.department_id} value={d.department_id}>
                {d.department_name}
              </option>
            ))}
          </select>

        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs">Loading complaint records...</div>
        ) : complaints.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No complaints match the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Tracking ID</th>
                  <th className="py-3.5 px-4">Title & Details</th>
                  <th className="py-3.5 px-4">Citizen</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Department & Staff</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {complaints.map(c => (
                  <tr key={c.complaint_id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono font-bold text-blue-700">
                      <Link to={`/track/${c.tracking_id}`} className="hover:underline">
                        {c.tracking_id}
                      </Link>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 max-w-xs truncate">{c.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{c.category}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 truncate max-w-xs">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{c.location_address}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-800">{c.citizen_name}</div>
                      <div className="text-[11px] text-slate-400">{c.citizen_phone || c.citizen_email}</div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <PriorityBadge priority={c.priority} />
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-medium text-slate-800">
                        {c.department_name || <span className="text-slate-400 italic">Unassigned</span>}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {c.staff_name ? `Staff: ${c.staff_name}` : 'No staff assigned'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={c.status} />
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => openTriageModal(c)}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 font-bold text-xs transition-colors shadow-sm"
                      >
                        Triage / Assign
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Interactive Triage & Assignment Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded">
                  {selectedComplaint.tracking_id}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">Triage & Departmental Routing</h3>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {triageError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs">
                {triageError}
              </div>
            )}

            {/* Quick Summary of Complaint */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1 mb-5">
              <div className="font-bold text-slate-900 text-sm">{selectedComplaint.title}</div>
              <div className="text-slate-600 line-clamp-2">{selectedComplaint.description}</div>
              <div className="text-slate-500 flex items-center gap-1 pt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedComplaint.location_address}</span>
              </div>
              {selectedComplaint.image_url && (
                <div className="pt-2">
                  <a
                    href={selectedComplaint.image_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline font-semibold inline-flex items-center gap-1"
                  >
                    View Citizen Attached Photo Evidence <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            <form onSubmit={handleTriageSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Priority Selection */}
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Set Priority Level
                  </label>
                  <select
                    value={triageData.priority}
                    onChange={(e) => setTriageData({ ...triageData, priority: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent (Safety Hazard)</option>
                  </select>
                </div>

                {/* Status Selection */}
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Lifecycle Status
                  </label>
                  <select
                    value={triageData.status}
                    onChange={(e) => setTriageData({ ...triageData, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="SUBMITTED">SUBMITTED</option>
                    <option value="UNDER REVIEW">UNDER REVIEW</option>
                    <option value="ASSIGNED">ASSIGNED</option>
                    <option value="IN PROGRESS">IN PROGRESS</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Assign Department */}
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Assign Department
                  </label>
                  <select
                    value={triageData.department_id}
                    onChange={(e) => setTriageData({ ...triageData, department_id: e.target.value, assigned_staff_id: '' })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Select Department --</option>
                    {departments.map(d => (
                      <option key={d.department_id} value={d.department_id}>
                        {d.department_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Assign Staff */}
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Assign Field Staff Officer
                  </label>
                  <select
                    value={triageData.assigned_staff_id}
                    onChange={(e) => setTriageData({ ...triageData, assigned_staff_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Select Field Staff --</option>
                    {departmentStaff.map(s => (
                      <option key={s.user_id} value={s.user_id}>
                        {s.name} ({s.department_name || 'Staff'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Triage / Administrative Comment */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Audit Log Remark (Visible on Public Timeline)
                </label>
                <textarea
                  rows={2}
                  value={triageData.comment}
                  onChange={(e) => setTriageData({ ...triageData, comment: e.target.value })}
                  placeholder="e.g. Verified photo evidence. Dispatched Road crew with asphalt patching roller."
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedComplaint(null)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={triaging}
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold shadow transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <UserCheck className="w-4 h-4" />
                  {triaging ? 'Saving Triage...' : 'Save & Dispatch'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
