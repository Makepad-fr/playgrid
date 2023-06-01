import { BrowserPool, CreateBrowserPoolOptions } from "./browser-pool";
import http from 'http';
import { WebSocket } from "ws";
import url from 'url';
import { BrowserTypeString, isBrowserTypeString } from "./browser-pool-element";
// TODO: Update import statement
import * as stream from 'node:stream';


type AuthenticationFunction = (req: http.IncomingMessage) => Promise<string | undefined>;


// TODO: Check possibility to add additional endpoints to the http server
export class PlaywrightServer {
    readonly #server;
    readonly #webSocketServer;
    readonly #browserPool: BrowserPool;
    readonly #authenticate: AuthenticationFunction;

    /**
     * Starts the current HTTP server with the given port number
     * @param port The port number for the server
     */
    async start(port: number): Promise<void> {
        return new Promise((resolve, _) => {
            console.info(`Listening on ${port}`)
            return this.#server.listen(port, (() => resolve()));
        });
    }

    /**
     * Creates a new PlaywrightServer instance with given parameters
     * @param options Options for the browser pool
     * @param authenticate The function used to authenticate clients
     * @returns PlaywrightServer instance created with given parameters
     */
    static async init(options: { browserPoolOptions: CreateBrowserPoolOptions }, authenticate: AuthenticationFunction): Promise<PlaywrightServer> {
        const pool = await BrowserPool.init(options.browserPoolOptions);
        return new PlaywrightServer(pool, authenticate);
    }

    private constructor(pool: BrowserPool, authenticateFunction: AuthenticationFunction) {
        this.#server = http.createServer();
        this.#webSocketServer = new WebSocket.Server({ noServer: true });
        this.#browserPool = pool;
        this.#authenticate = authenticateFunction;
        this.#server.on('connection', () => {
            console.log('New connection on server');
        })
        this.#server.on('upgrade', (req, socket, head) => this.#handleHttpUpgrade(req, socket, head));
        this.#server.on('close', () => {
            console.log(`Browser pool size: ${this.#browserPool.size}`);
            console.log('Connection closed');

        })
    }

    /**
     * Handles when HTTP connection is upgraded
     * @param req The related request instance for the HTTP communication
     * @param socket The socket related to the HTTP communication
     * @param head 
     */
    async #handleHttpUpgrade(req: http.IncomingMessage, socket: stream.Duplex, head: Buffer) {
        console.debug('Upgrade request detected');
        const browserTypeHeader = req.headers['paas-browser-type'];
        console.debug(`Browser type header: ${browserTypeHeader}`);
        const browserHeaderError = getBrowserHeaderError(browserTypeHeader)

        if (browserHeaderError !== undefined) {
            console.error(`Error with the browser header: ${browserHeaderError}`);
            // Destroy the connection with the calculated browser type error
            socket.destroy(browserHeaderError);
            return;
        }
        const browserType: BrowserTypeString = browserTypeHeader as BrowserTypeString;
        console.debug(`Browser type: ${browserType}`)

        // Check if the request is authenticated.
        const authenticatedUserId = await this.#authenticate(req);
        if (authenticatedUserId === undefined) {
            console.error(`Error while authenticating user`);
            // The authentication is not succeed
            socket.destroy(new Error('User is unable to authenticate'));
            return;
        }

        // Get available browser for the given browser type
        const browserElement = this.#browserPool.getAvailablebrowser(browserType);
        if (browserElement === undefined) {
            console.error('No available browser found for browser type ' + browserType);
            // TODO: Improve the error handling
            socket.destroy(new Error(`No available browsers for browser type: ${browserType}`));
            return;
        }
        console.debug(`Browser element id: ${browserElement.id}`);
        console.debug(`Is browser element undefined or null? ${browserElement === undefined || browserElement === null}`);
        console.debug(`Connecting to: ${browserElement.wsEndpoint}...`);
        // Connect to the playwright WebSocket server.
        const playwrightWs = new WebSocket(browserElement.wsEndpoint);
        console.debug(`Playwright web socket created`);
        playwrightWs.on('open', () => this.#handlePlaywrightServerConnection(req, socket, head));

        // // Proxy messages between the client and the Playwright server.
        this.#webSocketServer.on('connection', (ws: WebSocket) => this.#proxyMessagesBetweenClientAndPlaywrightServer(playwrightWs, ws));

        // // Handle closing of connections.
        playwrightWs.on('close', () => this.#handleClosingConnection(socket));
    }

    /**
     * Handles when client connects to the playwright server
     * @param req The request instance
     * @param socket The socket instance
     * @param head 
     */
    #handlePlaywrightServerConnection(req: http.IncomingMessage, socket: stream.Duplex, head: Buffer) {
        // When the Playwright server connection is established, upgrade the client connection.
        console.debug(`User connected to the playwright web socket. Request headers ${req.headers}`);
        this.#webSocketServer.handleUpgrade(req, socket, head, (ws) => {
            this.#webSocketServer.emit('connection', ws, req);
        });
    }

    /**
     * Proxy between client and playwright server
     * @param playwrightWs WebSocket for the Playwright communication
     * @param ws The instance of the web socket
     */
    #proxyMessagesBetweenClientAndPlaywrightServer(playwrightWs: WebSocket, ws: WebSocket) {
        // TODO: Maybe refactor this function to the server configuration. To let users may change their own proxy functions
        console.debug(`Proxy between client and playwright server called.`);
        ws.on('message', function (message: string) {
            /*
            TODO: Let users to use a custom logging system. 
            console.debug(`Forwarding the message: ${message} from client to the playwright server`)
            */
            playwrightWs.send(message);
        });

        playwrightWs.on('message', function (message: string) {
            /*
            TODO: Let users to use a custom logging system.
            console.debug(`Forwarding the message ${message} from playwright to client`);
            */
            ws.send(message);
        });
    }

    /**
     * Handles the connection close
     * @param socket The socket instance
     */
    #handleClosingConnection(socket: stream.Duplex) {
        /*
        TODO: Let users to use a custom logging system.
        console.debug(`Connection between client and playwright server is closed`);
        */
        console.debug(`Connection between client and playwright server is closed`);

        socket.destroy();
    }


}


/**
 * Verify if the given browser type is valis, if so returns undefined, otherwise returns the related error
 * @param browserTypeHeader The browser type header value got from http.IncomingMessage
 * @returns An error if there's an error in the browser type header value
 */
function getBrowserHeaderError(browserTypeHeader: string[] | string | undefined): Error | undefined {
    if (browserTypeHeader === undefined) {
        return new Error('"paas-browser-type" header is required to detect the browser type');
    }

    if (typeof browserTypeHeader !== "string") {
        return new Error("Only one browser type allowed for 'paas-browser-type' header");
    }

    if (!isBrowserTypeString(browserTypeHeader as string)) {
        return new Error(`Invalid browser type string ${browserTypeHeader}`);
    }
    return undefined;
}