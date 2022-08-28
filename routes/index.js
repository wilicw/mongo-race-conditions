const express = require('express');
const router = express.Router();
const { Order } = require('../models/Order');
const { User } = require('../models/User');
const { redlock } = require('../lock');

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
  let lock = null;
  redlock.acquire([`lock_${username}`], 100)
    .then(_lock => lock = _lock)
    .then(() => User.findOne({ username: username }))
    .then(user => {
      if (user.borrowed < user.limit) {
        user.borrowed += 1;
        return user.save();
      }
      throw new Error('Limit exceed');
    })
    .then(() => {
      const order = new Order({
        username: username,
      });
      return order.save();
    })
    .then(() => res.send())
    .then(() => lock.release())
    .catch((err) => {
      res.send(err);
      if (lock) lock.release();
    });
});

router.get('/return/:username', function (req, res, next) {
  const username = req.params.username;
  Order.updateMany({ username: username }, { returned: true })
    .then(() => User.updateOne({ username: username }, { borrowed: 0 }))
    .then(() => res.json({ "msg": `${username} returned` }));
});

module.exports = router;
