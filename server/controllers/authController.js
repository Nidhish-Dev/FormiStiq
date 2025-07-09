const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const signup = async (req, res) => {
  const { firstName, lastName, email, phone, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const user = new User({ firstName, lastName, email, phone, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '1h',
    });

    // Nodemailer transporter using Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // codenidhish07@gmail.com
        pass: process.env.EMAIL_PASS, // App password only
      },
    });

    // HTML Email Template (Dark FormiStiq Theme)
    const htmlTemplate = (name) => `
      <html>
        <head>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet" />
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Inter', sans-serif; background-color: #0d0d0d; color: #ffffff;">
          <div style="max-width: 600px; margin: auto; padding: 40px; background: #111111; border-radius: 12px; border: 1px solid #333;">
            <h1 style="background: linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 28px;">
              Welcome to FormiStiq, ${name}
            </h1>
            <p style="font-size: 16px; line-height: 1.6; margin-top: 20px;">
              You are now part of a smarter way to build, share, and manage intelligent forms.
            </p>
            <p style="margin-top: 20px;">
              Get started by logging in and exploring FormiAI, our AI-powered form generator.
            </p>
            <a href="https://formistiq.vercel.app/login" style="display: inline-block; margin-top: 30px; padding: 12px 24px; background: linear-gradient(to right, #3b82f6, #8b5cf6); border-radius: 8px; color: white; text-decoration: none;">
              Go to Dashboard
            </a>
            <p style="margin-top: 40px; font-size: 12px; color: #999;">FormiStiq – Intelligent Forms. Seamless Results.</p>
          </div>
        </body>
      </html>
    `;

    // Email to user
    const welcomeMailOptions = {
      from: '"FormiStiq" <codenidhish07@gmail.com>',
      to: email,
      subject: `Welcome to FormiStiq, ${firstName}`,
      html: htmlTemplate(firstName),
    };

    // Alert to self
    const adminMailOptions = {
      from: '"FormiStiq Bot" <codenidhish07@gmail.com>',
      to: 'codenidhish07@gmail.com',
      subject: `New User Signed Up: ${firstName} ${lastName}`,
      html: `
  <html>
    <head>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet" />
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Inter', sans-serif; background-color: #0d0d0d; color: #ffffff;">
      <div style="max-width: 600px; margin: auto; padding: 40px; background: #111111; border-radius: 12px; border: 1px solid #333;">
        <h1 style="background: linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 24px;">
          New User Signed Up
        </h1>
        <p style="font-size: 16px; line-height: 1.6; margin-top: 20px;">
          A new user has signed up to <strong>FormiStiq</strong>.
        </p>
        <div style="margin-top: 30px; padding: 16px; background-color: #1a1a1a; border-radius: 10px; border: 1px solid #444;">
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
        </div>
        <p style="margin-top: 40px; font-size: 12px; color: #999;">FormiStiq – Intelligent Forms. Seamless Results.</p>
      </div>
    </body>
  </html>
`
,
    };

    await Promise.all([
      transporter.sendMail(welcomeMailOptions),
      transporter.sendMail(adminMailOptions),
    ]);

    res.status(201).json({
      token,
      user: { id: user._id, firstName, lastName, email },
      message: 'Signup successful and emails sent.',
    });
  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '1h',
    });

    res.json({
      token,
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { signup, login };
