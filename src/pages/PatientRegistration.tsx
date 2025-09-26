import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, Calendar, CameraIcon, Upload, CreditCard, MapPin } from 'lucide-react';
import { useHealthcare } from '../context/HealthcareContext';

const API_URL = import.meta.env.VITE_API_URL;

const PatientRegistration = () => {
  const navigate = useNavigate();
  const { dispatch } = useHealthcare();
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    phoneNumber: '',
    sex: '',
    fatherMotherName: '',
    husbandWifeName: '',
    panCard: '',
    aadharCard: '',
    rationCard: '',
    address: '',
    password: '',          // ✅ NEW
    confirmPassword: ''
  });
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isVerified, setIsVerified] = useState(false);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhoto(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // In a real implementation, you would show a camera interface
      alert('Camera functionality would open here. For demo purposes, please use file upload.');
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      alert('Camera access denied. Please use file upload instead.');
    }
  };

  const sendOTP = async () => {
  try {
    const res = await fetch(`${API_URL}/send-phone-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: formData.phoneNumber }),
    });
    const data = await res.json();
    if (res.ok) {
      setOtpSent(true);
      alert(data.message);
    } else {
      alert(data.message);
    }
  } catch (err) {
    alert('Error sending OTP');
  }
};

const verifyOTP = async () => {
  try {
    const res = await fetch(`${API_URL}/verify-phone-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: formData.phoneNumber, otp }),
    });
    const data = await res.json();
    if (data.verified) {
      setIsVerified(true);
      alert('Phone number verified successfully!');
    } else {
      alert('Invalid OTP');
    }
  } catch (err) {
    alert('Error verifying OTP');
  }
};



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isVerified) {
      alert('Please verify your phone number first.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/register-patient`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          password: formData.password, 
          photo, // base64 image or URL
          registrationDate: new Date().toISOString()
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert(
          `✅ Patient registration successful! Your Patient ID: ${data.patientId} SMS sent to: ${formData.phoneNumber} Please save your Patient ID for future reference.`
        );

        navigate('/');
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="mr-4 p-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Patient Registration
            </h1>
            <p className="text-gray-600 mt-1">Register new patient details</p>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information Section */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b">
                Personal Information
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline w-4 h-4 mr-2" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={(e) => {
                      if (/^[a-zA-Z\s]*$/.test(e.target.value)) handleInputChange(e);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                {/* Date of Birth */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline w-4 h-4 mr-2" />
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>

                {/* Sex */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender *
                  </label>
                  <select
                    name="sex"
                    value={formData.sex}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Phone Number with OTP */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="inline w-4 h-4 mr-2" />
                    Phone Number *
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => {
                        if (/^\d{0,10}$/.test(e.target.value)) handleInputChange(e);
                      }}
                pattern="\d{10}"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter 10-digit number"
                      maxLength={10}
                      required
                    />
                    <button
                      type="button"
                      onClick={sendOTP}
                      disabled={formData.phoneNumber.length !== 10 || otpSent}
                      className="px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-400 transition-all duration-300"
                    >
                      {otpSent ? 'Sent' : 'Send OTP'}
                    </button>
                  </div>
                  
                  {otpSent && !isVerified && (
                    <div className="flex space-x-2 mt-2">
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Enter OTP"
                        maxLength={6}
                      />
                      <button
                        type="button"
                        onClick={verifyOTP}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
                      >
                        Verify
                      </button>
                    </div>
                  )}
                  
                  {isVerified && (
                    <p className="text-green-600 text-sm mt-1">✓ Phone number verified</p>
                  )}
                </div>
              </div>
            </div>

            {/* Family Information Section */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b">
                Family Information (Optional)
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Father/Mother Name
                  </label>
                  <input
                    type="text"
                    name="fatherMotherName"
                    value={formData.fatherMotherName}
                    onChange={(e) => {
                      if (/^[a-zA-Z\s]*$/.test(e.target.value)) handleInputChange(e);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter father/mother name"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Husband/Wife Name
                  </label>
                  <input
                    type="text"
                    name="husbandWifeName"
                    value={formData.husbandWifeName}
                    onChange={(e) => {
                      if (/^[a-zA-Z\s]*$/.test(e.target.value)) handleInputChange(e);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter husband/wife name"
                  />
                </div>
              </div>
            </div>

            {/* Document Information Section */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b">
                Document Information
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <CreditCard className="inline w-4 h-4 mr-2" />
                    PAN Card Number *
                  </label>
                  <input
                    type="text"
                    name="panCard"
                    value={formData.panCard}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter PAN card number"
                    pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                    required
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <CreditCard className="inline w-4 h-4 mr-2" />
                    Aadhar Card Number *
                  </label>
                  <input
                    type="text"
                    name="aadharCard"
                    value={formData.aadharCard}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter Aadhar card number"
                    pattern="[0-9]{12}"
                    maxLength={12}
                    required
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ration Card Number (For BPL)
                  </label>
                  <input
                    type="text"
                    name="rationCard"
                    value={formData.rationCard}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter ration card number"
                  />
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b">
                Address Information
              </h3>
              
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline w-4 h-4 mr-2" />
                  Complete Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter complete address"
                  required
                />
              </div>
            </div>

            {/* Account Credentials Section */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b">
                Account Credentials
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                    </label>
                    <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Set a password"
                    minLength={6}
                    required
                  />
                  
                </div>

    <div className="group">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Confirm Password *
      </label>
      <input
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleInputChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        placeholder="Re-enter password"
        minLength={6}
        required
      />
    </div>
  </div>
</div>


            {/* Photo Upload Section */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b">
                Passport-size Photo
              </h3>
              
              <div className="flex items-center space-x-4">
                {photo && (
                  <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-300">
                    <img src={photo} alt="Patient" className="w-full h-full object-cover" />
                  </div>
                )}
                
                <div className="flex space-x-4">
                  <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                  
                  <button
                    type="button"
                    onClick={handleCameraCapture}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-300 flex items-center"
                  >
                    <CameraIcon className="w-4 h-4 mr-2" />
                    Take Photo
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-orange-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Register Patient
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientRegistration;