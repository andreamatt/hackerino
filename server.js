require('./settings');
const port = process.env.PORT;

const app = require('./routes/index');

app.listen(port, () => console.log("server running on port " + port));