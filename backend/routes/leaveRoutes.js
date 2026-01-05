const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createLeave, getStudentLeaves, getAllLeaves, updateLeaveStatus } = require('../controllers/leaveController');

router.post('/', auth, createLeave);
router.get('/my-leaves', auth, getStudentLeaves);
router.get('/all', auth, getAllLeaves);
router.put('/:id', auth, updateLeaveStatus);

module.exports = router;
