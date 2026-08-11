import React, { useState } from 'react';
import { 
  Award, 
  Target, 
  TrendingUp, 
  Plus, 
  Star, 
  CheckCircle2, 
  User, 
  X
} from 'lucide-react';
import { PerformanceGoal, Employee } from '../../types';

interface PerformanceViewProps {
  goals: PerformanceGoal[];
  employees: Employee[];
  onAddGoal: (goal: PerformanceGoal) => void;
  onUpdateGoalProgress: (id: string, progress: number) => void;
}

export const PerformanceView: React.FC<PerformanceViewProps> = ({
  goals,
  employees,
  onAddGoal,
  onUpdateGoalProgress,
}) => {
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState(employees[0]?.id || '');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Strategic' | 'Technical' | 'Culture' | 'Leadership'>('Technical');
  const [dueDate, setDueDate] = useState('2026-09-30');

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find(e => e.id === selectedEmpId) || employees[0];
    if (!emp || !title) return;

    const newGoal: PerformanceGoal = {
      id: `G-${goals.length + 10}`,
      employeeId: emp.id,
      employeeName: emp.name,
      title,
      category,
      progress: 0,
      dueDate,
      rating: 4.5,
      reviewer: 'Sarah Jenkins',
    };

    onAddGoal(newGoal);
    setIsAddGoalModalOpen(false);
    setTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-[#1a2b3c] flex items-center gap-2">
            <Award className="w-5 h-5 text-[#0060ac]" />
            Enterprise Performance & OKR Tracking
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluate key strategic initiatives, performance review scores, and talent development targets.
          </p>
        </div>

        <button
          onClick={() => setIsAddGoalModalOpen(true)}
          className="px-3.5 py-2 bg-[#1a2b3c] text-white text-xs font-semibold rounded-lg hover:bg-[#041627] flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Strategic Goal
        </button>
      </div>

      {/* Goal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((g) => (
          <div key={g.id} className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-2xs hover:shadow-xs transition-all space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  g.category === 'Technical' ? 'bg-blue-50 text-[#0060ac]' :
                  g.category === 'Strategic' ? 'bg-purple-50 text-purple-700' :
                  'bg-teal-50 text-[#48bbbe]'
                }`}>
                  {g.category}
                </span>
                <h3 className="font-bold text-sm text-[#1a2b3c] mt-2 leading-snug">{g.title}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Assigned to <strong className="text-slate-800">{g.employeeName}</strong> • Due {g.dueDate}
                </p>
              </div>

              <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 shrink-0">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span className="text-xs font-bold text-amber-800">{g.rating}</span>
              </div>
            </div>

            {/* Interactive Progress Slider/Bar */}
            <div className="space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-600">Goal Progress</span>
                <span className="text-[#1a2b3c] font-bold">{g.progress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={g.progress}
                onChange={(e) => onUpdateGoalProgress(g.id, Number(e.target.value))}
                className="w-full accent-[#0060ac] cursor-pointer"
              />
            </div>

            {/* Reviewer Feedback */}
            {g.feedback && (
              <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600 border border-slate-100">
                <p className="font-semibold text-slate-700">Manager Review ({g.reviewer}):</p>
                <p className="italic text-slate-500 mt-0.5">"{g.feedback}"</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Goal Modal */}
      {isAddGoalModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#e2e8f0] w-full max-w-md p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-sm text-[#1a2b3c]">Assign Strategic OKR / Goal</h3>
              <button onClick={() => setIsAddGoalModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assignee</label>
                <select
                  value={selectedEmpId}
                  onChange={(e) => setSelectedEmpId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                >
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>{e.name} ({e.role})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Goal Objective Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement zero-trust security compliance"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                >
                  <option value="Technical">Technical</option>
                  <option value="Strategic">Strategic</option>
                  <option value="Culture">Culture</option>
                  <option value="Leadership">Leadership</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Completion Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddGoalModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[#1a2b3c] text-white font-semibold rounded-lg hover:bg-[#041627]"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
