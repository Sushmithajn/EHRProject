import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Download, History, User, Calendar, Phone, CreditCard, MapPin, FileText } from 'lucide-react';
import { useHealthcare } from '../context/HealthcareContext';

const API_URL = import.meta.env.VITE_API_URL;

const PatientDetails = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const { state } = useHealthcare();

  const patient = state.patients.find(p => p.patientId === patientId);
  const patientHistory = state.prescriptions.filter(p => p.patientId === patientId);

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Patient Not Found</h2>
          <button
            onClick={() => navigate('/doctor-dashboard')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleDocumentDownload = (docType: string) => {
    // In real implementation, this would download the actual document
    alert(`Downloading ${docType} for ${patient.fullName}. In production, this would download the actual document file.`);
  };

  const handleHistoryView = () => {
    if (patientHistory.length === 0) {
      alert('No previous medical history found for this patient.');
    } else {
      alert(`Found ${patientHistory.length} previous visit(s). In production, this would show detailed history.`);
    }
  };

  const handleProceedToObservation = () => {
    navigate(`/observation-prescription/${patientId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/doctor-dashboard')}
            className="mr-4 p-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Patient Details</h1>
            <p className="text-gray-600 mt-1">Complete patient information and medical records</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Patient Information Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-start space-x-6 mb-8">
                {/* Patient Photo */}
                <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-gray-200 flex-shrink-0">
                  {patient.photo ? (
                    <img src={patient.photo} alt="Patient" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <User className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Basic Info */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{patient.fullName}</h2>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-gray-700">Patient ID: {patient.patientId}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-gray-700">Age: {calculateAge(patient.dateOfBirth)} years</span>
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-gray-700">Sex: {patient.sex}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-gray-700">{patient.phoneNumber}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Address</h3>
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                    <p className="text-gray-700">{patient.address}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Family Information</h3>
                    <div className="space-y-2 text-sm">
                      {patient.fatherMotherName && (
                        <p><span className="text-gray-500">Father/Mother:</span> {patient.fatherMotherName}</p>
                      )}
                      {patient.husbandWifeName && (
                        <p><span className="text-gray-500">Spouse:</span> {patient.husbandWifeName}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Document Numbers</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <CreditCard className="w-4 h-4 text-gray-500 mr-2" />
                        <span>PAN: {patient.panCard}</span>
                      </div>
                      <div className="flex items-center">
                        <CreditCard className="w-4 h-4 text-gray-500 mr-2" />
                        <span>Aadhar: {patient.aadharCard}</span>
                      </div>
                      {patient.rationCard && (
                        <div className="flex items-center">
                          <CreditCard className="w-4 h-4 text-gray-500 mr-2" />
                          <span>Ration: {patient.rationCard}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions Panel */}
          <div className="space-y-6">
            {/* Document Downloads */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Download className="w-5 h-5 mr-2" />
                Download Documents
              </h3>
              <div className="space-y-3">
                {['Aadhar Card', 'PAN Card', 'SSLC Marks Card', 'Ration Card'].map((doc) => (
                  <button
                    key={doc}
                    onClick={() => handleDocumentDownload(doc)}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 flex items-center"
                  >
                    <FileText className="w-4 h-4 text-gray-500 mr-3" />
                    <span className="text-gray-700">{doc}</span>
                    <Download className="w-4 h-4 text-gray-400 ml-auto" />
                  </button>
                ))}
              </div>
            </div>

            {/* History & Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleHistoryView}
                  className="w-full flex items-center p-3 rounded-lg bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-all duration-300"
                >
                  <History className="w-5 h-5 text-blue-600 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-blue-800">View History</p>
                    <p className="text-sm text-blue-600">{patientHistory.length} previous visits</p>
                  </div>
                </button>

                <button
                  onClick={handleProceedToObservation}
                  className="w-full flex items-center p-4 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
                >
                  <FileText className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <p className="font-semibold">Start Consultation</p>
                    <p className="text-sm text-green-100">Proceed to observation & prescription</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Registration Info */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Registration Info</h3>
              <div className="text-sm text-gray-600">
                <p>Registered: {new Date(patient.registrationDate).toLocaleDateString()}</p>
                <p>Last Updated: {new Date(patient.registrationDate).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;