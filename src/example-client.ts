import { firefox } from "playwright-core";

async function main() {
    const browser = await firefox.connect('ws://localhost:9988', {
        headers: {
            "paas-browser-type": "firefox"
        }
    })
    const page = await browser.newPage();
    await page.goto('https://google.com');
    await page.close();
    await browser.close();
}

main().then();