var express = require("express");
const { ObjectId } = require("mongodb");
var router = express.Router();
var db = require("../../config/connection");

/*  admin click the view activity button */
router.get("/:id", async (req, res) => {
  console.log(req.session.admin);
  let id = req.params.id;
  console.log(id);
  var quotes = await db
    .get()
    .collection("user")
    .find({ _id: ObjectId(id) }, { quote: 1, name: 1 })
    .toArray();
  //   console.log("user quote successfully  find"+quotes);
  console.log(quotes);
  var quote = quotes[0].quote;
  var name = quotes[0].name;
  res.render("viewActivity", {
    name: name,
    quote: quote,
  }); /*response to the admin */

  console.log(quote);
});

module.exports = router;
