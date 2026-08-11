import React, { useState } from 'react';
import { 
  UserPlus, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  ChevronLeft, 
  CheckSquare, 
  Square, 
  ShieldCheck, 
  Laptop, 
  Mail, 
  FileText,
  UserCheck
} from 'lucide-react';
import { Candidate, PipelineStage } from '../../types';

interface OnboardingViewProps {
  candidates: Candidate[];
  onUpdateCandidate: (candidate: Candidate) => void;
}

const STAGES: PipelineStage[] = ['Sourced', 'Interviewing', 'Offer Extended', 'Onboarding', 'Completed'];

export const OnboardingView: React.FC<OnboardingViewProps> = ({
  candidates,
  onUpdateCandidate,
}) => {
  const [activeCandidate, setActiveCandidate] = useState<Candidate | null>(null);

  const handleToggleTask = (candidate: Candidate, taskId: string) => {
    const updatedChecklist = candidate.checklist.map((item) => 
      item.id === taskId ? { ...item, completed: !item.completed } : item
    );
    const tasksCompleted = updatedChecklist.filter((item) => item.completed).length;

    const updatedCandidate: Candidate = {
      ...candidate,
      checklist: updatedChecklist,
      tasksCompleted,
      stage: tasksCompleted === candidate.totalTasks ? 'Completed' : candidate.stage
    };

    onUpdateCandidate(updatedCandidate);
    if (activeCandidate?.id === candidate.id) {
      setActiveCandidate(updatedCandidate);
    }
  };

  const handleMoveStage = (candidate: Candidate, direction: 'prev' | 'next') => {
    const currentIndex = STAGES.indexOf(candidate.stage);
    let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex < 0) nextIndex = 0;
    if (nextIndex >= STAGES.length) nextIndex = STAGES.length - 1;

    const updatedCandidate: Candidate = {
      ...candidate,
      stage: STAGES[nextIndex]
    };

    onUpdateCandidate(updatedCandidate);
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-[#1a2b3c] flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-[#0060ac]" />
            Onboarding & Talent Acquisition Pipeline
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track background checks, offer sign-offs, IT laptop provisioning, and compliance orientation.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700">
          <span>Active Pipeline SLA:</span>
          <span className="text-[#48bbbe] font-bold">12.4 Days Avg</span>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-2">
        {STAGES.map((stage) => {
          const stageCandidates = candidates.filter((c) => c.stage === stage);

          return (
            <div key={stage} className="bg-slate-100/70 p-3 rounded-xl border border-[#e2e8f0] min-w-[220px] flex flex-col justify-between">
              <div>
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-200">
                  <span className="text-xs font-bold text-[#1a2b3c] tracking-tight">{stage}</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200">
                    {stageCandidates.length}
                  </span>
                </div>

                {/* Column Cards */}
                <div className="space-y-3">
                  {stageCandidates.length === 0 ? (
                    <div className="p-4 rounded-lg bg-white/50 border border-dashed border-slate-200 text-center text-[11px] text-slate-400">
                      No candidates in {stage}
                    </div>
                  ) : (
                    stageCandidates.map((c) => {
                      const progressPct = Math.round((c.tasksCompleted / c.totalTasks) * 100);

                      return (
                        <div 
                          key={c.id} 
                          className="bg-white p-3.5 rounded-xl border border-[#e2e8f0] shadow-2xs hover:shadow-xs transition-all space-y-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <img src={c.avatar} alt={c.name} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                              <div className="min-w-0">
                                <h4 className="font-bold text-xs text-[#1a2b3c] truncate">{c.name}</h4>
                                <p className="text-[11px] text-slate-500 truncate">{c.role}</p>
                              </div>
                            </div>
                          </div>

                          <div className="text-[10px] text-slate-500 flex items-center justify-between bg-slate-50 p-1.5 rounded">
                            <span>Department</span>
                            <span className="font-bold text-slate-700">{c.department}</span>
                          </div>

                          {/* Task Progress */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                              <span>Compliance Checklist</span>
                              <span>{c.tasksCompleted}/{c.totalTasks} ({progressPct}%)</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all ${
                                  progressPct === 100 ? 'bg-emerald-500' : 'bg-[#48bbbe]'
                                }`} 
                                style={{ width: `${progressPct}%` }}
                              />
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                            <button
                              onClick={() => setActiveCandidate(c)}
                              className="font-semibold text-[#0060ac] hover:underline"
                            >
                              Checklist &rarr;
                            </button>

                            <div className="flex items-center gap-1">
                              {stage !== 'Sourced' && (
                                <button
                                  onClick={() => handleMoveStage(c, 'prev')}
                                  className="p-1 rounded bg-slate-100 text-slate-600 hover:bg-slate-200"
                                  title="Move to previous stage"
                                >
                                  <ChevronLeft className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {stage !== 'Completed' && (
                                <button
                                  onClick={() => handleMoveStage(c, 'next')}
                                  className="p-1 rounded bg-[#1a2b3c] text-white hover:bg-[#041627]"
                                  title="Advance to next stage"
                                >
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Candidate Checklist Modal */}
      {activeCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#e2e8f0] w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-[#e2e8f0] pb-3">
              <div className="flex items-center gap-3">
                <img src={activeCandidate.avatar} alt={activeCandidate.name} className="w-10 h-10 rounded-full border border-slate-200" />
                <div>
                  <h3 className="font-bold text-sm text-[#1a2b3c]">{activeCandidate.name}</h3>
                  <p className="text-xs text-slate-500">{activeCandidate.role} • {activeCandidate.department}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveCandidate(null)}
                className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                Done
              </button>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase mb-2">Onboarding Verification Checklist</h4>
              <div className="space-y-2">
                {activeCandidate.checklist.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => handleToggleTask(activeCandidate, task.id)}
                    className="w-full flex items-center gap-3 p-2.5 rounded-lg border border-[#e2e8f0] bg-slate-50 hover:bg-slate-100 transition-colors text-left text-xs font-medium text-slate-800"
                  >
                    {task.completed ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span className={task.completed ? 'line-through text-slate-400' : 'text-slate-800'}>
                      {task.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
