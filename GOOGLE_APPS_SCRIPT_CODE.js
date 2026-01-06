function doPost(e) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet();
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    if (action === "register") {
        return registerUser(data, sheet);
    } else if (action === "login") {
        return loginUser(data, sheet);
    } else if (action === "createLeave") {
        return createLeave(data, sheet);
    } else if (action === "getStudentLeaves") {
        return getStudentLeaves(data, sheet);
    } else if (action === "getAllLeaves") {
        return getAllLeaves(data, sheet);
    } else if (action === "updateLeaveStatus") {
        return updateLeaveStatus(data, sheet);
    }

    return response({ status: "error", message: "Invalid action" });
}

function response(data) {
    return ContentService.createTextOutput(JSON.stringify(data))
        .setMimeType(ContentService.MimeType.JSON);
}

// --- Auth Functions ---

function registerUser(data, sheet) {
    const usersSheet = sheet.getSheetByName("users");
    if (!usersSheet) return response({ status: "error", message: "Users sheet not found" });

    const users = usersSheet.getDataRange().getValues();
    // Check if email exists
    for (let i = 1; i < users.length; i++) {
        if (users[i][2] === data.email) { // Email is column 3 (index 2)
            return response({ status: "error", message: "User already exists" });
        }
    }

    const id = Utilities.getUuid();
    // Simple "hash" (Not production secure, but better than plain text for GAS demo)
    // In real GAS, you usually send plain text or use a library, but let's keep it simple.
    // We will store the password AS IS for this simple demo or you can add simple encoding.
    const password = data.password;

    usersSheet.appendRow([id, data.name, data.email, password, data.role || 'student']);

    return response({
        status: "success",
        token: id, // Using ID as simple token
        user: { id: id, name: data.name, role: data.role || 'student' }
    });
}

function loginUser(data, sheet) {
    const usersSheet = sheet.getSheetByName("users");
    if (!usersSheet) return response({ status: "error", message: "Users sheet not found" });

    const users = usersSheet.getDataRange().getValues();
    for (let i = 1; i < users.length; i++) {
        if (users[i][2] === data.email && users[i][3] === data.password) {
            const user = { id: users[i][0], name: users[i][1], role: users[i][4] };
            return response({
                status: "success",
                token: user.id,
                user: user
            });
        }
    }
    return response({ status: "error", message: "Invalid credentials" });
}

// --- Leave Functions ---

function createLeave(data, sheet) {
    const leavesSheet = sheet.getSheetByName("leaves");
    const leaveId = Utilities.getUuid();
    const timestamp = new Date().toLocaleString();

    // Columns: Timestamp, RegNo, Name, Year, Dept, StudentMobile, ParentMobile, Room, Reason, Floor, Dates, ID, StudentID, Status, Comments, From, To, Days, OutTime
    leavesSheet.appendRow([
        timestamp,
        data.registerNumber,
        data.userName,
        data.yearOfStudy,
        data.department,
        data.studentMobile,
        data.parentMobile,
        data.roomNumber,
        data.reason,
        data.floorInCharge,
        `${data.fromDate} to ${data.toDate} (${data.numberOfDays} days)`,
        leaveId,
        data.studentId, // Student UUID
        'Pending',
        '', // Comments
        data.fromDate,
        data.toDate,
        data.numberOfDays,
        data.outTime
    ]);

    return response({ status: "success", message: "Leave created" });
}

function getStudentLeaves(data, sheet) {
    const leavesSheet = sheet.getSheetByName("leaves");
    const rows = leavesSheet.getDataRange().getValues();
    const headers = rows[0];
    const leaves = [];

    // Assuming: 
    // Col 11 (index 11) is ID
    // Col 12 (index 12) is StudentID
    // Col 13 (index 13) is Status
    // Col 14 (index 14) is Comments
    // Col 8 (index 8) is Reason
    // Col 15 (index 15) is FromDate
    // Col 16 (index 16) is ToDate

    for (let i = 1; i < rows.length; i++) {
        if (rows[i][12] === data.userId) { // Check StudentID
            leaves.push({
                _id: rows[i][11],
                status: rows[i][13],
                reason: rows[i][8],
                fromDate: rows[i][15],
                toDate: rows[i][16],
                createdAt: rows[i][0],
                comments: rows[i][14]
            });
        }
    }
    // Reverse to show newest first
    return response(leaves.reverse());
}

function getAllLeaves(data, sheet) {
    const leavesSheet = sheet.getSheetByName("leaves");
    const rows = leavesSheet.getDataRange().getValues();
    const leaves = [];

    for (let i = 1; i < rows.length; i++) {
        leaves.push({
            _id: rows[i][11],
            student: { name: rows[i][2], registerNumber: rows[i][1] }, // Mock object
            registerNumber: rows[i][1],
            department: rows[i][4],
            yearOfStudy: rows[i][3],
            roomNumber: rows[i][7],
            studentMobile: rows[i][5],
            reason: rows[i][8],
            fromDate: rows[i][15],
            toDate: rows[i][16],
            numberOfDays: rows[i][17],
            outTime: rows[i][18],
            floorInCharge: rows[i][9],
            status: rows[i][13],
            comments: rows[i][14],
            createdAt: rows[i][0]
        });
    }
    return response(leaves.reverse());
}


function updateLeaveStatus(data, sheet) {
    const leavesSheet = sheet.getSheetByName("leaves");
    const rows = leavesSheet.getDataRange().getValues();

    for (let i = 1; i < rows.length; i++) {
        if (rows[i][11] === data.leaveId) { // Check ID
            leavesSheet.getRange(i + 1, 14).setValue(data.status); // Approving Status (Col 14, 1-based)
            leavesSheet.getRange(i + 1, 15).setValue(data.comments); // Comments (Col 15)
            return response({ status: "success" });
        }
    }
    return response({ status: "error", message: "Leave not found" });
}
