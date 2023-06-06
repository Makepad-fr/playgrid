import http from 'http';

export type AuthenticationFunction = (req: http.IncomingMessage) => Promise<string | undefined>;
export type DisconnectFunction = (authenticatedUserId: string) => Promise<void>
export type CreateBrowserPoolOptions = {
    firefox?: number,
    chromium?: number,
    webkit?: number
};
export type BrowserTypeString = 'firefox'|'chromium'|'webkit';
export type BrowserPoolStatus = {
    browsers: BrowserPoolBrowserCountStatus 
}
export type BrowserPoolBrowserCountStatus = {
    firefox: BrowserCountStatusDetails,
    chromium: BrowserCountStatusDetails,
    webkit: BrowserCountStatusDetails,
    total: number
}


type BrowserCountStatusDetails = {
    available: number,
    unavailable: number,
    total: number
}

export type PlaywrightServerConfig = {
    authenticate: AuthenticationFunction,
    disconnect?: DisconnectFunction,
    browserPoolOptions: CreateBrowserPoolOptions,
    daemonServerPortNumber?: number
}