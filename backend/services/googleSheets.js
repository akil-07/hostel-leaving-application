const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

const getDoc = async () => {
    if (!process.env.GOOGLE_SHEET_ID || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
        console.warn("Google Sheets Env Vars missing. Skipping Sheet operations.");
        return null;
    }

    const serviceAccountAuth = new JWT({
        email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    return doc;
};

const appendToSheet = async (data) => {
    try {
        const doc = await getDoc();
        if (!doc) return;

        const sheet = doc.sheetsByIndex[0];

        // Ensure headers exist if empty
        if (sheet.headerValues.length === 0) {
            await sheet.setHeaderRow(Object.keys(data));
        }

        await sheet.addRow(data);
        console.log("Added row to Google Sheet");
    } catch (error) {
        console.error('Error appending to Google Sheet:', error);
    }
};

const fetchFromSheet = async () => {
    try {
        const doc = await getDoc();
        if (!doc) return [];

        const sheet = doc.sheetsByIndex[0];
        const rows = await sheet.getRows();
        return rows.map(row => row.toObject());
    } catch (error) {
        console.error('Error fetching from Google Sheet:', error);
        return [];
    }
}

module.exports = { appendToSheet, fetchFromSheet };
