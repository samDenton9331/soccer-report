const excel = require("excel4node");
const { getMonday, dateStr, getDateFromDayName } = require("./../date/dateUtil");

let monday = getMonday(new Date());

exports.writeExcel = (map) => {
    return new Promise((resolve, reject) => {
        const filename = `GymWorkout${dateStr(monday)} - ${getDateFromDayName(
            "sunday"
        )}.xlsx`;
        const writePath = `./exports/${filename}`;
        console.log("Writing to file", writePath, ", full path", filename);

        // Create a new instance of a Workbook class
        var workbook = new excel.Workbook();

        // Add Worksheets to the workbook
        var worksheet = workbook.addWorksheet("Sheet 1");

        // Create a reusable style
        var style = workbook.createStyle({
            font: {
                size: 12,
            },
        });

        const chestDays = ["Barbell Bench"]
        const legDays = ["Squat"];

        const rotation = [
            "Biceps and Back",
            "Lower Body",
            "Chest And Shoulders",
        ];

        const findRotation = (workout) => {
            const exercises = Object.keys(workout).map(
                (key) => key.split("_")[1]
            );
            for (const exercise of exercises) {
                for (const chestDay of chestDays) {
                    if (exercise.includes(chestDay)) {
                        return rotation[2];
                    }
                }
                for (const legDay of legDays) {
                    if (exercise.includes(legDay)) {
                        return rotation[1];
                    }
                }
            }
            return rotation[0];
        }

        let rotationIndex = 0;
        let row = 1;
        let col = 1;

        const write = (value) => {
            // console.log("write value", value, "at (", row, ",", col, ")");
            worksheet.cell(row, col).string(value).style(style);
        };

        write(
            `Samuel Denton - Training - Week of ${dateStr(
                monday
            )} - ${getDateFromDayName("sunday")}`
        );

        const keys = Object.keys(map).sort(
            (a, b) => new Date(a).getTime() - new Date(b).getTime()
        );

        for (const key of keys) {
            const rowUp = () => row++;
            const colUp = () => col++;
            const colDown = () => col--;
            const resetCol = () => (col = 1);

            rowUp();
            rowUp();

            if (key.endsWith("Walking") || key.endsWith("Running")) {
            } else if (Object.keys(map[key]).length > 0) {
                const workout = map[key];
                write(key + " - " + findRotation(workout));
                row++;
                rotationIndex++;
                if (rotationIndex === 3) rotationIndex = 0;
                col++;
                write("Exercise");
                col++;
                write("reps x ibs");
                row++;
                col--;
                for (const key in workout) {
                    const sets = workout[key];
                    write(sets[0].workout);
                    colUp();
                    for (const set of sets) {
                        write(`${set.reps.trim()} reps x ${set.ibs} ibs`);
                        rowUp();
                    }
                    colDown();
                }
            }

            resetCol();
            row++;
        }

        workbook.write(writePath, (e) => {
            if (e === null || e === "null") {
                console.log("Excel write to path", writePath, "finishes");
                resolve(filename);
                return;
            }
            console.log(e);
        });
    });
};
