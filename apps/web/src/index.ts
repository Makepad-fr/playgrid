import {PlaywrightServer} from '@playgrid/server';
const SERVER_PORT = +(process.env["PAAS_SERVER_PORT"] ?? "9988")

/**
 * For instance this module contains an example server code that launchs the PlaywrightServer
 * from @paas/server package.
 * TODO:
 * In this module, 
 * - we need to authenticate deamons
 * - we need to authenticate clients
 * - We need to implement custom logging system
 * - To authenticate clients and deamons we need to have a database.
 * Therefor we need to have a docker-compose.yml file. Also this repository should contain
 * the Dockerfile to containerize the server
 */

async function main() {
    const server = await PlaywrightServer.init({
      authenticate: () => Promise.resolve(crypto.randomUUID()),
      browserPoolOptions: {
        firefox: 3
      },
      disconnect: (authenticatedUserId:string) => logout(authenticatedUserId)
    })
    return server.start(SERVER_PORT)
}

async function logout(authenticatedUserId: string) {
  console.log(`User: ${authenticatedUserId} disconnected from playwright`);
}
  
//   createBrowserServer();

main().then()