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