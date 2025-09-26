import React, { useState } from 'react';
import { User, Lock, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useHealthcare, Patient } from '../context/HealthcareContext';
import { useNavigate } from 'react-router-dom';
import { PatientDashboard } from './PatientDashboard';

export const PatientLogin: React.FC = () => {
  const { dispatch } = useHealthcare();
  const [patientId, setPatientId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Logging in with Patient ID:', patientId.trim());

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/patients/login`, {
        patientId: patientId.trim(),
        password
      });

      const { token, patient } = res.data;

      if (!token || !patient) throw new Error('Invalid response from server');

      // Save token in localStorage
      localStorage.setItem('patientToken', token);

      // ✅ Save patient in context
      dispatch({ type: 'SET_CURRENT_PATIENT', payload: patient as Patient });



      // Navigate to patient dashboard
      navigate('/patient-dashboard');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Invalid Patient ID or Password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <User className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Patient Portal</h2>
          <p className="text-gray-600">Access your medical records securely</p>
        </div>

        {/* Login Form */}
        <div className="bg-white shadow-xl rounded-2xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-2">
                Patient ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="patientId"
                  type="text"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your Patient ID"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 focus:ring-4 focus:ring-blue-200"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="#" className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
              Forgot your password?
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>© 2024 Medical Center. All rights reserved.</p>
          <p className="mt-1">Your health information is protected and secure.</p>
        </div>
      </div>
    </div>
  );
};

export default PatientLogin;
