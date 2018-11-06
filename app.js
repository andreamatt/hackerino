var express = require("express");
var path = require('path');

var port = process.env.PORT || 3000;

const app = express();

app.get("/", (req, res) => {
	res.send("ciao mondo");
});

app.get("/help", (req, res) => {
	res.sendFile(path.join(__dirname + '/help.html'));

});

var server = app.listen(port, () => console.log("server running"));

module.exports.server = server
