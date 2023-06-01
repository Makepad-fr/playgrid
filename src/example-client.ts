import { firefox } from "playwright-core";

const SERVER_URL = 'localhost:9988';

async function main() {
    
    const browser = await firefox.connect(`ws://${SERVER_URL}`, {
        headers: {
            "paas-browser-type": "firefox"
        }
    })
    const page = await browser.newPage();
    await page.goto('https://google.com');
    await page.close();
    await browser.close();

    const apiResult = await fetch(`http://${SERVER_URL}/test`)
    console.log(`API result: ${JSON.stringify(await apiResult.json())}`);
}

main().then();