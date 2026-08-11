import React, { useState } from 'react';
import { 
  Building2, 
  Globe, 
  Mail, 
  Phone, 
  MessageSquare, 
  MapPin, 
  Check, 
  Save, 
  ExternalLink,
  Users,
  ShieldCheck,
  Award
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'departments' | 'teams' | 'designations'>('profile');
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'profile' 
              ? 'bg-white text-slate-900 border border-slate-200 shadow-2xs' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-3.5 h-3.5 text-amber-500" />
          <span>Company Profile</span>
        </button>

        <button
          onClick={() => setActiveTab('departments')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
            activeTab === 'departments' 
              ? 'bg-white text-slate-900 border border-slate-200 shadow-2xs' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-3.5 h-3.5 text-blue-500" />
          <span>Departments (5)</span>
        </button>

        <button
          onClick={() => setActiveTab('teams')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
            activeTab === 'teams' 
              ? 'bg-white text-slate-900 border border-slate-200 shadow-2xs' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-purple-500" />
          <span>Teams (3)</span>
        </button>

        <button
          onClick={() => setActiveTab('designations')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
            activeTab === 'designations' 
              ? 'bg-white text-slate-900 border border-slate-200 shadow-2xs' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-emerald-500" />
          <span>Designations (6)</span>
        </button>
      </div>

      {/* Main Company Profile Card (Matching Image 2) */}
      <div className="bg-white rounded-2xl border border-blue-200 p-6 shadow-sm space-y-6">
        {/* Title Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Kenzo Infosystems Pvt. Ltd.
              </h2>
              <p className="text-xs text-slate-500">
                Official Corporate Entity & Global Headquarters Details
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-center">
            Active Legal Entity
          </span>
        </div>

        {/* 4 Cards Row: Website, Email, Contact Phone, WhatsApp */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Website */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
              <Globe className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Website</span>
              <a 
                href="https://kenzoinfosystems.com" 
                target="_blank" 
                rel="noreferrer"
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 truncate"
              >
                <span>kenzoinfosystems.com</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            </div>
          </div>

          {/* Card 2: Official Email */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Official Email</span>
              <a 
                href="mailto:sales@kenzoinfosystems.com"
                className="text-xs font-bold text-slate-800 hover:text-blue-600 truncate block"
              >
                sales@kenzoinfosystems.com
              </a>
            </div>
          </div>

          {/* Card 3: Contact Phone */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Contact Phone</span>
              <span className="text-xs font-bold text-slate-800 block">9999740587</span>
            </div>
          </div>

          {/* Card 4: WhatsApp */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shrink-0">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">WhatsApp</span>
              <span className="text-xs font-bold text-slate-800 block">8810531196</span>
            </div>
          </div>
        </div>

        {/* Registered Corporate Address Block */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shrink-0 mt-0.5">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Registered Corporate Address
            </span>
            <p className="text-xs font-bold text-slate-900 leading-snug">
              Kenzo - 32-C, UNIT NO. 107, B.R. COMPLEX, MAYUR VIHAR PHASE I, EAST DELHI – 110091
            </p>
            <p className="text-[11px] text-slate-500 font-mono">
              CIN: U72900DL2020PTC368912 • ISO 27001:2022 Certified Corporate Office
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
