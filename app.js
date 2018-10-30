var express = require("express");

var port = process.env.PORT || 3000;

const app = express();

app.get("/", (req, res) => {

});

app.listen(port, () => console.log("server running"));