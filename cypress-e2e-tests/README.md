# Sock Shop microservices assessment - Cypress E2E tests


Cypress E2E front end tests for Sock Shop microservices

## Getting Started

These instruction will get you a copy of the project up and running on you local machine for development.

### Installing

To run this project you just need to install the npm dependencies</br>
[Ensure that you are in the right folder (`cd cypress-e2e-tests`)]

```
npm install
```

## Running the tests with UI

To run the tests with the Cypress UI enter the following command:

```
npx cypress open
```

## NPM Tasks

```
"cy": "Opens the Cypress test runnes"

"cy:run": "Runs Cypress tests in a headed mode on Chrome browser"

"cy:run:headless": "Runs Cypress tests in a headless browser"

"prettify": "Applies code formatting"
```

## Test cases documentation

All test cases are described in `test_cases_doc` folder.
There are remarks if some test cases fail.

## Design pattern

For transparency and avoiding code duplication the framework uses quasi Page Object Model.<br />
Reusable methods and locators are exported to separate files. So every page is represented by locators in `custom/locators` and methods in `support/pages`.<br />
Helper functions are kept under `support/helpers`.<br />
Framework gets advantages of cypress 9.7.0 and uses its built-in structure, so:<br />
- custom cypress commands can be found in `support/commands.js`.<br />
- test data is in `fixture`<br />
- test cases are in `integration` folder.<br />
- some configuration for plugins in `plugins/index.js` (no configuration now, but keeping file as a reference)
- some test prerequisities are in `support/index.js`
