const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  kgId: String,
  mbbsCertId: String,
  fullName: String,
  email: String,
  phoneNumber: String,
  phcName: String,
  department: String,
  password: String,
  
  resetToken: String,
  resetTokenExpiry: Date
});

module.exports = mongoose.model('Doctor', doctorSchema);
