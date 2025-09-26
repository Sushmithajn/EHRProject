import React, { useState } from 'react';
import { InvestigationReport } from '../context/HealthcareContext';
import { FileText, Calendar, User, ChevronDown, ChevronUp, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface InvestigationReportsProps {
  reports: InvestigationReport[];
}

export const InvestigationReports: React.FC<InvestigationReportsProps> = ({ reports }) => {
  const [expandedReport, setExpandedReport] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredReports = reports.filter(report => 
    filterStatus === 'all' || report.status === filterStatus
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal':
        return <Minus className="h-4 w-4 text-green-500" />;
      case 'high':
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'low':
        return <TrendingDown className="h-4 w-4 text-blue-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'review':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getResultStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'text-green-600 bg-green-50';
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'low':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Investigation Reports</h2>
          <p className="text-gray-600 mt-1">View and track your medical test results</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Reports</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="review">Under Review</option>
          </select>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <div key={report.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Report Header */}
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{report.type}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{report.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{report.doctor}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                    {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                  </span>
                  <button
                    onClick={() => setExpandedReport(expandedReport === report.id ? null : report.id)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    {expandedReport === report.id ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedReport === report.id && (
              <div className="border-t border-gray-100">
                {/* Results Table */}
                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Test Results</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Parameter</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Value</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Normal Range</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.results.map((result, index) => (
                          <tr key={index} className="border-b border-gray-100">
                            <td className="py-3 px-4 text-gray-900">{result.parameter}</td>
                            <td className="py-3 px-4 font-medium text-gray-900">{result.value}</td>
                            <td className="py-3 px-4 text-gray-600">{result.normalRange}</td>
                            <td className="py-3 px-4">
                              <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getResultStatusColor(result.status)}`}>
                                {getStatusIcon(result.status)}
                                <span>{result.status.charAt(0).toUpperCase() + result.status.slice(1)}</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Notes */}
                {report.notes && (
                  <div className="p-6 bg-gray-50">
                    <h4 className="font-semibold text-gray-900 mb-2">Doctor's Notes</h4>
                    <p className="text-gray-700">{report.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {filteredReports.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Found</h3>
            <p className="text-gray-600">
              {filterStatus === 'all' 
                ? 'You don\'t have any investigation reports yet.'
                : `No reports with status "${filterStatus}" found.`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};