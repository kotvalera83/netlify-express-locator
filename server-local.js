'use strict';
const cron = require("node-cron");
const faunadb = require('faunadb');
const faunadbKey = 'fnADqC6W_OACCx8gaWh6Rsykbf5uAlq_Y30PCMkv';
const client = new faunadb.Client({ secret: faunadbKey });
const q = faunadb.query;
const app = require('./express/server');
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
app.listen(3000, () => console.log('Local app listening on port 3000!'));
