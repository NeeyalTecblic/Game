const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const transporter = require('../config/mail');
const { Op } = require('sequelize');

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    if (!['customer', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = generateVerificationCode();
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      verificationCode,
    });
    // Send verification email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Verify your email',
      text: `Your verification code is: ${verificationCode}`,
    });
    res.status(201).json({ message: 'Registration successful. Please check your email for the verification code.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ message: 'Already verified' });
    if (user.verificationCode !== code) return res.status(400).json({ message: 'Invalid verification code' });
    user.isVerified = true;
    user.verificationCode = null;
    await user.save();
    res.json({ message: 'Email verified successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ message: 'User already verified' });
    const verificationCode = generateVerificationCode();
    user.verificationCode = verificationCode;
    await user.save();
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Resend Verification Code',
      text: `Your new verification code is: ${verificationCode}`,
    });
    res.json({ message: 'Verification code resent. Please check your email.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role !== 'admin') return res.status(403).json({ message: 'You are not allowed to login from here' });
    if (!user.isVerified) return res.status(403).json({ message: 'Please verify your email before logging in' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    // Issue JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );
    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 