const fs = require("fs");
const { dateStr, getSunday } = require("../date/dateUtil");

const prepRun = process.argv[2] === "1";

const sun = dateStr(getSunday());
const files = fs.readdirSync("./exports");
const filesWithoutCurrent = files.filter(
    (file) =>
        file !== "archive" &&
        !file.endsWith(sun + ".xlsx") &&
        !file.endsWith(sun + ".txt")
);
const currentFiles = files.filter((file) => file !== "archive");

for (const file of filesWithoutCurrent) {
    fs.cpSync("./exports/" + file, "./exports/archive/" + file);
    fs.rmSync("./exports/" + file);
}

if (prepRun) {
    for (const file of currentFiles) {
        fs.rmSync("./exports/" + file);
    }
}
