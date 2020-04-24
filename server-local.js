'use strict';
const cron = require("node-cron");
const faunadb = require('faunadb');
const faunadbKey = 'fnADqC6W_OACCx8gaWh6Rsykbf5uAlq_Y30PCMkv';
const client = new faunadb.Client({ secret: faunadbKey });
const q = faunadb.query;
const app = require('./express/server');

app.listen(3000, () => console.log('Local app listening on port 3000!'));
