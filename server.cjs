// ✅ Load environment variables at the top
require('dotenv').config({ path: __dirname + '/.env' });
console.log('Loaded MONGO_URI:', process.env.MONGO_URI);
const twilio = require('twilio');
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const Patient = require('./models/patient.cjs');
const generatePatientId = require('./generatePatientId.cjs');
const Opd = require('./models/opd.cjs');
const Observation = require('./models/observation.cjs');


const { v4: uuidv4 } = require('uuid');

require('dotenv').config({ path: __dirname + '/.env' });




const mongoose = require('mongoose');

mongoose.set('bufferCommands', false);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

  
const Doctor = require('./models/doctor.cjs');


const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path'); 

const app = express();

app.use(cors({
   origin: [
    "http://localhost:5173",       // for local dev
    "https://ehrproject-1.onrender.com" // for deployed frontend
  ]
}));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json());

const otpStore = {}; // In-memory store for OTP

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// POST /send-otp
app.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  otpStore[email] = otp;

  try {
    await transporter.sendMail({
      from: `"Doctor Portal" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP for Registration',
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    });

    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error('Failed to send OTP:', err);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// POST /verify-otp
app.post('/verify-otp', async (req, res) => {
  const { email, otp, doctorData } = req.body;

  if (otpStore[email] === otp) {
    delete otpStore[email]; // Clean up OTP after verification

    try {
      const newDoctor = new Doctor(doctorData);
      await newDoctor.save();

      return res.json({ success: true, message: 'Doctor registered successfully' });
    } catch (err) {
      console.error('Error saving doctor:', err);
      return res.status(500).json({ success: false, message: 'Failed to save doctor' });
    }
  }

  return res.status(400).json({ success: false, message: 'Invalid OTP' });
});

// ✅ POST /check-email
app.post('/check-email', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking email:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// POST /send-phone-otp
app.post('/send-phone-otp', async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  otpStore[phone] = otp;

  try {
    await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER, // e.g., +1XXXXXXXXXX
      to: `+91${phone}`
    });

    console.log(`OTP for ${phone}: ${otp}`);
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error('Error sending phone OTP:', err);
    res.status(500).json({ message: 'Failed to send phone OTP' });
  }
});


// POST /verify-phone-otp


// ✅ POST /verify-phone-otp — simple manual verification
app.post('/verify-phone-otp', (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ message: 'Phone and OTP are required' });
  }

  if (otpStore[phone] === otp) {
    delete otpStore[phone]; // OTP is valid, remove it
    return res.status(200).json({ verified: true });
  } else {
    return res.status(400).json({ verified: false, message: 'Invalid or expired OTP' });
  }
});



app.post('/doctor-login', async (req, res) => {
  const { mbbsCertId, password } = req.body;

  try {
    const doctor = await Doctor.findOne({ mbbsCertId });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    if (doctor.password !== password) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    res.status(200).json({ doctor }); // You can also send a JWT token here later
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// POST /register-patient
// ✅ Updated POST /register-patient
app.post('/register-patient', async (req, res) => {
  const {
    fullName,
    dateOfBirth,
    phoneNumber,
    sex,
    fatherMotherName,
    husbandWifeName,
    panCard,
    aadharCard,
    rationCard,
    address,
    photo
  } = req.body;

  if (!fullName || !dateOfBirth || !phoneNumber || !sex) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Check if patient already exists
    const existing = await Patient.findOne({ phoneNumber });
    if (existing) {
      return res.status(400).json({ message: 'Patient already registered with this phone number' });
    }

    // ✅ Generate Patient ID
    const patientId = generatePatientId();

    // ✅ Create new patient document
    const newPatient = new Patient({
      fullName,
      dateOfBirth,
      phoneNumber,
      sex,
      fatherMotherName,
      husbandWifeName,
      panCard,
      aadharCard,
      rationCard,
      address,
      photo,
      patientId // ✅ Save generated ID
    });

    await newPatient.save();

    // ✅ Send SMS with patient ID
    await client.messages.create({
      body: `Registration successful. Your Patient ID is ${patientId}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${phoneNumber}`
    });

    // ✅ Respond with confirmation
    res.status(201).json({
      message: 'Patient registered successfully',
      patientId
    });

  } catch (err) {
    console.error('Error registering patient:', err);
    res.status(500).json({ message: 'Server error while registering patient' });
  }
});

// Inside server.cjs or routes file
app.get('/patient/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    const patient = await Patient.findOne({ patientId });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json(patient);
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({ message: 'Server error while fetching patient' });
  }
});




// naive E.164 normalizer; for production use libphonenumber-js
const normalizePhoneE164 = (raw) => {
  if (!raw) return null;
  if (raw.startsWith('+')) return raw;
  if (/^\d{10}$/.test(raw)) return '+91' + raw; // assuming Indian numbers by default
  return raw; // fallback, might be malformed
};


// POST /api/opd
app.post('/api/opd', async (req, res) => {
  try {
    const { patientId, opdNumber, department, timeSlot, date, status, phcName } = req.body;

    if (!patientId || !opdNumber || !department || !timeSlot || !date) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Lookup patient (normalize patientId for consistency)
    const patient = await Patient.findOne({ patientId: patientId.trim().toLowerCase() });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found with given ID' });
    }

    // Normalize and validate phone
    const patientPhone = normalizePhoneE164(patient.phoneNumber);
    if (!patientPhone) {
      return res.status(400).json({ message: 'Patient phone number missing or invalid' });
    }

    const opdEntry = new Opd({
      id: uuidv4(),
      patientId: patient.patientId,
      patientName: patient.fullName,
      Address: patient.address,       // matches updated schema
      patientPhone,                  // required in schema
      sex: patient.sex,
      opdNumber,
      department,
      timeSlot,
      date,
      status: status || 'waiting',
      phcName,
    });

    const saved = await opdEntry.save();

    // Send SMS confirmation (non-blocking)
    try {
      await client.messages.create({
        body: `OPD Registration Successful!
        OPD Number: ${opdNumber}
        Patient: ${patient.fullName}
        Department: ${department}
        Time Slot: ${timeSlot}
        Date: ${date}

Please arrive 15 minutes before your scheduled time.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: patientPhone,
      });
    } catch (smsErr) {
      console.warn('Failed to send OPD SMS:', smsErr.message);
      // do not fail the whole response
    }

    res.status(201).json({ message: 'OPD entry saved', data: saved });
  } catch (error) {
    console.error('Error saving OPD entry:', error);
    if (error.code === 11000) {
      return res.status(409).json({ message: 'OPD number already exists' });
    }
    res.status(500).json({ error: 'Failed to save OPD data' });
  }
});

