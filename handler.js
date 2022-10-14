const puppeteer = require('puppeteer-core');
const chromium = require('chrome-aws-lambda');
const FormData = require('form-data');
const fetch = require('node-fetch');

module.exports.render = async ({
  type,
  id,
  url,
  variable,
  selector,
  return_url: returnURL,
  secret,
  version,
}) => {
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  });
  const page = await browser.newPage();

  try {
    await page.goto(url, {
      waitUntil: 'networkidle0',
    });
    await page.waitForSelector(selector);
  } catch (err) {
    throw new Error('page.goto/waitForSelector timed out.');
  }

  let html;

  try {
    const handle = await page.evaluateHandle(variable);

    html = await handle.jsonValue();

    await handle.dispose();
  } catch {
    const handle = await page.$(selector);

    html = await page.evaluate((el) => el.innerHTML, handle);

    await handle.dispose();
  }

  await browser.close();

  const body = new FormData();
  const data = {
    type,
    id,
    html,
    secret,
    version,
  };

  Object.keys(data)
      .forEach(key => {
        try {
          body.append(key, data[key]);
        } catch {}
      });

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
