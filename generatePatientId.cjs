function generatePatientId() {
  const randomNum = Math.floor(100000 + Math.random() * 900000); // 6-digit number
  return `pt${randomNum}`;
}

module.exports = generatePatientId;
