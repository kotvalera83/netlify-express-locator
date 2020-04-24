'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
const cron = require("node-cron");
const faunadb = require('faunadb');
const faunadbKey = 'fnADqC6W_OACCx8gaWh6Rsykbf5uAlq_Y30PCMkv';
const mailgunKey = 'key-5e5568248f383617f8bc98fd24448ddd';
const mailgunDomain = 'tearivercoffee.com';
const googleKey = 'AIzaSyCj_MvVb7QB3mHmKbfLHsKtuAYDO47bgVo';
const googleSearchUrl = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=';
const client = new faunadb.Client({ secret: faunadbKey });
const q = faunadb.query;
const mailgun = require('mailgun-js')({apiKey: mailgunKey, domain: mailgunDomain});
const emailConfig = {
  to: 'info@chimneymonkey.com',
  from: 'kot@valerii.ml',
  subject: 'New Locator GRAB',
  text: ''
}
const router = express.Router();
router.get("/login", (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>LocationGraber</title>
    <!-- Bulma Version 0.8.x-->
    <link rel="stylesheet" href="https://unpkg.com/bulma@0.8.0/css/bulma.min.css" />
    <link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet"
      integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
    <style>
    .social-media {
      margin-top: 30px;
    }
    
    .social-media a {
      margin-right: 10px;
    }
    
    .field:not(:last-child) {
      margin-bottom: 20px;
    }
    
    @media screen and (min-width: 768px) {
      .navbar {
        padding: 10px 0;
        position: fixed;
        width: 100%;
      }
    }
    </style>
  </head>
  
  <body>   
    <section class="hero is-fullheight">
      <div class="hero-body">
        <div class="container has-text-centered">
          <div class="columns is-8 is-variable ">
            <div class="column is-one-thirds has-text-left"></div>
            <div class="column is-one-third has-text-left">
            <form action="/" class="box" method="post" enctype="method="post" enctype="multipart/form-data">
              <div class="field">
                <label class="label">ZIP</label>
                <div class="control">
                  <input class="input is-medium" type="text" name="zip">
                </div>
              </div>
              <div class="field">
                <label class="label">Email</label>
                <div class="control">
                  <input class="input is-medium" type="text" name="email">
                </div>
              </div>
              <div class="control">
                <button type="submit" class="button is-link is-fullwidth has-text-weight-medium is-medium">Send</button>
              </div>
            </div>
            <div class="column is-one-thirds has-text-left"></div>
          </div>
        </div>
      </div>
    </section>
  
  </body>
  
  </html>
  `);
});
router.post('/', (req, res) => {
  if(req.body.zip && req.body.email){
    var createP = client.query(
      q.Create(q.Collection('cron'), { data: { zip: req.body.zip, email: req.body.email} })
    ).then(function(response) {
      console.log(response.ref) // Would log the ref to console.
      res.json({ message: response.ref});
    })
  }else{
    res.json({ message: 'failed'});
  }
  
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
   res.header('Access-Control-Allow-Origin', req.headers.origin);
   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
   next();
});
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

module.exports = app;
module.exports.handler = serverless(app);
