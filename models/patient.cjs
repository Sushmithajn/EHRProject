const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  patientId: { type: String,required: true, unique: true },
  dateOfBirth: { type: Date, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  sex: { type: String, required: true },
  fatherMotherName: { type: String },
  husbandWifeName: { type: String },
  panCard: { type: String },
  aadharCard: { type: String },
  rationCard: { type: String },
  address: { type: String },
  photo: { type: String }, // base64 string or URL
  registrationDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Patient', patientSchema);
