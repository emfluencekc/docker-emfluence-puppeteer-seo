const express = require("express");
const puppeteer = require("puppeteer-core");

const app = express();

app.get('/', async (req, res) => {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            executablePath: '/usr/bin/google-chrome-unstable',
            args: ['--no-sandbox']
        });
        const page = await browser.newPage();
        await page.setUserAgent("emfluence-puppeteer-seo");
        await page.goto(req.query.url, { waitUntil: 'networkidle0' });
        if (process.env.auth_user && process.env.auth_pass) {
            await page.authenticate({username: process.env.auth_user, password: process.env.auth_pass});
        }
        const html = await page.content();
        await browser.close();

        return res.status(200).send(html);
    }
    catch (error) {
        console.log(error);
        return res.status(500).send();
    }
});

app.listen(3000, () => console.log('Listening on port 3000'));
