/**
 * This file will be called from the index.ts of @playgrid/core package using child_process.spawn function
 */

/* TODO: Get the argument passed to this process and parse it to JSON. This JSON
    will contain the type of the browser, if the browser is headless and other browser server
    related configuration
*/ 
// TODO: Create a new browser server
// TODO: Listen process messages
// TODO: Some messages should be forwarded directly to the browser server
// TODO: Other messages should handled internally
// TODO: All messages coming from browser server should directed to the parent process
// TODO: Messages should have the following format {command: Command, data: unknown} 