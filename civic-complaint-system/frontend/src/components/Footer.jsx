import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, PhoneCall, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 pb-8 border-b border-slate-800">
          
          {/* Col 1: Brand & Purpose */}
          <div>
            <div className="flex items-center gap-2.5 text-white font-bold text-base mb-3">
              <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <span>CivicPulse</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Integrated municipal grievance redressal portal. Empowering citizens to report, track, and verify public infrastructure and civic maintenance in real time.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Quick Links</h4>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li>
                <Link to="/submit" className="hover:text-teal-400 transition-colors">
                  Report a Civic Grievance
                </Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-teal-400 transition-colors">
                  Track Complaint Status
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-teal-400 transition-colors">
                  Department Officer Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-teal-400 transition-colors">
                  Citizen Portal Registration
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Municipal Helpdesk */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Municipal Grievance Helpline</h4>
            <div className="space-y-2 text-slate-400 text-xs">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-teal-400 shrink-0" />
                <span>1800-233-0200 (Toll-Free 24x7)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>grievance@civicpulse.gov.in</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>Municipal Corporation Headquarters, Gandhinagar, Gujarat</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-slate-500 gap-3 text-xs">
          <p>© 2026 CivicPulse — Municipal Corporation Public Grievance Portal. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Citizen Charter</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
