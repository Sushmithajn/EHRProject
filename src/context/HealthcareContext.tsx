import React, { createContext, useContext, useReducer, useEffect } from 'react';

interface Doctor {
  id: string;
  kgId: string;
  mbbsCertId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  phcName: string;
  department: string;
  password: string;
}

export interface Patient {
  patientId: string;
  fullName: string;
  dateOfBirth: string;
  phoneNumber: string;
  sex: string;
  fatherMotherName?: string;
  husbandWifeName?: string;
  panCard: string;
  aadharCard: string;
  rationCard?: string;
  photo?: string;
  address: string;
  password: string;
  registrationDate: string;

  allergies?: string[];       // keep if you want to track allergies
  bloodType?: string;
  email?: string;
  emergencyContact?: { fullName: string; phone: string; relationship: string };
}



interface OPDEntry {
  id: string;
  patientId: string;
  patientName: string;
  Address: string;
  sex: string;
  opdNumber: string;
  department: string;
  timeSlot: string;
  date: string;
  status: 'waiting' | 'admitted' | 'completed';

}

interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  Address : string;
  date: string;
  observations: string;
  medications: Array<{
    drugName: string;
    dosage: string;
    duration: string;
  }>;
}

interface HealthcareState {
  currentDoctor: Doctor | null;
  doctors: Doctor[];
  patients: Patient[];
  opdQueue: OPDEntry[];
  prescriptions: Prescription[];
  currentPatient: Patient | null;
  investigationReports: InvestigationReport[];
  pharmacyReports: PharmacyReport[];
}

export interface InvestigationResult {
  parameter: string;
  value: string;
  normalRange: string;
  status: 'normal' | 'high' | 'low';
}

export interface InvestigationReport {
  id: string;
  patientId: string;
  type: string;
  date: string;
  doctor: string;                  // added
  status: 'pending' | 'completed' | 'review'; // match your filter
  results: InvestigationResult[];  // added for table
  notes?: string;                  // optional doctor's notes
}


export interface PharmacyReport {
  id: string;
  prescriptionId: string;
  patientId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  prescribedBy: string;
  prescribedDate: string;
  dispensedDate?: string;
  status: 'active' | 'completed' | 'cancelled' | 'pending';
  refillsRemaining: number;
  instructions?: string;
}



type HealthcareAction = 
  | { type: 'SET_CURRENT_DOCTOR'; payload: Doctor }
  | { type: 'LOGOUT_DOCTOR' }
  | { type: 'ADD_DOCTOR'; payload: Doctor }
  | { type: 'ADD_PATIENT'; payload: Patient }
  | { type: 'ADD_OPD_ENTRY'; payload: OPDEntry }
  | { type: 'UPDATE_OPD_STATUS'; payload: { id: string; status: 'waiting' | 'admitted' | 'completed' } }
  | { type: 'ADD_PRESCRIPTION'; payload: Prescription }
  | { type: 'LOAD_STATE'; payload: HealthcareState }
  | { type: "SET_PATIENTS"; payload: Patient[] }
  | { type: "SET_OPD_QUEUE"; payload: OPDEntry[] }
  | { type: 'SET_INVESTIGATION_REPORTS'; payload: InvestigationReport[] }
  | { type: 'SET_PHARMACY_REPORTS'; payload: PharmacyReport[] }
  | { type: 'SET_CURRENT_PATIENT'; payload: Patient }

  

const initialState: HealthcareState = {
  currentDoctor: null,
  doctors: [],
  patients: [],
  opdQueue: [],
  prescriptions: [],
  currentPatient: null,               // added
  investigationReports: [],           // added
  pharmacyReports: []
};

const healthcareReducer = (state: HealthcareState, action: HealthcareAction): HealthcareState => {
  switch (action.type) {
    case 'SET_CURRENT_DOCTOR':
      return { ...state, currentDoctor: action.payload };

    case 'LOGOUT_DOCTOR':
      return { ...state, currentDoctor: null };

    case 'ADD_DOCTOR':
      return { ...state, doctors: [...state.doctors, action.payload] };

    case 'ADD_PATIENT':
      return { 
        ...state, 
        patients: [...state.patients, action.payload],
        currentPatient: action.payload,
      };

    case 'SET_PATIENTS':
      return { ...state, patients: action.payload };

    case 'ADD_OPD_ENTRY':
      return { ...state, opdQueue: [...state.opdQueue, action.payload] };

    case 'SET_OPD_QUEUE':
      return { ...state, opdQueue: action.payload };

    case 'UPDATE_OPD_STATUS':
      return {
        ...state,
        opdQueue: state.opdQueue.map(entry =>
          entry.id === action.payload.id ? { ...entry, status: action.payload.status } : entry
        )
      };

    case 'ADD_PRESCRIPTION':
      return { ...state, prescriptions: [...state.prescriptions, action.payload] };

    case 'LOAD_STATE':
      return action.payload;

    case 'SET_INVESTIGATION_REPORTS':
      return { ...state, investigationReports: action.payload };
      
    case 'SET_PHARMACY_REPORTS':
      return { ...state, pharmacyReports: action.payload };

    case 'SET_CURRENT_PATIENT':
      return { ...state, currentPatient: action.payload };

    default:
      return state;
  }
};



const HealthcareContext = createContext<{
  state: HealthcareState;
  dispatch: React.Dispatch<HealthcareAction>;
} | null>(null);

export const HealthcareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(healthcareReducer, initialState);

  useEffect(() => {
    const savedState = localStorage.getItem('healthcareState');
    if (savedState) {
      dispatch({ type: 'LOAD_STATE', payload: JSON.parse(savedState) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('healthcareState', JSON.stringify(state));
  }, [state]);

  return (
    <HealthcareContext.Provider value={{ state, dispatch }}>
      {children}
    </HealthcareContext.Provider>
  );
};

export const useHealthcare = () => {
  const context = useContext(HealthcareContext);
  if (!context) {
    throw new Error('useHealthcare must be used within a HealthcareProvider');
  }
  return context;
};