const express = require('express');   
const router = express.Router();
const passport = require('passport');
const pool = require('../functions/db');

router.get('/login/success', async (req, res) => {
  if (req.user) {

    const userEmail = req.user.emails[0].value;

    const [userLevel] = await pool.query(
      'SELECT level FROM mrbs_users WHERE email = ?',
      [userEmail]
    );

    if (!userLevel.length) {
      req.logout((err) => {
        if (err) {
          console.error('Logout error:', err);
        }
      });
      return res.status(403).json({
        success: false,
        message: 'Email not authorized'
      });
    }


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
  passport.authenticate('google', { failureRedirect: '/login/failed' }),
  async (req, res) => {
    try {
      const userEmail = req.user.emails[0].value;
      
      const [user] = await pool.query(
        'SELECT * FROM mrbs_users WHERE email = ?',
        [userEmail]
      );

      if (!user.length) {
        req.logout((err) => {
          if (err) {
            console.error('Logout error:', err);
          }
          res.redirect('/login/failed');
        });
        return;
      }

      res.redirect(process.env.CLIENT_URL);
    } catch (error) {
      console.error('Auth error:', error);
      res.redirect('/login/failed');
    }
  }
);

router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'] ,
    // hd: 'nitc.ac.in'
  })
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
