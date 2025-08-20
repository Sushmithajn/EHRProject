import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Clock, Calendar, MapPin } from 'lucide-react';
import { useHealthcare } from '../context/HealthcareContext';
import axios from 'axios';
import { v4 as uuid } from 'uuid'; // ✅ Added UUID
import { Patient } from '../context/HealthcareContext'; // ✅ Import Patient interface

const API_URL = import.meta.env.VITE_API_URL;

const OPDForm = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useHealthcare();
  const [patientId, setPatientId] = useState('');
  const [department, setDepartment] = useState('');
  const [patientDetails, setPatientDetails] = useState<Patient | null>(null);
  const [error, setError] = useState('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]); // YYYY-MM-DD
  const [timeSlot, setTimeSlot] = useState('');
  const [takenSlots, setTakenSlots] = useState<string[]>([]);
  const [loadingTaken, setLoadingTaken] = useState(false);

  const departments = [
    'General Medicine', 'Pediatrics', 'Gynecology', 'Surgery', 'Orthopedics',
    'Cardiology', 'Dermatology', 'ENT', 'Ophthalmology', 'Psychiatry'
  ];

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  // Fetch patient by ID
  const fetchPatientDetails = async () => {
    if (!patientId.trim()) {
      setError('Please enter Patient ID');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/patient/${patientId.trim()}`);
      if (!response.ok) throw new Error('Patient not found');

      const data = await response.json();
      setPatientDetails(data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Patient not found. Please check the Patient ID.');
      setPatientDetails(null);
    }
  };

  // Fetch taken slots when date or department changes
  useEffect(() => {
    const fetchTaken = async () => {
      if (!department || !date) {
        setTakenSlots([]);
        return;
      }
      setLoadingTaken(true);
      try {
        const resp = await axios.get(`${API_URL}/api/opd`, {
          params: { date, department }
        });
        const slots: string[] = resp.data
          .map((o: any) => o.timeSlot)
          .filter(Boolean);
        setTakenSlots(slots);
        if (slots.includes(timeSlot)) {
          setTimeSlot(''); // reset if current selection became invalid
        }
      } catch (err) {
        console.error('Error fetching taken slots:', err);
        setTakenSlots([]);
      } finally {
        setLoadingTaken(false);
      }
    };
    fetchTaken();
  }, [date, department]);

  const generateOPDNumber = () => 'OPD' + Date.now().toString().slice(-6);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientDetails) {
      setError('Please fetch patient details first');
      return;
    }

    if (!department) {
      setError('Please select a department');
      return;
    }

    if (!timeSlot) {
      setError('Please select a time slot');
      return;
    }

    const opdNumber = generateOPDNumber();
    const currentDate = date; // chosen date

    const opdEntry = {
      id: uuid(),
      patientId: patientDetails.patientId,
      patientName: patientDetails.fullName,
      Address: patientDetails.address,
      patientPhone: patientDetails.phoneNumber,
      sex: patientDetails.sex,
      opdNumber,
      department,
      timeSlot,
      date: currentDate,
      status: 'waiting' as const
    };

    try {
      await axios.post(`${API_URL}/api/opd`, opdEntry);
      dispatch({ type: 'ADD_OPD_ENTRY', payload: opdEntry });

      alert(`OPD Registration Successful!

OPD Number: ${opdNumber}
Patient: ${patientDetails.fullName}
Department: ${department}
Time Slot: ${timeSlot}
Date: ${new Date(currentDate).toLocaleDateString()}

Please arrive 15 minutes before your scheduled time.`);

      navigate('/');
    } catch (err: any) {
      console.error('Failed to save OPD entry:', err);
      if (err.response?.status === 409) {
        setError(err.response.data.message || 'Selected slot already booked');
      } else {
        setError('Failed to save OPD data. Please try again.');
      }
    }
  };

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

  // Derive slot options with disabled state
  const slotOptions = timeSlots.map(slot => ({
    slot,
    disabled: takenSlots.includes(slot)
  }));

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="mr-4 p-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">OPD Registration</h1>
            <p className="text-gray-600 mt-1">Register for outpatient services</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Patient ID */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b">
                Patient Information
              </h3>

              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline w-4 h-4 mr-2" />
                    Patient ID *
                  </label>
                  <input
                    type="text"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter Patient ID (e.g., PT123456)"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={fetchPatientDetails}
                  className="mt-10 px-2 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Fetch Details
                </button>
              </div>

              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
            </div>

            {/* Patient Info Display */}
            {patientDetails && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Patient Details</h4>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-4">
                    {patientDetails.photo && (
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300">
                        <img src={patientDetails.photo} alt="Patient" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-800">{patientDetails.fullName}</p>
                      <p className="text-gray-600 text-sm">ID: {patientDetails.patientId}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-gray-700">Age: {calculateAge(patientDetails.dateOfBirth)} years</span>
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-gray-700">Sex: {patientDetails.sex}</span>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 text-gray-500 mr-2 mt-1" />
                      <span className="text-gray-700 text-sm">{patientDetails.address}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Department Selection */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b">
                Treatment Department
              </h3>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Department *
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="">Choose treatment department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Date & Time Slot Selection */}
            <div className="bg-blue-50 rounded-lg p-6 space-y-4">
              <div className="flex items-center mb-2">
                <Clock className="w-5 h-5 text-blue-600 mr-2" />
                <h4 className="text-lg font-semibold text-blue-800">Appointment Information</h4>
              </div>

              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    Select Date *
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    Select Time Slot *
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg"
                    required
                    disabled={!department || !date || loadingTaken}
                  >
                    <option value="">Choose time slot</option>
                    {slotOptions.map(({ slot, disabled }) => (
                      <option key={slot} value={slot} disabled={disabled}>
                        {slot} {disabled ? '(Taken)' : ''}
                      </option>
                    ))}
                  </select>
                  {loadingTaken && <p className="text-xs text-gray-600 mt-1">Loading booked slots...</p>}
                  {!loadingTaken && takenSlots.length > 0 && (
                    <p className="text-xs text-red-600 mt-1">
                      Taken for {date} in {department}: {takenSlots.join(', ')}
                    </p>
                  )}
                </div>
              </div>

              <p className="text-blue-600 text-sm mt-2">
                Please select preferred date and time slot. Already booked slots are disabled.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!patientDetails}
              className="w-full bg-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-400"
            >
              Generate OPD Number & Time Slot
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OPDForm;
