const express = require("express");
const puppeteer = require("puppeteer-core");

const app = express();

app.get('/', async (req, res) => {
    try {
        console.log('ohi');
        const browser = await puppeteer.launch({
            headless: true,
            executablePath: '/usr/bin/google-chrome-unstable'
        });
        console.log('ohi2');
        const page = await browser.newPage();
        console.log('ohi3');
        await page.setUserAgent("emfluence-puppeteer-seo");
        console.log('ohi4');
        await page.goto(req.query.url, { waitUntil: 'networkidle0' });
        console.log('ohi5');
        const html = await page.content();
        console.log('ohi6');
        await browser.close();
        console.log('ohi7');

        return res.status(200).send(html);
    }
    catch (error) {
        console.log(error);
        return res.status(500).send();
    }
});

app.listen(3000, () => console.log('Listening on port 3000'));
