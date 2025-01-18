const fs = require("fs");
const input = require("../../resources/input.json");
const {
    getDayName,
    getDateFromDayName,
    dateStr,
    getMonday,
    getSunday
} = require("../date/dateUtil");
const { countReports } = require("../counters/trainingCounters");

const mon = dateStr(getMonday());
const sun = dateStr(getSunday());

exports.writeText = (text) => {
    fs.writeFileSync(`./exports/output${mon} - ${sun}.txt`, text);
    return text;
};

const days = {
    monday: "",
    tuesday: "",
    wednesday: "",
    thursday: "",
    friday: "",
    saturday: "",
    sunday: "",
};

const workoutCustomize = (day) => {
    let workout = day[0].workout.toLowerCase();
    let counter = 0;
    if (workout === "sit up") {
        for (const set of day) {
            counter += parseInt(set.reps);
        }
        return ` (${counter} reps)`;
    }
    if (workout === "russian twist") {
        for (const set of day) {
            counter += parseInt(set.reps);
        }
        return ` (${counter} reps)`;
    }
    return "";
};

const processDay = (key, map, type) => {
    if (!key.endsWith("-Running") && !key.endsWith("-Walking")) {
        const day = map[key];
        let dayString = days[getDayName(key).toLowerCase()];
        if (dayString === "")
            dayString = getDayName(key).toUpperCase() + " (" + key + ")";
        const addText = (t, prefix = "") => (dayString += prefix + t);
        if (type === "gym") {
            addText(" - GYM WORKOUT - 5m Warmup Treadmill Walk");
        }
        let i = 1;
        for (let workoutKey in day) {
            addText(
                day[workoutKey][0].workout +
                    workoutCustomize(day[workoutKey], day),
                ", "
            );
            i++;
        }
        return dayString;
    } else {
        const walkRun = map[key];
        let dateKey;
        let comments;
        let activity;
        let keyToSet;
        if (key.includes("Run")) {
            dateKey = key.split("-Running")[0];
            activity = "Running";
            keyToSet = "Run";
        }
        if (key.includes("Walk")) {
            dateKey = key.split("-Walking")[0];
            activity = "Walking";
            keyToSet = "Walk";
        }
        comments = input[getDayName(dateKey).toLowerCase() + keyToSet]
            ? " - " +
              input[getDayName(dateKey).toLowerCase() + keyToSet] +
              " - "
            : "";
        days[getDayName(dateKey).toLowerCase() + keyToSet] =
            getDayName(dateKey).toUpperCase() +
            " (" +
            dateKey +
            `) - ${activity + comments} - ${parseFloat(
                walkRun.distance
            ).toFixed(2)} km, ${walkRun.duration} mins`;
    }
};

const getComments = (soccerDay) => {
    if (soccerDay.comments) {
        return ", " + soccerDay.comments;
    }
    return "";
};

const buildSoccerStr = (soccerDay, day, strs) => {
    if (soccerDay?.time) {
        let str = "";
        if (soccerDay?.type === "Game") {
            str = `${soccerDay.time} mins, position Goalkeeper${getComments(
                soccerDay
            )}`;
        }
        if (soccerDay?.type === "Training") {
            str = `${soccerDay.time} mins${getComments(soccerDay)}`;
        }
        strs.push(
            day.toUpperCase() +
                " (" +
                getDateFromDayName(day) +
                `) - ` +
                `Soccer ${soccerDay.type}, ${str}`
        );
    }
};

const buildSoccerStrJuggles = (soccerDay, day, strs) => {
    if (soccerDay?.max > 0) {
        strs.push(
            day.toUpperCase() +
                " (" +
                getDateFromDayName(day) +
                `) - ` +
                `Max number of juggles was ${soccerDay.max} - practiced for ${soccerDay.time} mins${getComments(soccerDay)}`
        );
    }
};

const defaultDays = (soccer) => {
    for (const key in days) {
        if (
            days[key] === "" &&
            !soccer[key.toUpperCase() + "_Game"]?.time &&
            !days[key + "Walk"] &&
            !days[key + "Run"]
        ) {
            days[key] =
                key.toUpperCase() + ` (${getDateFromDayName(key)}) - Rest Day`;
        }
    }
};

const buildSoccerAndJuggles = (map, soccer, day, strs) => {
    if (soccer[day.toUpperCase() + "_Juggles"]) {
        const soccerDay = soccer[day.toUpperCase() + "_Juggles"];
        buildSoccerStrJuggles(soccerDay, day, strs);
    }
    if (soccer[day.toUpperCase() + "_Training"]) {
        const soccerDay = soccer[day.toUpperCase() + "_Training"];
        buildSoccerStr(soccerDay, day, strs);
    }
    if (soccer[day.toUpperCase() + "_Game"]) {
        const soccerDay = soccer[day.toUpperCase() + "_Game"];
        buildSoccerStr(soccerDay, day, strs);
    }
};

exports.writeEmailText = (map, soccer) => {
    const addDay = (day) => {
        const strs = [days[day]];
        if (days[day + "Walk"]) {
            strs.push(days[day + "Walk"]);
        }
        if (days[day + "Run"]) {
            strs.push(days[day + "Run"]);
        }
        buildSoccerAndJuggles(map, soccer, day, strs);
        strs.push("");
        return strs;
    };

    for (const key in map) {
        let dayString = processDay(key, map, "gym");
        let keyName = getDayName(key).toLowerCase();
        if (dayString) {
            days[keyName] = dayString;
        }
    }
    defaultDays(soccer);
    const data = [
        `Hi Guys, Please see Training Report ${countReports()} with attachments`,
        '',
        `Report`,
        `********`,
        ...addDay("monday"),
        ...addDay("tuesday"),
        ...addDay("wednesday"),
        ...addDay("thursday"),
        ...addDay("friday"),
        ...addDay("saturday"),
        ...addDay("sunday"),
        '',
        'Thanks',
        'Sam'
    ].filter((value, i, arr) => {
        if (arr[i] === "" && arr[i + 1] === "") {
            return false;
        }
        return true;
    });
    return exports.writeText(data.join("\n"));
};
