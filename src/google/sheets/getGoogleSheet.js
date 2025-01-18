// https://hackernoon.com/how-to-use-google-sheets-api-with-nodejs-cz3v316f
// node getGoogleSheet.js 1-fw75VtdcAPzjkuJodN-sbQRx03oEnDTkfL24rEdu6 Sheet1
const {
    getAuthToken,
    getSpreadSheet,
    getSpreadSheetValues,
} = require("./googleSheetService");

const spreadsheetId = process.env.SPREADSHEETID;

async function testGetSpreadSheet() {
    try {
        const auth = await getAuthToken();
        const response = await getSpreadSheet({
            spreadsheetId,
            auth,
        });
        console.log(
            "output for getSpreadSheet",
            JSON.stringify(response.data, null, 2)
        );
    } catch (error) {
        console.log(error.message, error.stack);
    }
}

const convert = (data) => {
    const map = {};
    for (const i in data.values) {
        const [day, max, time, comments] = data.values[i];
        if (i > 0 && day?.length > 0) {
            const juggling = {
                day,
                max,
                time,
                comments,
            };
            map[juggling.day.trim() + "_Juggles"] = juggling;
        }
    }
    return map;
};

async function testGetSpreadSheetValues() {
    try {
        const auth = await getAuthToken();
        const response = await getSpreadSheetValues({
            spreadsheetId,
            sheetName: "Juggles",
            auth,
        });
        return convert(response.data);
    } catch (error) {
        console.log(error.message, error.stack);
    }
}

const convertSoccer = (data) => {
    const map = {};
    for (const i in data.values) {
        const [day, position, type, time, comments] = data.values[i];
        if (i > 0 && day?.length > 0 && type?.length > 0) {
            const juggling = {
                day,
                position,
                type: type.trim(),
                time,
                comments,
            };
            map[juggling.day.trim() + "_" + type.trim()] = juggling;
        }
    }
    return map;
};

async function getSpreadSheetValuesSoccer() {
    try {
        const auth = await getAuthToken();
        const response = await getSpreadSheetValues({
            spreadsheetId,
            sheetName: "Soccer",
            auth,
        });
        return convertSoccer(response.data);
    } catch (error) {
        console.log(error.message, error.stack);
    }
}

module.exports = {
    testGetSpreadSheet,
    testGetSpreadSheetValues,
    getSpreadSheetValuesSoccer,
};
