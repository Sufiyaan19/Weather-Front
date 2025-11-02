
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
  name: { type: String, trim: true, default: '' },
  email: { type: String, required: true, unique: true, lowercase: true, validate: [validator.isEmail, 'Invalid email'] },
  password: { type: String, required: true },
  bio: { type: String, default: '' }
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', UserSchema);
