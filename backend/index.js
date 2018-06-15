'use strict';

import express from 'express';
import superagent from 'superagent';
// READ DOCUMENTATION FOR THIS LAB!!!!!!!!!

require('dotenv').config();

const app = express();


const GOOGLE_OAUTH_URL = '';
const OPEN_ID_URL = '';
// we are building an oath complient back-end

app.get('/oath/google', (req, res) => {
  if (!req.query.code) {
    res.redirect(process.env.CLIENT_URL);
  } else {
    console.log('__3.1_3.2_CODE__', req.query.code);
    // begin step 3.2 we have the code, now we send the code back
    // note that the code is NEVER STORED-- sotring CODES is considered bad practice!
    // console.log('__3.2_GETTING_CODE_BACK__', req.query.code )
    return superagent.post(GOOGLE_OAUTH_URL)
      .type('form')
      .send({
        code: req.query.code,
        grant_type: 'authorization_code',
        client_id: process.env.GOOGLE_OAUTH_ID,
        client_secret: process.env.GOOGLE_OAUTH_SECRET,
        redirect_uri: `${process.env.API_URL}/oauth/google`,
      })
      .then((tokenResponse) => {
      // 3.3 here we expect the access token-- the redirect URL is saying, hey send the token here!
        console.log('__3.3_ACCESS_TOKEN__', tokenResponse.body.access_token);
        if (!tokenResponse.body.access_token) {
          response.redirect(process.env.CLIENT_URL);
        }
        const accessToken = tokenResponse.body.access_token;
        // step 4 -- note that we still use bearer auth, because this is standard at this point in time

        return superagent.get(OPEN_ID_URL)
          .set('Authorization', `Bearer ${accessToken}`);
      })
      .then((openIDResponse) => {
        console.log('_STEP_FOUR_OPEN_ID_', openIDResponse.body);

        // now we can trigger our OWN backend process-- create account, create token and return tp application for our own purposes sooo new Account({info}).save()
        response.cookie('FAKEYCOOKIE', 'this would be an actual ${token}');
        response.redirect(process.env.CLIENT_URL);
      })
      .catch((err) => {
        console.log(err);
        response.redirect(`${process.env.CLIENT_URL  }?error in OATH`);
      });
  }
});

app.listen(process.env.PORT, () => {
  console.log('_____SERVER UP ______', process.env.PORT);
});
