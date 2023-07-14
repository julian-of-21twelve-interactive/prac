const schedule = require('node-schedule');
var rule = new schedule.RecurrenceRule();
rule.minute = new schedule.Range(0, 59, 10);
const { Op } = require('sequelize');
const { user } = require('../models/index');
const { getUTCTimeStamp } = require('../utils/common');
const getUtcTime = getUTCTimeStamp();

const deleteOTPCRON = schedule.scheduleJob(rule, async () => {
    try {
        const deleteData = await user.destroy({
            where: {
                dateAndTime: {
                    [Op.lte]: getUtcTime
                }
            }
        });
        if (!deleteData) {
            deleteOTPCRON.emit('deleteOTPCount');
        } else {
            console.log('data delete success');
        }
    } catch (e) {
        console.log('error', e)
        throw new Error(e)
    }
});

deleteOTPCRON.addListener('deleteOTPCount', (value) => {
    console.log('closing the cron hahaha', value);
    deleteOTPCRON.cancel();
});

const startOTPCRON = () => {
    const startTime = new Date();
    const job = schedule.scheduleJob({ start: startTime, rule: rule }, function () {
        console.log('start time');
    });
};

module.exports = {
    startOTPCRON,
}