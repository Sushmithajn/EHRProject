
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HealthcareProvider } from './context/HealthcareContext';
import HomePage from './pages/HomePage';
import MainDashboard from './pages/MainDashboard';
import DoctorLogin from './pages/DoctorLogin';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDetails from './pages/PatientDetails';
import ObservationPrescription from './pages/ObservationPrescription';
import DoctorForgotPassword from './pages/DoctorForgotPassword';
import ResetPassword from "./pages/ResetPassword";






function App() {
  return (
    <HealthcareProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<MainDashboard />} />
            <Route path="/doctor-login" element={<DoctorLogin />} />
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            <Route path="/patient-details/:patientId" element={<PatientDetails />} />
            <Route path="/observation-prescription/:patientId" element={<ObservationPrescription />} />
            <Route path="/doctor-forgot-password" element={<DoctorForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
        </div>
      </Router>
    </HealthcareProvider>
  );
}

export default App;