const app = require('./routes/index').app;
var port = process.env.PORT || 3000;

app.listen(port, () => console.log("server running on port " + port));