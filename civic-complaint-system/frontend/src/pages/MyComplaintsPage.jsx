import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  PlusCircle, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export default function MyComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const activeStatusFilter = searchParams.get('filter') || 'ALL';

  useEffect(() => {
    api.get('/complaints/my')
      .then(res => setComplaints(res.data.complaints || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleFilterChange = (status) => {
    if (status === 'ALL') {
      searchParams.delete('filter');
    } else {
      searchParams.set('filter', status);
    }
    setSearchParams(searchParams);
  };

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = 
      c.tracking_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location_address.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeStatusFilter === 'ALL') return matchesSearch;
    if (activeStatusFilter === 'PENDING') return matchesSearch && ['SUBMITTED', 'UNDER REVIEW'].includes(c.status);
    if (activeStatusFilter === 'ACTIVE') return matchesSearch && ['ASSIGNED', 'IN PROGRESS'].includes(c.status);
    return matchesSearch && c.status === activeStatusFilter;
  });

  return (
    <div className="space-y-6 py-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">My Filed Grievances</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage and track all complaints filed from your citizen account.</p>
        </div>
        <Link
          to="/citizen/submit"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-sm transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          File New Complaint
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID, title, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {[
            { id: 'ALL', label: 'All' },
            { id: 'PENDING', label: 'Pending' },
            { id: 'ACTIVE', label: 'In Progress' },
            { id: 'RESOLVED', label: 'Resolved (Review)' },
            { id: 'CLOSED', label: 'Closed' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => handleFilterChange(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeStatusFilter === f.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

      </div>

      {/* Complaints List */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-sm">Loading complaints...</div>
      ) : filteredComplaints.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-slate-700">No complaints matched your search filter</h4>
          <p className="text-xs text-slate-400 mt-1">Try clearing the search query or status filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredComplaints.map(c => (
            <div 
              key={c.complaint_id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    {c.tracking_id}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <PriorityBadge priority={c.priority} />
                    <StatusBadge status={c.status} />
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 text-base mb-1.5 leading-snug">{c.title}</h3>
                
                <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                  {c.description}
                </p>

                <div className="space-y-1.5 text-xs text-slate-500 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700">{c.category}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{c.location_address}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Filed: {new Date(c.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                {c.status === 'RESOLVED' ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 animate-pulse">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Sign-off Pending
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400">
                    {c.department_name ? `Dept: ${c.department_name}` : 'Awaiting Assignment'}
                  </span>
                )}

                <Link
                  to={`/track/${c.tracking_id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
                >
                  <span>Track Timeline</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
