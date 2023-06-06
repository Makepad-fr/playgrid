// TODO: Connect to the websocket server on port 9002 pass an authorization header
// TODO: Copy the code of the BrowserPoolElement and types.ts to @paas/core package
// TODO: Create a BrowserPoolElement using init function when connecting to the server
// TODO: Send a message to the connected server
// TODO: Receive messages from connected serber

export class PlaygridDeamon {

    readonly #url: string;

    private constructor(address: string) {
        this.#url = address;
    }

    async init(address: string): Promise<PlaygridDeamon> {
        /* TODO: 
        The init function should take a configuration to start the browsers:
        This configuration should contain:
        - the number browsers grouped by browser type
        - the percent of ressources (CPU/RAM) to be used to limit the ressource usage
        - If auto scaling is enabled, the configuration should contain minimum and max number of browsers
        by default the minimum number is 1 and the maximum number is the number of CPU
        - All browser servers should be created using child_process to keep the possibility to monitoring them
        */
        return new PlaygridDeamon(address);
    }

    start() {
        // Create a new WebSocket connection
        const socket: WebSocket = new WebSocket(this.#url);

        // Add an event listener for when the connection is open
        socket.addEventListener('open', (event) => {
            console.log('WebSocket connection opened');

            // Send a message to the server
            socket.send('Hello Server!');
        });

        // Add an event listener for when a message is received from the server
        socket.addEventListener('message', (event) => {
            console.log('Message from server: ', event.data);
        });

        // Add an event listener for when the connection is closed
        socket.addEventListener('close', (event) => {
            console.log('WebSocket connection closed');
        });

        // Add an event listener for any errors that occur
        socket.addEventListener('error', (event) => {
            console.error('WebSocket error: ', event);
        });
    }
}

const url = 'ws://example.com'; // replace with your WebSocket server URL



