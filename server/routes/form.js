const express = require('express');
const { createForm, getUserForms, getFormByUrl, submitResponse, getFormResponses } = require('../controllers/formController');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to authenticate JWT
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Protected routes
router.post('/', authMiddleware, createForm);
router.get('/', authMiddleware, getUserForms);
router.get('/:uniqueUrl', getFormByUrl); // Public access
router.post('/:uniqueUrl/submit', submitResponse); // Public access
router.get('/:uniqueUrl/responses', authMiddleware, getFormResponses);

module.exports = router;