const express = require('express');   
const router = express.Router();
const pool = require('../functions/db');


router.post('/listArea', async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM mrbs_area WHERE is_public = 1');
        
        res.status(201).json({ 
            success: true,
            data: results, 
            message: 'List of areas' 
        });
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ 
            success: false,
            message: 'Internal server error', 
            error: error.message 
        });
    }
});

router.post('/listRoom', async (req, res) => {
    try {
        const { area_id } = req.body;
        const [results] = await pool.query(
            'SELECT * FROM mrbs_room WHERE area_id = ?',
            [area_id]
        );
        
        res.status(201).json({ 
            success: true,
            data: results, 
            message: 'List of rooms' 
        });
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ 
            success: false,
            message: 'Internal server error', 
            error: error.message 
        });
    }
});

router.post('/listBookings', async (req, res) => {
    try {
        const { area_id, date } = req.body;

        const [results] = await pool.query(
            `SELECT e.*, r.room_name, a.area_name
             FROM mrbs_entry e
             JOIN mrbs_room r ON e.room_id = r.id
             JOIN mrbs_area a ON e.area_id = a.id
             WHERE e.area_id = ? 
             AND a.is_public = 1
             AND DATE(e.date) = DATE(?)
             AND (e.is_approved = 0 OR e.is_approved = 1)
             ORDER BY e.start_time ASC`,
            [area_id, date]
        );

        
        res.status(201).json({ 
            success: true,
            data: results, 
            message: 'List of bookings' 
        });
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ 
            success: false,
            message: 'Internal server error', 
            error: error.message 
        });
    }
});

module.exports = router;
