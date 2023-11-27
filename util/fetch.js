const https = require("https");
const fs = require("fs");

// Write to a file
const writeFile = (filename, data, flag = 'w') => new Promise((resolve, reject) => {
    fs.writeFile(filename, data, { flag }, (err) => {
        if (err) reject(err);
        else resolve();
    });
});

// Fetch and save data as json
const fetchData = async () => {
    const limit = 1000; // Max records per request
    let skip = 0;       // Starting point for each batch
    let hasMore = true; // Flag to indicate more data to fetch

    let allSlugs = []; // Accumulate all slugs here

    while (hasMore) {
        const url = `https://www.azuki.com/api/elemental_token_configs?skip=${skip}&limit=${limit}`;
        await new Promise((resolve, reject) => {
            https.get(url, (res) => {
                let data = "";
                res.on("data", (chunk) => data += chunk);
                res.on("end", () => {
                    const parsedData = JSON.parse(data);

                    if (parsedData.ELEMENTALS && parsedData.ELEMENTALS.length > 0) {
                        parsedData.ELEMENTALS.forEach(elemental => {
                            let obj = {};
                            obj[elemental.name.substring(11)] = elemental.image.substring(36, 72);
                            allSlugs.push(obj);
                        });

                        if (parsedData.ELEMENTALS.length < limit) {
                            hasMore = false; // No more data to fetch
                        }
                    } else {
                        hasMore = false; // No data in response
                    }

                    skip += limit; // Increment for next batch
                    resolve();
                });
            }).on("error", (err) => {
                console.error("Error during HTTP request:", err);
                reject(err);
            });
        });
    }

    // Write accumulated data to file
    try {
        await writeFile("data.json", JSON.stringify(allSlugs, null, 2));
        console.log("Data written to JSON file");
    } catch (err) {
        console.error("Error writing to file:", err);
    }
};

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
