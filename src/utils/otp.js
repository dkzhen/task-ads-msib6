exports.generateOTP = () => {
  const digits = "0123456789";

  let otp = digits[Math.floor(Math.random() * 9) + 1];

  for (let i = 1; i < 6; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
};
