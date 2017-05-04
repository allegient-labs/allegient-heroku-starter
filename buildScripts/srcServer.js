/* eslint-disable no-console */

import express from 'express';
import path from 'path';
import open from 'open';
import webpack from 'webpack';
import jsforce from 'jsforce';
import fs from 'fs';
//  import http from 'http';
import https from 'https';
import config from '../webpack.config.dev';

const sslOptions = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
};
const port = 3000;
const app = express();
const compiler = webpack(config);
const oauth2 = new jsforce.OAuth2({
  // you can change loginUrl to connect to sandbox or prerelease env.
  // loginUrl : 'https://test.salesforce.com',
  clientId: '3MVG9szVa2RxsqBa0SUzP8My6BykjgvcJkRv_tjDS8Xo922cRTmy5ulU7DbFcFZ8nogjCGBgmYx4xk7.avI2h',
  clientSecret: '6403195744383263889',
  redirectUri: 'https://127.0.0.1:3000/oauth2/callback',
});


app.use(require('webpack-dev-middleware')(compiler, {
  noinfo: true,
  publicPath: config.output.publicPath,
}));
app.get('*', (req, res) => {

});
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../src/index.html'));
});

app.get('/oauth2/auth', (req, res) => {
  res.redirect(oauth2.getAuthorizationUrl({ scope: 'api id web', display: 'popup' }));
});

//
// Pass received authz code and get access token
//
app.get('/oauth2/callback', (req, res) => {
  const conn = new jsforce.Connection({ oauth2 });
  const code = req.param('code');
  conn.authorize(code, (err, userInfo) => {
    if (err) { return console.error(err); }
    // Now you can get the access token, refresh token, and instance URL information.
    // Save them to establish connection next time.
    console.log(conn.accessToken);
    console.log(conn.refreshToken);
    console.log(conn.instanceUrl);
    console.log(`User ID: ${userInfo.id}`);
    console.log(`Org ID: ${userInfo.organizationId}`);
    res.redirect('/');
  });
});

https.createServer(sslOptions, app).listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    open(`https://127.0.0.1:${port}`);
  }
});
