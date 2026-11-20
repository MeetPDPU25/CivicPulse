import React from 'react';
import { Shield, MapPin, Award, CheckCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 pb-8 border-b border-slate-800">
          
          {/* Col 1: System Info */}
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-sm mb-2">
              <Shield className="w-5 h-5 text-blue-400" />
              <span>Public Complaint & Civic Issue Tracking System</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              A transparent 3-tier municipal governance portal bridging citizens, administrative triage officers, and ground field crews for rapid civic grievance resolution.
            </p>
          </div>

          {/* Col 2: Academic Info */}
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-sm mb-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Minor Project Evaluation (2026)</span>
            </div>
            <p className="text-slate-300 font-medium">Department of Computer Science and Engineering</p>
            <p className="text-slate-400">School of Technology, Pandit Deendayal Energy University (PDEU)</p>
            <p className="mt-1 text-slate-400">
              Developed by: <span className="text-slate-200 font-semibold">Meet Patel & Aditya Jadeja</span>
            </p>
          </div>

          {/* Col 3: Key Features */}
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-sm mb-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span>Demonstrated Capabilities</span>
            </div>
            <ul className="space-y-1 text-slate-400 text-xs">
              <li>• HTML5 GPS Geo-tagging & Photo Proofs</li>
              <li>• 6-Stage Accountability State Transitions</li>
              <li>• Field Crew Proof-of-Work Verification</li>
              <li>• Citizen 5-Star Rating & Quality Sign-Off</li>
            </ul>
          </div>

        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-slate-500 gap-4">
          <p>© 2026 CivicPulse Municipal Corporation. Built for Academic Demonstration.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              API & DB Operational (Port 5000 / MySQL)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
