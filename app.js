var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");
const { v4: uuidv4 } = require("uuid");
var nocache = require("nocache");

var app = express();

var usersRouter = require("./routes/user/users");
var adminRouter = require("./routes/admin/admin");
var viewAcitivityRouter = require("./routes/admin/viewActivity");

var db = require("./config/connection");

app.use(nocache());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: "uuidv4()",
    resave: false,
    saveUninitialized: false,
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

//database
db.connect((err) => {
  if (err) console.log("connection Error" + err);
  else console.log("Database connect successfully");
});


app.use("/", usersRouter);
app.use("/admin", adminRouter);
app.use("/viewActivity", viewAcitivityRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
