const { generateFormNumber } = require("../utils/common");
const { MESSAGES, STATUS_CODES } = require("../utils/constants");
const { getLastFormNumber, insertUserData, getUserByNameOrEmail, deleteUserById, checkUser, getAllUser, getUserById, updateUserById } = require("../services/user.service");
const Payload = require("../utils/common.model");
const { createToken, validateHashString } = require("../utils/authentication");

const listOfUsers = async (req, res) => {
    try {
        const users = await getAllUser();
        if (users) {
            return res.render('dashboard', { users: users });
        } else {
            return res.handler.badRequest(
                MESSAGES.USER.FETCH_USERS_NOT,
                STATUS_CODES.BAD_REQUEST,
                null
            )
        }
    } catch (error) {
        return res.handler.serverError(
            error.message,
            STATUS_CODES.SERVER_ERROR,
            error
        )
    }
}

const singupUser = async (req, res) => {
    try {
        const payload = req.body;
        let getFormNumber;
        getFormNumber = await getLastFormNumber();
        if (!getFormNumber) {
            getFormNumber = 0
        }
        const formNumber = await generateFormNumber(getFormNumber);
        if (!formNumber) {
            return res.handler.badRequest(
                MESSAGES.USER.FORM_NUMBER_NOT_GENERATE,
                STATUS_CODES.BAD_REQUEST,
                null
            )
        }
        const checkUser = await getUserByNameOrEmail(payload);
        if (checkUser) {
            return res.handler.badRequest(
                MESSAGES.USER.USER_ALREDY_EXIST,
                STATUS_CODES.BAD_REQUEST,
                null
            )
        }
        const result = await insertUserData(payload, formNumber);
        if (result) {
            const { userName, email } = payload;
            const tokenPayload = new Payload(result.id, userName, email);
            const token = createToken(tokenPayload);
            const responsearray = {
                userName: userName,
                email: email,
                token: token,
            }
            return await listOfUsers(req, res);
        } else {
            return res.handler.badRequest(
                MESSAGES.USER.USER_DATA_NOT_INSERTED,
                STATUS_CODES.BAD_REQUEST,
                null
            )
        }
    } catch (e) {
        return res.handler.serverError(
            e.message,
            STATUS_CODES.SERVER_ERROR,
            e
        );
    }
}

const loginUser = async (req, res) => {
    try {
        const payload = req.body;
        const user = await checkUser(payload);
        if (!user) {
            return res.handler.badRequest(
                MESSAGES.USER.USER_ALREDY_EXIST,
                STATUS_CODES.BAD_REQUEST,
                null
            )
        }
        const isPassMatch = await validateHashString(payload.password, user.password);
        if (!isPassMatch) {
            return res.handler.validation(
                MESSAGES.USER.PASSWORD_INCORRECT,
                STATUS_CODES.BAD_REQUEST,
                null
            );
        }
        const { userNameOrEmail } = payload;
        const tokenPayload = new Payload(user.id, userNameOrEmail, user.email);
        const token = createToken(tokenPayload);
        const responsearray = {
            userNameOrEmail: userNameOrEmail,
            email: user.email,
            token: token,
        }
        return await listOfUsers(req, res);
    } catch (error) {
        return res.handler.serverError(
            error,
            STATUS_CODES.SERVER_ERROR,
            error
        )
    }
}

const userLoginPage = async (req, res) => {
    try {
        res.render("login");
    } catch (error) {
        return res.handler.serverError(
            error,
            STATUS_CODES.SERVER_ERROR,
            error
        )
    }
}

const editUserData = async (req, res) => {
    try {
        const id = req.params.id;
        const users = await getUserById(id);
        if (!users) {
            return res.handler.badRequest(
                MESSAGES.USER.FETCH_USERS_NOT,
                STATUS_CODES.BAD_REQUEST,
                null
            )
        }
        return res.render('edit', {
            id: users.id,
            userName: users.userName,
            email: users.email,
            taskName: users.taskName,
            taskDescription: users.taskDescription,
        });
    } catch (error) {
        return res.handler.serverError(
            error,
            STATUS_CODES.SERVER_ERROR,
            error
        )
    }
}

const updateUserData = async (req, res) => {
    try {
        const id = req.params.id;
        const payload = req.body;
        const users = await updateUserById(id, payload);
        if (!users) {
            return res.handler.badRequest(
                MESSAGES.USER.USER_DATA_NOT_UPDATED,
                STATUS_CODES.BAD_REQUEST,
                null
            )
        }
        return await listOfUsers(req, res);
    } catch (error) {
        return res.handler.serverError(
            error,
            STATUS_CODES.SERVER_ERROR,
            error
        )
    }
}

const deleteUserData = async (req, res) => {
    try {
        const id = req.params.id;
        const users = await deleteUserById(id);
        if (!users) {
            return res.handler.badRequest(
                MESSAGES.USER.USER_NOT_DELETE,
                STATUS_CODES.BAD_REQUEST,
                null
            )
        }
        await listOfUsers(req, res);
    } catch (error) {
        return res.handler.serverError(
            error,
            STATUS_CODES.SERVER_ERROR,
            error
        )
    }
}

module.exports = {
    singupUser,
    loginUser,
    listOfUsers,
    userLoginPage,
    editUserData,
    updateUserData,
    deleteUserData
}