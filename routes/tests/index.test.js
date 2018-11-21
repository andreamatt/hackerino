fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const homeFolder = require('../index').homeFolder;

const baseurl = process.env.BASEURL || 'http://localhost:3000';

test("Checking if GET / returns info.html", async () => {
    expect.assertions(1);
    let response = await fetch(`${baseurl}/`);
    let data = await response.text();
    expect(data).toBe(fs.readFileSync(path.join(`${homeFolder}/public/info.html`)).toString());
});

test("Checking if GET /help returns help.html", async () => {
    expect.assertions(1);
    let response = await fetch(`${baseurl}/help`);
    let data = await response.text();
    expect(data).toBe(fs.readFileSync(path.join(`${homeFolder}/public/help.html`)).toString());
});