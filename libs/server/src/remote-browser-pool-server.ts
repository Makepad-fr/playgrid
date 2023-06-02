import WebSocket from 'ws';
import http from 'http';

export class RemoteBrowserPoolServer {

    readonly #wss: WebSocket.Server

    constructor() {
        this.#wss = new WebSocket.Server({ port: 8080 });
        this.#initHandlers();
    }

    #initHandlers() {
        this.#wss.on('connection', (ws: WebSocket, request: http.IncomingMessage) => this.#handleDaemonConnection(ws, request))
        this.#wss.on('close', () => this.#handleConnectionClosed())
    }

    async #validateDaemonConnection(ws: WebSocket, request: http.IncomingMessage): Promise<boolean> {
        return true;
    }

    async #handleDaemonConnection(ws: WebSocket, request: http.IncomingMessage) {
        /**
         * The use case of the connection between this server and a daemon instance:
         * ---
         * - Daemons are programs that hosting Playwright servers. 
         * - When they are connected to the main server, they need to communicate
         * their configuration.
         * - The configuration should be saved and stored somewhere
         * - Each time a paas client wants to connect a playwright server, we choose a peer from 
         * saved data
         * - Once we found a daemon, we then forward all messages in proxy handler to the daemon
         * - How daemons can forward the message to the right browser?
         * In the proxy function the message should be changed and transferred to the daemon 
         * connection as a json {message:message, browserId: <the_id_of_the_browser>}.
         * Then on the daemon side, this message should be extracted and forwarded to the playwright
         * browser with given id
         *   
         */
        // Send a message back to the client immediately after connection

        // Authenticate the connected daemon
        const authorizationHeaderValue = request.headers['authorization'];
        if (authorizationHeaderValue === undefined) {
            ws.close(401, 'Authorization header is required')
            return;
        }
        if (!(await this.#validateDaemonConnection(ws, request))) {
            // TODO:To avoid spamming maybe ip blocking on count ?
            ws.close(403, 'Deamon validation failed');
            return;
        }
        // Daemon passed the validation test

        ws.send('Hello, client! You are connected.');

        // When we receive a message...
        ws.on('message', (message: string) => {
            console.debug('A new message got from daemon')
            try {
                /* TODO: 
                Create a custom type, if the type parsing fails,
                it may be a message from playwright server to forward to client, contains the unique identifier to identify client connection
                Do not use client id, create an id when a client connects to daemon. The same id should also be sent
                when sending messages to the daemon and daemon should be able to identify the playwright server using this id 
                */
                const parsedMessage = JSON.parse(message);
                if (parsedMessage['action'] === 'browser-config') {
                    const daemonConfig = parsedMessage['data'];
                    // TODO: Save daemon config, ws, and authenticated daemon id some where
                }
                // TODO: Daemon should also emit a message when playwright server is closed or crashed
                // TODO: Daemon should also emit message when playwright server has an error
            } catch (e) {
                // If the parsing fails, it is not a JSON message
            }
        });
    }

    #handleConnectionClosed() {
        console.log('A daemon disconnected')
    }
}