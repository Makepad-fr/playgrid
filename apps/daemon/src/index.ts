import {PlaygridDeamon} from "@playgrid/deamon";
/**
 * This module should contain the code for the Daemon application 
 * that used for PaaS peers (or nodes). This should use @playgrid/daemon
 * package with a configuration. 
 * The application should be packaged as an electron app. The electron app
 * should show statistics for the peer's accounts and usage. This information 
 * will be got directly from @playwgrid/daemon package. When deploying in production
 * the Electron app's logs should be reviewed and all sensible log details should be removed
 * Also the debug mode for the Electron app should be disabled and the source code should not be
 * readable.
 */
console.log('Hello world');

const daemon = new PlaygridDeamon("ws://localhost:9988", {})