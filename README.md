# CVS COVID Vaccine Alert

This lambda function checks CVS COVID website for openings in a US State and then send a SMS if there are openings. The example and repo are for CT, but can applied to any state.

## How this works

The site scrapes the CVS COVID website and clicks the US state and watches the modal for the data. It then takes the Table data, converts to JSON and loops through looking for appointments. It then send an SMS to you if it sees appointments that are available.

## Configuration

You need to setup an `.env` with the following information:

```
TWILIO_ACCOUNT_SID=YOUR_SID_ON_TWILIO
TWILIO_AUTH_TOKEN=AUTH_TOKEN_HERE
TWILIO_PHONE_NUMBER=YOUR_TWILIO_PHONE_NUMBER
HOST_PHONE_NUMBER=YOUR_PHONE_NUMBER
MONGODB_URI=YOUR_MONGO_URI
```

You can remove the MongoDB dependency in the code by removing the `logRequest` function. You can sign up for a Twilio number at https://www.twilio.com/.

## How to run locally

0. Since this repo is using `chrome-aws-lambda` it will not work locally, you need to run `npm install puppetter` and then replace `const chromium = require("chrome-aws-lambda");` with the setup fro here: https://www.npmjs.com/package/puppeteer`
1. Replace `#vaccineinfo-CT` with `#vaccineinfo-MA` or `#vaccineinfo-MT` (your preferred state);
2. Change `index.js` to act like a normal function (dropping `module.handler`) and invoke it.
3. Configure your `.env` file as seen above
4. Run `node index.js` and watch your phone!

## Deploying to AWS Lambda

1. You zip eveythign and deploy (it should be below 50MB)
2. Add a layer to your Lambda function (https://github.com/shelfio/chrome-aws-lambda-layer)
3. Invoke and it should work! Make sure to add your enviromental variables to your Lambda configuration.
4. You can even add CloudWatch Event Schedule to have the Lambda run on a schedule (https://docs.aws.amazon.com/lambda/latest/dg/services-cloudwatchevents.html)
