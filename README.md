# DAFs as a Service Documentation

This repository contains the documentation for using Endaoment's Donor Advised Fund (DAF) as a Service API.
This API allows you to create and manage Donor Advised Funds as a third-party service, while leveraging Endaoment's expertise in charitable giving.

## Overview

This documentation is broken down into a quickstart example and flow guides.
The quickstart example is a copy-able working implementation of the DAF as a Service API, while the flow guides provide a more in-depth look at the API, its features, and how to use them.

## Documentation

1. [Login User](docs/login-user.md)
2. [Open a DAF](docs/open-daf.md)
3. [Donate to a DAF](docs/donate-to-daf.md)
4. [Search for an Organization](docs/search-for-org.md)
5. [Grant from a DAF](docs/grant-from-daf.md)

## Working Code Sample

### Setting up your environment
1. Set up and install NVM
   - [Linux and Mac](https://github.com/nvm-sh/nvm)
   - [Windows](https://github.com/coreybutler/nvm-windows)
2. Using NVM, install Node v22.11.0
   - Confirm installation by running `node -v` on the command line
3. Install yarn with `npm install --global yarn`
   - Confirm installation by running `yarn -v` on the command line

### Running the Application
1. Set up the [API](./quickstart/backend/README.md)
2. Set up the [Frontend App](./quickstart/frontend/README.md)
3. You should be able to see the application working
