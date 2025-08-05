import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useHealthcare } from '../context/HealthcareContext';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface Medication {
  drugName: string;
  dosage: string;
  duration: string;
}

declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable?: { finalY: number };
  }
}

const ObservationPrescription = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const { state } = useHealthcare();

  const [opd, setOpd] = useState<any | null>(null);
  const [observations, setObservations] = useState('');
  const [medications, setMedications] = useState<Medication[]>([{ drugName: '', dosage: '', duration: '' }]);
  const [prescriptionHistory, setPrescriptionHistory] = useState<any[]>([]);
  const [success, setSuccess] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTarget, setRecordingTarget] = useState<'observation' | 'medication' | null>(null);

  const observationRef = useRef<HTMLDivElement>(null);

  // Recording refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  useEffect(() => {
    const fetchOPDDetails = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/opd`);
        const matched = res.data.find((entry: any) => entry.patientId === patientId);
        if (matched) setOpd(matched);
      } catch (err) {
        console.error('Error fetching OPD:', err);
      }
    };

    const fetchPrescriptionHistory = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/observations?patientId=${patientId}`
        );
        setPrescriptionHistory(res.data);
      } catch (err) {
        console.error('Error fetching history:', err);
      }
    };

    if (patientId) {
      fetchOPDDetails();
      fetchPrescriptionHistory();
    }
  }, [patientId]);

  const handleAddMedication = () => {
    setMedications([...medications, { drugName: '', dosage: '', duration: '' }]);
  };

  const handleRemoveMedication = (index: number) => {
    if (medications.length > 1) {
      setMedications(meds => meds.filter((_, i) => i !== index));
    }
  };

  const handleChangeMedication = (index: number, field: keyof Medication, value: string) => {
    setMedications(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleSubmit = async () => {
    if (!opd || !state.currentDoctor) return;

    const newObservation = {
      opdNumber: opd.opdNumber,
      doctorId: state.currentDoctor.kgId,
      patientId: opd.patientId,
      symptoms: observations,
      diagnosis: '',
      advice: '',
      prescription: medications,
    };

    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/observations`, newObservation);
      setSuccess(true);
      const historyRes = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/observations?patientId=${opd.patientId}`
      );
      setPrescriptionHistory(historyRes.data);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error('Error saving observation (axios):', err.response?.data || err.message);
      } else if (err instanceof Error) {
        console.error('Error saving observation:', err.message);
      } else {
        console.error('Unknown error saving observation:', err);
      }
    }
  };

  const handlePrint = () => {
    if (observationRef.current) {
      const printContents = observationRef.current.innerHTML;
      const printWindow = window.open('', '', 'width=800,height=600');
      printWindow?.document.write(
        `<html><head><title>Prescription</title></head><body>${printContents}</body></html>`
      );
      printWindow?.document.close();
      printWindow?.print();
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Prescription Report', 14, 20);

    doc.setFontSize(12);
    doc.text(`Patient Name: ${opd?.patientName || 'N/A'}`, 14, 30);
    doc.text(`OPD Number: ${opd?.opdNumber || 'N/A'}`, 14, 38);
    doc.text(`Sex: ${opd?.sex || 'N/A'}`, 14, 46);
    doc.text(`Address: ${opd?.Address || 'N/A'}`, 14, 54);

    doc.text('Observations:', 14, 70);
    const splitObservations = doc.splitTextToSize(observations || '', 180);
    doc.text(splitObservations, 14, 78);

    const lastY: number = ((doc as any).lastAutoTable?.finalY ?? 100) as number;

    doc.text('Medications:', 14, lastY + 10);
    const tableData = medications.map(med => [med.drugName, med.dosage, med.duration]);
    (doc as any).autoTable({
      head: [['Drug Name', 'Dosage', 'Duration']],
      body: tableData,
      startY: lastY + 15,
    });

    doc.save(`Prescription_${opd?.patientId || 'unknown'}.pdf`);
  };

  const deduplicateText = (current: string, incoming: string) => {
    if (!incoming.trim()) return current;
    const currentNormalized = current.trim().toLowerCase();
    const incomingNormalized = incoming.trim().toLowerCase();
    if (currentNormalized.endsWith(incomingNormalized)) return current;
    return `${current} ${incoming}`.trim();
  };

  const parseMedicationText = (text: string): Medication => {
    const numberMap: Record<string, string> = {
      zero: "0", one: "1", two: "2", three: "3", four: "4", five: "5",
      six: "6", seven: "7", eight: "8", nine: "9", ten: "10",
      twenty: "20", thirty: "30", forty: "40", fifty: "50",
      sixty: "60", seventy: "70", eighty: "80", ninety: "90",
      hundred: "100"
    };

    const normalize = (w: string) => numberMap[w.toLowerCase()] || w;

    const words = text.trim().split(/\s+/).map(normalize);

    let drugNameParts: string[] = [];
    let dosageParts: string[] = [];
    let durationParts: string[] = [];

    let foundDosage = false;
    let foundDuration = false;

    for (let i = 0; i < words.length; i++) {
      const w = words[i].toLowerCase();

      // Detect dosage (number followed by unit like mg/ml)
      if (!foundDosage && /\d+/.test(w)) {
        if (words[i + 1] && /(mg|ml|g|mcg)/i.test(words[i + 1])) {
          dosageParts.push(w, words[i + 1]);
          i++;
        } else {
          dosageParts.push(w);
        }
        foundDosage = true;
        continue;
      }

      // Detect duration (number followed by time unit)
      if (foundDosage && !foundDuration && /\d+/.test(w)) {
        if (words[i + 1] && /(day|days|week|weeks|hour|hours|month|months)/i.test(words[i + 1])) {
          durationParts.push(w, words[i + 1]);
          i++;
          foundDuration = true;
          continue;
        }
      }

      // Before dosage, treat as drug name
      if (!foundDosage) {
        drugNameParts.push(w);
      }
    }

    return {
      drugName: drugNameParts.join(" ").trim(),
      dosage: dosageParts.join(" ").trim(),
      duration: durationParts.join(" ").trim()
    };
  };

  const startRecording = async (target: 'observation' | 'medication') => {
    if (isRecording) return;
    setIsRecording(true);
    setRecordingTarget(target);
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = e => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const form = new FormData();
        form.append('audio', blob, 'note.webm');

        const medNames = medications.map(m => m.drugName).filter(Boolean);
        if (medNames.length) form.append('extraKeywords', JSON.stringify(medNames));

        try {
          const resp = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/deepgram/transcribe-medical`, form, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          const transcript: string = resp.data.transcript || '';
          if (target === 'observation') {
            setObservations(prev => deduplicateText(prev, transcript));
          } else if (target === 'medication') {
            const parsed = parseMedicationText(transcript);
            setMedications(prev => {
              const updated = [...prev];
              const last = updated.length - 1;
              updated[last] = parsed;
              return updated;
            });
          }
        } catch (err) {
          console.error('Transcription request failed:', err);
        } finally {
          setIsRecording(false);
          setRecordingTarget(null);
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
          }
        }
      };

      mediaRecorder.start();
    } catch (err) {
      console.error('Microphone access failed:', err);
      setIsRecording(false);
      setRecordingTarget(null);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  if (!opd) return <div className="p-6 text-gray-700">Loading patient details...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8 bg-white shadow-lg rounded-xl p-8" ref={observationRef}>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Observation & Prescription</h2>
      {success && (
        <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">
          ✅ Prescription saved successfully!
        </div>
      )}

      {/* Patient Info */}
      <div className="mb-6">
        <p className="text-gray-700"><strong>Patient Name:</strong> {opd.patientName || 'N/A'}</p>
        <p className="text-gray-700"><strong>OPD Number:</strong> {opd.opdNumber}</p>
        <p className="text-gray-700"><strong>Sex:</strong> {opd.sex}</p>
        <p className="text-gray-700"><strong>Address:</strong> {opd.Address || 'N/A'}</p>
      </div>

      {/* Observations */}
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2">Observations</label>
        <textarea
          value={observations}
          onChange={e => setObservations(e.target.value)}
          rows={4}
          className="w-full border border-gray-300 rounded-md p-2"
          placeholder="Enter observations"
        />
        <div className="mt-2 flex gap-4">
          {!isRecording || recordingTarget !== 'observation' ? (
            <button
              onClick={() => startRecording('observation')}
              className="px-4 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              🎙️ Start Voice (Observation)
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              ⏹️ Stop Recording
            </button>
          )}
        </div>
      </div>

      {/* Medications */}
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2">Medications</label>
        {medications.map((med, index) => (
          <div key={index} className="grid grid-cols-3 gap-4 mb-2 items-center">
            <input value={med.drugName} onChange={(e) => handleChangeMedication(index, 'drugName', e.target.value)} placeholder="Drug Name" className="border border-gray-300 rounded-md p-2" />
            <input value={med.dosage} onChange={(e) => handleChangeMedication(index, 'dosage', e.target.value)} placeholder="Dosage" className="border border-gray-300 rounded-md p-2" />
            <input value={med.duration} onChange={(e) => handleChangeMedication(index, 'duration', e.target.value)} placeholder="Duration" className="border border-gray-300 rounded-md p-2" />
            {medications.length > 1 && (
              <button onClick={() => handleRemoveMedication(index)} className="text-red-600 text-sm">🗑️ Remove</button>
            )}
          </div>
        ))}
        <div className="flex gap-4 mt-2">
          <button onClick={handleAddMedication} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">➕ Add More</button>
          {!isRecording ? (
            <button onClick={() => startRecording('medication')} className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">🎤 Start Voice (Medication)</button>
          ) : recordingTarget === 'medication' ? (
            <button onClick={stopRecording} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">⏹️ Stop</button>
          ) : null}
        </div>
      </div>

      <div className="flex gap-4">
        <button onClick={handleSubmit} className="flex-1 bg-green-600 text-white py-2 rounded-md font-semibold hover:bg-green-700">Submit Prescription</button>
        <button onClick={handlePrint} className="flex-1 bg-gray-600 text-white py-2 rounded-md font-semibold hover:bg-gray-700">🖨️ Print</button>
        <button onClick={exportToPDF} className="flex-1 bg-indigo-600 text-white py-2 rounded-md font-semibold hover:bg-indigo-700">📄 Export to PDF</button>
      </div>

      {prescriptionHistory.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Previous Prescriptions</h3>
          <ul className="space-y-3">
            {prescriptionHistory.map((pres: any) => (
              <li key={pres._id} className="bg-gray-100 p-4 rounded">
                <p><strong>Date:</strong> {new Date(pres.date).toLocaleDateString()}</p>
                <p><strong>Observations:</strong> {pres.symptoms}</p>
                <p><strong>Medications:</strong></p>
                <ul className="ml-4 list-disc">
                  {pres.prescription.map((med: Medication, i: number) => (
                    <li key={i}>{med.drugName} - {med.dosage} for {med.duration}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul> 
        </div>
      )}
    </div>
  );
};

export default ObservationPrescription;
