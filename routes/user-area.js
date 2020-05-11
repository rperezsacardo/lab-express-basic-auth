const express = require('express');
const User = require('./../models/user');
const routeGuard = require('./../middleware/route-guard');

const userArea = new express.Router();

userArea.get('/main', routeGuard, (req, res, next) => {
  res.render('main');
});

userArea.get('/private', routeGuard, (req, res, next) => {
  res.render('private');
});

userArea.get('/profile/:id', routeGuard, (req, res, next) => {
  const id = req.params.id;
  User.findById(id)
    .then((result) => {
      console.log(result);
      res.render('profile', { result });
    })
    .catch((error) => {
      next(error);
    });
});
userArea.get('/profile/:id/edit', routeGuard, (req, res, next) => {
  res.render('edit');
});

userArea.post('/profile/:id/edit', routeGuard, (req, res, next) => {
  const id = req.params.id;
  const newNick = req.body.nick;
  const filter = { _id: id };
  const update = { nick: newNick };
  User.findOneAndUpdate(filter, update)
    .then((result) => {
      res.render('profile');
    })
    .catch((error) => next(error));
});

module.exports = userArea;
