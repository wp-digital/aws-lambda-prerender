const puppeteer = require('puppeteer-core');
const chromium = require('chrome-aws-lambda');
const FormData = require('form-data');

module.exports.render = async ({
  post_id,
  post_url,
  return_url,
  secret
}, context, callback) => {

  let response = null;

  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto(post_url, {waitUntil: 'networkidle0'});
    const content = await page.evaluate(() => document.getElementById("app").innerHTML);
    await browser.close();

    const body = new FormData();
    body.append('post_id', post_id);
    body.append('content', JSON.stringify({
      content,
    }));
    body.append('secret', secret);

    response = fetch(return_url, {
      method: 'POST',
      body
    })
  } catch (error) {
    return callback(error);
  }

  return callback(null, response);
};