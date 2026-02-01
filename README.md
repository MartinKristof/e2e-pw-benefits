
# Dovolená za Benefity - Playwright E2E Tests

This repository contains a set of E2E tests for the "Dovolená za Benefity" application, created as a part of a technical assignment.

## Instructions

### Prerequisites

- Node.js
- npm

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

### Running the tests

To run the tests, use the following command:

```bash
npx playwright test
```

## Test Structure and Architecture

The tests are structured into two main files:

- `tests/happy-path.spec.ts`: Covers the main successful user journey.
- `tests/unhappy-path.spec.ts`: Covers various error scenarios.

The test implementation follows a simple and readable approach, focusing on user flow rather than detailed assertions.

## AI Usage

This project was developed in collaboration with an AI assistant. The AI was used for:

- **Initial project setup and configuration.**
- **Generating boilerplate code for tests.**
- **Researching and solving the "booking link" challenge.**
- **Providing guidance on best practices for Playwright testing.**

## Reflection

Given more time, I would have:

- **Implemented a more robust solution for handling test data.**
- **Added more detailed assertions to the tests.**
- **Explored the Polish version of the application in more detail.**
- **Created a more comprehensive test suite covering more edge cases.**
- **Refactored the code to use Page Object Model for better maintainability.**
