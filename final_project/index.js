const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use(
  '/customer',
  session({
    secret: 'fingerprint_customer',
    resave: true,
    saveUninitialized: true,
  })
);

app.use('/customer/auth/*', (req, res, next) => {
  console.log(req.session.username);
  if (req.session.username) {
    next(); // Proceed if the session contains a username
  } else {
    res.status(401).send('Authentication required'); // Block if not authenticated
  }
});
const PORT = 5001;

app.use('/customer', customer_routes);
app.use('/', genl_routes);

app.listen(PORT, () => console.log('Server is running'));
