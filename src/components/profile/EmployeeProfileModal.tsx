import React, { useState } from 'react';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Heart, 
  Users, 
  GraduationCap, 
  Activity, 
  Award, 
  FileText, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Save, 
  ShieldCheck,
  Edit3,
  Key,
  Calendar,
  Building,
  DollarSign,
  Briefcase
} from 'lucide-react';
import { Employee, EmployeeDocument, UserAccount } from '../../types';

interface EmployeeProfileModalProps {
  employee: Employee;
  currentUser: UserAccount | null;
  onClose: () => void;
  onUpdateProfile: (id: string, updatedData: Partial<Employee> & { newEmpId?: string; newPassword?: string }) => void;
  onUpdateDocuments?: (id: string, updatedDocs: EmployeeDocument[]) => void;
}

export const EmployeeProfileModal: React.FC<EmployeeProfileModalProps> = ({
  employee,
  currentUser,
  onClose,
  onUpdateProfile,
  onUpdateDocuments,
}) => {
  const isAdmin = currentUser?.role === 'Admin';
  const isSelf = currentUser?.id === employee.id || currentUser?.email.toLowerCase() === employee.email.toLowerCase();
  const canEdit = isAdmin || isSelf;

  const [activeTab, setActiveTab] = useState<'details' | 'documents'>('details');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const formatDateForInput = (dateVal?: string | null) => {
    if (!dateVal) return '2026-01-01';
    try {
      const d = new Date(dateVal);
      if (!isNaN(d.getTime())) {
        return d.toISOString().split('T')[0];
      }
    } catch {}
    return String(dateVal).split('T')[0] || '2026-01-01';
  };

  // Profile Form State
  const [form, setForm] = useState({
    newEmpId: employee.id || 'EMP-1001',
    name: employee.name || '',
    phone: employee.phone || '',
    email: employee.email || '',
    emergencyPhone: employee.emergencyPhone || '+91 98110 00000',
    address: employee.address || 'Kenzo - 32-C, UNIT NO. 107, B.R. COMPLEX, MAYUR VIHAR PHASE I, EAST DELHI - 110091',
    maritalStatus: employee.maritalStatus || 'Single',
    nomineeName: employee.nomineeName || 'Parent / Spouse',
    nomineeDob: employee.nomineeDob || '1995-05-15',
    nomineeRelation: employee.nomineeRelation || 'Parent',
    highestQualification: employee.highestQualification || 'Bachelor of Technology (B.Tech)',
    medicalHistory: employee.medicalHistory || 'No major pre-existing conditions reported.',
    scoreCard: employee.scoreCard || 95,
    salary: employee.salary || 125000,
    department: employee.department || 'Engineering',
    role: employee.role || 'Software Engineer',
    location: employee.location || 'Delhi NCR (HQ)',
    joinDate: formatDateForInput(employee.joinDate),
    newPassword: '',
  });

  // Document Vault State
  const [documents, setDocuments] = useState<EmployeeDocument[]>(
    employee.documents && employee.documents.length > 0
      ? employee.documents
      : [
          { id: 'doc-1', name: 'Aadhaar Card (Original + Photocopy)', isMandatory: true, status: 'Pending' },
          { id: 'doc-2', name: 'PAN Card (Original + Photocopy)', isMandatory: true, status: 'Pending' },
          { id: 'doc-3', name: 'Permanent Address Proof', isMandatory: true, status: 'Pending' },
          { id: 'doc-4', name: 'Current/Temporary Address Proof (if different)', isMandatory: false, status: 'Pending' },
          { id: 'doc-5', name: 'Class 10th Mark Sheet/Certificate', isMandatory: true, status: 'Pending' },
          { id: 'doc-6', name: 'Class 12th Mark Sheet/Certificate', isMandatory: true, status: 'Pending' },
          { id: 'doc-7', name: 'Graduation Mark Sheets (all years/semesters)', isMandatory: false, status: 'Pending' },
          { id: 'doc-8', name: 'Graduation Degree Certificate (if available)', isMandatory: false, status: 'Pending' },
          { id: 'doc-9', name: 'Two recent passport-size photographs', isMandatory: false, status: 'Pending' },
          { id: 'doc-10', name: 'Cancelled Cheque (or first page of bank passbook)', isMandatory: false, status: 'Pending' },
          { id: 'doc-11', name: 'Offer Letter(s) from previous employer(s)', isMandatory: false, status: 'Pending' },
          { id: 'doc-12', name: 'Experience Letter(s) from previous employer(s)', isMandatory: false, status: 'Pending' },
          { id: 'doc-13', name: 'Relieving Letter from previous employer', isMandatory: false, status: 'Pending' },
          { id: 'doc-14', name: 'Last 3 Salary Slips', isMandatory: false, status: 'Pending' },
          { id: 'doc-15', name: 'Updated Resume', isMandatory: false, status: 'Pending' },
        ]
  );

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onUpdateProfile(employee.id, {
        ...form,
        designation: form.role,
      });
      setIsEditing(false);
      setSuccessMsg('Profile and access credentials updated successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = (docId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const updatedDocs = documents.map((doc) => {
      if (doc.id === docId) {
        return {
          ...doc,
          status: 'Uploaded' as const,
          fileName: file.name,
          uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          fileSize: `${(file.size / 1024).toFixed(0)} KB`,
        };
      }
      return doc;
    });

    setDocuments(updatedDocs);
    if (onUpdateDocuments) {
      onUpdateDocuments(employee.id, updatedDocs);
    }
    setSuccessMsg('Document uploaded successfully!');
    setTimeout(() => setSuccessMsg(null), 2500);
  };

  const mandatoryCount = documents.filter((d) => d.isMandatory).length;
  const mandatoryUploaded = documents.filter((d) => d.isMandatory && d.status === 'Uploaded').length;
  const totalUploaded = documents.filter((d) => d.status === 'Uploaded').length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#e2e8f0] w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
        
        {/* Header Drawer */}
        <div className="p-6 border-b border-[#e2e8f0] bg-slate-50/80 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <img 
              src={employee.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=0060ac&color=fff`} 
              alt={employee.name} 
              className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-[#1a2b3c]">{employee.name}</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isAdmin ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-teal-100 text-teal-800 border border-teal-300'
                }`}>
                  {employee.role}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{employee.id} • {employee.department} • Joined {employee.joinDate || '2026-01-01'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {canEdit && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 bg-[#0060ac] text-white font-bold text-xs rounded-xl shadow-2xs hover:bg-[#004e8c] flex items-center gap-1.5 transition-all"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile & Access</span>
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        {successMsg && (
          <div className="bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs px-6 py-2.5 font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex items-center border-b border-slate-200 bg-white px-6">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 px-4 font-bold text-xs border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'details' ? 'border-[#0060ac] text-[#0060ac]' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Employee Profile Details</span>
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`py-3 px-4 font-bold text-xs border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'documents' ? 'border-[#0060ac] text-[#0060ac]' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Document Vault ({mandatoryUploaded}/{mandatoryCount} Mandatory)</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-700">
          {activeTab === 'details' ? (
            isEditing ? (
              /* Editable Profile & Administrative Control Form */
              <form onSubmit={handleSaveProfile} className="space-y-4">
                
                {/* ADMIN EXCLUSIVE CONTROLS SECTION */}
                {isAdmin && (
                  <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 space-y-3">
                    <h4 className="font-bold text-xs text-amber-900 flex items-center gap-1.5 uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4 text-amber-700" /> HR Admin Governance Controls (Restricted)
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-bold text-slate-800 mb-1">Employee ID (Emp_id)</label>
                        <input
                          type="text"
                          required
                          value={form.newEmpId}
                          onChange={(e) => setForm({ ...form, newEmpId: e.target.value })}
                          className="w-full p-2.5 bg-white border border-amber-300 rounded-lg font-mono font-bold text-[#1a2b3c] focus:outline-none focus:border-[#0060ac]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-800 mb-1">Role / Job Designation</label>
                        <input
                          type="text"
                          required
                          value={form.role}
                          onChange={(e) => setForm({ ...form, role: e.target.value })}
                          className="w-full p-2.5 bg-white border border-amber-300 rounded-lg font-bold text-[#1a2b3c] focus:outline-none focus:border-[#0060ac]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-800 mb-1">Department</label>
                        <select
                          value={form.department}
                          onChange={(e) => setForm({ ...form, department: e.target.value as any })}
                          className="w-full p-2.5 bg-white border border-amber-300 rounded-lg font-bold text-[#1a2b3c] focus:outline-none focus:border-[#0060ac]"
                        >
                          <option value="Engineering">Engineering</option>
                          <option value="Product & Design">Product & Design</option>
                          <option value="Human Resources">Human Resources</option>
                          <option value="Sales & Marketing">Sales & Marketing</option>
                          <option value="Finance">Finance</option>
                          <option value="Operations">Operations</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-800 mb-1">Work Location</label>
                        <input
                          type="text"
                          required
                          value={form.location}
                          onChange={(e) => setForm({ ...form, location: e.target.value })}
                          className="w-full p-2.5 bg-white border border-amber-300 rounded-lg font-semibold text-[#1a2b3c] focus:outline-none focus:border-[#0060ac]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-800 mb-1">Annual Salary (₹)</label>
                        <input
                          type="number"
                          required
                          value={form.salary}
                          onChange={(e) => setForm({ ...form, salary: Number(e.target.value) })}
                          className="w-full p-2.5 bg-white border border-amber-300 rounded-lg font-bold text-[#1a2b3c] focus:outline-none focus:border-[#0060ac]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-800 mb-1">Date of Joining</label>
                        <input
                          type="date"
                          required
                          value={form.joinDate}
                          onChange={(e) => setForm({ ...form, joinDate: e.target.value })}
                          className="w-full p-2.5 bg-white border border-amber-300 rounded-lg font-semibold text-[#1a2b3c] focus:outline-none focus:border-[#0060ac]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* LOGIN PASSWORD RESET SECTION */}
                <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-200 space-y-2">
                  <h4 className="font-bold text-xs text-[#0060ac] flex items-center gap-1.5 uppercase tracking-wider">
                    <Key className="w-4 h-4 text-[#0060ac]" /> 
                    {isAdmin ? `Reset Login Password for ${employee.name}` : `Change My Login Password`}
                  </h4>
                  <div className="max-w-md">
                    <label className="block font-semibold text-slate-700 mb-1">
                      New Password {isAdmin ? '(Admin override)' : '(Minimum 6 characters)'}
                    </label>
                    <input
                      type="password"
                      placeholder="Leave blank to keep existing password"
                      value={form.newPassword}
                      onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                      className="w-full p-2.5 bg-white border border-blue-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#0060ac]"
                    />
                  </div>
                </div>

                {/* GENERAL PROFILE DETAILS FORM */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-800 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#0060ac]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Work Email</label>
                    <input
                      type="email"
                      disabled={!isAdmin}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full p-2.5 bg-slate-100 border border-slate-300 rounded-lg text-slate-600 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Phone Number</label>
                    <input
                      type="text"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#0060ac]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Emergency Contact Number</label>
                    <input
                      type="text"
                      required
                      value={form.emergencyPhone}
                      onChange={(e) => setForm({ ...form, emergencyPhone: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#0060ac]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Marital Status</label>
                    <select
                      value={form.maritalStatus}
                      onChange={(e) => setForm({ ...form, maritalStatus: e.target.value as any })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#0060ac]"
                    >
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-800 mb-1">Permanent & Current Address</label>
                    <textarea
                      rows={2}
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#0060ac]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Dependent Nominee Name</label>
                    <input
                      type="text"
                      value={form.nomineeName}
                      onChange={(e) => setForm({ ...form, nomineeName: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#0060ac]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Nominee DOB & Relation</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={form.nomineeDob}
                        onChange={(e) => setForm({ ...form, nomineeDob: e.target.value })}
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Relation (e.g. Parent)"
                        value={form.nomineeRelation}
                        onChange={(e) => setForm({ ...form, nomineeRelation: e.target.value })}
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Highest Qualification</label>
                    <input
                      type="text"
                      value={form.highestQualification}
                      onChange={(e) => setForm({ ...form, highestQualification: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#0060ac]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Performance Score Card (/100)</label>
                    <input
                      type="number"
                      disabled={!isAdmin}
                      value={form.scoreCard}
                      onChange={(e) => setForm({ ...form, scoreCard: Number(e.target.value) })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#0060ac]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-800 mb-1">Medical History & Allergies</label>
                    <textarea
                      rows={2}
                      value={form.medicalHistory}
                      onChange={(e) => setForm({ ...form, medicalHistory: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#0060ac]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-slate-200 text-slate-800 font-bold rounded-xl hover:bg-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 bg-[#0060ac] text-white font-bold rounded-xl hover:bg-[#004e8c] shadow-md flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Read-Only Profile Overview */
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#1a2b3c] text-white p-4 rounded-xl shadow-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Employee ID</span>
                    <p className="font-extrabold text-sm text-cyan-300 font-mono">{employee.id}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Role & Department</span>
                    <p className="font-bold text-xs">{employee.role} ({employee.department})</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Date of Joining</span>
                    <p className="font-bold text-xs text-amber-300">{employee.joinDate || '2026-01-01'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Work Email</span>
                    <p className="font-bold text-slate-900">{employee.email}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Work Location</span>
                    <p className="font-bold text-slate-900">{employee.location || 'Delhi NCR (HQ)'}</p>
                  </div>
                  {isAdmin && (
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Annual Salary</span>
                      <p className="font-bold text-emerald-700">₹{employee.salary?.toLocaleString()}/yr</p>
                    </div>
                  )}
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Phone Number</span>
                    <p className="font-bold text-slate-900">{employee.phone || '+91 99997 40587'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Emergency Contact</span>
                    <p className="font-bold text-slate-900">{employee.emergencyPhone || '+91 98110 00000'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Marital Status</span>
                    <p className="font-bold text-slate-900">{employee.maritalStatus || 'Single'}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Address</span>
                    <p className="font-bold text-slate-900 leading-snug">{employee.address || 'Kenzo - 32-C, UNIT NO. 107, B.R. COMPLEX, MAYUR VIHAR PHASE I, EAST DELHI - 110091'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                  <div>
                    <span className="text-[10px] font-bold text-blue-700 uppercase">Dependent Nominee</span>
                    <p className="font-bold text-slate-900">{employee.nomineeName || 'Parent / Spouse'}</p>
                    <p className="text-[11px] text-slate-500">DOB: {employee.nomineeDob || '1995-05-15'} ({employee.nomineeRelation || 'Parent'})</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-blue-700 uppercase">Highest Qualification</span>
                    <p className="font-bold text-slate-900">{employee.highestQualification || 'Bachelor of Technology (B.Tech)'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200">
                    <span className="text-[10px] font-bold text-amber-800 uppercase">Medical History</span>
                    <p className="font-medium text-slate-800 mt-1">{employee.medicalHistory || 'No major pre-existing conditions reported.'}</p>
                  </div>
                  <div className="p-3.5 bg-purple-50/60 rounded-xl border border-purple-200">
                    <span className="text-[10px] font-bold text-purple-800 uppercase">Performance Score Card</span>
                    <p className="text-xl font-extrabold text-purple-900 mt-0.5">{employee.scoreCard || 95} / 100</p>
                  </div>
                </div>
              </div>
            )
          ) : (
            /* Document Vault View (15 Items List) */
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>Document Vault Verification Progress</span>
                  <span>{totalUploaded} / {documents.length} Files Uploaded</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${(totalUploaded / documents.length) * 100}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  <strong className="text-red-600">**</strong> denotes mandatory compliance documents required for employment verification.
                </p>
              </div>

              <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
                {documents.map((doc, idx) => (
                  <div key={doc.id} className="p-3.5 bg-white hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-slate-900">
                          <span>{doc.name}</span>
                          {doc.isMandatory && <span className="text-red-600 font-extrabold" title="Mandatory Document">**</span>}
                        </div>
                        {doc.fileName ? (
                          <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                            Uploaded: {doc.fileName} ({doc.fileSize}) on {doc.uploadedAt}
                          </p>
                        ) : (
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {doc.isMandatory ? 'Mandatory upload pending' : 'Optional document'}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        doc.status === 'Uploaded' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {doc.status}
                      </span>

                      {canEdit && (
                        <label className="cursor-pointer px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-[11px] font-bold rounded-lg flex items-center gap-1 transition-all">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{doc.status === 'Uploaded' ? 'Re-upload' : 'Upload'}</span>
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => handleFileUpload(doc.id, e)}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 text-slate-800 font-bold text-xs rounded-xl hover:bg-slate-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
