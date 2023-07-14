const { Sequelize, sequelize } = require("../config/db.connection");

const User = sequelize.define("user", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    userName: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    formNumber: {
        type: Sequelize.STRING
    },
    taskName: {
        type: Sequelize.STRING
    },
    taskDescription: {
        type: Sequelize.STRING
    },
    dateAndTime: {
        type: Sequelize.STRING
    }
})

module.exports = User;