# PAAS: Playwright As A Service

PAAS is an open-source npm package that provides an HTTP server, compatible with Playwright's connect method. It enables you to execute Playwright tests from a home IP address, solving the common problem of IP-based blocking in automated testing environments.

PAAS is designed with a custom authentication system, allowing clients to authenticate in a way that best suits their needs. It's built to be modular and adaptable, fitting into your testing workflow with ease.

Furthermore, PAAS aims to extend its capabilities to support a wider community of users. The future goal is to enable individuals to connect their home-based Playwright servers to the PAAS infrastructure, potentially earning a profit if their servers are used by others.

This project was born out of the needs faced during the development of [Linkedin.js](https://github.com/Makepad-fr/linkedin.js), an open-source npm package that automates LinkedIn.

## Features

- **Custom Authentication System**: PAAS allows clients to authenticate in a way that best suits their needs, enhancing security and flexibility.
- **Playwright Compatibility**: PAAS is fully compatible with Playwright's connect method, making it possible to run tests from a home IP address.
- **Future-Proof**: The future goal of PAAS is to allow individuals to connect their home-based Playwright servers to the PAAS infrastructure, creating a community of home-based server hosts.

## Technologies Used

This project extensively uses the following technologies:

- [**Playwright**](https://playwright.dev): [Playwright](https://playwright.dev) is a Node.js library to automate the Chromium, WebKit, and Firefox browsers with a single API. In PAAS, we use [Playwright](https://playwright.dev)'s [connect](https://playwright.dev/docs/api/class-browsertype#browser-type-connect) method to provide an interface for running tests from home IP addresses.
- [**Express.js**](https://expressjs.com/): [Express.js](https://expressjs.com/) is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. We use Express.js in PAAS to create our HTTP server.
- [**TypeScript**](https://www.typescriptlang.org/): TypeScript is an open-source language which builds on JavaScript, one of the world's most used tools, by adding static type definitions. [TypeScript](https://www.typescriptlang.org/) helps us write safer and more understandable code in PAAS.

## Getting Started

### Installing the library

```bash
npm install @makepad/paas
```

Once the library is installed you can follow the [`example-server` code](./src/example-server.ts) to implement your own server.

You can also find an example client code in [`example-client.ts` file](src/example-client.ts)


## Contributing

All contributions are welcome. Please read [contribution guidelines](./CONTRIBUTING.md).

## License

All source code is licensed under [GNU GENERAL PUBLIC LICENSE Version 3.0](./LICENSE). But we are not closed to the propretary use of the project, if it's you case please [contact us][mailto:dev@makepad.fr] 

