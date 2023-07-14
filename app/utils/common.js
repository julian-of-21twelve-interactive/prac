const moment = require("moment");

async function generateFormNumber(formNumber) {
    const currentDate = moment().format('DDMMYY');
    let lastFormNumber = {
        date: currentDate,
        number: formNumber
    }
    lastFormNumber.number++;
    const formattedNumber = lastFormNumber.number.toString().padStart(2, '0');

    const formatNmber = `${currentDate}_${formattedNumber}`;
    return formatNmber;
}

const getUTCTimeStamp = () => {
    return moment.utc().valueOf();
}

module.exports = {
    generateFormNumber,
    getUTCTimeStamp
}