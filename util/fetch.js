const https = require("https");
const fs = require("fs");

// Write to a file
const writeFile = (filename, data) => new Promise((resolve, reject) => {
    fs.writeFile(filename, data, (err) => {
        if (err) reject(err);
        else resolve();
    });
});

// Fetch and save data as json
const fetchData = () => new Promise((resolve, reject) => {
    https.get("https://www.azuki.com/api/elemental_token_configs", (res) => {
        let data = "";
        res.on("data", (chunk) => data += chunk);
        res.on("end", async () => {
            const parsedData = JSON.parse(data);
            const slugs = parsedData.ELEMENTALS.map(elemental => {
                let obj = {};
                obj[elemental.name.substring(11)] = elemental.image.substring(36, 72);
                return obj;
            });
            try {
                await writeFile("data.json", JSON.stringify(slugs, null, 2));
                console.log("Data written to JSON file");
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }).on("error", reject);
});

// Convert json to js
const convertJsonToJs = async () => {
    try {
        const jsonString = fs.readFileSync("./data.json", "utf-8");
        const data = JSON.parse(jsonString);
        await writeFile("data.js", `const data = ${JSON.stringify(data, null, 2)};\nmodule.exports = data;`);
        console.log("JSON file converted to JS file");
    } catch (err) {
        console.error("Error reading file:", err);
    }
};

// Convert json to csv
const convertJsonToCsv = async () => {
    try {
        const data = fs.readFileSync('./data.json', 'utf8');
        const jsonData = JSON.parse(data);
        if (Array.isArray(jsonData) && jsonData.length > 0) {
            const csvData = [
                'id,slug', // header
                ...jsonData.map(obj => {
                    const key = Object.keys(obj)[0];
                    const value = obj[key];
                    return `${key},${value}`;
                }) // data
            ].join('\n');
            await writeFile('data.csv', csvData);
            console.log('JSON file converted to CSV file');
        } else {
            throw new Error('Invalid JSON data for CSV conversion.');
        }
    } catch (err) {
        console.error(err);
    }
};

// Main function
const main = async () => {
    try {
        await fetchData();
        await convertJsonToJs();
        await convertJsonToCsv();
    } catch (err) {
        console.error(err);
    }
};

main();
