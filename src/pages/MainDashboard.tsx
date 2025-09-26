import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  UserPlus, 
  LogIn, 
  Clipboard, 
  Users, 
  Menu, 
  X,
  Home,
  ArrowLeft,
  Stethoscope
} from 'lucide-react';
import DoctorRegistration from './DoctorRegistration';
import PatientRegistration from './PatientRegistration';
import OPDForm from './OPDForm';
import  PatientLogin from './PatientLogin';

const MainDashboard = () => {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false); // sidebar closed on mobile by default

  const modules = [
    {
      id: 'home',
      title: 'Dashboard Home',
      icon: Home,
      color: 'bg-blue-600 hover:bg-blue-700',
      description: 'Main dashboard overview'
    },
    {
      id: 'doctor-registration',
      title: 'Doctor Registration',
      icon:  Stethoscope,
      color: 'bg-green-600 hover:bg-green-700',
      description: 'Register healthcare professionals'
    },
    {
      id: 'doctor-login',
      title: 'Doctor Login',
      icon: LogIn,
      color: 'bg-green-600 hover:bg-green-700',
      description: 'Access medical dashboard'
    },
    {
      id: 'patient-registration',
      title: 'Patient Registration',
      icon: Users,
      color: 'bg-orange-600 hover:bg-orange-700',
      description: 'Register new patients'
    },
    {
      id: 'opd-form',
      title: 'OPD Registration',
      icon: Clipboard,
      color: 'bg-purple-600 hover:bg-purple-700',
      description: 'Outpatient department services'
    },
    {
      id: 'patient-login',
      title: 'Patient Login',
      icon: UserPlus,
      color: 'bg-orange-600 hover:bg-orange-700',
      description: 'Access medical dashboard'
    }
  ];

  const handleDoctorLogin = () => {
    navigate('/doctor-login');
  };

  const renderContent = () => {
    switch (activeModule) {
      case 'doctor-registration':
        return <DoctorRegistration />;
      case 'patient-registration':
        return <PatientRegistration />;
      case 'opd-form':
        return <OPDForm />;
      case 'doctor-login':
        handleDoctorLogin();
        return null;
      case 'patient-login' :
        return <PatientLogin />;
      default:
        return (
          <div className="p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
              {/* Welcome Header */}
              <div className="text-center mb-8 md:mb-12">
                <div className="flex justify-center mb-4 md:mb-6">
                  <div className="bg-blue-600 p-4 md:p-6 rounded-full shadow-2xl">
                    <Heart className="w-10 h-10 md:w-16 md:h-16 text-white" />
                  </div>
                </div>
                <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2 md:mb-4">
                  Healthcare Management Dashboard
                </h1>
                <p className="text-sm md:text-xl text-gray-600 max-w-2xl mx-auto">
                  Select a module to begin managing your healthcare operations
                </p>
              </div>

              {/* Module Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                {modules.filter(module => module.id !== 'home').map((module, index) => {
                  const IconComponent = module.icon;
                  return (
                  <div
                  key={module.id}
                  className="group cursor-pointer transform transition-all duration-500 hover:scale-105"
                  onClick={() => setActiveModule(module.id)}
                  >
                    <div className="bg-white h-15 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-3 md:p-4 border border-gray-100 text-center flex flex-col items-center justify-center">
                      <div className={`${module.color} p-2 rounded-lg mb-3 inline-block`}>
                        <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-white" />
                        </div>
                        <h3 className="text-sm md:text-lg font-semibold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors duration-300">
                          {module.title}
                          </h3>
                          <p className="text-xs md:text-sm text-gray-600 leading-snug">
                            {module.description}
                            </p>
                            </div>
                            </div>
                            );
                            })}
                            </div>


              {/* Quick Stats */}
              <div className="mt-10 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <div className="bg-white rounded-xl shadow-md p-4 md:p-6 text-center">
                  <div className="bg-blue-100 p-2 md:p-3 rounded-lg inline-block mb-2 md:mb-4">
                    <Users className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg md:text-2xl font-bold text-gray-800">24/7</h3>
                  <p className="text-xs md:text-gray-600">Available</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-4 md:p-6 text-center">
                  <div className="bg-green-100 p-2 md:p-3 rounded-lg inline-block mb-2 md:mb-4">
                    <Heart className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg md:text-2xl font-bold text-gray-800">100%</h3>
                  <p className="text-xs md:text-gray-600">Secure</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-4 md:p-6 text-center">
                  <div className="bg-purple-100 p-2 md:p-3 rounded-lg inline-block mb-2 md:mb-4">
                    <Clipboard className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg md:text-2xl font-bold text-gray-800">Fast</h3>
                  <p className="text-xs md:text-gray-600">Processing</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-4 md:p-6 text-center">
                  <div className="bg-orange-100 p-2 md:p-3 rounded-lg inline-block mb-2 md:mb-4">
                    <UserPlus className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
                  </div>
                  <h3 className="text-lg md:text-2xl font-bold text-gray-800">Easy</h3>
                  <p className="text-xs md:text-gray-600">To Use</p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex">
    {/* Sidebar */}
<div
  className={`${sidebarOpen ? 'w-64 md:w-80' : 'w-12'} 
              bg-white shadow-2xl transition-all duration-300 
              flex flex-col items-center`}
>
  {/* Sidebar Header */}
  <div className="p-3 flex items-center justify-between w-full">
    {sidebarOpen && (
      <div className="flex items-center">
        <div className="bg-blue-600 p-2 rounded-lg mr-3">
          <Heart className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800">Healthcare</h2>
          <p className="text-sm text-gray-600">Management</p>
        </div>
      </div>
    )}
    <button
      onClick={() => setSidebarOpen(!sidebarOpen)}
      className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
    >
      {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
    </button>
  </div>

  {/* Only show menu if open */}
  {sidebarOpen && (
    <>
      {/* Back to Home Button */}
      <div className="p-4 border-b border-gray-200 w-full">
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="ml-3">Back to Home</span>
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 w-full">
        <div className="space-y-2">
          {modules.map((module) => {
            const IconComponent = module.icon;
            const isActive = activeModule === module.id;

            return (
              <button
                key={module.id}
                onClick={() => setActiveModule(module.id)}
                className={`w-full flex items-center p-4 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <div className="ml-3 text-left">
                  <p className="font-medium">{module.title}</p>
                  <p className={`text-sm ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
                    {module.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-200 text-center text-sm text-gray-500 w-full">
        <p>Healthcare Management System</p>
      </div>
    </>
  )}
</div>


      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default MainDashboard;
