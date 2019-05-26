const express = require("express");
const puppeteer = require("puppeteer");

const app = express();

app.get('/', async (req, res) => {
    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.setUserAgent("emfluence-puppeteer-seo");
        await page.goto(req.query.url, { waitUntil: 'networkidle0' });
        const html = await page.content();
        await browser.close();

        return res.status(200).send(html);
    }
    catch (error) {
        return res.status(500).send();
    }
});

app.listen(3000, () => console.log('Listening on port 3000'));
