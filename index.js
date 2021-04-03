require("dotenv").config();
const sendSMS = require("./libs/sms");
const logRequest = require("./libs/logRequest");
const chromeLambda = require("chrome-aws-lambda");
const HtmlTableToJson = require("html-table-to-json");

exports.handler = async (event) => {
  const browser = await chromeLambda.puppeteer.launch({
    args: chromeLambda.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromeLambda.executablePath,
  });

  await page.goto(
    "https://www.cvs.com/immunizations/covid-19-vaccine?icid=cvs-home-hero1-link2-coronavirus-vaccine"
  );

  const elementHandle = await page.$('[data-modal="vaccineinfo-CT"]');

  if (elementHandle) {
    await elementHandle.click();

    await page.waitForSelector("#vaccineinfo-CT", {
      visible: true,
    });

    const htmlContent = await page.$eval("#vaccineinfo-CT table", (element) => {
      return element.innerHTML;
    });

    const jsonTables = HtmlTableToJson.parse(`<table>${htmlContent}</table>`);

    const availableSites = [];

    const timeStampText = await page.$eval(
      `#vaccineinfo-CT [data-id="timestamp"] p `,
      (element) => {
        return element.innerHTML;
      }
    );

    await browser.close();

    if (jsonTables.results[0]) {
      for (const data of jsonTables.results[0]) {
        console.log(data);
        await logRequest("csvLocations", data["City/Town"], data.Status);

        if (data.Status !== "Fully Booked") {
          availableSites.push(data);
        }
      }

      if (availableSites.length !== 0) {
        const firstAvailable = availableSites[0];
        const locationsText =
          availableSites.length > 1 ? "locations" : "location";
        await sendSMS({
          message: `CVS COVID VAX ALERT: There are ${availableSites.length} CVS ${locationsText} with available vaccine appointment. ${timeStampText}. First result is ${firstAvailable["City/Town"]} \n LINK: https://www.cvs.com/immunizations/covid-19-vaccine?icid=cvs-home-hero1-link2-coronavirus-vaccine`,
        });
      }
    }

    return;
  } else {
    console.log("not found");
    await browser.close();
  }
};
