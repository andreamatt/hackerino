fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

require('../../settings');
const baseurl = process.env.BASEURL;
const port = process.env.PORT;
const V = process.env.APIVERSION;

test("empty test", async () => {
    let response = await fetch(`${baseurl}${port}/${V}/`);
    //let data = await response.json();

});