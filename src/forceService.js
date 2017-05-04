import jsforce from 'jsforce';

export const oauth2 = new jsforce.OAuth2({
  // you can change loginUrl to connect to sandbox or prerelease env.
  // loginUrl : 'https://test.salesforce.com',
  clientId: '3MVG9szVa2RxsqBa0SUzP8My6BykjgvcJkRv_tjDS8Xo922cRTmy5ulU7DbFcFZ8nogjCGBgmYx4xk7.avI2h',
  clientSecret: '6403195744383263889',
  redirectUri: 'https://127.0.0.1:3000/oauth2/callback',
});

export const authorizationURL = oauth2.getAuthorizationUrl({
  scope: 'api id web',
  display: 'popup',
});
export const conn = new jsforce.Connection({ oauth2 });
export function auhtorize(code) {
  conn.authorize(code, (err, userInfo) => {
    if (err) {
      return console.error(err);
    }
    // Now you can get the access token, refresh token, and instance URL information.
    // Save them to establish connection next time.
    console.log(conn.accessToken);
    console.log(conn.refreshToken);
    console.log(conn.instanceUrl);
    console.log(`User ID: ${userInfo.id}`);
    console.log(`Org ID: ${userInfo.organizationId}`);
    return true;
  });
}
