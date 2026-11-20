import React from 'react';
import { 
  FileText, 
  Search, 
  UserCheck, 
  Wrench, 
  CheckCircle2, 
  ShieldCheck, 
  Clock 
} from 'lucide-react';

const stages = [
  { key: 'SUBMITTED', label: 'Submitted', desc: 'Citizen filed grievance' },
  { key: 'UNDER REVIEW', label: 'Under Review', desc: 'Admin verifying validity' },
  { key: 'ASSIGNED', label: 'Assigned', desc: 'Routed to Department & Staff' },
  { key: 'IN PROGRESS', label: 'In Progress', desc: 'Field crew active on site' },
  { key: 'RESOLVED', label: 'Resolved', desc: 'Repair done & proof uploaded' },
  { key: 'CLOSED', label: 'Closed', desc: 'Citizen verified & feedback logged' }
];

const stageOrder = ['SUBMITTED', 'UNDER REVIEW', 'ASSIGNED', 'IN PROGRESS', 'RESOLVED', 'CLOSED'];

export default function Timeline({ currentStatus, history = [] }) {
  const currentIndex = stageOrder.indexOf(currentStatus);

  return (
    <div className="space-y-8">
      {/* 1. Visual Stepper Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
          Lifecycle Progression
        </h4>
        
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-5 left-6 right-6 h-1 bg-slate-200 -z-0">
            <div 
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{
                width: currentIndex >= 0 ? `${(currentIndex / (stageOrder.length - 1)) * 100}%` : '0%'
              }}
            />
          </div>

          {stages.map((stage, idx) => {
            const isCompleted = idx <= currentIndex;
            const isCurrent = idx === currentIndex;

            return (
              <div key={stage.key} className="relative z-10 flex md:flex-col items-center gap-3 md:gap-2 text-left md:text-center flex-1">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-colors shadow-sm ${
                    isCurrent
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                      : isCompleted
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-slate-400 border border-slate-300'
                  }`}
                >
                  {isCompleted ? '✓' : idx + 1}
                </div>
                <div>
                  <div className={`text-xs font-semibold ${isCurrent ? 'text-blue-700' : isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                    {stage.label}
                  </div>
                  <div className="text-[11px] text-slate-500 hidden lg:block">
                    {stage.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Detailed History Feed */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-5 h-5 text-slate-500" />
          <h4 className="font-semibold text-slate-900">Activity & Audit Log</h4>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium ml-auto">
            {history.length} Event{history.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="relative border-l-2 border-slate-200 ml-3 space-y-6">
          {history.length === 0 ? (
            <p className="text-sm text-slate-500 pl-6">No historical records available.</p>
          ) : (
            history.map((item, idx) => (
              <div key={item.history_id || idx} className="relative pl-6">
                {/* Dot */}
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-4 border-blue-600" />
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 px-2 py-0.5 rounded bg-slate-100">
                      {item.status}
                    </span>
                    {item.updater_name && (
                      <span className="text-xs text-slate-500">
                        by <span className="font-medium text-slate-800">{item.updater_name}</span>
                        {item.updater_role && (
                          <span className="ml-1 text-[10px] uppercase tracking-wide text-blue-600 font-semibold">
                            ({item.updater_role})
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400">
                    {new Date(item.created_at).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </span>
                </div>

                {item.comment && (
                  <p className="mt-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    {item.comment}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
