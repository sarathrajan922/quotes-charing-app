var express = require("express");
var router = express.Router();
var bcrypt = require("bcrypt");
var db = require("../../config/connection");
const userHelpers = require("../../helpers/user-helpers");

/* GET users listing. */
router.get("/", async function (req, res, next) {
  if (req.session.user) {
    
    res.redirect(`/submit/${req.session.user}`);

  } else {
    res.render("register");
  }
});

/* insert new registered data into database . */
router.post("/submit", async (req, res, next) => {

  //validation
  if (req.body.password === req.body.cpassword) {
    var email = req.body.email;
    var pass = req.body.password;
    var name = req.body.name;

    const userpass = bcrypt.hash(pass, 10, async (err, hash) => {
      var obj = { name: name, email: email, password: hash, quote: [] };

      var userdata = await db
        .get()
        .collection("user")
        .insertOne(obj, (err) => {
          if (err) console.log("data insert err");
          else console.log("1 document inserted");
        });

      console.log(userdata);
      res.redirect("/login");
    });
  } else {
    console.log("password not match");
    res.render("error", { error: "password not match" });
  }
});

/* user loged data  listing. */
router.post("/users", async function (req, res, next) {
  
  var logemail = req.body.email;
  var logpass = req.body.password;

  /*find user typed email is exist */
  const dbData =await userHelpers.getAllData(logemail)
  
  console.log(dbData);

  if (dbData) {
    /*if document exist  */
    var userpass = dbData[0].password;
    /* bcrypt user loged password and compare  */
    bcrypt.compare(logpass, userpass, (err, result) => {
      if (result) {
        /* validation */
        if (logemail === dbData[0].email) {
          req.session.loggedIn = true;
          req.session.user = logemail;

          res.redirect(`/submit/${logemail}`);
        }
      } else {
        console.log("password bcrypt failed");
        res.render("error", { error: "password bcrypt failed" });
      }
    });
  } else {
    res.render("error", { error: "user not exist" });
  }
});



router.get('/submit/:id', async(req,res)=>{
  logmail = req.params.id
  const dbData =await userHelpers.getAllData(logmail)
  res.render("userhome", {
      email: dbData[0].email,
      name: dbData[0].name,
      array: dbData[0].quote,
    });

})

/* GET login page. */
router.get("/login", async function (req, res, next) {
  if (req.session.user) {
    /* direct assess to the home page */
   
    res.redirect(`/submit/${req.session.user}`);


     /* response to the user*/
  } else {
    res.render("index", { title: "Login" });
  }
});

//route for logout
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.render("error", { error: err });
    } else {
      res.redirect("/");
    }
  });
});

/* GET activity form page. */
router.get("/activity", function (req, res, next) {
  res.render("activity");
});

/*user activity submit */
router.post("/activitysubmit", async (req, res) => {
  var msg = req.body.message;

  const dbData = await userHelpers.getAllData(req.session.user)
  if (dbData) {
   userHelpers.activityUpdate(req.session.user, msg);
  } else {
    res.render("error", { error: "Database not found" });
  }
  res.redirect("/login");
});

module.exports = router;
