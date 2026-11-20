import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import Timeline from '../components/Timeline';
import { 
  MapPin, 
  Calendar, 
  User, 
  Building2, 
  HardHat, 
  CheckCircle2, 
  Star, 
  AlertCircle, 
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  Phone
} from 'lucide-react';

export default function ComplaintDetailPage() {
  const { trackingId } = useParams();
  const { user } = useAuth();

  const [complaint, setComplaint] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Citizen verification form state
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState('');

  const fetchDetails = () => {
    api.get(`/complaints/${trackingId}`)
      .then(res => {
        if (res.data.success) {
          setComplaint(res.data.complaint);
          setHistory(res.data.history || []);
        }
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Complaint not found with this tracking ID');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDetails();
  }, [trackingId]);

  const handleVerifyClose = async (e) => {
    e.preventDefault();
    setVerifying(true);
    try {
      const res = await api.post(`/complaints/${trackingId}/verify`, {
        rating,
        feedback
      });

      if (res.data.success) {
        setVerificationSuccess('Complaint verified and closed successfully!');
        fetchDetails(); // Reload complaint data
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error verifying complaint');
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500">Retrieving grievance record & audit trail...</p>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl border border-slate-200 shadow text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-900">Ticket Not Found</h3>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          No civic complaint exists with tracking ID <span className="font-mono font-bold text-slate-800">{trackingId}</span>.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Portal Home
        </Link>
      </div>
    );
  }

  const isOwner = user && (user.user_id === complaint.user_id || user.role === 'admin');
  const canVerify = isOwner && complaint.status === 'RESOLVED';

  return (
    <div className="space-y-8 py-6">
      
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to={user?.role === 'admin' ? '/admin/complaints' : user?.role === 'staff' ? '/staff/dashboard' : '/citizen/complaints'}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <span className="text-xs font-mono bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200 font-bold">
          {complaint.tracking_id}
        </span>
      </div>

      {/* Main Ticket Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded">
                {complaint.category}
              </span>
              <PriorityBadge priority={complaint.priority} />
              <StatusBadge status={complaint.status} />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {complaint.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-3">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Submitted: {new Date(complaint.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Citizen: {complaint.citizen_name}
              </span>
            </div>
          </div>

          {/* Quick Department Box */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 lg:w-72 flex-shrink-0 text-xs space-y-2">
            <div className="font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide text-[11px]">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Department In-Charge</span>
            </div>
            <div className="text-sm font-semibold text-slate-900">
              {complaint.department_name || 'Triage Pending'}
            </div>
            {complaint.staff_name && (
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1">
                  <HardHat className="w-3.5 h-3.5 text-amber-600" />
                  Staff: {complaint.staff_name}
                </span>
                {complaint.staff_phone && (
                  <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {complaint.staff_phone}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Description & Location */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
          <div className="lg:col-span-2 space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Issue Description</h4>
              <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                {complaint.description}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Location Details</h4>
              <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700">
                <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-semibold text-slate-900">{complaint.location_address}</div>
                  {complaint.latitude && (
                    <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                      <span>GPS: {complaint.latitude}, {complaint.longitude}</span>
                      <a
                        href={`https://www.google.com/maps?q=${complaint.latitude},${complaint.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline inline-flex items-center gap-1"
                      >
                        Open on Maps <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Citizen Photo */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Citizen Evidence Photo</h4>
            {complaint.image_url ? (
              <a href={complaint.image_url} target="_blank" rel="noreferrer" className="block group">
                <img
                  src={complaint.image_url}
                  alt="Complaint Evidence"
                  className="w-full h-48 rounded-xl object-cover border border-slate-200 group-hover:opacity-90 transition-opacity"
                />
                <span className="text-[10px] text-blue-600 block text-right mt-1 font-semibold">Click to enlarge</span>
              </a>
            ) : (
              <div className="h-48 rounded-xl bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center text-xs text-slate-400 text-center p-4">
                No initial photo attached by citizen
              </div>
            )}
          </div>
        </div>

      </div>

      {/* RESOLUTION PROOF & CITIZEN VERIFICATION SECTION (Slide 4, 5, 8) */}
      {(complaint.status === 'RESOLVED' || complaint.status === 'CLOSED' || complaint.resolution_notes) && (
        <div className={`p-6 sm:p-8 rounded-2xl border shadow-sm ${
          complaint.status === 'CLOSED' ? 'bg-emerald-50/50 border-emerald-200' : 'bg-amber-50/40 border-amber-200'
        }`}>
          
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className={`w-6 h-6 ${complaint.status === 'CLOSED' ? 'text-emerald-600' : 'text-amber-600'}`} />
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Field Staff Resolution Proof & Verification
              </h3>
              <p className="text-xs text-slate-500">
                Ground repair completion notes and quality sign-off
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-5 rounded-xl border border-slate-200">
            {/* Proof photo */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Proof-of-Work Photo
              </span>
              {complaint.resolution_image_url ? (
                <a href={complaint.resolution_image_url} target="_blank" rel="noreferrer">
                  <img
                    src={complaint.resolution_image_url}
                    alt="Proof of Repair"
                    className="w-full h-40 object-cover rounded-lg border border-slate-200"
                  />
                </a>
              ) : (
                <div className="h-40 rounded-lg bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                  No completion photo recorded
                </div>
              )}
            </div>

            {/* Resolution Notes */}
            <div className="md:col-span-2 space-y-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Field Staff Repair Notes
                </span>
                <p className="text-xs text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed">
                  {complaint.resolution_notes || 'Issue resolved on site.'}
                </p>
              </div>

              {/* If already CLOSED: show citizen rating & review */}
              {complaint.status === 'CLOSED' && (
                <div className="pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                    Citizen Verification Rating & Feedback
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 mb-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${s <= (complaint.citizen_rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                      />
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-1.5">
                      {complaint.citizen_rating || 5} / 5 Stars
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 italic">
                    "{complaint.citizen_feedback || 'Verified and approved'}"
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Verification Form for Citizen if RESOLVED */}
          {canVerify && (
            <div className="mt-6 pt-6 border-t border-amber-200/60">
              <div className="max-w-xl">
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  Verify Repair Quality & Close Grievance Ticket
                </h4>
                <p className="text-xs text-slate-600 mb-4">
                  Please rate your satisfaction with the repair work done by municipal field staff.
                </p>

                <form onSubmit={handleVerifyClose} className="space-y-4">
                  {/* Star selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Rating</label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setRating(s)}
                          onMouseEnter={() => setHoverRating(s)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 focus:outline-none"
                        >
                          <Star
                            className={`w-6 h-6 transition-colors ${
                              s <= (hoverRating || rating)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-semibold text-slate-600 ml-2">
                        {rating === 5 ? 'Excellent' : rating === 4 ? 'Good' : rating === 3 ? 'Average' : 'Needs improvement'}
                      </span>
                    </div>
                  </div>

                  {/* Feedback text */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Feedback Comments</label>
                    <textarea
                      rows={2}
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="e.g. Clean repair job, pothole smoothly leveled. Thank you!"
                      className="w-full p-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={verifying}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {verifying ? 'Submitting Sign-off...' : 'Verify Repair & Close Ticket'}
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Visual Timeline & Event Audit Feed */}
      <Timeline currentStatus={complaint.status} history={history} />

    </div>
  );
}
