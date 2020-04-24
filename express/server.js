'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
const cron = require("node-cron");
const faunadb = require('faunadb');
const faunadbKey = 'fnADqC6W_OACCx8gaWh6Rsykbf5uAlq_Y30PCMkv';
const client = new faunadb.Client({ secret: faunadbKey });
const q = faunadb.query;

const router = express.Router();
router.get('/another', (req, res) => res.json({ route: req.originalUrl }));
router.post('/', (req, res) => res.json({ postBody: req.body }));

app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));
cron.schedule("*/15 * * * *", function() {
  client.query(
    q.Map(
      q.Paginate(
        q.Match(q.Index("all_cron"))
      ),
      q.Lambda("X", q.Get(q.Var("X")))
    )
  )
  .then( function(ret) {
    for (let index = 0; index < ret.data.length; index++) {
      const element = ret.data[index];
      console.log(element.data); // {"zip": 60061}
      // remove colection
      client.query(q.Delete(q.Ref(element.ref))).then((r) => console.log(r));
    }
  })
});
module.exports = app;
module.exports.handler = serverless(app);
