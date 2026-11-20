import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { 
  FileText, 
  Clock, 
  Wrench, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  Users, 
  AlertTriangle 
} from 'lucide-react';

const COLORS = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/analytics'),
      api.get('/admin/complaints')
    ])
      .then(([analyticsRes, complaintsRes]) => {
        setData(analyticsRes.data);
        setRecentComplaints((complaintsRes.data.complaints || []).slice(0, 6));
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500">Loading municipal analytics & grievance metrics...</p>
      </div>
    );
  }

  const { stats, charts } = data;

  return (
    <div className="space-y-8 py-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Municipal Command Center
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">Admin Analytics & Oversight</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time grievance ingestion metrics, departmental workload, and resolution performance.
          </p>
        </div>
        <Link
          to="/admin/complaints"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-colors whitespace-nowrap"
        >
          <FileText className="w-4 h-4" />
          Manage & Triage Complaints
        </Link>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Total Complaints</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 mt-3">{stats.total}</div>
          <p className="text-[11px] text-slate-400 mt-1">Across all 5 civic departments</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-amber-600 text-xs font-bold uppercase tracking-wider">
            <span>Pending Review</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-amber-600 mt-3">{stats.pending}</div>
          <p className="text-[11px] text-slate-400 mt-1">Requires triage & routing</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-blue-600 text-xs font-bold uppercase tracking-wider">
            <span>In Progress</span>
            <Wrench className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-black text-blue-600 mt-3">{stats.in_progress}</div>
          <p className="text-[11px] text-slate-400 mt-1">Ground crews active</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-emerald-600 text-xs font-bold uppercase tracking-wider">
            <span>Resolved / Closed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-emerald-600 mt-3">{stats.resolved}</div>
          <p className="text-[11px] text-slate-400 mt-1">Proof uploaded & signed off</p>
        </div>

      </div>

      {/* Recharts Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Complaints by Category (Bar Chart) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Complaints by Category</h3>
          <p className="text-xs text-slate-500 mb-6">Distribution across municipal issue classifications</p>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.byCategory} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
                <XAxis 
                  dataKey="category" 
                  angle={-20} 
                  textAnchor="end" 
                  interval={0} 
                  tick={{ fontSize: 10, fill: '#64748b' }} 
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Complaints by Status (Pie / Donut Chart) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Lifecycle State Breakdown</h3>
          <p className="text-xs text-slate-500 mb-6">Current grievance progress in the 6-stage lifecycle</p>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.byStatus}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {charts.byStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Recent Grievances Requiring Action Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Complaints Queue</h3>
            <p className="text-xs text-slate-500">Latest tickets submitted for administrative triage</p>
          </div>
          <Link
            to="/admin/complaints"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Open All ({stats.total})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold tracking-wider border-y border-slate-200">
              <tr>
                <th className="py-3 px-3">Ticket ID</th>
                <th className="py-3 px-3">Title & Category</th>
                <th className="py-3 px-3">Citizen</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Department</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentComplaints.map(c => (
                <tr key={c.complaint_id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-blue-700 whitespace-nowrap">
                    {c.tracking_id}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900 truncate max-w-xs">{c.title}</div>
                    <div className="text-[11px] text-slate-500">{c.category}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                    {c.citizen_name}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <PriorityBadge priority={c.priority} />
                  </td>
                  <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                    {c.department_name || <span className="text-slate-400 italic">Unassigned</span>}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <Link
                      to={`/track/${c.tracking_id}`}
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      View / Triage →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
