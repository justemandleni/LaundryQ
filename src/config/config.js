require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3000,
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
  GUARD_PHONE_NUMBER: process.env.GUARD_PHONE_NUMBER,
  WASHER_CYCLE_TIME: 40 * 60 * 1000, // 40 minutes in milliseconds
  DRYER_CYCLE_TIME: 60 * 60 * 1000,  // 60 minutes in milliseconds
  RESPONSE_TIMEOUT: 10 * 60 * 1000,  // 10 minutes to respond
};