import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowRight, Shield, Users, Clock, Award } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Users,
      title: 'Patient Management',
      description: 'Comprehensive patient registration and record management'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'HIPAA compliant with advanced security measures'
    },
    {
      icon: Clock,
      title: 'Efficient Workflow',
      description: 'Streamlined processes for faster patient care'
    },
    {
      icon: Award,
      title: 'Professional Grade',
      description: 'Built for healthcare professionals by experts'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32">
          <div className="text-center animate-fade-in">
            <div className="flex justify-center mb-8">
              <div className="bg-white bg-opacity-20 p-6 rounded-full shadow-2xl animate-pulse">
                <Heart className="w-20 h-20 text-white" />
              </div>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 animate-slide-up">
              EHR
              <span className="block text-blue-200">Management System</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-12 animate-slide-up delay-200">
              Revolutionizing healthcare delivery with cutting-edge digital solutions for seamless patient care and efficient medical practice management.
            </p>
            
            <button
              onClick={() => navigate('/dashboard')}
              className="group bg-white text-blue-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-2xl animate-slide-up delay-300"
            >
              <span className="flex items-center">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </button>
          </div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-blue-300 bg-opacity-20 rounded-full animate-bounce delay-2000"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white bg-opacity-15 rounded-full animate-bounce delay-3000"></div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our System?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built with modern technology and designed specifically for healthcare professionals
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={feature.title}
                  className={`text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 animate-slide-up delay-${(index + 1) * 100}`}
                >
                  <div className="bg-blue-600 p-4 rounded-xl mb-6 inline-block">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Healthcare Practice?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of healthcare professionals who trust our system for their daily operations.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-2xl"
          >
            Access Dashboard
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <Heart className="w-8 h-8 text-blue-400" />
          </div>
          <p className="text-gray-400">
            © 2025 Healthcare Management System. Empowering healthcare with technology.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;