const mongoose = require('mongoose');

const observationSchema = new mongoose.Schema({
  opdNumber: { type: String, required: true },
  doctorId: { type: String, required: true }, // 🔁 Use kgId as a string
  patientId: { type: String, required: true },
  symptoms: String,
  diagnosis: String,
  advice: String,
  prescription: [
    {
      drugName: String,
      dosage: String,
      duration: String
    }
  ],
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Observation', observationSchema);