// ✅ Get OPD entries with patient details


// Your route
app.get('/api/opd', async (req, res) => {
  try {
    // 1. Get all OPD entries with status = waiting
    const opdList = await Opd.find({ status: 'waiting' });

    // 2. Get all patients
    const patients = await Patient.find();

    // 3. Manually join patients using patientId string
    const enrichedOpdList = opdList.map(opd => {
      const patient = patients.find(p => p.patientId === opd.patientId);
      return {
        ...opd.toObject(),
        patient // embedded patient data
      };
    });

    res.status(200).json(enrichedOpdList);
  } catch (error) {
    console.error('Error fetching OPD list with patient info:', error);
    res.status(500).json({ message: 'Failed to fetch OPD list' });
  }
});


app.get('/api/observations', async (req, res) => {
  console.log('🔔 /api/observations GET hit');
  try {
    const { patientId } = req.query;
    if (!patientId) return res.status(400).json({ message: 'patientId query is required' });

    const observations = await Observation.find({ patientId }).sort({ date: -1 });

    const transformed = observations.map(o => ({
      _id: o._id.toString(), // frontend uses pres._id as key
      date: o.date,
      symptoms: o.symptoms || '',
      diagnosis: o.diagnosis || '',
      advice: o.advice || '',
      prescription: Array.isArray(o.prescription)
        ? o.prescription.map(p => ({
            drugName: p.drugName || '',
            dosage: p.dosage || '',
            duration: p.duration || '',
          }))
        : [],
    }));

    res.json(transformed);
  } catch (error) {
    console.error('Error fetching observation history:', error);
    res.status(500).json({ message: 'Failed to fetch observation history' });
  }
});

