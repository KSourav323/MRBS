const express = require('express');   
const router = express.Router();
const {auth} = require('../middleware/auth');


router.use(auth);

router.post('/test', (req, res) => {
    console.log('test route');
  res.status(200).json({ message: 'okay' });
});

router.post('/addBooking', (req, res) => {
    console.log('added');
    console.log(req.body);
  res.status(200).json({ message: 'added' });
});


module.exports = router;
