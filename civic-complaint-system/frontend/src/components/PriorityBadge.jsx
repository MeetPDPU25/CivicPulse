import React from 'react';
import { AlertCircle, AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react';

const priorityConfig = {
  'Urgent': {
    bg: 'bg-rose-50 text-rose-700 border-rose-200',
    icon: AlertCircle,
    label: 'Urgent'
  },
  'High': {
    bg: 'bg-orange-50 text-orange-700 border-orange-200',
    icon: AlertTriangle,
    label: 'High'
  },
  'Medium': {
    bg: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: ArrowUp,
    label: 'Medium'
  },
  'Low': {
    bg: 'bg-slate-100 text-slate-600 border-slate-200',
    icon: ArrowDown,
    label: 'Low'
  }
};

export default function PriorityBadge({ priority, className = '' }) {
  const config = priorityConfig[priority] || priorityConfig['Medium'];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-medium border ${config.bg} ${className}`}>
      <Icon className="w-3 h-3" />
      <span>{config.label}</span>
    </span>
  );
}
