const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',   // Reference to User collection
    required: true,
  },
  title: {
    type: String,
    required: true,  // Must provide a title
  },
  description: {
    type: String,
    default: '',    // Optional, defaults to empty string
  },
  completed: {
    type: Boolean,
    default: false,  // Track if todo is completed
  },
  dueDate: {
    type: Date,
    default: null,  // Optional due date
  },
}, {
  timestamps: true   // Adds createdAt and updatedAt fields automatically
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
