const { user } = require("../models/index");
const moment = require("moment");
const { encryptString } = require("../utils/authentication");
const { Op } = require('sequelize');

const getLastFormNumber = async () => {
    try {
        return await user.findOne({}, {
            sort: {
                $natural: -1
            }
        });
    } catch (error) {
        throw new Error(error);
    }
}

const getUserByNameOrEmail = async (payload) => {
    try {
        return await user.findOne({
            where: {
                [Op.or]: [
                    {
                        email: {
                            [Op.eq]: payload.email
                        }
                    },
                    {
                        userName: {
                            [Op.eq]: payload.userName
                        }
                    },
                ]
            }
        })
    } catch (error) {
        throw new Error(error);
    }
}

const insertUserData = async (payload, formNumber) => {
    try {
        const hash = await encryptString(payload.password);
        const data = {
            userName: payload.userName,
            password: hash,
            email: payload.email,
            formNumber: formNumber,
            taskName: payload.taskName,
            taskDescription: payload.taskDescription,
            dateAndTime: moment.utc(payload.dateAndTime).valueOf()
        }
        return await user.create(data);
    } catch (error) {
        throw new Error(error);
    }
}

const checkUser = async (payload) => {
    try {
        return await user.findOne({
            where: {
                [Op.or]: [
                    {
                        email: {
                            [Op.eq]: payload.userNameOrEmail
                        }
                    },
                    {
                        userName: {
                            [Op.eq]: payload.userNameOrEmail
                        }
                    },
                ]
            }
        })
    } catch (error) {
        throw new Error(error);
    }
}

const getAllUser = async () => {
    try {
        return await user.findAll({});
    } catch (error) {
        throw new Error(error);
    }
}

const getUserById = async (id) => {
    try {
        return await user.findOne({ id });
    } catch (error) {
        throw new Error(error);
    }
}

const updateUserById = async (id, payload) => {
    try {
        const { userName, email, taskName, taskDescription } = payload;
        return await user.update({
            userName, email, taskName, taskDescription
        }, {
            where: {
                id
            }
        })
    } catch (error) {
        throw new Error(error);
    }
}

const deleteUserById = async (id) => {
    try {
        return await user.destroy({
            where: {
                id
            }
        })
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = {
    getLastFormNumber,
    insertUserData,
    getUserByNameOrEmail,
    checkUser,
    getAllUser,
    getUserById,
    updateUserById,
    deleteUserById
}