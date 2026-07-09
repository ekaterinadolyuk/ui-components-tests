# ui-components-tests

End-to-end UI component tests built with [Playwright](https://playwright.dev/) + TypeScript.
The public demo site [demoqa.com](https://demoqa.com/) is used as the test bench to verify
the behavior of common interface elements: forms, checkboxes, radio buttons, dropdowns,
tooltips, alerts, tables, a date picker, and iframes.

![Playwright](https://img.shields.io/badge/tested%20with-Playwright-2EAD33?logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)

## Contents

- [Tech stack](#tech-stack)
- [Test coverage](#test-coverage)
- [Project structure](#project-structure)
- [Requirements](#requirements)
- [Installation](#installation)
- [Running the tests](#running-the-tests)
- [Reports](#reports)
- [Configuration](#configuration)
- [CI](#ci)

## Tech stack

| Tool | Purpose |
| --- | --- |
| [Playwright Test](https://playwright.dev/docs/test-intro) `^1.59` | Test runner and browser automation |
| TypeScript | Test authoring language |
| Node.js | Runtime |
| `@types/node` | Node.js type definitions for TypeScript |

Tests run across three engines: **Chromium**, **Firefox**, and **WebKit**.

## Test coverage

All scenarios live in [`tests/uiComponentsTests.spec.ts`](tests/uiComponentsTests.spec.ts).
Before each test (`beforeEach`) the demoqa.com home page and the **Interaction** section are
opened, then navigation continues into the relevant component category.

| # | Test | Section / component | What it verifies |
| --- | --- | --- | --- |
| 1 | `Submit a form` | Elements → Text Box | Filling in form fields (name, email, addresses) and correct rendering of the submitted data |
| 2 | `Radio Buttons can be checked/unchecked` | Elements → Radio Button | Mutually exclusive radio selection and the disabled state of the `No` option |
| 3 | `All checkboxes can be checked` | Elements → Check Box | Checking every box in the tree and validating the full list of selected items |
| 4 | `Dropdown values can be chosen` | Widgets → Select Menu | Sequentially selecting each value in the dropdown |
| 5 | `Button tooltip contains correct value` | Widgets → Tool Tips | Tooltip appearing on hover and having the correct text |
| 6 | `Alert can be accepted` | Alerts, Frame & Windows → Alerts | Handling the native `confirm` dialog, its message, and the confirmation result |
| 7 | `Edit cell in web table` | Elements → Web Tables | Editing a cell (salary) in a table row and persisting the change |
| 8 | `Pick the date in 30 days in datepicker` | Widgets → Date Picker | Selecting a date 31 days ahead by paging through the calendar months |
| 9 | `Iframe contains correct text` | Alerts, Frame & Windows → Frames | Reading content inside an `iframe` via `frameLocator` |

The suite demonstrates working with different Playwright locator types (`getByRole`, `locator`,
`frameLocator`), handling dialog events (`page.on('dialog', …)`), iterating over element
collections, and computing dates on the fly.

## Project structure
ui-components-tests/
├── tests/
│   └── uiComponentsTests.spec.ts   # all test scenarios
├── playwright.config.ts            # Playwright configuration
├── package.json                    # project dependencies
└── .gitignore

## Requirements

- [Node.js](https://nodejs.org/) version 18 or higher
- npm (comes with Node.js)

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/ekaterinadolyuk/ui-components-tests.git
cd ui-components-tests

# 2. Install dependencies
npm install

# 3. Install Playwright browsers
npx playwright install
```

## Running the tests

```bash
# Run all tests across all browsers
npx playwright test

# Run a specific file
npx playwright test tests/uiComponentsTests.spec.ts

# Run a single test by name
npx playwright test -g "Submit a form"

# Run in a single browser only
npx playwright test --project=chromium

# Run in UI Mode
npx playwright test --ui

# Run in headed mode (visible browser window)
npx playwright test --headed
```

## Reports

An HTML report is generated after each run. Open it with:

```bash
npx playwright show-report
```

The report includes test statuses, steps, screenshots, and traces for failed scenarios.

## Configuration

Key settings are defined in [`playwright.config.ts`](playwright.config.ts):

- **`testDir: './tests'`** — the tests directory.
- **`fullyParallel: true`** — tests run in parallel.
- **`reporter: 'html'`** — report format.
- **`trace: 'on-first-retry'`** — collect a trace on the first retry for debugging.
- **`projects`** — Chromium, Firefox, and WebKit (mobile and branded browsers are available
  but commented out).

## CI

The configuration is ready for CI environments:

- retries are enabled when `process.env.CI` is set (`retries: 2`);
- parallelism is limited to a single worker (`workers: 1`);
- `forbidOnly` prevents accidentally committing a leftover `test.only`.

---

> This is a learning/demo project showcasing approaches to end-to-end testing of UI
> components with Playwright.
