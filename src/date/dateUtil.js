const weekOffset = 1;

exports.getMonday = (d = new Date()) => {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    const mon = new Date(d.setDate(diff));
    mon.setHours(0, 0, 0, 0);
    mon.setDate(mon.getDate() - (7 * weekOffset));
    return mon;
};

exports.getDayFromMonday = (d = new Date(), upset = 0) => {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6 : 1) + upset; // adjust when day is sunday
    const dayOffset = new Date(d.setDate(diff));
    dayOffset.setHours(0, 0, 0, 0);
    dayOffset.setDate(dayOffset.getDate() - 7 * weekOffset);
    return dayOffset;
};

exports.getSunday = () => exports.getDayFromMonday(new Date(), 6);

exports.getDayName = (dateStr, locale = "en") => {
    var date = new Date(dateStr);
    date.setDate(date.getDate() + 1);
    return date.toLocaleDateString(locale, { weekday: "long" });
};

const getOffsetOfDay = (dayName) => {
    if (dayName === "monday") return 0;
    if (dayName === "tuesday") return 1;
    if (dayName === "wednesday") return 2;
    if (dayName === "thursday") return 3;
    if (dayName === "friday") return 4;
    if (dayName === "saturday") return 5;
    if (dayName === "sunday") return 6;
}

exports.getDateFromDayName = (dayName) => {
    let offset = getOffsetOfDay(dayName.toLowerCase());
    var date = this.getDayFromMonday(new Date(), offset);
    return exports.dateStr(date);
};

exports.getDayNameFromDate = (date, locale = "en") => {
    return date.toLocaleDateString(locale, { weekday: "long" });
};

const pad = num => num < 10 ? "0" + num : num;

exports.dateStr = (day) =>
    `${day.getFullYear()}-${pad(day.getMonth() + 1)}-${pad(day.getDate())}`;
