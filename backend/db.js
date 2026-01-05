const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

const getFilePath = (collection) => path.join(dataDir, `${collection}.json`);

const readData = (collection) => {
    const filePath = getFilePath(collection);
    if (!fs.existsSync(filePath)) {
        return [];
    }
    const jsonData = fs.readFileSync(filePath);
    return JSON.parse(jsonData);
};

const writeData = (collection, data) => {
    const filePath = getFilePath(collection);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

module.exports = { readData, writeData };
