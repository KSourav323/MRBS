require('dotenv').config();
const express = require('express');   
const router = express.Router();
const {auth, isAdmin} = require('../middleware/auth');
const pool = require('../functions/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const csvParser = require('csv-parser');
const xlsx = require('xlsx');    
const nodemailer = require('nodemailer');

router.use(auth);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, '../uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });

const fileFilter = (req, file, cb) => {
const allowedExtensions = /(\.csv|\.xlsx|\.xls)$/i;
if (allowedExtensions.test(path.extname(file.originalname))) {
    cb(null, true);
} else {
    cb(new Error('Only CSV and Excel files are allowed.'), false);
}
};

const upload = multer({ storage, fileFilter });

const roleToLevel = {
    user: 1,
    admin: 2
  };

const statusMap = {
    '-1' : 'rejected',
    '1' : 'accepted'
  };

  async function sendEmail(to, subject, text, html) {
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // e.g., smtp.gmail.com for Gmail
      port: 465 ,                // 465 for secure, 587 for non-secure
      secure: true,            // true for port 465, false for 587
      auth: {
        user: process.env.ADMIN_MAIL,   // your email address
        pass: process.env.MAIL_APP_PASSWORD,        // your email password or app password
      },
    });
  
    let mailOptions = {
      from: '"MRBS Admin" <mrbs@gmail.com>', // sender address
      to,                                          // list of receivers
      subject,                                     // subject line
      text,                                        // plain text body
      html,                                        // html body (optional)
    };
  
    try {
      let info = await transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

router.post('/addUser', isAdmin, async (req, res) => {
    try {
        const { name, email, role } = req.body;

       const level = roleToLevel[role]
        
        const [existingUser] = await pool.query(
            'SELECT * FROM mrbs_users WHERE email = ?',
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(202).json({ 
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
        
        res.status(201).json({ 
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

router.post('/addArea', isAdmin, async (req, res) => {
    try {
        const { areaName, areaAdminEmail, approvalEnabled, isPublic } = req.body;
        
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
            'INSERT INTO mrbs_area (area_name, area_admin_email, approval_enabled, is_public) VALUES (?, ?, ?, ?)',
            [areaName, areaAdminEmail, approvalEnabled, isPublic]
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

router.post('/addRoom', isAdmin, async (req, res) => {
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

router.post('/addBooking', async (req, res) => {
    try {
        const { area_id, room_id, subject, description, date, start_time, end_time } = req.body;
        const create_by = req.user.emails[0].value

        const [overlaps] = await pool.query(
            `SELECT * FROM mrbs_entry 
             WHERE room_id = ? 
             AND date = ?
            AND (is_approved = 0 OR is_approved = 1)
             AND (
                 (start_time < ? AND end_time > ?) OR 
                 (start_time < ? AND end_time > ?) OR 
                 (start_time >= ? AND end_time <= ?) 
             )`,
            [room_id, date, end_time, start_time, end_time, start_time, start_time, end_time]
        );

        if (overlaps.length > 0) {
            return res.status(202).json({
                success: false,
                message: 'Time slot overlaps with existing booking'
            });
        }

        const [areaData] = await pool.query('SELECT * FROM mrbs_area WHERE id = ?', [area_id]);
        const adminEmail = areaData[0].area_admin_email;
        const areaName = areaData[0].area_name;

        if (areaData.length === 0) {
            return res.status(400).json({ success: false, message: 'Invalid area_id' });
        }
        const approval_enabled = areaData[0].approval_enabled;


        if (approval_enabled == 1) {
            query = `INSERT INTO mrbs_entry 
                     (area_id, date, start_time, end_time, room_id, create_by, subject, description)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
            values = [area_id, date, start_time, end_time, room_id, create_by, subject, description];
        } else {
            query = `INSERT INTO mrbs_entry 
                     (area_id, date, start_time, end_time, room_id, create_by, subject, description, is_approved)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            values = [area_id, date, start_time, end_time, room_id, create_by, subject, description, 1];
        }

        const [result] = await pool.query(query, values);

        if (result.affectedRows === 1) {

            sendEmail(adminEmail, 'MRBS booking', `There is a new request for ${areaName} waiting for your approval.`)

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

router.post('/listBookings', async (req, res) => {
    try {
        const { area_id, date } = req.body;

        const [results] = await pool.query(
            `SELECT e.*, r.room_name, a.area_name
             FROM mrbs_entry e
             JOIN mrbs_room r ON e.room_id = r.id
             JOIN mrbs_area a ON e.area_id = a.id
             WHERE e.area_id = ? 
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

router.post('/listRequests', async (req, res) => {
    try {
        const { adminEmail } = req.body;
        const userEmail = req.user.emails[0].value;

        if (adminEmail !== userEmail) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view these requests'
            });
        }
        
        const [results] = await pool.query(
            `SELECT e.*, r.room_name, 
                    a.area_name, a.area_admin_email
             FROM mrbs_entry e
             JOIN mrbs_room r ON e.room_id = r.id
             JOIN mrbs_area a ON e.area_id = a.id
             WHERE r.room_admin_email = ? AND e.is_approved = 0`,
            [userEmail]
        );
        
        res.status(201).json({ 
            success: true,
            data: results, 
            message: 'List of requests' 
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

router.post('/listMyEntry', async (req, res) => {
    try {
        const { adminEmail } = req.body;
        const userEmail = req.user.emails[0].value;

        if (adminEmail !== userEmail) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view these requests'
            });
        }
        
        const [results] = await pool.query(
            `SELECT e.*, r.room_name, 
                    a.area_name, a.area_admin_email
             FROM mrbs_entry e
             JOIN mrbs_room r ON e.room_id = r.id
             JOIN mrbs_area a ON e.area_id = a.id
             WHERE r.room_admin_email = ? 
             AND (e.is_approved = 1 OR e.is_approved = -1)
             ORDER BY e.date DESC, e.start_time DESC`
             ,
            [userEmail]
        );
        
        res.status(201).json({ 
            success: true,
            data: results, 
            message: 'List of requests' 
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

router.post('/addApproval', async (req, res) => {
    try {
        const { request_id, status } = req.body;
        const userEmail = req.user.emails[0].value;

        const [request] = await pool.query(
            `SELECT e.*, r.room_admin_email 
             FROM mrbs_entry e
             JOIN mrbs_room r ON e.room_id = r.id
             WHERE e.id = ? AND r.room_admin_email = ?`,
            [request_id, userEmail]
        );
        
        if (!request.length) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to approve this request'
            });
        }

        const [entryData] = await pool.query(
            'SELECT create_by FROM mrbs_entry WHERE id = ?',
            [request_id]
        );

        const createByEmail = entryData[0].create_by;
        statusWord = statusMap[status];


        const [result] = await pool.query(
            'UPDATE mrbs_entry SET is_approved = ? WHERE id = ?',
            [status, request_id]
        );


        if (result.affectedRows === 1) {

            sendEmail(createByEmail, 'MRBS booking', `Your request has been ${statusWord}.`)

            res.status(201).json({
                success: true,
                message: 'successful'
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

router.post('/import', upload.single('csvFile'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded.' });
      }
  
      const filePath = req.file.path;
      const ext = path.extname(req.file.originalname).toLowerCase();
      let dataRows = [];
  
      if (ext === '.csv') {
        dataRows = await new Promise((resolve, reject) => {
          const results = [];
          fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', reject);
        });
      } 

      else if (ext === '.xlsx' || ext === '.xls') {
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        dataRows = xlsx.utils.sheet_to_json(sheet);
      } 
      else {
        return res.status(400).json({ success: false, message: 'Unsupported file type.' });
      }
  
      let insertedCount = 0;
  
      for (const row of dataRows) {
        const {level, name, email } = row;
  
        if (!name || !email) {
          console.log('Skipping row due to missing name or email:', row);
          continue;
        }

        const [existingUser] = await pool.query(
          'SELECT * FROM mrbs_users WHERE email = ?',
          [email]
        );
        if (existingUser.length > 0) {
          console.log(`User with email ${email} already exists. Skipping.`);
          continue;
        }
  
        const [result] = await pool.query(
          'INSERT INTO mrbs_users (level, name, email) VALUES (?, ?, ?)',
          [level, name, email]
        );
  
        if (result.affectedRows === 1) {
          insertedCount++;
        }
      }
  
      return res.status(201).json({
        success: true,
        message: 'File imported successfully.',
        insertedCount
      });
    } catch (error) {
      console.error('Error importing:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  });
  


module.exports = router;
