var express = require("express");
var bodyParser =require("body-parser");
var mongoose= require("mongoose");
var logger = require("morgan");
var exphbs = require ("express-handlebars");


var cheerio = require("cheerio");
var axios = require("axios");
var path = require("path");
var db =  require ("./models");

var PORT=  process.env.PORT || 3000 ;

var MONGODB_URI =
	process.env.MONGODB_URI || "mongodb://localhost/mongoscraper";
mongoose.connect(MONGODB_URI);


var app = express();


app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, "public")));


app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

mongoose.connect("mongodb://localhost/mongoscraper");

app.set("view engine", "handlebars");

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/mongoscraper");

var db = mongoose.connection;


// Routes

require("./routes/api-routes")(app, axios, cheerio, db);
// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
