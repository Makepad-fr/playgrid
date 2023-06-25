import { type BrowserTypeString } from "@playgrid/core";
import {BrowserServer, BrowserType, Logger, chromium, firefox, webkit} from 'playwright';


/**
 * This file will be called from the index.ts of @playgrid/core package using child_process.spawn function
 */


type BrowserServerProcessParams = {
    browserType: BrowserTypeString,
    options?: BrowserServerOptions
}

type BrowserServerOptions = {
        /**
         * Additional arguments to pass to the browser instance. The list of Chromium flags can be found
         * [here](http://peter.sh/experiments/chromium-command-line-switches/).
         */
        args?: Array<string>;
    
        /**
         * Browser distribution channel.  Supported values are "chrome", "chrome-beta", "chrome-dev", "chrome-canary",
         * "msedge", "msedge-beta", "msedge-dev", "msedge-canary". Read more about using
         * [Google Chrome and Microsoft Edge](https://playwright.dev/docs/browsers#google-chrome--microsoft-edge).
         */
        channel?: string;
    
        /**
         * Enable Chromium sandboxing. Defaults to `false`.
         */
        chromiumSandbox?: boolean;
    
        /**
         * **Chromium-only** Whether to auto-open a Developer Tools panel for each tab. If this option is `true`, the
         * `headless` option will be set `false`.
         */
        devtools?: boolean;
    
        /**
         * If specified, accepted downloads are downloaded into this directory. Otherwise, temporary directory is created and
         * is deleted when browser is closed. In either case, the downloads are deleted when the browser context they were
         * created in is closed.
         */
        downloadsPath?: string;
    
        /**
         * Specify environment variables that will be visible to the browser. Defaults to `process.env`.
         */
        env?: { [key: string]: string|number|boolean; };
    
        /**
         * Path to a browser executable to run instead of the bundled one. If `executablePath` is a relative path, then it is
         * resolved relative to the current working directory. Note that Playwright only works with the bundled Chromium,
         * Firefox or WebKit, use at your own risk.
         */
        executablePath?: string;
    
        /**
         * Firefox user preferences. Learn more about the Firefox user preferences at
         * [`about:config`](https://support.mozilla.org/en-US/kb/about-config-editor-firefox).
         */
        firefoxUserPrefs?: { [key: string]: string|number|boolean; };
    
        /**
         * Close the browser process on SIGHUP. Defaults to `true`.
         */
        handleSIGHUP?: boolean;
    
        /**
         * Close the browser process on Ctrl-C. Defaults to `true`.
         */
        handleSIGINT?: boolean;
    
        /**
         * Close the browser process on SIGTERM. Defaults to `true`.
         */
        handleSIGTERM?: boolean;
    
        /**
         * Whether to run browser in headless mode. More details for
         * [Chromium](https://developers.google.com/web/updates/2017/04/headless-chrome) and
         * [Firefox](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Headless_mode). Defaults to `true` unless the
         * `devtools` option is `true`.
         */
        headless?: boolean;
    
        /**
         * If `true`, Playwright does not pass its own configurations args and only uses the ones from `args`. If an array is
         * given, then filters out the given default arguments. Dangerous option; use with care. Defaults to `false`.
         */
        ignoreDefaultArgs?: boolean|Array<string>;
    
        /**
         * Logger sink for Playwright logging.
         */
        logger?: Logger;
    
        /**
         * Port to use for the web socket. Defaults to 0 that picks any available port.
         */
        port?: number;
    
        /**
         * Network proxy settings.
         */
        proxy?: {
          /**
           * Proxy to be used for all requests. HTTP and SOCKS proxies are supported, for example `http://myproxy.com:3128` or
           * `socks5://myproxy.com:3128`. Short form `myproxy.com:3128` is considered an HTTP proxy.
           */
          server: string;
    
          /**
           * Optional comma-separated domains to bypass proxy, for example `".com, chromium.org, .domain.com"`.
           */
          bypass?: string;
    
          /**
           * Optional username to use if HTTP proxy requires authentication.
           */
          username?: string;
    
          /**
           * Optional password to use if HTTP proxy requires authentication.
           */
          password?: string;
        };
    
        /**
         * Maximum time in milliseconds to wait for the browser instance to start. Defaults to `30000` (30 seconds). Pass `0`
         * to disable timeout.
         */
        timeout?: number;
    
        /**
         * If specified, traces are saved into this directory.
         */
        tracesDir?: string;
    
        /**
         * Path at which to serve the Browser Server. For security, this defaults to an unguessable string.
         *
         * **NOTE** Any process or web page (including those running in Playwright) with knowledge of the `wsPath` can take
         * control of the OS user. For this reason, you should use an unguessable token when using this option.
         */
        wsPath?: string;
}

/**
 * Get a BrowserType from the stirng representation 
 * @param browserTypeString The string representation of the browser type
 * @returns The BrowserType instance created from the string representation
 */    
function getBrowserTypeFromString(browserTypeString: BrowserTypeString): BrowserType {
    switch (browserTypeString) {
        case "firefox": return firefox;
        case "chromium": return chromium;
        case "webkit": return webkit;
        default: throw new Error(`Unknown browser type ${browserTypeString}`);
    }
}

/**
 * Get the browser server process configuration from the current process' arguments
 * @returns The BrowserServerProcessParams instance parsed from the current process' arguments
 */
function getBrowserServerProcessConfig(): BrowserServerProcessParams {
    if (process.argv[2]) {
        return JSON.parse(process.argv[2]!);
    }
    throw new Error(`Please provide configuration to process args`);
}

/**
 * Creates a new browser server from the current configuration and returns it
 * @param config The configuration of the current browser server process   
 * returns The created BrowserSever instance from th current configuration
 */
async function createBrowserServer(config: BrowserServerProcessParams): Promise<BrowserServer> {
    const browserType: BrowserType = getBrowserTypeFromString(config.browserType);
    return browserType.launchServer(config.options);
}

/**
 * Handle the browser server creation
 * @param browserServer The created browser server instance
 */
function handleBrowserServerCreation(browserServer: BrowserServer) {
    // TODO: Send a message to the parent process to let them know that the browser server is created
    // TODO: Start monitoring the process ressource usage and send them to the parent process
    // TODO: Listen process messages
    // TODO: Some messages should be forwarded directly to the browser server
    // TODO: Other messages should handled internally
    // TODO: All messages coming from browser server should directed to the parent process
    // TODO: Messages should have the following format {command: Command, data: unknown} 
}

/**
 * Start the browser server process 
 */
async function start() {
    const config = getBrowserServerProcessConfig();
    await createBrowserServer(config).then((browserServer) => handleBrowserServerCreation(browserServer));
}

start().then();
