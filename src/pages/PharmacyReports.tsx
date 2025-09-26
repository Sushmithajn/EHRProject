import React, { useState } from 'react';
import { PharmacyReport } from '../context/HealthcareContext';
import { Pill, Calendar, User, Clock, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

interface PharmacyReportsProps {
  reports: PharmacyReport[];
}

export const PharmacyReports: React.FC<PharmacyReportsProps> = ({ reports }) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredReports = reports.filter(report => 
    filterStatus === 'all' || report.status === filterStatus
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-gray-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-orange-500" />;
      default:
        return <Pill className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const activeReports = reports.filter(report => report.status === 'active');
  const totalPrescriptions = reports.length;
  const completedPrescriptions = reports.filter(report => report.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pharmacy Reports</h2>
          <p className="text-gray-600 mt-1">Manage your prescriptions and medications</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Prescriptions</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Medications</p>
              <p className="text-2xl font-bold text-green-600">{activeReports.length}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Pill className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Prescriptions</p>
              <p className="text-2xl font-bold text-blue-600">{totalPrescriptions}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <RefreshCw className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Completed</p>
              <p className="text-2xl font-bold text-gray-600">{completedPrescriptions}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Prescription Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredReports.map((report) => (
          <div key={report.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Card Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    {getStatusIcon(report.status)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{report.medicationName}</h3>
                    <p className="text-gray-600 text-sm">{report.dosage} - {report.frequency}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(report.status)}`}>
                  {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Prescribed By</p>
                  <p className="text-sm text-gray-600 flex items-center mt-1">
                    <User className="h-4 w-4 mr-1" />
                    {report.prescribedBy}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Duration</p>
                  <p className="text-sm text-gray-600 flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    {report.duration}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Prescribed Date</p>
                  <p className="text-sm text-gray-600">{report.prescribedDate}</p>
                </div>
                {report.dispensedDate && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Dispensed Date</p>
                    <p className="text-sm text-gray-600">{report.dispensedDate}</p>
                  </div>
                )}
              </div>

              {report.status === 'active' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-800">Refills Remaining</span>
                    <span className="text-sm font-bold text-green-600">{report.refillsRemaining}</span>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm font-medium text-gray-700 mb-1">Instructions</p>
                <p className="text-sm text-gray-600">{report.instructions}</p>
              </div>
            </div>

            {/* Card Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">ID: {report.prescriptionId}</span>
                {report.status === 'active' && report.refillsRemaining > 0 && (
                  <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                    Request Refill
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredReports.length === 0 && (
          <div className="col-span-2 bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center">
            <Pill className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Prescriptions Found</h3>
            <p className="text-gray-600">
              {filterStatus === 'all' 
                ? 'You don\'t have any prescriptions yet.'
                : `No prescriptions with status "${filterStatus}" found.`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
