const express = require('express');   
const router = express.Router();
const passport = require('passport');
const pool = require('../functions/db');

router.get('/login/success', async (req, res) => {
  if (req.user) {

    const [userLevel] = await pool.query(
      'SELECT level FROM mrbs_users WHERE email = ?',
      [req.user.emails[0].value]
    );

    res.status(201).json({
      error: true,
      message: 'User has successfully authenticated',
      user: {
        ...req.user,
        level: userLevel[0]?.level || 1 
      },
      cookies: req.cookies,
    });
  }
  else {
    res.status(200).json({
      message: 'User has not authenticated',
    });
  }
});

router.get('/login/failed', (req, res) => {
  res.status(401).json({
    error: true,
    message: 'Login failed',
  });
});

router.get('/google/callback', 
  passport.authenticate('google', { 
    successRedirect: process.env.CLIENT_URL ,
    failureRedirect: '/login/failed'
  })
);

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get("/logout", (req, res, next) => {
  console.log('logging out');
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect(process.env.CLIENT_URL);
  });
});


module.exports = router;
