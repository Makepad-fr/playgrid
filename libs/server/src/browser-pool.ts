import { BrowserPoolElement } from './browser-pool-element';
import { RemoteBrowserPoolServer } from './remote-browser-pool-server';
import { BrowserPoolBrowserCountStatus, BrowserTypeString, CreateBrowserPoolOptions } from './types';





type BrowserPoolElements = BrowserPoolElement[];

export class BrowserPool {
    readonly #firefoxBrowsers: BrowserPoolElements;
    readonly #chromiumBrowsers: BrowserPoolElements;
    readonly #webkitBrowsers: BrowserPoolElements;
    readonly #browserPoolServer: RemoteBrowserPoolServer;

    constructor(daemonServerPort: number) {
        // TODO: Move the port number to the server configuration
        this.#browserPoolServer = new RemoteBrowserPoolServer(daemonServerPort);
        this.#firefoxBrowsers = [];
        this.#chromiumBrowsers = [];
        this.#webkitBrowsers = [];
        this.#initServerListeners();
    }

    #initServerListeners() {

    }

    /**
     * Get the browser count status of the browser pool.
     */
    get size(): BrowserPoolBrowserCountStatus {
        return {
            total: this.#firefoxBrowsers.length + this.#chromiumBrowsers.length + this.#webkitBrowsers.length,
            firefox: {
                available: this.#firefoxBrowsers.filter(e => e.available).length,
                unavailable: this.#firefoxBrowsers.filter(e => !e.available).length,
                total: this.#firefoxBrowsers.length
            },
            chromium: {
                available: this.#chromiumBrowsers.filter(e => e.available).length,
                unavailable: this.#chromiumBrowsers.filter(e => !e.available).length,
                total: this.#chromiumBrowsers.length    
            },
            webkit: {
                available: this.#webkitBrowsers.filter(e => e.available).length,
                unavailable: this.#webkitBrowsers.filter(e => !e.available).length,
                total: this.#webkitBrowsers.length    
            }
        }
    }

    /**
     * From the given browser type, return the best available browser
     * @param bts the browser type as string to select an available browser
     * @returns The selected browser or undefined, if there's none
     */
    getAvailablebrowser(bts: BrowserTypeString): BrowserPoolElement | undefined {
        /**
         * When implementing external daemons, this code will be changed.
         * We need to have the requesters location and ideally session id
         * Using these information, we need to query the DaemonPoolServer instance to return the
         * related browser as BrowserPoolElement to hide daemon details
         */
        let selectedBrowserPool: BrowserPoolElements
        switch (bts) {
            case 'firefox':
                selectedBrowserPool = this.#firefoxBrowsers;
                console.debug(`Firefox browsers ws endpoint`);
                console.debug(this.#firefoxBrowsers.map(b => b.wsEndpoint));
                console.debug(`Number of firefox browsers= ${this.#firefoxBrowsers.length}`)
                break;
            case 'chromium':
                selectedBrowserPool = this.#chromiumBrowsers;
                break;
            case 'webkit':
                selectedBrowserPool = this.#webkitBrowsers;
                break;
            default:
                throw new Error(`Browser type: ${bts} is not supported yet`)
        }
        return findBestBrowser(selectedBrowserPool)
    }
}

/**
 * Select the best browser from the given list. It scores each element of the given
 * browser pool elements and get the element with the highet score
 * @param elements Browsers for the same type to select
 */
function findBestBrowser(elements: BrowserPoolElements): BrowserPoolElement | undefined {

    const sortedElements = elements.sort((a, b) => a.availabilityFactor - b.availabilityFactor);

    return sortedElements[0] as BrowserPoolElement | undefined;
}