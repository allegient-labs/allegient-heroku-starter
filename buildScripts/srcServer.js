/* eslint-disable no-console */

import express from 'express';
import path from 'path';
import open from 'open';
import webpack from 'webpack';
import fs from 'fs';
//  import http from 'http';
import https from 'https';
import config from '../webpack.config.dev';
import * as forceService from '../src/forceService';

const sslOptions = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
};
const port = 3000;
const app = express();
const compiler = webpack(config);


app.use(require('webpack-dev-middleware')(compiler, {
  noinfo: true,
  publicPath: config.output.publicPath,
}));

app.get('/', (req, res) => {
  if (!forceService.conn.accessToken) {
    res.redirect(forceService.authorizationURL);
  }
  res.sendFile(path.join(__dirname, '../src/index.html'));
});

app.get('/oauth2/auth', (req, res) => {
  res.redirect(forceService.authorizationURL);
});

//
// Pass received authz code and get access token
//
app.get('/oauth2/callback', (req, res) => {
  if (req.param('code')) {
    forceService.authorize(req.param('code')).then(() => {
      res.redirect('/');
    });
  } else { res.redirect(forceService.authorizationURL); }
});

https.createServer(sslOptions, app).listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    // open(`https://127.0.0.1:${port}`);
  }
});
