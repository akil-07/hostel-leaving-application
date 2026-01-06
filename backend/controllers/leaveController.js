const { readData, writeData } = require('../db');
const { v4: uuidv4 } = require('uuid');
const { appendToSheet } = require('../services/googleSheets');

exports.createLeave = async (req, res) => {
    try {
        const {
            reason, fromDate, toDate,
            registerNumber, yearOfStudy, department,
            studentMobile, parentMobile, roomNumber,
            floorInCharge, numberOfDays, outTime
        } = req.body;
        const leaves = readData('leaves');

        const newLeave = {
            _id: uuidv4(),
            student: req.user.id,
            reason,
            fromDate,
            toDate,
            registerNumber,
            yearOfStudy,
            department,
            studentMobile,
            parentMobile,
            roomNumber,
            floorInCharge,
            numberOfDays,
            outTime,
            status: 'Pending',
            comments: '',
            createdAt: new Date().toISOString()
        };

        leaves.push(newLeave);
        writeData('leaves', leaves);

        // Append to Google Sheet (Async, don't block response)
        appendToSheet({
            ID: newLeave._id,
            StudentID: newLeave.student,
            Name: req.user.name || 'Student', // Ideally fetch name
            Reason: reason,
            From: fromDate,
            To: toDate,
            RegisterNo: registerNumber,
            Year: yearOfStudy,
            Dept: department,
            StudentMobile: studentMobile,
            ParentMobile: parentMobile,
            Room: roomNumber,
            FloorInCharge: floorInCharge,
            Days: numberOfDays,
            OutTime: outTime,
            Status: 'Pending',
            CreatedAt: newLeave.createdAt
        });

        res.json(newLeave);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getStudentLeaves = async (req, res) => {
    try {
        const leaves = readData('leaves');
        const studentLeaves = leaves.filter(l => l.student === req.user.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        res.json(studentLeaves);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getAllLeaves = async (req, res) => {
    try {
        if (req.user.role !== 'warden') return res.status(403).json({ msg: 'Access denied' });

        const leaves = readData('leaves');
        const users = readData('users');

        const leavesWithStudent = leaves.map(leave => {
            const student = users.find(u => u.id === leave.student);
            return {
                ...leave,
                student: student ? { name: student.name, email: student.email } : { name: 'Unknown', email: '' }
            };
        }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json(leavesWithStudent);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateLeaveStatus = async (req, res) => {
    try {
        if (req.user.role !== 'warden') return res.status(403).json({ msg: 'Access denied' });

        const { status, comments } = req.body;
        const leaves = readData('leaves');
        const index = leaves.findIndex(l => l._id === req.params.id);

        if (index === -1) return res.status(404).json({ msg: 'Leave request not found' });

        leaves[index].status = status;
        if (comments) leaves[index].comments = comments;

        writeData('leaves', leaves);

        // Return with populated student for frontend consistency
        const users = readData('users');
        const student = users.find(u => u.id === leaves[index].student);
        const updatedLeave = {
            ...leaves[index],
            student: student ? { name: student.name, email: student.email } : { name: 'Unknown', email: '' }
        };

        res.json(updatedLeave);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
