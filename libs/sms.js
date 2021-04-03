const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const axios = require("axios");
const querystring = require("querystring");

const sendSMS = async ({ message }) => {
  const baseUrl = `https://api.twilio.com/2010-04-01`;

  console.log(process.env);

  const data = await axios.post(
    `${baseUrl}/Accounts/${accountSid}/Messages.json`,
    querystring.stringify({
      To: process.env.HOST_PHONE_NUMBER,
      From: process.env.TWILIO_PHONE_NUMBER,
      Body: message,
    }),
    {
      auth: {
        username: accountSid,
        password: authToken,
      },
    }
  );

  console.log(data.data);
};

module.exports = sendSMS;
