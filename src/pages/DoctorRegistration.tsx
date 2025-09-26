import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserCheck, Mail, Phone, Building,
  CreditCard, User, CheckCircle, Stethoscope
} from 'lucide-react';
import { useHealthcare } from '../context/HealthcareContext';

const API_URL = import.meta.env.VITE_API_URL;


const DoctorRegistration = () => {
  const navigate = useNavigate();
  const { dispatch } = useHealthcare();

  const [formData, setFormData] = useState({
    kgId: '',
    mbbsCertId: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    phcName: '',
    department: '',
    password: ''
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [step, setStep] = useState(1);
  const [otpSent, setOtpSent] = useState(false);

  const phcOptions = [
    'Taluk Hospital - Bangalore Urban',
    'District Hospital - Bangalore Rural',
    'Taluk Hospital - Mysore',
    'District Hospital - Mandya',
    'Taluk Hospital - Hassan',
    'District Hospital - Tumkur'
  ];

  const departmentOptions = [
    'General Medicine', 'Pediatrics', 'Gynecology', 'Surgery',
    'Orthopedics', 'Cardiology', 'Dermatology', 'ENT',
    'Ophthalmology', 'Psychiatry'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const sendOtpToEmail = async () => {
  try {
    const response = await fetch(`${API_URL}/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: formData.email }),
    });

    const data = await response.json();

    if (response.ok) {
      setOtpSent(true);
      console.log(data.message);
    } else {
      alert(data.message || 'Failed to send OTP');
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
    alert('An error occurred while sending the OTP');
  }
};

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (formData.password !== confirmPassword) {
    alert('Passwords do not match.');
    return;
  }

  // Step 1: Check if email is already registered
  try {
    const response = await fetch(`${API_URL}/check-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: formData.email }),
    });

    const data = await response.json();

    if (response.ok && data.exists) {
      alert('Account already exists. Please login.');
      return;
    }
  } catch (error) {
    console.error('Error checking email:', error);
    alert('An error occurred while checking email');
    return;
  }

  // Step 2: Send OTP if email is not registered
  await sendOtpToEmail();
  setStep(2);
};


  const handleOtpSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await fetch(`${API_URL}/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.email,
        otp: otp,
        doctorData: formData // ✅ Send full form data to backend
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Doctor registration successful!');
      navigate('/dashboard');
    } else {
      alert(data.message || 'Invalid OTP. Please try again.');
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    alert('An error occurred during OTP verification');
  }
};



  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center">
        <div className="bg-green-600 p-3 rounded-lg mr-4">
          <Stethoscope className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Doctor Registration</h1>
          <p className="text-gray-600 mt-1">Register as a healthcare professional</p>
        </div>
      </div>

      {/* Step 1: Registration Form */}
      {step === 1 && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {[
            { label: 'KG ID', icon: <CreditCard />, name: 'kgId', type: 'text', placeholder: 'Enter your KG ID' },
            { label: 'MBBS Certificate ID', icon: <UserCheck />, name: 'mbbsCertId', type: 'text', placeholder: 'Enter MBBS Certificate ID' },
            {
              label: 'Full Name', icon: <User />, name: 'fullName', type: 'text',
              placeholder: 'Enter your full name', onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                if (/^[a-zA-Z\s]*$/.test(e.target.value)) handleInputChange(e);
              }
            }
          ].map(({ label, icon, name, type, placeholder, onChange }) => (
            <div className="group" key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {icon} {label}
              </label>
              <input
                type={type}
                name={name}
                value={(formData as any)[name]}
                onChange={onChange || handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                placeholder={placeholder}
              />
            </div>
          ))}

          {/* Email and Phone */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2"><Mail className="inline w-4 h-4 mr-2" />Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                placeholder="Enter email address"
              />
            </div>
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2"><Phone className="inline w-4 h-4 mr-2" />Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => {
                  if (/^\d{0,10}$/.test(e.target.value)) handleInputChange(e);
                }}
                pattern="\d{10}"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                placeholder="Enter 10-digit phone"
              />
            </div>
          </div>

          {/* PHC Name & Department */}
          {[
            { label: 'PHC Name', name: 'phcName', options: phcOptions },
            { label: 'Department', name: 'department', options: departmentOptions }
          ].map(({ label, name, options }) => (
            <div className="group" key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {name === 'phcName' && <Building className="inline w-4 h-4 mr-2" />}
                {label}
              </label>
              <select
                name={name}
                value={(formData as any)[name]}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="">Select {label}</option>
                {options.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          ))}

          {/* Password Fields */}
          <div className="group">
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              placeholder="Enter password"
            />
          </div>
          <div className="group">
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              placeholder="Re-enter password"
            />
          </div>

          <button type="submit" className="bg-blue-600 text-white w-full py-3 rounded-lg font-semibold">
            Submit & Verify Email
          </button>
        </form>
      )}

      {/* Step 2: OTP Verification */}
      {step === 2 && (
        <form onSubmit={handleOtpSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center text-green-600 font-semibold">
            {otpSent && <p>OTP has been sent to your email!</p>}
          </div>

          <div className="group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <CheckCircle className="inline w-4 h-4 mr-2" />
              Enter 4-digit OTP
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => {
                if (/^\d{0,4}$/.test(e.target.value)) setOtp(e.target.value);
              }}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              placeholder="Enter OTP sent to your email"
            />
          </div>

          <button type="submit" className="bg-green-600 text-white w-full py-3 rounded-lg font-semibold">
            Confirm & Complete Registration
          </button>

          <button
            type="button"
            onClick={sendOtpToEmail}
            className="w-full py-2 text-blue-600 hover:underline"
          >
            Resend OTP
          </button>
        </form>
      )}
    </div>
  );
};

export default DoctorRegistration;
