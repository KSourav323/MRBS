
auth = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log('user is authenticated');
    return next();
  }
  console.log('user is not authenticated');
  res.redirect('/auth/google');
};



module.exports = { auth };
