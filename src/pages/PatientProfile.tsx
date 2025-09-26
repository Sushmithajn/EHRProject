import React, { useState } from 'react';
import { Patient } from '../context/HealthcareContext';
import {Mail, Phone, Droplet, AlertTriangle, Edit3, Save, X, UserCircle } from 'lucide-react';


interface PatientProfileProps {
  patient: Patient;
  onUpdateProfile: (updatedPatient: Patient) => void;
}

export const PatientProfile: React.FC<PatientProfileProps> = ({ patient, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPatient, setEditedPatient] = useState<PatientProfileProps['patient']>({
    ...patient,
    allergies: patient.allergies || [],
    emergencyContact: patient.emergencyContact || { fullName: '', phone: '', relationship: '' }
  });

  const handleSave = () => {
    onUpdateProfile(editedPatient);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedPatient({
      ...patient,
      allergies: patient.allergies || [],
      emergencyContact: patient.emergencyContact || { fullName: '', phone: '', relationship: '' }
    });
    setIsEditing(false);
  };

  const handleAllergyChange = (index: number, value: string) => {
    const newAllergies = [...(editedPatient.allergies || [])];
    newAllergies[index] = value;
    setEditedPatient({ ...editedPatient, allergies: newAllergies });
  };

  const addAllergy = () => {
    setEditedPatient({
      ...editedPatient,
      allergies: [...(editedPatient.allergies || []), '']
    });
  };

  const removeAllergy = (index: number) => {
    const newAllergies = (editedPatient.allergies || []).filter((_, i) => i !== index);
    setEditedPatient({ ...editedPatient, allergies: newAllergies });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Patient Profile</h2>
          <p className="text-gray-600 mt-1">Manage your personal and medical information</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <Edit3 className="h-4 w-4" />
            <span>Edit Profile</span>
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture and Basic Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="text-center mb-6">
              <div className="bg-blue-100 rounded-full p-6 w-24 h-24 mx-auto mb-4">
                <UserCircle className="h-12 w-12 text-blue-600 mx-auto" />
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={editedPatient.fullName}
                  onChange={(e) => setEditedPatient({ ...editedPatient, fullName: e.target.value })}
                  className="text-xl font-bold text-gray-900 text-center w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              ) : (
                <h3 className="text-xl font-bold text-gray-900">{patient.fullName}</h3>
              )}
              <p className="text-gray-600">Patient ID: {patient.patientId}</p>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Droplet className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Blood Type</span>
                </div>
                {isEditing ? (
                  <select
                    value={editedPatient.bloodType || ''}
                    onChange={(e) => setEditedPatient({ ...editedPatient, bloodType: e.target.value })}
                    className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="">Select Blood Type</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                ) : (
                  <p className="text-lg font-bold text-blue-600 mt-1">{patient.bloodType || 'N/A'}</p>
                )}
              </div>

              <div className="bg-orange-50 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-gray-700">Allergies</span>
                </div>
                {isEditing ? (
                  <div className="mt-2 space-y-2">
                    {(editedPatient.allergies || []).map((allergy, index) => (
                      <div key={index} className="flex space-x-2">
                        <input
                          type="text"
                          value={allergy}
                          onChange={(e) => handleAllergyChange(index, e.target.value)}
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-1 text-sm"
                          placeholder="Enter allergy"
                        />
                        <button
                          onClick={() => removeAllergy(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addAllergy}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      + Add Allergy
                    </button>
                  </div>
                ) : (
                  <div className="mt-1">
                    {patient.allergies && patient.allergies.length > 0 ? (
                      patient.allergies.map((allergy, index) => (
                        <span key={index} className="inline-block bg-orange-200 text-orange-800 text-xs px-2 py-1 rounded-full mr-1 mb-1">
                          {allergy}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-gray-600">No known allergies</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="h-4 w-4 inline mr-1" />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedPatient.email || ''}
                    onChange={(e) => setEditedPatient({ ...editedPatient, email: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                ) : (
                  <p className="text-gray-900">{patient.email || 'N/A'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="h-4 w-4 inline mr-1" />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editedPatient.phoneNumber || ''}
                    onChange={(e) => setEditedPatient({ ...editedPatient, phoneNumber: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                ) : (
                  <p className="text-gray-900">{patient.phoneNumber || 'N/A'}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
