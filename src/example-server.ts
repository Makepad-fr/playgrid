import { firefox } from "playwright";
import { PlaywrightServer } from ".";

async function main() {
    const server = await PlaywrightServer.init({
      authenticate: () => Promise.resolve(crypto.randomUUID()),
      browserPoolOptions: {
        firefox: 3
      },
      disconnect: (authenticatedUserId:string) => logout(authenticatedUserId)
    })
    return server.start(9988)
}

async function logout(authenticatedUserId: string) {
  console.log(`User: ${authenticatedUserId} disconnected from playwright`);
}

async function createBrowserServer(): Promise<void> {
    const server = await firefox.launchServer();
    const endpoint = server.wsEndpoint();
    console.log('WebSocket endpoint:', endpoint);
  }
  
//   createBrowserServer();

main().then()