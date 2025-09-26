import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useHealthcare } from '../context/HealthcareContext';
import PatientDashboard from './PatientDashboard';

const PatientDashboardWrapper: React.FC = () => {
  const { state } = useHealthcare();
  const { currentPatient, investigationReports, pharmacyReports } = state;
  const navigate = useNavigate();

  if (!currentPatient) {
    return <p className="text-center p-6">Loading patient data...</p>;
  }

  return (
    <PatientDashboard
      patient={currentPatient}
      investigationReports={investigationReports}
      pharmacyReports={pharmacyReports}
      onNavigate={(page) => navigate(page)}
    />
  );
};

export default PatientDashboardWrapper;
