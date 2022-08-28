const express = require('express');
const router = express.Router();
const { Order } = require('../models/Order');
const { User } = require('../models/User');

router.get('/new/:username', function (req, res, next) {
  const username = req.params.username;
  const new_user = new User({
    username: username,
    limit: 5,
  });
  new_user.save().then(() => res.json(new_user));
});

router.get('/borrow/:username', function (req, res, next) {
  const username = req.params.username;
  User.findOne({ username: username }, (err, user) => {
    console.log(user);
    if (user.borrowed < user.limit) {
      user.borrowed += 1;
      const order = new Order({
        username: username,
      });
      order.save();
      user.save();
    }
  });
  res.send();
});

router.get('/return/:username', function (req, res, next) {
  const username = req.params.username;
  Order.updateMany({ username: username }, { returned: true }, (err, orders) => {
    User.findOne({ username: username }, (err, user) => {
      user.borrowed = 0;
      user.save();
    })
    res.json({ "msg": `${username} returned` });
  });
});

module.exports = router;
