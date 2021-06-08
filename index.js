const express = require("express");
const puppeteer = require("puppeteer-core");

const app = express();

app.get('/', async (req, res) => {
    let browser = null;
    try {
        browser = await puppeteer.connect({ browserWSEndpoint: 'ws://chrome:3000' });
        const page = await browser.newPage();
        await page.setUserAgent("emfluence-puppeteer-seo");
        if (process.env.auth_user && process.env.auth_pass) {
            await page.authenticate({username: process.env.auth_user, password: process.env.auth_pass});
        }
        await page.goto(req.query.url, { waitUntil: 'networkidle0' });
        const html = await page.content();
        await browser.close();

        return res.status(200).send(html);
    }
    catch (error) {
        console.log(error);
        if (browser) {
            await browser.close();
        }
        return res.status(500).send();
    }
});

app.listen(3000, () => console.log('Listening on port 3000'));
