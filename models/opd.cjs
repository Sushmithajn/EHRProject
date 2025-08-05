// models/opd.cjs
const mongoose = require('mongoose');

const opdSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  patientName: {type: String, required: true},
  Address: {type: String, required: true},
  patientPhone: { type: String, required: true },
  sex: {type: String, required: true},
  age: {Number: Number},
  opdNumber: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  timeSlot: { type: String, required: true },
  date: { type: String, required: true }, // or Date
  status: { type: String, enum: ['waiting', 'admitted'], default: 'waiting' }
});

// Optional sanitization
opdSchema.pre('save', function (next) {
  if (this.patientId) {
    this.patientId = this.patientId.trim().toLowerCase();
  }
  next();
});

module.exports = mongoose.model('Opd', opdSchema);
