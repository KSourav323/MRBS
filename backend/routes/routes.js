const express = require('express');   
const router = express.Router();
const {auth} = require('../middleware/auth');
const pool = require('../functions/db');
const { v4: uuidv4 } = require('uuid');

router.use(auth);

const roleToLevel = {
    user: 1,
    admin: 2
  };

router.post('/addUser', async (req, res) => {
    try {
        const { name, email, role } = req.body;

       const level = roleToLevel[role]
        
        // Check if user already exists
        const [existingUser] = await pool.query(
            'SELECT * FROM mrbs_users WHERE email = ?',
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({ 
                success: false, 
                message: 'User already exists' 
            });
        }

        // Insert new user
        const [result] = await pool.query(
            'INSERT INTO mrbs_users (level, name, email) VALUES (?, ?, ?)',
            [level, name, email]
        );

        if (result.affectedRows === 1) {
            res.status(201).json({
                success: true,
                message: 'User added successfully',
                userId: result.insertId
            });
        } else {
            throw new Error('Failed to add user');
        }

    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

router.post('/listUser', async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM mrbs_users');
        
        res.status(200).json({ 
            success: true,
            data: results, 
            message: 'List of users' 
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

router.post('/addArea', async (req, res) => {
    try {
        const { areaName, areaAdminEmail } = req.body;
        
        const [existingArea] = await pool.query(
            'SELECT * FROM mrbs_area WHERE area_name = ?',
            [areaName]
        );

        if (existingArea.length > 0) {
            return res.status(409).json({ 
                success: false, 
                message: 'Area already exists' 
            });
        }

        const [result] = await pool.query(
            'INSERT INTO mrbs_area (area_name, area_admin_email, approval_enabled) VALUES (?, ?, ?)',
            [areaName, areaAdminEmail, 1]
        );

        if (result.affectedRows === 1) {
            res.status(201).json({
                success: true,
                message: 'Area added successfully',
                userId: result.insertId
            });
        } else {
            throw new Error('Failed to add area');
        }

    } catch (error) {
        console.error('Error adding area:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

router.post('/listArea', async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM mrbs_area');
        
        res.status(200).json({ 
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

router.post('/addRoom', async (req, res) => {
    try {
        const { areaId, roomName, description, capacity, roomAdminEmail } = req.body;
        
        const [existingRoom] = await pool.query(
            'SELECT * FROM mrbs_room WHERE room_name = ? AND area_id = ?',
            [roomName, areaId]
        );

        if (existingRoom.length > 0) {
            return res.status(409).json({ 
                success: false, 
                message: 'Room already exists' 
            });
        }

        const [result] = await pool.query(
            'INSERT INTO mrbs_room (area_id, room_name, description, capacity, room_admin_email) VALUES (?, ?, ?, ?, ?)',
            [areaId, roomName, description, capacity, roomAdminEmail]
        );

        if (result.affectedRows === 1) {
            res.status(201).json({
                success: true,
                message: 'Room added successfully',
                userId: result.insertId
            });
        } else {
            throw new Error('Failed to add room');
        }

    } catch (error) {
        console.error('Error adding room:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
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
        
        res.status(200).json({ 
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

router.post('/addBooking', async (req, res) => {
    try {
        const { name, email, role } = req.body;

       const level = roleToLevel[role]
        
        const [existingUser] = await pool.query(
            'SELECT * FROM mrbs_users WHERE email = ?',
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({ 
                success: false, 
                message: 'User already exists' 
            });
        }

        const [result] = await pool.query(
            'INSERT INTO mrbs_users (level, name, email) VALUES (?, ?, ?)',
            [level, name, email]
        );

        if (result.affectedRows === 1) {
            res.status(201).json({
                success: true,
                message: 'entry added successfully',
                userId: result.insertId
            });
        } else {
            throw new Error('Failed to add entry');
        }

    } catch (error) {
        console.error('Error adding entry:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

router.post('/listBooking', (req, res) => {
    // console.log('added');
    // console.log(req.body);
    pool.query('SELECT * FROM mrbs_users', (error, results, fields) => {
        if (error) {
          console.error('Error executing query:', error);
          return;
        }
        console.log('Table contents:', results);
      });
  res.status(200).json({ message: 'added' });
});

router.post('/addApproval', (req, res) => {
    console.log(req.body);
  res.status(200).json({ message: 'added' });
});


module.exports = router;
