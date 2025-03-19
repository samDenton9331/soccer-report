const nodemailer = require("nodemailer");
const config = require("../../../resources/config.json");
const { countReports } = require("../../counters/trainingCounters");

const readline = require("readline");

// Create an interface for input and output
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const askQuestion = (question) => {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
};

const from = process.env.GMAIL;
let to = process.env.GMAIL_TO;

if (config.emailToCoaches === true) {
    to = process.env.GMAIL_TO_COACHES;
    console.log("Sending emails to " + to);
}

const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: from,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

exports.sendEmail = async (attachmentName, text) => {

    const count = countReports();

    /**
     * type - @Mail.Options
     */
    const mailOptions = {
        from,
        to,
        subject: `Training Report ${count} - Week of ${attachmentName.split("Workout")[1].split('.')[0]}`,
        text,
        attachments: {
            filename: attachmentName,
            path: `${process.env.BASE_PATH}${process.env.fileSeperator}exports${process.env.fileSeperator}${attachmentName}`,
        },
    };

    console.log("Attaching", mailOptions.attachments.path, "to the email, subject of email is", mailOptions.subject);

    if (config.sendEmail === false) {
        console.log("Send email is turned off");
        process.exit(1);
    }

    // Get user input using await
    const answer = await askQuestion('Do you want to send Email to ' + to + '? ');
    console.log('Answer was', answer);

    if (answer.toUpperCase() !== 'Y') {
        console.log("Answer was not Y");
        process.exit(1);
        return;
    }

    if (config.sendEmail) {
        console.log("Sending email to", to);
        return new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error("Error sending email: ", error);
                } else {
                    console.log("Email sent: ", info.response);
                }
                resolve()
            });
        })
    }
    return
};
