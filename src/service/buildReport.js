require("dotenv").config();
const { getFitbod } = require("../converters/convert");
const { writeExcel } = require("../writers/excelWrite");
const { sendEmail } = require("../google/gmail/emailSendService");
const {
    getSpreadSheetValuesSoccer,
    testGetSpreadSheetValues,
} = require("../google/sheets/getGoogleSheet");
const { writeEmailText } = require("../writers/textWrite");

const run = async () => {
    const sheet = await testGetSpreadSheetValues();
    const soccer = await getSpreadSheetValuesSoccer();
    const fitbodMap = getFitbod();
    const attachmentName = await writeExcel(fitbodMap);
    const text = writeEmailText(fitbodMap, { ...soccer, ...sheet });
    await sendEmail(attachmentName, text);
    process.exit(1);
};

run();
