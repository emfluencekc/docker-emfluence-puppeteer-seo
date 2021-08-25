const newrelic = require("newrelic");
const express = require("express");
const puppeteer = require("puppeteer-core");
const url = require("url");

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

        try {
            const urlParts = url.parse(req.query.url);

            const rules = [
                { pattern: '^/parts/details/.*', name: 'parts/details', },
                { pattern: '^/parts/model/.*', name: 'parts/model', },
                { pattern: '^/parts/.*', name: 'parts', },
                { pattern: '^/equipment/.*', name: 'equipment', },
                { pattern: '^/model/.*', name: 'model', },
                { pattern: '^/customer/.*', name: 'customer', },
                { pattern: '^/search/.*', name: 'search', },
            ];

            rules.some(rule => {
                let reg = new RegExp(rule.pattern, 'i');
                let newPathname = urlParts.pathname.replace(reg, rule.name);
                if (newPathname !== urlParts.pathname) {
                    newrelic.setTransactionName(newPathname);
                    return true;
                }
            });

            newrelic.addCustomAttribute('URL', req.query.url);
        } catch (ex) {}

        await page.goto(req.query.url, { waitUntil: 'networkidle0' });
        const html = await page.content();

        res.status(200).send(html);
    }
    catch (error) {
        console.log(error);
        res.status(500).send();
    }
    finally {
        await browser.close();
    }
});

app.listen(3000, () => console.log('Listening on port 3000'));
