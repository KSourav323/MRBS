const pool = require('../functions/db');

const auth = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log('Authenticated');
    return next();
  }
  console.log('user is not authenticated');
  res.status(200).json({
    message: 'Not authenticated'
  });
};

const isAdmin = async (req, res, next) => {
  if (!req.isAuthenticated()) {
      return res.status(200).json({
          success: false,
          message: 'Please login to continue'
      });
  }

  try {
      const [userLevel] = await pool.query(
          'SELECT level FROM mrbs_users WHERE email = ?',
          [req.user.emails[0].value]
      );

      if (userLevel[0]?.level === 2) {
         console.log('Admin action')
          return next();
      }

      console.log('user action')
      return res.status(200).json({
          success: false,
          message: 'Admin access required'
      });
  } catch (error) {
      console.error('Error checking admin status:', error);
      return res.status(500).json({
          success: false,
          message: 'Error checking permissions'
      });
  }
};


module.exports = { auth, isAdmin };
