const { v4: uuidv4 } = require('uuid');
const { fetchFromSheet, appendToSheet, updateSheetRow } = require('../services/googleSheets');

// Helper to map Google Sheet Row -> Frontend Object
const mapSheetRow = (row) => {
    return {
        _id: row.ID,
        student: { // Mock populated student object since we store name in sheet
            id: row.StudentID,
            name: row['Student Name'],
            email: '' // Not stored in leave sheet
        },
        // If we strictly need the ID at the top level for checks:
        studentId: row.StudentID,

        registerNumber: row['Register Number or Admission Number'],
        yearOfStudy: row['Year of study'],
        department: row['Department'],
        studentMobile: row['Student Mobile Number'],
        parentMobile: row['Parent Mobile Number'],
        roomNumber: row['Room Number'],
        floorInCharge: row['Floor In charge'],

        reason: row['Reason'],
        // We will store raw dates in new columns for easier parsing
        fromDate: row['FromDate'] || new Date().toISOString(),
        toDate: row['ToDate'] || new Date().toISOString(),
        numberOfDays: row['Number of Days'],
        outTime: row['Out Time'],

        status: row['Status'] || 'Pending',
        comments: row['Comments'] || '',
        createdAt: row['Timestamp'] || new Date().toISOString()
    };
};

exports.createLeave = async (req, res) => {
    try {
        const {
            reason, fromDate, toDate,
            registerNumber, yearOfStudy, department,
            studentMobile, parentMobile, roomNumber,
            floorInCharge, numberOfDays, outTime
        } = req.body;

        const newLeaveId = uuidv4();
        const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

        // Object matching Google Sheet Columns
        // Note: We are ADDING columns (ID, StudentID, Status, etc) that might not be in the user's original form.
        // They should add these columns to their sheet or the API will auto-add them if getting fresh.
        const sheetRow = {
            'Timestamp': timestamp,
            'Register Number or Admission Number': registerNumber,
            'Student Name': req.user.name || 'Student',
            'Year of study': yearOfStudy,
            'Department': department,
            'Student Mobile Number': studentMobile,
            'Parent Mobile Number': parentMobile,
            'Room Number': roomNumber,
            'Reason': reason,
            'Floor In charge': floorInCharge,
            'Leave Date(s)': `${fromDate} to ${toDate} (${numberOfDays} days)`,

            // System Columns (For App Functionality)
            'ID': newLeaveId,
            'StudentID': req.user.id,
            'Status': 'Pending',
            'Comments': '',
            'FromDate': fromDate,
            'ToDate': toDate,
            'Number of Days': numberOfDays,
            'Out Time': outTime
        };

        await appendToSheet('leaves', sheetRow);

        // Return the mapped object so frontend updates immediately
        res.json(mapSheetRow(sheetRow));
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getStudentLeaves = async (req, res) => {
    try {
        const rows = await fetchFromSheet('leaves');
        const studentLeaves = rows
            .map(mapSheetRow)
            .filter(l => l.studentId === req.user.id)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json(studentLeaves);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getAllLeaves = async (req, res) => {
    try {
        if (req.user.role !== 'warden') return res.status(403).json({ msg: 'Access denied' });

        const rows = await fetchFromSheet('leaves');
        const allLeaves = rows
            .map(mapSheetRow)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json(allLeaves);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateLeaveStatus = async (req, res) => {
    try {
        if (req.user.role !== 'warden') return res.status(403).json({ msg: 'Access denied' });

        const { status, comments } = req.body;

        await updateSheetRow('leaves', req.params.id, {
            'Status': status,
            'Comments': comments
        });

        // We return the updated object mock
        res.json({ _id: req.params.id, status, comments });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
