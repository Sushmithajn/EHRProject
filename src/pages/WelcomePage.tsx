import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, UserPlus, LogIn, Clipboard, Users } from 'lucide-react';

const WelcomePage = () => {
  const navigate = useNavigate();

  const navigationOptions = [
    {
      title: 'Doctor Registration',
      description: 'Register as a healthcare professional',
      icon: UserPlus,
      path: '/doctor-registration',
      color: 'bg-blue-600 hover:bg-blue-700',
      delay: 'delay-100'
    },
    {
      title: 'Doctor Login',
      description: 'Access your medical dashboard',
      icon: LogIn,
      path: '/doctor-login',
      color: 'bg-green-600 hover:bg-green-700',
      delay: 'delay-200'
    },
    {
      title: 'OPD Registration',
      description: 'Register for outpatient services',
      icon: Clipboard,
      path: '/opd',
      color: 'bg-purple-600 hover:bg-purple-700',
      delay: 'delay-300'
    },
    {
      title: 'Patient Registration',
      description: 'Register new patient details',
      icon: Users,
      path: '/patient-registration',
      color: 'bg-orange-600 hover:bg-orange-700',
      delay: 'delay-400'
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-6xl w-full">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 p-6 rounded-full shadow-2xl animate-pulse">
              <Heart className="w-16 h-16 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4 animate-slide-up">
            Healthcare Management System
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-slide-up delay-100">
            Streamlining healthcare services with digital innovation for better patient care and efficient medical practice management.
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {navigationOptions.map((option, index) => {
            const IconComponent = option.icon;
            return (
              <div
                key={option.title}
                className={`group cursor-pointer transform transition-all duration-500 hover:scale-105 animate-slide-up ${option.delay}`}
                onClick={() => navigate(option.path)}
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100">
                  <div className={`${option.color} p-4 rounded-xl mb-6 inline-block transition-all duration-300 group-hover:scale-110`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    {option.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {option.description}
                  </p>
                  <div className="mt-6 flex items-center text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-2">
                    <span className="mr-2">Get Started</span>
                    <div className="w-4 h-0.5 bg-blue-600"></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 animate-fade-in delay-500">
          <p className="text-gray-500">
            Empowering healthcare professionals with modern technology solutions
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;