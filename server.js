var express = require("express");
var path = require("path");
var connection = require("./db/connection");

// Tells node that we are creating an "express" server
var app = express();
// Sets an initial port. We"ll use this later in our listener
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Get all tables that aren't waiting
app.get("/api/views", function (req, res) {
  connection.query("SELECT * FROM tables WHERE isWaiting = FALSE", function (err, dbTables) {
    res.json(dbTables);
  });
});

// Save a new table
// Set isWaiting to true if there are already 5 or more "seated" tables
app.post("/api/views", function(req, res) {
  connection.query("SELECT COUNT (IF(isWaiting = FALSE, 1, NULL)) FROM tables", function (err, dbSeated) {
    if (err) throw err;

    if (dbSeated[0].count > 4) {
      req.body.isWaiting = true;
   }
   
   connection.query("INSERT INTO tables SET ?", req.body, function (err, result) {
    if (err) throw err;

    connection.query("SELECT * FROM tables WHERE id = ?", [result.insertId], function (err, dbTables) {
      res.json(dbTables[0]);
    });
   });

  });
});

// Get all tables where isWaiting is true (waiting list)
app.get("api/waitlist", function(req, res) {
  connection.query("SELECT * FROM tables WHERE isWaiting = TRUE", function(err, dbTables) {
    res.json(dbTables);
    
  });
});