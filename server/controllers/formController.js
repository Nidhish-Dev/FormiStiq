const Form = require('../models/Form');
const shortid = require('shortid');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const mongoose = require('mongoose');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'your-gemini-api-key');

const createForm = async (req, res) => {
  const { title, description, questions } = req.body;
  const userId = req.user.userId;
  try {
    const uniqueUrl = shortid.generate();
    const form = new Form({ title, description, userId, uniqueUrl, questions });
    await form.save();
    res.status(201).json({ form, message: 'Form created successfully' });
  } catch (error) {
    console.error('Create form error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const generateFormWithAI = async (req, res) => {
  const { topic, numQuestions, questionType, includeName, includeEmail, includeContact } = req.body;
  const userId = req.user.userId;
  try {
    if (!topic || !numQuestions || !['mcq', 'shortAnswer'].includes(questionType)) {
      return res.status(400).json({ message: 'Invalid input: topic, numQuestions, and questionType (mcq or shortAnswer) are required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const additionalFields = [];
    if (includeContact) additionalFields.push('a short-answer question for the respondent’s contact number (required)');

    const prompt = `
      Generate a form for the topic "${topic}" with the following requirements:
      - Title: A concise, relevant title for the form (max 50 characters).
      - Description: A brief description of the form (max 200 characters).
      - Questions: Exactly ${numQuestions} questions of type "${questionType === 'mcq' ? 'Multiple-choice with 4 options each, one correct answer' : 'Short-answer'}".
      - Do NOT include questions for name or email, as these are handled separately.
      ${
        includeContact && additionalFields.length > 0
          ? `- Additional Fields: Include ${additionalFields.join(', ')} at the start of the questions array.`
          : ''
      }
      - Format the response as JSON:
      {
        "title": "<title>",
        "description": "<description>",
        "questions": [
          ${
            questionType === 'mcq'
              ? '{ "text": "<question_text>", "options": ["<option1>", "<option2>", "<option3>", "<option4>"], "correctAnswer": "<option>" }'
              : '{ "text": "<question_text>" }'
          }
        ]
      }
      - Ensure the response is valid JSON without markdown or extra characters.
    `;

    // Retry logic for Gemini API
    const maxRetries = 3;
    let attempt = 0;
    let result;

    while (attempt < maxRetries) {
      try {
        result = await model.generateContent(prompt);
        break;
      } catch (error) {
        attempt++;
        if (attempt === maxRetries || error.status !== 503) {
          throw error;
        }
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`Retrying Gemini API (attempt ${attempt + 1}/${maxRetries}) after ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    const response = await result.response;
    let text = response.text();

    // Clean markdown or extra characters
    text = text.replace(/```json\n|\n```/g, '').replace(/```/g, '').trim();

    // Validate and parse JSON
    let generatedForm;
    try {
      generatedForm = JSON.parse(text);
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Raw response:', text);
      return res.status(500).json({ message: 'Invalid JSON response from AI', error: parseError.message });
    }

    // Validate generated form structure
    if (!generatedForm.title || !generatedForm.description || !Array.isArray(generatedForm.questions)) {
      return res.status(500).json({ message: 'Invalid form structure from AI' });
    }

    const uniqueUrl = shortid.generate();
    const formType = questionType === 'mcq' ? 'mcq' : 'short_answer';
    const questions = [];

    // Add additional fields (name, email, contact) first
    if (includeName) {
      questions.push({
        _id: new mongoose.Types.ObjectId(),
        type: 'short_answer',
        text: 'What is your name?',
        options: [],
        required: true,
      });
    }
    if (includeEmail) {
      questions.push({
        _id: new mongoose.Types.ObjectId(),
        type: 'short_answer',
        text: 'What is your email?',
        options: [],
        required: true,
      });
    }
    if (includeContact) {
      questions.push({
        _id: new mongoose.Types.ObjectId(),
        type: 'short_answer',
        text: 'What is your contact number?',
        options: [],
        required: true,
      });
    }

    // Add AI-generated questions
    generatedForm.questions.forEach((q) => {
      questions.push({
        _id: new mongoose.Types.ObjectId(),
        type: formType,
        text: q.text,
        options: q.options || [],
        required: false,
      });
    });

    const form = new Form({
      title: generatedForm.title,
      description: generatedForm.description,
      userId,
      uniqueUrl,
      questions,
    });

    await form.save();
    res.status(201).json({ form, message: 'AI-generated form created successfully' });
  } catch (error) {
    console.error('AI form generation error:', error);
    let errorMessage = 'Server error';
    if (error.status === 503) {
      errorMessage = 'AI service is temporarily unavailable. Please try again later.';
    } else if (error.status === 429) {
      errorMessage = 'Rate limit exceeded for AI service. Please try again later.';
    }
    res.status(500).json({ message: errorMessage, error: error.message });
  }
};

const getUserForms = async (req, res) => {
  const userId = req.user.userId;
  try {
    const forms = await Form.find({ userId }).select('-responses');
    res.json(forms);
  } catch (error) {
    console.error('Get forms error:', error);
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
    console.error('Get form by URL error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const submitResponse = async (req, res) => {
  const { uniqueUrl } = req.params;
  const { answers } = req.body;
  const userId = req.user?.userId;
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
    console.error('Submit response error:', error);
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
    console.error('Get responses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createForm, generateFormWithAI, getUserForms, getFormByUrl, submitResponse, getFormResponses };