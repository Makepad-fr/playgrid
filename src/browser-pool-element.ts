import { BrowserServer, BrowserType, chromium, firefox, webkit } from "playwright-core";

export type BrowserTypeString = 'firefox'|'chromium'|'webkit';

export function isBrowserTypeString(value: string): value is BrowserTypeString {
    return ['firefox', 'chromium', 'webkit'].includes(value);
}

export class BrowserPoolElement {
    #id: string;
    #browser: BrowserServer;
    #available: boolean;
    #currentUser: string|undefined;
    #startedAt: Date;
    #busySince: Date|undefined;
    #history: BrowserUsageHistoryItem[];
    // TODO: Add the websocket address of the created browser
    private constructor(id: string, browser: BrowserServer, available: boolean, startedAt: Date, busySince: Date|undefined, history: BrowserUsageHistoryItem[], currentUser: string|undefined) {
        this.#id = id;
        this.#browser = browser;
        this.#available = available;
        this.#currentUser = currentUser;
        this.#startedAt = startedAt;
        this.#busySince = busySince;
        this.#history = history;
    }

    static async init(bt: BrowserTypeString): Promise<BrowserPoolElement> {
        const id = crypto.randomUUID();
        const browserType = createBrowserTypeFromString(bt);
        // TODO: Change to headless true
        const browserServer = await browserType.launchServer({headless: false});
        return new BrowserPoolElement(id, browserServer, true, new Date(), undefined, [], undefined)
    }

    get availabilityFactor(): number {
        if (this.#available) {
            // If the browser is available calculate the availability factor
            //TODO: Complete the algorithm
            return 1;
        }
        return -1;
    }

    get id() {
        return this.#id;
    }

    get wsEndpoint(): string {
        console.log('HERREEEE====');
        console.debug(`WsEndpoint getter function called. The browser is undefined? :${this.#browser === undefined}`);
        return this.#browser.wsEndpoint()
    }

    get available(): boolean {
        return this.#available;
    }

    set available(a: boolean) {
        this.#available = a;
    }

}



interface BrowserUsageHistoryItem {
    id: string;
    started: Date;
    ended: Date;
}


function createBrowserTypeFromString(bt: BrowserTypeString): BrowserType {
    switch (bt) {
        case 'firefox': return firefox;
        case 'chromium': return chromium;
        case "webkit": return webkit;
        default: throw new Error(`${bt} is not a defined browser type string`);
    }
}