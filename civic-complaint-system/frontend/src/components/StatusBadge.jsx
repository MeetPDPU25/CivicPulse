import React from 'react';
import { 
  FileText, 
  Search, 
  UserCheck, 
  Wrench, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';

const statusConfig = {
  'SUBMITTED': {
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: FileText,
    label: 'Submitted'
  },
  'UNDER REVIEW': {
    bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    icon: Search,
    label: 'Under Review'
  },
  'ASSIGNED': {
    bg: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: UserCheck,
    label: 'Assigned'
  },
  'IN PROGRESS': {
    bg: 'bg-cyan-50 text-cyan-800 border-cyan-200',
    icon: Wrench,
    label: 'In Progress'
  },
  'RESOLVED': {
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: CheckCircle2,
    label: 'Resolved'
  },
  'CLOSED': {
    bg: 'bg-slate-100 text-slate-700 border-slate-300',
    icon: ShieldCheck,
    label: 'Closed'
  }
};

export default function StatusBadge({ status, className = '' }) {
  const config = statusConfig[status] || {
    bg: 'bg-gray-100 text-gray-700 border-gray-200',
    icon: FileText,
    label: status
  };
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg} ${className}`}>
      <Icon className="w-3.5 h-3.5" />
      <span>{config.label}</span>
    </span>
  );
}
