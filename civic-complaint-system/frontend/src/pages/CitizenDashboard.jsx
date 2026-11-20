import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import { 
  PlusCircle, 
  ListOrdered, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  MapPin, 
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function CitizenDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/complaints/my')
      .then(res => {
        setComplaints(res.data.complaints || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const total = complaints.length;
  const inProgress = complaints.filter(c => ['ASSIGNED', 'IN PROGRESS', 'UNDER REVIEW'].includes(c.status)).length;
  const resolved = complaints.filter(c => ['RESOLVED', 'CLOSED'].includes(c.status)).length;
  const awaitingVerification = complaints.filter(c => c.status === 'RESOLVED').length;

  return (
    <div className="space-y-8 py-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-blue-300">Citizen Grievance Portal</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">Welcome back, {user?.name}!</h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">Track the resolution of your civic reports and keep your neighborhood clean & safe.</p>
        </div>
        <Link
          to="/citizen/submit"
          className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 whitespace-nowrap"
        >
          <PlusCircle className="w-4 h-4" />
          File New Complaint
        </Link>
      </div>

      {/* Verification Notice Alert if any complaint is RESOLVED */}
      {awaitingVerification > 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-amber-900">
                Action Required: {awaitingVerification} Complaint{awaitingVerification > 1 ? 's' : ''} Ready for Verification!
              </h4>
              <p className="text-xs text-amber-700">
                Municipal crews have finished repairs. Please inspect the uploaded proof photo and rate the service to close the ticket.
              </p>
            </div>
          </div>
          <Link
            to="/citizen/complaints?filter=RESOLVED"
            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold whitespace-nowrap shadow-sm"
          >
            Review Now
          </Link>
        </div>
      )}

      {/* KPI Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Total Reported</span>
            <ListOrdered className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{total}</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>In Processing</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-600 mt-2">{inProgress}</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Resolved / Closed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">{resolved}</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Awaiting Sign-off</span>
            <AlertCircle className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-600 mt-2">{awaitingVerification}</div>
        </div>
      </div>

      {/* Recent Complaints Feed */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Your Submitted Complaints</h3>
            <p className="text-xs text-slate-500">Live timeline and field repair updates</p>
          </div>
          <Link
            to="/citizen/complaints"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            View All ({complaints.length})
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 text-sm">Loading your grievances...</div>
        ) : complaints.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-slate-700">No grievances logged yet</h4>
            <p className="text-xs text-slate-500 mt-1 mb-4">Notice a pothole, waste spill, or broken streetlight? Report it right now.</p>
            <Link
              to="/citizen/submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold shadow"
            >
              <PlusCircle className="w-4 h-4" />
              File Your First Complaint
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {complaints.slice(0, 5).map((c) => (
              <div 
                key={c.complaint_id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-slate-50/50 transition-all gap-4"
              >
                <div className="flex items-start gap-4">
                  {c.image_url ? (
                    <img
                      src={c.image_url}
                      alt={c.title}
                      className="w-14 h-14 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 flex-shrink-0 text-xs font-bold">
                      CIVIC
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {c.tracking_id}
                      </span>
                      <PriorityBadge priority={c.priority} />
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(c.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 mt-1">{c.title}</h4>
                    
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                      <span className="text-slate-700 font-medium">{c.category}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-500 truncate max-w-xs">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        {c.location_address}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                  <StatusBadge status={c.status} />
                  <Link
                    to={`/track/${c.tracking_id}`}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 text-xs font-semibold transition-colors whitespace-nowrap"
                  >
                    View Timeline
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
