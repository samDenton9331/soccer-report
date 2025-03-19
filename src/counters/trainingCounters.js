const fs = require("fs");

exports.countReports = () => {
    const countCurrent = fs
        .readdirSync(process.env.BASE_PATH + "/exports")
        .filter((file) => file.endsWith(".xlsx")).length;
    const countAchive = fs
        .readdirSync(process.env.BASE_PATH + "/exports/archive")
        .filter((file) => file.endsWith(".xlsx")).length;
    return countCurrent + countAchive;
};
