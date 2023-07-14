const express = require("express");
const path =  require("path");
const { sequelize } = require("./app/config/db.connection");
require("./app/models/index");
const { startOTPCRON } = require('./app/utils/cron');
const port = process.env.PORT || 9000
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'app', 'views'))
app.set('view engine', 'ejs');
// ------------------------    RESPONSE HANDLER    -------------------
app.use((req, res, next) => {
    const ResponseHandler = require("./app/middlewares/response-handler");
    res.handler = new ResponseHandler(req, res);
    next();
});

app.get('/', (req, res) => {
    res.redirect('/user/login');
});

app.use("/", require("./app/routes/index"));

sequelize.sync().then(() => {
    app.listen(port)
    console.log(`server started on port: ${port}`);
    startOTPCRON();
}).catch((error) => {
    console.log(error);
})