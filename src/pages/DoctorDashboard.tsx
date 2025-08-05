import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Clock, User, UserCheck } from 'lucide-react';
import { useHealthcare } from '../context/HealthcareContext';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useHealthcare();

  useEffect(() => {
    const fetchOPDDetails = async () => {
      try {
        // Fetch OPD details (with embedded patient info)
        const opdDetailsRes = await fetch('http://localhost:5000/opd-details');
        const opdDetailsDataRaw = await opdDetailsRes.json();

        // Normalize if needed (make sure each entry has an 'id' for React keys)
        const opdDetailsData = opdDetailsDataRaw.map((entry: any) => ({
          ...entry,
          id: entry._id,
        }));

        dispatch({ type: 'SET_OPD_QUEUE', payload: opdDetailsData });
      } catch (err) {
        console.error("Failed to fetch OPD details", err);
      }
    };

    fetchOPDDetails();
  }, [dispatch]);

  if (!state.currentDoctor) return null;

  // Filter OPD entries for current doctor's department and waiting status
  const doctorQueue = state.opdQueue.filter(
    (entry) =>
      entry.status === 'waiting' &&
      entry.department === state.currentDoctor?.department
  );

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT_DOCTOR' });
    navigate('/');
  };

  const handleAdmitPatient = (patientId: string, opdId: string) => {
    dispatch({ type: 'UPDATE_OPD_STATUS', payload: { id: opdId, status: 'admitted' } });
    navigate(`/observation-prescription/${patientId}`);
  };

  const calculateAge = (dob: string) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Welcome, Dr. {state.currentDoctor?.fullName}
              </h1>
              <p className="text-gray-600 mt-1">
                {state.currentDoctor?.department} • {state.currentDoctor?.phcName}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Logged in as</p>
                <p className="font-medium text-gray-800">{state.currentDoctor?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Patients Waiting</p>
                <p className="text-2xl font-bold text-gray-800">{doctorQueue.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Department</p>
                <p className="text-lg font-semibold text-gray-800">{state.currentDoctor?.department}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Today's Date</p>
                <p className="text-lg font-semibold text-gray-800">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Patient Queue */}
        <div className="bg-white rounded-2xl shadow-lg">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-800">Patient Queue - Waiting List</h2>
            <p className="text-gray-600 mt-1">Patients waiting for consultation in {state.currentDoctor?.department}</p>
          </div>

          <div className="overflow-x-auto">
            {doctorQueue.length === 0 ? (
              <div className="p-12 text-center">
                <div className="bg-gray-100 p-6 rounded-full inline-block mb-4">
                  <Clock className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Patients Waiting</h3>
                <p className="text-gray-600">There are currently no patients in the queue for your department.</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm text-gray-500 uppercase">SI. No</th>
                    <th className="px-6 py-4 text-left text-sm text-gray-500 uppercase">OPD Number</th>
                    <th className="px-6 py-4 text-left text-sm text-gray-500 uppercase">Patient Name</th>
                    <th className="px-6 py-4 text-left text-sm text-gray-500 uppercase">Address</th>
                    <th className="px-6 py-4 text-left text-sm text-gray-500 uppercase">Sex</th>
                    <th className="px-6 py-4 text-left text-sm text-gray-500 uppercase">Time Slot</th>
                    <th className="px-6 py-4 text-left text-sm text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {doctorQueue.map((entry, index) => {
                    // Extract patient info directly from entry
                    const {
                      patientName,
                      Address,
                      sex,
                      timeSlot,
                      opdNumber,
                      patientId,
                      id,
                    } = entry;

                    return (
                      <tr key={id}>
                        <td className="px-6 py-4 text-sm">{index + 1}</td>
                        <td className="px-6 py-4 text-sm">{opdNumber}</td>
                        <td className="px-6 py-4 text-sm">{patientName || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm">{Address || 'N/A'}</td>
                
                        <td className="px-6 py-4 text-sm">{sex || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 text-blue-500 mr-1" />
                            {timeSlot}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {patientId ? (
                            <button
                              onClick={() => handleAdmitPatient(patientId, id)}
                              className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 text-sm"
                            >
                              Admit
                            </button>
                          ) : (
                            <span className="text-red-500 text-sm">Patient not found</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
