const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('./../models/user');

const authenticationRouter = new express.Router();

authenticationRouter.get('/sign-up', (req, res) => {
  res.render('sign-up');
});

authenticationRouter.post('/sign-up', (req, res, next) => {
  const name = req.body.name;
  const password = req.body.password;
  User.findOne({ name })
    .then((document) => {
      if (!document) {
        return bcrypt
          .hash(password, 10)
          .then((hashAndSalt) => {
            return User.create({
              name,
              passwordHash: hashAndSalt,
            });
          })
          .then((user) => {
            console.log(user);
            res.redirect('/');
          });
      } else {
        const error = new Error("There's alread a user with this username");
        return Promise.reject(error);
      }
    })
    .catch((error) => {
      next(error);
      //..
    });
});

authenticationRouter.get('/sign-in', (req, res, next) => {
  res.render('sign-in');
});

authenticationRouter.post('/sign-in', (req, res, next) => {
  const name = req.body.name;
  const password = req.body.password;
  let user;

  User.findOne({ name })
    .then((document) => {
      user = document;
      return bcrypt.compare(password, user.passwordHash);
    })
    .then((result) => {
      if (result) {
        req.session.userId = user._id;
        res.redirect('/');
      } else {
        const error = new Error('Wrong Password');
        return Promise.reject(error);
      }
    })
    .catch((error) => {
      next(error);
    });
});

authenticationRouter.post('/sign-out', (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
});

//....

module.exports = authenticationRouter;
