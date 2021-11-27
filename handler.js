const puppeteer = require('puppeteer-core')
const chromium = require('chrome-aws-lambda')
const FormData = require('form-data')
const fetch = require('node-fetch')

module.exports.render = async ({
  type,
  id,
  url,
  selector,
  return_url: returnURL,
  secret,
}) => {
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  });
  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: 'networkidle0',
  });

  const elementHandle = await page.$(selector);
  const html = await page.evaluate((el) => el.innerHTML, elementHandle);

  await elementHandle.dispose();
  await browser.close();

  const body = new FormData();
  const data = {
    type,
    id,
    html,
    secret,
  };

  Object.keys(data)
      .forEach(key => body.append(key, data[key]));

  const response = await fetch(returnURL, {
    method: 'POST',
    body,
    insecureHTTPParser: true,
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const contentType = response.headers.get('content-type');

  if (!contentType || !contentType.includes('application/json')) {
    return response.status;
  }

  return response.json();
};