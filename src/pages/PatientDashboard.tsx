import React from 'react';
import { User, FileText, Pill, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';
import { Patient, InvestigationReport, PharmacyReport } from '../context/HealthcareContext';

interface DashboardProps {
  patient: Patient;
  investigationReports: InvestigationReport[];
  pharmacyReports: PharmacyReport[];
  onNavigate: (page: string) => void;
}

export const PatientDashboard: React.FC<DashboardProps> = ({
  patient,
  investigationReports,
  pharmacyReports,
  onNavigate
}) => {
  const activeMedications = pharmacyReports.filter((report: PharmacyReport) => report.status === 'active').length;
  const pendingReports = investigationReports.filter((report: InvestigationReport) => report.status === 'pending').length;

  const recentReports = investigationReports
    .sort((a: InvestigationReport, b: InvestigationReport) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const activeMeds = pharmacyReports
    .filter((report: PharmacyReport) => report.status === 'active')
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, {patient.fullName}</h1>
            <p className="text-blue-100">Here's your latest health overview</p>
          </div>
          <div className="bg-white/20 p-3 rounded-full">
            <User className="h-8 w-8" />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900">{investigationReports.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Medications</p>
              <p className="text-2xl font-bold text-gray-900">{activeMedications}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Pill className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending Reviews</p>
              <p className="text-2xl font-bold text-gray-900">{pendingReports}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Health Score</p>
              <p className="text-2xl font-bold text-gray-900">85%</p>
            </div>
            <div className="bg-teal-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-teal-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <button
          onClick={() => onNavigate('investigations')}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow text-left group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-full group-hover:bg-blue-200 transition-colors">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">{investigationReports.length} reports</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Investigation Reports</h3>
          <p className="text-gray-600 text-sm">View your test results and lab reports</p>
        </button>

        <button
          onClick={() => onNavigate('pharmacy')}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow text-left group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-full group-hover:bg-green-200 transition-colors">
              <Pill className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-sm text-gray-500">{activeMedications} active</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Pharmacy Reports</h3>
          <p className="text-gray-600 text-sm">Manage your prescriptions and medications</p>
        </button>

        <button
          onClick={() => onNavigate('profile')}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow text-left group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-full group-hover:bg-purple-200 transition-colors">
              <User className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-sm text-gray-500">Profile</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Patient Profile</h3>
          <p className="text-gray-600 text-sm">View and update your personal information</p>
        </button>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reports */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Recent Reports</h3>
          </div>
          <div className="p-6 space-y-4">
            {recentReports.map((report: InvestigationReport) => (
              <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    report.status === 'completed' ? 'bg-green-500' :
                    report.status === 'pending' ? 'bg-orange-500' : 'bg-blue-500'
                  }`} />
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{report.type}</p>
                    <p className="text-gray-600 text-xs">{report.date}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  report.status === 'completed' ? 'bg-green-100 text-green-800' :
                  report.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {report.status}
                </span>
              </div>
            ))}
            {recentReports.length === 0 && (
              <p className="text-gray-500 text-center py-4">No recent reports</p>
            )}
          </div>
        </div>

        {/* Active Medications */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Active Medications</h3>
          </div>
          <div className="p-6 space-y-4">
            {activeMeds.map((med: PharmacyReport) => (
              <div key={med.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-500 w-3 h-3 rounded-full" />
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{med.medicationName}</p>
                    <p className="text-gray-600 text-xs">{med.dosage} - {med.frequency}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{med.refillsRemaining} refills left</p>
                </div>
              </div>
            ))}
            {activeMeds.length === 0 && (
              <p className="text-gray-500 text-center py-4">No active medications</p>
            )}
          </div>
        </div>
      </div>

      {/* Health Alerts */}
      {pendingReports > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-orange-600" />
            <div>
              <h3 className="font-semibold text-orange-900">Attention Required</h3>
              <p className="text-orange-800 text-sm">
                You have {pendingReports} report{pendingReports > 1 ? 's' : ''} waiting for review. 
                Please check your investigation reports.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
