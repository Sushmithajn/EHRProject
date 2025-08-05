const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
  drugName: { type: String, required: true },
  dosage: { type: String },
  duration: { type: String }
});

const prescriptionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // uuid
  patientId: { type: String, required: true },
  doctorId: { type: String, required: true },
  date: { type: Date, required: true },
  observations: { type: String },
  medications: { type: [medicationSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);
