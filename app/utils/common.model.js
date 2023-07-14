class Payload {
    userId;
    userName;
    email;

    constructor(userId, userName, email) {
        this.userId = userId;
        this.userName = userName;
        this.email = email;
    }
}

module.exports = Payload;