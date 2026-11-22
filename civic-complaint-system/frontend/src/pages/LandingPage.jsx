import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
  Shield, 
  Search, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  Trash2, 
  Lightbulb, 
  Droplet, 
  ArrowRight,
  TrendingUp,
  Clock,
  Building2,
  Users
} from 'lucide-react';

export default function LandingPage() {
  const [stats, setStats] = useState({ total: 8, pending: 2, in_progress: 3, resolved: 3 });
  const [trackingInput, setTrackingInput] = useState('');
  const [searchError, setSearchError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/analytics')
      .then(res => {
        if (res.data?.stats) {
          setStats(res.data.stats);
        }
      })
      .catch(err => console.log('Analytics fetch info:', err.message));
  }, []);

  const handleTrackSearch = (e) => {
    e.preventDefault();
    if (!trackingInput.trim()) return;
    const cleanId = trackingInput.trim().toUpperCase();
    navigate(`/track/${cleanId}`);
  };

  const categories = [
    {
      title: 'Road Damage & Potholes',
      desc: 'Craters, asphalt cracks, damaged manhole covers, and road subsidence hazards.',
      icon: AlertTriangle,
      color: 'bg-amber-500/10 text-amber-600 border-amber-200'
    },
    {
      title: 'Garbage & Waste Dumping',
      desc: 'Overflowing dumpsters, uncollected organic refuse, and illicit debris dumping.',
      icon: Trash2,
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200'
    },
    {
      title: 'Streetlight & Electrical',
      desc: 'Non-functional street lamps, flickering illumination, and exposed wiring cables.',
      icon: Lightbulb,
      color: 'bg-blue-500/10 text-blue-600 border-blue-200'
    },
    {
      title: 'Water Supply & Drainage',
      desc: 'Pipeline bursts, contaminated tap water, sewage blockages, and flooded storm drains.',
      icon: Droplet,
      color: 'bg-cyan-500/10 text-cyan-600 border-cyan-200'
    }
  ];

  const workflowSteps = [
    { step: '01', title: 'GPS Detection & Filing', desc: 'Citizen submits photo proof, description, and 1-click GPS coordinates.' },
    { step: '02', title: 'Automated Ingestion', desc: 'System generates unique Ticket ID (e.g. CIV-2026-0001) & logs timestamp.' },
    { step: '03', title: 'Administrative Triage', desc: 'Admin reviews validity, flags priority, and routes to the relevant department.' },
    { step: '04', title: 'On-Site Field Repair', desc: 'Ground crew fixes the issue and uploads a proof-of-work completion photo.' },
    { step: '05', title: 'Citizen Verification', desc: 'Citizen inspects repair proof, leaves a 1–5 star rating, and closes the ticket.' }
  ];

  return (
    <div className="space-y-16 py-8">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-8 md:p-14 shadow-xl border border-slate-800">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-6">
            <Building2 className="w-3.5 h-3.5" />
            <span>Municipal Grievance Redressal Portal</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Digitalizing Civic Reporting for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">Transparent Governance</span>
          </h1>

          <p className="mt-4 text-base md:text-lg text-slate-300 leading-relaxed">
            Report potholes, sanitation lapses, broken streetlights, and drainage outages directly to municipal authorities. Track real-time repair progress with GPS accountability.
          </p>

          {/* Quick Tracking Search Bar */}
          <form onSubmit={handleTrackSearch} className="mt-8 flex flex-col sm:flex-row gap-2 max-w-lg">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Enter Complaint Tracking ID (e.g. CIV-2026-0001)"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm backdrop-blur-sm"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              Track Ticket
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Action CTAs */}
          <div className="mt-8 flex flex-wrap gap-4 pt-6 border-t border-slate-800 text-sm">
            <Link
              to="/citizen/submit"
              className="px-5 py-2.5 rounded-lg bg-white text-slate-900 font-bold hover:bg-slate-100 transition-colors shadow"
            >
              File a Grievance Now
            </Link>
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-white font-semibold border border-slate-700 transition-colors"
            >
              Municipal Authority Sign In →
            </Link>
          </div>
        </div>
      </section>

      {/* Real-time Municipal Metrics Counter */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Grievances</span>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900">{stats.total}</div>
          <p className="text-xs text-slate-500 mt-1">Logged in municipal system</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Pending Review</span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <div className="mt-3 text-3xl font-extrabold text-amber-600">{stats.pending}</div>
          <p className="text-xs text-slate-500 mt-1">Under triage inspection</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Active In Progress</span>
            <MapPin className="w-5 h-5 text-blue-500" />
          </div>
          <div className="mt-3 text-3xl font-extrabold text-blue-600">{stats.in_progress}</div>
          <p className="text-xs text-slate-500 mt-1">Field teams active on site</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Resolved & Closed</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="mt-3 text-3xl font-extrabold text-emerald-600">{stats.resolved}</div>
          <p className="text-xs text-slate-500 mt-1">Verified with proof photo</p>
        </div>
      </section>

      {/* Core Civic Categories Grid (Slide 2) */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Core Civic Grievance Categories</h2>
          <p className="text-slate-500 text-sm mt-1">Direct jurisdictional routing to the appropriate municipal department</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((c, i) => {
            const Icon = c.icon;
            return (
              <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 border ${c.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">{c.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed">{c.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5-Stage Lifecycle Section (Slide 4) */}
      <section className="bg-slate-100/70 p-8 md:p-12 rounded-2xl border border-slate-200">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">End-to-End Resolution Accountability</span>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">How The Civic Tracking System Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {workflowSteps.map((s, idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative">
              <span className="text-2xl font-black text-slate-200 absolute top-3 right-4">{s.step}</span>
              <div className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Step {s.step}</div>
              <h4 className="font-bold text-slate-900 text-sm mb-2">{s.title}</h4>
              <p className="text-slate-600 text-xs leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
