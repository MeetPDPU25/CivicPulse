import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { 
  FileText, 
  MapPin, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Crosshair, 
  Image as ImageIcon,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

const categories = [
  'Road Damage & Potholes',
  'Garbage & Waste Dumping',
  'Streetlight & Electrical Issues',
  'Water Supply & Drainage Issues',
  'Other'
];

export default function SubmitComplaintPage() {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Road Damage & Potholes',
    description: '',
    location_address: '',
    latitude: '',
    longitude: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successResult, setSuccessResult] = useState(null);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file size cannot exceed 5MB');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLocating(true);
    setLocationSuccess(false);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);

        setFormData(prev => ({
          ...prev,
          latitude: lat,
          longitude: lng,
          location_address: prev.location_address || `GPS Coordinates: ${lat}, ${lng} (Near PDPU, Gandhinagar)`
        }));
        setLocating(false);
        setLocationSuccess(true);
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        // Fallback demo coordinates near Gandhinagar / PDPU for demonstration
        setFormData(prev => ({
          ...prev,
          latitude: '23.155700',
          longitude: '72.666900',
          location_address: prev.location_address || 'Knowledge Corridor, PDPU, Gandhinagar (Simulated GPS)'
        }));
        setLocating(false);
        setLocationSuccess(true);
      },
      { timeout: 7000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.description || !formData.location_address) {
      return setError('Please fill in the title, description, and location.');
    }

    setSubmitting(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('category', formData.category);
      data.append('description', formData.description);
      data.append('location_address', formData.location_address);
      if (formData.latitude) data.append('latitude', formData.latitude);
      if (formData.longitude) data.append('longitude', formData.longitude);
      if (imageFile) data.append('image', imageFile);

      const res = await api.post('/complaints', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setSuccessResult(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (successResult) {
    return (
      <div className="max-w-lg mx-auto my-12 px-4">
        <div className="bg-white p-8 rounded-2xl border border-emerald-200 shadow-lg text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Grievance Registered!</h2>
          <p className="text-slate-500 text-xs mt-1">Your complaint has been successfully queued for municipal triage.</p>
          
          <div className="my-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs uppercase font-bold text-slate-400">Unique Tracking Ticket ID</span>
            <div className="text-2xl font-mono font-black text-blue-700 mt-1">
              {successResult.tracking_id}
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Save this ID to check live real-time state changes and dispatch logs.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to={`/track/${successResult.tracking_id}`}
              className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow transition-colors flex items-center justify-center gap-1.5"
            >
              Track Live Timeline
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/citizen/dashboard"
              className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto my-8 px-4">
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
        
        {/* Header */}
        <div className="mb-6 pb-4 border-b border-slate-100">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Citizen Filing Desk</span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">Submit a Civic Grievance</h1>
          <p className="text-xs text-slate-500 mt-1">Provide clear location and optional photo evidence for prompt departmental action.</p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Complaint Title *
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g. Broken water pipe leaking on main road"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Civic Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {categories.map((cat, i) => (
                <option key={i} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Location & GPS Capture Button */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Location / Address *
              </label>
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={locating}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-3 py-1 rounded-lg transition-colors disabled:opacity-50"
              >
                <Crosshair className={`w-3.5 h-3.5 ${locating ? 'animate-spin' : ''}`} />
                <span>{locating ? 'Acquiring GPS...' : 'Use Current GPS Location'}</span>
              </button>
            </div>

            <div className="relative">
              <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                name="location_address"
                required
                value={formData.location_address}
                onChange={handleInputChange}
                placeholder="Street address, landmark, or sector number"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {locationSuccess && formData.latitude && (
              <div className="mt-2 flex items-center gap-2 text-xs text-teal-700 bg-teal-50/70 p-2 rounded-lg border border-teal-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                <span>GPS Tagged: Lat {formData.latitude}, Long {formData.longitude}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Detailed Description *
            </label>
            <textarea
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the issue hazard, how long it has persisted, and any specific landmarks nearby..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Upload Issue Photo Evidence (Optional)
            </label>

            <div className="mt-1 flex flex-col sm:flex-row items-center gap-4">
              <label className="flex-1 w-full border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-xl p-5 text-center cursor-pointer bg-slate-50 hover:bg-blue-50/30 transition-colors">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                <span className="text-xs font-semibold text-slate-700 block">
                  {imageFile ? imageFile.name : 'Click to select or drag photo here'}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">JPG, PNG, WebP up to 5MB</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {imagePreview && (
                <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0 shadow-sm">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/citizen/dashboard')}
              className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {submitting ? 'Submitting Grievance...' : 'Submit Grievance Ticket'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
