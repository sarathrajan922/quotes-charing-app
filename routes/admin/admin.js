var express = require("express");
const { ObjectId } = require("mongodb");
var router = express.Router();
var db = require("../../config/connection");

/* GET users listing. */
router.get("/", async function (req, res, next) {
  if (req.session.admin) {
    var Alldata = await db
      .get()
      .collection("user")
      .find()
      .project({ name: 1, email: 1 })
      .toArray();

    res.render("adminhome", {
      name: req.body.name,
      array: Alldata,
    }); /*response to admin*/
  } else {
    res.render("admin", { title: "Admin Login" });
    next();
  }
});

/* POST admin login data listing. */
router.post("/adminSubmit", async function (req, res, next) {
  if (req.session.admin) {
    var Alldata = await db
      .get()
      .collection("user")
      .find()
      .project({ name: 1, email: 1 })
      .toArray();

    res.render("adminhome", {
      Name: req.body.name,
      array: Alldata,
    }); /*response to admin*/
  } else {
    /*check admin loged data same as database data */
    var data = await db.get().collection("admin").find({}).toArray();
    if (
      req.body.name === data[0].user &&
      req.body.password === data[0].password
    ) {
      req.session.admin = data[0].user;
      console.log("valid user");
      console.log(data);
      console.log("user entered data");
      console.log(req.body);

      console.log(req.session.admin + " this is admin session");

      var Alldata = await db
        .get()
        .collection("user")
        .find()
        .project({ name: 1, email: 1 })
        .toArray();

      console.log(Alldata);

      res.render("adminhome", {
        name: req.body.name,
        array: Alldata,
      }); /*response to admin*/
    } else {
      res.render("error", { error: "invalid user" });
      console.log(req.body);
    }
  }
});

/*admin click the delete  */
router.get("/:id", async (req, res) => {
  console.log(req.session.admin);
  let id = req.params.id;
  console.log(id);
  await db
    .get()
    .collection("user")
    .deleteOne({ _id: ObjectId(id) });
  console.log("one document deleted");

  var Alldata = await db
    .get()
    .collection("user")
    .find()
    .project({ name: 1, email: 1 })
    .toArray();

  res.render("adminhome", {
    name: req.body.name,
    array: Alldata,
  }); /*response to admin*/
});

/* admin logout click */

router.get("/logout", (req, res) => {
  console.log("session cleared    " + "  success");

  req.session.destroy((err) => {
    if (err) {
      res.render("error", { error: err });
    } else {
      console.log("session cleared    " + "  success");
      res.redirect("/admin");
    }
  });
});

module.exports = router;
