const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, unique: true },
  limit: { type: Number, default: 0 },
  borrowed: { type: Number, default: 0 },
});

const User = mongoose.model('User', userSchema);

module.exports = { User };