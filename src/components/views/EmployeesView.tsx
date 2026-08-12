import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Plus, 
  Mail, 
  MapPin, 
  Building2, 
  Trash2,
  AlertTriangle,
  X,
  Lock,
  Calendar,
  CalendarCheck
} from 'lucide-react';
import { Employee, Department, EmploymentStatus, UserAccount, EmployeeDocument } from '../../types';
import { EmployeeProfileModal } from '../profile/EmployeeProfileModal';

interface EmployeesViewProps {
  employees: Employee[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onAddEmployee: (employeeData: Partial<Employee> & { empId?: string }) => void;
  onUpdateEmployeeProfile: (id: string, updatedData: Partial<Employee> & { newEmpId?: string; newPassword?: string }) => void;
  onUpdateEmployeeDocuments?: (id: string, docs: EmployeeDocument[]) => void;
  onDeleteEmployee: (id: string) => void;
  currentUser: UserAccount | null;
}

export const EmployeesView: React.FC<EmployeesViewProps> = ({
  employees,
  searchQuery,
  onSearchChange,
  onAddEmployee,
  onUpdateEmployeeProfile,
  onUpdateEmployeeDocuments,
  onDeleteEmployee,
  currentUser,
}) => {
  const isAdmin = currentUser?.role === 'Admin';
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  // New Employee Form State
  const [newForm, setNewForm] = useState({
    empId: '',
    name: '',
    email: '',
    role: '',
    department: 'Engineering' as Department,
    status: 'Active' as EmploymentStatus,
    location: 'Delhi NCR (HQ)',
    salary: 125000,
    joinDate: new Date().toISOString().split('T')[0],
    phone: '+91 99997 40587',
    emergencyPhone: '+91 98110 00000',
    address: 'Kenzo - 32-C, UNIT NO. 107, B.R. COMPLEX, MAYUR VIHAR PHASE I, EAST DELHI - 110091',
    maritalStatus: 'Single' as 'Single' | 'Married' | 'Divorced' | 'Widowed',
    nomineeName: 'Parent / Spouse',
    nomineeDob: '1995-05-15',
    nomineeRelation: 'Parent',
    highestQualification: 'Bachelor of Technology (B.Tech)',
    medicalHistory: 'No major pre-existing conditions reported.',
    scoreCard: 95,
    manager: 'Admin Office',
    userRole: 'Employee' as 'Admin' | 'Employee',
  });

  // Filter Logic
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    const matchesStatus = selectedStatus === 'All' || emp.status === selectedStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.name || !newForm.email || !newForm.role) return;

