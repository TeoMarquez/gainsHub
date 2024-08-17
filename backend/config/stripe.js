// config/stripe.js
require('dotenv').config();

const STRIPE_PRIVATE_KEY = process.env.STRIPE_PRIVATE_KEY;

module.exports = {
  STRIPE_PRIVATE_KEY
};
