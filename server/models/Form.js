const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  uniqueUrl: { type: String, required: true, unique: true },
  questions: [{
    type: {
      type: String,
      enum: ['short_answer', 'long_answer', 'mcq'],
      required: true,
    },
    text: { type: String, required: true },
    options: [{ type: String }], // For MCQ
    required: { type: Boolean, default: false },
  }],
  responses: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional, for authenticated users
    answers: [{
      questionId: { type: mongoose.Schema.Types.ObjectId },
      answer: { type: String },
    }],
    submittedAt: { type: Date, default: Date.now },
  }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Form', formSchema);