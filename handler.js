const chromium = require('chrome-aws-lambda')
const fetch = require('node-fetch')
const FormData = require('form-data')
const puppeteer = require('puppeteer-core')

module.exports.render = async ({
  type,
  id,
  url,
  return_url,
  secret,
  element
}, context, callback) => {

  let response = null

  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    })

    const page = await browser.newPage()
    await page.goto(url, {waitUntil: 'networkidle0'})
    const html = await page.evaluate(
      (el) => document.querySelector(el).innerHTML,
      element
    )
    await browser.close()

    const body = new FormData()
    body.append('type', type)
    body.append('id', id)
    body.append('html', html)
    body.append('secret', secret)

    response = fetch(return_url, {
      method: 'POST',
      body
    })
  } catch (error) {
    return callback(error)
  }

  return callback(null, response)
};