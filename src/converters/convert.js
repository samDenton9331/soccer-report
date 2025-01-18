const { getMonday, dateStr } = require("./../date/dateUtil");

const xlsx = require("node-xlsx").default;

exports.getFitbod = () => {
    // Parse a file
    const workSheetsFromFile = xlsx.parse(
        process.env.FILE_PATH,
    );
    const fitbodData = workSheetsFromFile[0].data;
    let i = 0;
    const map = {};
    let monday = getMonday(new Date());
    let sunday = new Date();
    const stravaData = {};
    for (const row of fitbodData) {
        if (i !== 0) {
            let [
                date,
                workout,
                reps,
                kg,
                d1,
                d2,
                incline,
                resistence,
                warmup,
            ] = row;
            let day = new Date(date);
            date = dateStr(day) + " 12:00:00.000Z"
            if (day >= monday && day <= sunday) {
                if (workout === "Walking" || workout === "Running") {
                    if (!map[date.split(" ")[0] + "-" + workout])
                        map[date.split(" ")[0] + "-" + workout] = {
                            duration: Math.round(d1 / 60),
                            distance: d2 / 1000,
                        };
                } else {
                    if (!map[date.split(" ")[0]]) map[date.split(" ")[0]] = {};
                    if (!map[date.split(" ")[0]][date + "_" + workout])
                        map[date.split(" ")[0]][date + "_" + workout] = [];
                    map[date.split(" ")[0]][date + "_" + workout].push({
                        workout,
                        reps,
                        kg,
                        warmup,
                        ibs: Math.round(kg * 2.2046),
                    });
                }
            }
        }
        i++;
    }
    console.log("Done conversion of fitbod data");
    return map;
};
