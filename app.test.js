const app = require("./app");

test('close server test', () => {
    app.server.close();
});
