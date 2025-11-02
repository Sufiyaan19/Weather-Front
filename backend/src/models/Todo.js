
const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  completed: { type: Boolean, default: false },
  tags: [{ type: String }],
  dueDate: { type: Date, default: null },
  priority: { type: String, enum: ['low','medium','high'], default: 'low' }
}, { timestamps: true });

module.exports = mongoose.model('Todo', TodoSchema);
