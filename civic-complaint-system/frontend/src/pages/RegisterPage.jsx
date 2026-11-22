import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, User, Mail, Phone, Lock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Validate single field or whole form
  const validate = () => {
    const errors = {};

    // 1. Name validation: Only letters and spaces
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    } else if (!nameRegex.test(formData.name)) {
      errors.name = 'Name can only contain letters and spaces';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    // 2. Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    // 3. Phone validation: Numbers only (exactly 10 digits)
    if (!formData.phone.trim()) {
      errors.phone = 'Mobile number is required';
    } else if (!/^\d+$/.test(formData.phone)) {
      errors.phone = 'Mobile number can only contain numbers';
    } else if (formData.phone.length !== 10) {
      errors.phone = 'Please enter a valid 10-digit mobile number';
    }

    // 4. Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    // 5. Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
  };

  const handleNameChange = (e) => {
    // Only allow letters and spaces
    const val = e.target.value;
    // Strip non-letter and non-space characters
    const sanitized = val.replace(/[^a-zA-Z\s]/g, '');
    setFormData((prev) => ({ ...prev, name: sanitized }));

    if (val !== sanitized) {
      setFieldErrors((prev) => ({
        ...prev,
        name: 'Numbers and special symbols are not allowed in names'
      }));
    } else if (sanitized.trim().length >= 2) {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy.name;
        return copy;
      });
    }
  };

  const handlePhoneChange = (e) => {
    // Only allow digits, max 10 digits
    const val = e.target.value;
    const digitsOnly = val.replace(/\D/g, '').slice(0, 10);
    setFormData((prev) => ({ ...prev, phone: digitsOnly }));

    if (val !== digitsOnly && /\D/.test(val)) {
      setFieldErrors((prev) => ({
        ...prev,
        phone: 'Phone number can only contain numbers'
      }));
    } else if (digitsOnly.length === 10) {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy.phone;
        return copy;
      });
    } else if (digitsOnly.length > 0 && digitsOnly.length < 10) {
      setFieldErrors((prev) => ({
        ...prev,
        phone: `${10 - digitsOnly.length} more digit(s) required`
      }));
    } else {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy.phone;
        return copy;
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time clearance of errors on typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setGeneralError('');

    const errors = validate();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      await register(formData.name.trim(), formData.email.trim(), formData.phone.trim(), formData.password);
      navigate('/citizen/dashboard');
    } catch (err) {
      setGeneralError(err.response?.data?.message || 'Registration failed. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 px-4">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-md">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-teal-600/20">
            <User className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Citizen Registration</h2>
          <p className="text-xs text-slate-500 mt-1">Create an official citizen account to report and track civic issues</p>
        </div>

        {/* Global Error Banner */}
        {generalError && (
          <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{generalError}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4" noValidate>
          
          {/* Full Name */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">Full Name</label>
              <span className="text-[10px] text-slate-400">Letters and spaces only</span>
            </div>
            <div className="relative">
              <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleNameChange}
                placeholder="Meet Patel"
                className={`w-full pl-9 pr-8 py-2 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 ${
                  fieldErrors.name
                    ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-rose-200'
                    : 'border-slate-300 focus:border-teal-500 focus:ring-teal-100'
                }`}
              />
              {formData.name.trim().length >= 2 && !fieldErrors.name && (
                <CheckCircle2 className="absolute right-3 top-2.5 w-4 h-4 text-emerald-500" />
              )}
            </div>
            {fieldErrors.name && (
              <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {fieldErrors.name}
              </p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="citizen@example.com"
                className={`w-full pl-9 pr-8 py-2 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 ${
                  fieldErrors.email
                    ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-rose-200'
                    : 'border-slate-300 focus:border-teal-500 focus:ring-teal-100'
                }`}
              />
              {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()) && !fieldErrors.email && (
                <CheckCircle2 className="absolute right-3 top-2.5 w-4 h-4 text-emerald-500" />
              )}
            </div>
            {fieldErrors.email && (
              <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {fieldErrors.email}
              </p>
            )}
          </div>

          {/* Mobile Contact */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">Mobile Number</label>
              <span className="text-[10px] text-slate-400">Numbers only (10 digits)</span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-2 text-xs font-semibold text-slate-500 select-none">
                +91
              </span>
              <input
                type="tel"
                name="phone"
                required
                maxLength={10}
                value={formData.phone}
                onChange={handlePhoneChange}
                placeholder="9876543210"
                className={`w-full pl-12 pr-8 py-2 rounded-lg border text-sm tracking-wider font-mono transition-colors focus:outline-none focus:ring-2 ${
                  fieldErrors.phone
                    ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-rose-200'
                    : 'border-slate-300 focus:border-teal-500 focus:ring-teal-100'
                }`}
              />
              {formData.phone.length === 10 && !fieldErrors.phone && (
                <CheckCircle2 className="absolute right-3 top-2.5 w-4 h-4 text-emerald-500" />
              )}
            </div>
            {fieldErrors.phone && (
              <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {fieldErrors.phone}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className={`w-full pl-9 pr-3 py-2 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 ${
                  fieldErrors.password
                    ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-rose-200'
                    : 'border-slate-300 focus:border-teal-500 focus:ring-teal-100'
                }`}
              />
            </div>
            {fieldErrors.password && (
              <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                className={`w-full pl-9 pr-8 py-2 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 ${
                  fieldErrors.confirmPassword
                    ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-rose-200'
                    : 'border-slate-300 focus:border-teal-500 focus:ring-teal-100'
                }`}
              />
              {formData.confirmPassword && formData.password === formData.confirmPassword && !fieldErrors.confirmPassword && (
                <CheckCircle2 className="absolute right-3 top-2.5 w-4 h-4 text-emerald-500" />
              )}
            </div>
            {fieldErrors.confirmPassword && (
              <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 rounded-lg bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white font-semibold text-sm shadow transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
          Already registered?{' '}
          <Link to="/login" className="text-teal-600 font-semibold hover:underline">
            Sign In here
          </Link>
        </div>

      </div>
    </div>
  );
}
