const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const getDoc = async () => {
    if (!process.env.GOOGLE_SHEET_ID || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
        console.warn("Google Sheets Env Vars missing.");
        return null;
    }

    const serviceAccountAuth = new JWT({
        email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        scopes: SCOPES,
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    return doc;
};

const getSheetIndex = (collection) => {
    if (collection === 'leaves') return 0;
    if (collection === 'users') return 1;
    return 0;
};

const appendToSheet = async (collection, data) => {
    try {
        const doc = await getDoc();
        if (!doc) return;

        const sheet = doc.sheetsByIndex[getSheetIndex(collection)];
        if (!sheet) return;

        // Ensure headers exist if empty
        if (sheet.headerValues.length === 0) {
            await sheet.setHeaderRow(Object.keys(data));
        }

        await sheet.addRow(data);
    } catch (error) {
        console.error('Error appending to Google Sheet:', error);
    }
};

const fetchFromSheet = async (collection) => {
    try {
        const doc = await getDoc();
        if (!doc) return [];

        const index = getSheetIndex(collection);
        if (index >= doc.sheetCount) return []; // Sheet doesn't exist

        const sheet = doc.sheetsByIndex[index];
        const rows = await sheet.getRows();

        // Convert to array of objects
        return rows.map(row => {
            const obj = row.toObject();
            obj._rowIndex = row.rowNumber; // Keep track of row for updates
            return obj;
        });
    } catch (error) {
        console.error('Error fetching from Google Sheet:', error);
        return [];
    }
}

const updateSheetRow = async (collection, id, updates) => {
    try {
        const doc = await getDoc();
        if (!doc) return;

        const sheet = doc.sheetsByIndex[getSheetIndex(collection)];
        const rows = await sheet.getRows();
        const row = rows.find(r => r.get('ID') === id || r.get('_id') === id); // adaptable ID check

        if (row) {
            Object.keys(updates).forEach(key => {
                row.assign({ [key]: updates[key] });
            });
            await row.save();
        }
    } catch (error) {
        console.error('Error updating Google Sheet:', error);
    }
}

module.exports = { appendToSheet, fetchFromSheet, updateSheetRow };
