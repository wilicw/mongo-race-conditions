const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  username: String,
  returned: { type: Boolean, default: false },
  time: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = { Order };