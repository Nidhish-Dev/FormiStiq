const Form = require('../models/Form');
const shortid = require('shortid');

const createForm = async (req, res) => {
  const { title, description, questions } = req.body;
  const userId = req.user.userId; // From JWT middleware
  try {
    const uniqueUrl = shortid.generate();
    const form = new Form({ title, description, userId, uniqueUrl, questions });
    await form.save();
    res.status(201).json({ form, message: 'Form created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getUserForms = async (req, res) => {
  const userId = req.user.userId;
  try {
    const forms = await Form.find({ userId }).select('-responses');
    res.json(forms);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getFormByUrl = async (req, res) => {
  const { uniqueUrl } = req.params;
  try {
    const form = await Form.findOne({ uniqueUrl }).select('-responses');
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    res.json(form);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const submitResponse = async (req, res) => {
  const { uniqueUrl } = req.params;
  const { answers } = req.body;
  const userId = req.user?.userId; // Optional, for authenticated users
  try {
    const form = await Form.findOne({ uniqueUrl });
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    const response = { userId, answers, submittedAt: new Date() };
    form.responses.push(response);
    await form.save();
    res.status(201).json({ message: 'Response submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getFormResponses = async (req, res) => {
  const { uniqueUrl } = req.params;
  const userId = req.user.userId;
  try {
    const form = await Form.findOne({ uniqueUrl, userId }).select('responses questions');
    if (!form) {
      return res.status(404).json({ message: 'Form not found or unauthorized' });
    }
    res.json({ responses: form.responses, form: { questions: form.questions } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createForm, getUserForms, getFormByUrl, submitResponse, getFormResponses };