app.use(bodyParser.json());
// ✅ POST /api/observations — Save Observation & Prescription
app.post('/api/observations', async (req, res) => {
  try {
    const { opdNumber, doctorId, patientId, symptoms, diagnosis, advice, prescription } = req.body;

    if (!opdNumber || !doctorId || !patientId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newObservation = new Observation({
      opdNumber,
      doctorId,
      patientId,
      symptoms,
      diagnosis,
      advice,
      prescription
    });

    await newObservation.save();

    res.status(201).json({ message: 'Observation saved successfully' });
  } catch (error) {
    console.error('Error saving observation:', error);
    res.status(500).json({ message: 'Failed to save observation' });
  }
});



const crypto = require('crypto');


app.post('/doctor-forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const doctor = await Doctor.findOne({ email });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    // Generate token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = Date.now() + 3600000; // 1 hour

    // Store token in doctor model (you can also use a separate collection)
    doctor.resetToken = resetToken;
    doctor.resetTokenExpiry = tokenExpiry;
    await doctor.save();

    const resetURL = `http://localhost:5000/reset-password?token=${resetToken}`;

    // Send Email with Reset Link
    await transporter.sendMail({
      from: `"Doctor Portal" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Link',
      html: `
        <p>You requested to reset your password.</p>
        <p>Click <a href="${resetURL}">here</a> to reset. This link will expire in 1 hour.</p>
        <p>If you didn’t request this, you can ignore this email.</p>
      `,
    });

    console.log(`📨 Sent reset link to ${email}`);

    res.status(200).json({ message: 'Reset link sent to your email.' });
  } catch (error) {
    console.error('Error in forgot-password:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});


app.post('/api/doctor/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: 'Token and new password are required' });
  }

  try {
    // Find doctor with matching token and ensure it's not expired
    const doctor = await Doctor.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() } // token not expired
    });

    if (!doctor) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Update password
    doctor.password = newPassword; // Consider hashing for production
    doctor.resetToken = undefined;
    doctor.resetTokenExpiry = undefined;

    await doctor.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Error resetting password:', err);
    res.status(500).json({ message: 'Failed to reset password' });
  }
});


const multer = require('multer');
const upload = multer(); // in-memory

app.post('/api/deepgram/transcribe-medical', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No audio provided' });

    const deepgramKey = process.env.DEEPGRAM_API_KEY;
    if (!deepgramKey) return res.status(500).json({ error: 'Deepgram API key not configured' });

    // Base medical terms you always want to surface
    const baseKeyterms = ['metformin', 'atorvastatin', 'hydrochlorothiazide', 'hypertension', 'diabetes mellitus'];

    // Extra terms from frontend (expected as JSON stringified array)
    let extra = [];
    if (req.body.extraKeywords) {
      try {
        const parsed = JSON.parse(req.body.extraKeywords);
        if (Array.isArray(parsed)) extra = parsed.filter(t => typeof t === 'string' && t.trim());
      } catch (e) {
        // ignore parse errors, fallback to empty extra
      }
    }

    // Combine and dedupe
    const allKeyterms = Array.from(new Set([...baseKeyterms, ...extra])).map(t => t.trim()).filter(Boolean);
    // Join with comma; multi-word terms should be URL-encoded automatically by URLSearchParams
    const params = new URLSearchParams({
      model: 'nova-3-medical',
      language: 'en',
    });
    if (allKeyterms.length) {
      params.set('keyterm', allKeyterms.join(','));
    }

    const deepgramUrl = `https://api.deepgram.com/v1/listen?${params.toString()}`;

    const response = await fetch(deepgramUrl, {
      method: 'POST',
      headers: {
        Authorization: `Token ${deepgramKey}`,
        'Content-Type': req.file.mimetype,
      },
      body: req.file.buffer,
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Deepgram API error:', errText);
      return res.status(response.status).json({ error: errText });
    }

    const result = await response.json();
    const transcript = result?.results?.channels?.[0]?.alternatives?.[0]?.transcript || '';

    res.json({ transcript, raw: result });
  } catch (err) {
    console.error('Deepgram transcription failure:', err);
    res.status(500).json({ error: 'Transcription failed' });
  }
});


app.get('/', (req, res) => {
  res.send('EHR backend is running 🎉');
});





const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