    onAddEmployee(newForm);
    setIsAddModalOpen(false);
    setNewForm({
      empId: '',
      name: '',
      email: '',
      role: '',
      department: 'Engineering',
      status: 'Active',
      location: 'Delhi NCR (HQ)',
      salary: 125000,
      joinDate: new Date().toISOString().split('T')[0],
      phone: '+91 99997 40587',
      emergencyPhone: '+91 98110 00000',
      address: 'Kenzo - 32-C, UNIT NO. 107, B.R. COMPLEX, MAYUR VIHAR PHASE I, EAST DELHI - 110091',
      maritalStatus: 'Single',
      nomineeName: 'Parent / Spouse',
      nomineeDob: '1995-05-15',
      nomineeRelation: 'Parent',
      highestQualification: 'Bachelor of Technology (B.Tech)',
      medicalHistory: 'No major pre-existing conditions reported.',
      scoreCard: 95,
      manager: 'Admin Office',
      userRole: 'Employee',
    });
  };

  const confirmDelete = () => {
    if (employeeToDelete) {
      onDeleteEmployee(employeeToDelete.id);
      if (selectedEmployee?.id === employeeToDelete.id) {
        setSelectedEmployee(null);
      }
      setEmployeeToDelete(null);
    }
  };

  const getStatusBadge = (status: EmploymentStatus) => {
    switch (status) {
      case 'Active':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 text-[#48bbbe] border border-teal-200">Active</span>;
      case 'On Leave':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">On Leave</span>;
      case 'Pending':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">Pending</span>;
      case 'Remote':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">Remote</span>;
      case 'Contractor':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">Contractor</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">{status}</span>;
    }
  };

  if (!isAdmin) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center shadow-2xs space-y-4 max-w-2xl mx-auto my-8">
        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#1a2b3c]">Employee Directory Access Restricted</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
            The global employee roster, locations, and personnel profile actions are managed exclusively by HR Administration. You can view your personal profile, attendance, and leave records from your Employee Dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Filters & Actions Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Department & Status Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <Filter className="w-3.5 h-3.5" /> Filter By:
          </div>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-[#e2e8f0] rounded-lg focus:outline-none focus:border-[#0060ac] text-slate-800 font-medium"
          >
            <option value="All">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Product & Design">Product & Design</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Sales & Marketing">Sales & Marketing</option>
            <option value="Finance">Finance</option>
            <option value="Operations">Operations</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-[#e2e8f0] rounded-lg focus:outline-none focus:border-[#0060ac] text-slate-800 font-medium"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Remote">Remote</option>
            <option value="Pending">Pending</option>
            <option value="Contractor">Contractor</option>
          </select>

          {(selectedDept !== 'All' || selectedStatus !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedDept('All');
                setSelectedStatus('All');
                onSearchChange('');
              }}
              className="text-xs text-slate-500 hover:text-slate-800 underline font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* View Toggle & Add Employee Button (Admin Only) */}
        <div className="flex items-center justify-between md:justify-end gap-3">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-[#e2e8f0]">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'table' ? 'bg-white text-[#1a2b3c] shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'grid' ? 'bg-white text-[#1a2b3c] shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Grid Cards View"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>

          {isAdmin && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-1.5 bg-[#1a2b3c] text-white text-xs font-semibold rounded-lg hover:bg-[#041627] flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Employee</span>
            </button>
          )}
        </div>
      </div>

      {/* Directory Content */}
      {filteredEmployees.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-12 text-center">
          <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#1a2b3c]">No Employee Profiles Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            No employees match the selected filters or search parameters. Try adjusting your search query.
          </p>
        </div>
      ) : viewMode === 'table' ? (
        /* Data Table View */
        <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-[#e2e8f0] text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Role & Dept</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Date of Joining</th>
                  {isAdmin && <th className="py-3 px-4">Annual Compensation</th>}
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0] text-xs">
                {filteredEmployees.map((emp) => (
                  <tr 
                    key={emp.id} 
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    onClick={() => setSelectedEmployee(emp)}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={emp.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=0060ac&color=fff`} 
                          alt={emp.name} 
                          className="w-9 h-9 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-[#1a2b3c] hover:text-[#0060ac] transition-colors">{emp.name}</p>
                          <p className="text-[11px] text-slate-400 font-mono">{emp.id} • {emp.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800">{emp.role}</p>
                      <p className="text-[11px] text-slate-500">{emp.department}</p>
                    </td>

                    <td className="py-3 px-4">
                      {getStatusBadge(emp.status)}
                    </td>

                    <td className="py-3 px-4 text-slate-600 font-medium">
                      {emp.location || 'Delhi NCR (HQ)'}
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-700">
                      {emp.joinDate || '2026-01-01'}
                    </td>

                    {isAdmin && (
                      <td className="py-3 px-4 font-bold text-[#1a2b3c]">
                        ${emp.salary ? emp.salary.toLocaleString() : '125,000'}/yr
                      </td>
                    )}

                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedEmployee(emp)}
                          className="px-2.5 py-1 text-[11px] font-semibold rounded bg-slate-100 text-[#0060ac] hover:bg-blue-50 transition-colors"
                        >
                          Profile & Docs
                        </button>

                        {isAdmin && (
                          <button
                            onClick={() => setEmployeeToDelete(emp)}
                            title="Delete Employee"
                            className="p-1 rounded text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Card View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map((emp) => (
            <div 
              key={emp.id}
              onClick={() => setSelectedEmployee(emp)}
              className="bg-white rounded-xl border border-[#e2e8f0] p-4 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={emp.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=0060ac&color=fff`} 
                      alt={emp.name} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-slate-100 shadow-2xs"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-[#1a2b3c] hover:text-[#0060ac] transition-colors">{emp.name}</h4>
                      <p className="text-xs text-slate-500">{emp.role}</p>
                    </div>
                  </div>
                  {getStatusBadge(emp.status)}
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mb-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{emp.department}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{emp.location || 'Delhi NCR (HQ)'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">Joined: {emp.joinDate || '2026-01-01'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#e2e8f0] flex items-center justify-between text-xs">
                {isAdmin ? (
                  <span className="font-bold text-[#1a2b3c]">₹{emp.salary ? emp.salary.toLocaleString() : '125,000'}/yr</span>
                ) : (
                  <span className="font-semibold text-slate-500 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-slate-400" /> Confidential Profile
                  </span>
                )}
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <span className="text-[11px] font-semibold text-[#0060ac] hover:underline" onClick={() => setSelectedEmployee(emp)}>
                    Profile & Docs &rarr;
                  </span>
                  {isAdmin && (
                    <button
                      onClick={() => setEmployeeToDelete(emp)}
                      className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Employee Detail & Document Vault Modal */}
      {selectedEmployee && (
        <EmployeeProfileModal
          employee={selectedEmployee}
          currentUser={currentUser}
          onClose={() => setSelectedEmployee(null)}
          onUpdateProfile={(id, data) => {
            onUpdateEmployeeProfile(id, data);
            setSelectedEmployee((prev) => prev ? { ...prev, ...data } : null);
          }}
          onUpdateDocuments={(id, docs) => {
            if (onUpdateEmployeeDocuments) {
              onUpdateEmployeeDocuments(id, docs);
            }
            setSelectedEmployee((prev) => prev ? { ...prev, documents: docs } : null);
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {employeeToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Delete Employee Record</h3>
            </div>

            <p className="text-xs text-slate-600">
              Are you sure you want to delete <strong className="text-slate-900">{employeeToDelete.name}</strong> ({employeeToDelete.email}) from the PostgreSQL database? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setEmployeeToDelete(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 shadow-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Employee Modal Form (Admin Only) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#e2e8f0] w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-[#e2e8f0] flex items-center justify-between bg-slate-50/50 sticky top-0 bg-white z-10">
              <h3 className="text-base font-bold text-[#1a2b3c]">Add New Employee Profile</h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Employee ID (Emp_id)</label>
                  <input
                    type="text"
                    placeholder="Auto or e.g. EMP-1006"
                    value={newForm.empId}
                    onChange={(e) => setNewForm({ ...newForm, empId: e.target.value })}
                    className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg font-mono focus:outline-none focus:border-[#0060ac]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date of Joining</label>
                  <input
                    type="date"
                    required
                    value={newForm.joinDate}
                    onChange={(e) => setNewForm({ ...newForm, joinDate: e.target.value })}
                    className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:border-[#0060ac]"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jordan Miller"
                    value={newForm.name}
                    onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:border-[#0060ac]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Work Email</label>
                  <input
                    type="email"
                    required
                    placeholder="Enter the company mail"
                    value={newForm.email}
                    onChange={(e) => setNewForm({ ...newForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:border-[#0060ac]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Job Title / Designation</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Software Engineer"
                    value={newForm.role}
                    onChange={(e) => setNewForm({ ...newForm, role: e.target.value })}
                    className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:border-[#0060ac]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={newForm.department}
                    onChange={(e) => setNewForm({ ...newForm, department: e.target.value as Department })}
                    className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:border-[#0060ac]"
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
                  <label className="block font-semibold text-slate-700 mb-1">Work Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Delhi NCR (HQ) or San Francisco"
                    value={newForm.location}
                    onChange={(e) => setNewForm({ ...newForm, location: e.target.value })}
                    className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:border-[#0060ac]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">System Role Access</label>
                  <select
                    value={newForm.userRole}
                    onChange={(e) => setNewForm({ ...newForm, userRole: e.target.value as 'Admin' | 'Employee' })}
                    className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:border-[#0060ac]"
                  >
                    <option value="Employee">Employee (Standard Access)</option>
                    <option value="Admin">Admin (Full Control Access)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Employment Status</label>
                  <select
                    value={newForm.status}
                    onChange={(e) => setNewForm({ ...newForm, status: e.target.value as EmploymentStatus })}
                    className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:border-[#0060ac]"
                  >
                    <option value="Active">Active</option>
                    <option value="Remote">Remote</option>
                    <option value="Pending">Pending</option>
                    <option value="Contractor">Contractor</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Annual Salary (₹)</label>
                  <input
                    type="number"
                    value={newForm.salary}
                    onChange={(e) => setNewForm({ ...newForm, salary: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:border-[#0060ac]"
                  />
                </div>

                <div className="col-span-2">
                  <span className="text-[11px] text-slate-500 font-medium">Default password will be hashed as <code className="text-[#0060ac] font-bold">kenzo123</code>. Admin can reset it anytime.</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#e2e8f0] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1a2b3c] text-white font-semibold rounded-lg hover:bg-[#041627]"
                >
                  Create Employee Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
