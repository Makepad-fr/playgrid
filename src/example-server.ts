import { firefox } from "playwright";
import { PlaywrightServer } from ".";

async function main() {
    const server = await PlaywrightServer.init({browserPoolOptions: {firefox: 1}}, () => Promise.resolve(crypto.randomUUID()));
    return server.start(9988)
}

async function createBrowserServer(): Promise<void> {
    const server = await firefox.launchServer();
    const endpoint = server.wsEndpoint();
    console.log('WebSocket endpoint:', endpoint);
  }
  
//   createBrowserServer();

main().then()