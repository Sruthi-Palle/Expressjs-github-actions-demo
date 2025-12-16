# CI/CD Deployment Workflow

This document provides a detailed explanation of the GitHub Actions workflow defined in `.github/workflows/deploy.yml`. This workflow is designed to automate the testing and deployment of the Node.js application.

## Workflow Overview

The workflow is named **Deployment** and performs the following primary functions:

1.  **Tests the application**: It runs a comprehensive test suite against the application in a controlled environment.
2.  **Prepares for deployment**: After tests pass, it runs a placeholder `deploy` job, which can be extended for actual deployment to a hosting environment.

---

## Triggers

The workflow is automatically triggered on a `push` event to the following branches:

- `main`
- `dev`

---

## Environment Variables

A workflow-level environment variable is defined and is available to all jobs:

- `MONGODB_DB_NAME`: The name of the MongoDB database. Set to `gha-demo`.

---

## Jobs

The workflow consists of two sequential jobs: `test` and `deploy`.

### 1. `test` Job

This job is responsible for setting up the environment, installing dependencies, and running the test suite to ensure the application is stable and correct.

#### Environment

- **Runner**: `ubuntu-latest`
- **GitHub Environment**: `testing`
  - This configuration allows the job to access secrets specifically defined for the `testing` environment, such as database credentials.

#### Secrets

The `test` job uses the following secrets, which must be configured in the `testing` environment within your repository's settings:

- `secrets.MONGODB_USERNAME`: The username for the MongoDB Atlas database.
- `secrets.MONGODB_PASSWORD`: The password for the MongoDB Atlas database.

#### Steps

1.  **Get Code**: Checks out the repository's source code using `actions/checkout@v4`.

2.  **Cache dependencies**: This step implements a highly efficient caching strategy to speed up builds.

    - It caches the `node_modules` directory directly.
    - The cache `key` is generated based on a hash of the `package-lock.json` file. This ensures that a new cache is created only when dependencies change.
    - If a cache is found for the current `package-lock.json`, the `node_modules` directory is restored, and subsequent installation steps are skipped, saving significant time.

3.  **Install dependencies**:

    - This step runs `npm ci` to install dependencies.
    - **Conditional Execution**: It only runs if the previous caching step resulted in a "cache miss" (`if: steps.cache-node-modules.outputs.cache-hit != 'true'`). This is a key optimization.

4.  **Run server**:

    - It executes `npm start & npx wait-on http://127.0.0.1:$PORT`.
    - The `npm start` command starts the Node.js server in the background (`&`).
    - `npx wait-on` pauses the workflow until the server is fully started and responsive at the specified port, ensuring the server is ready before tests begin.

5.  **Run tests**:

    - Executes `npm test`, which in turn runs the Playwright test suite (`npx playwright test`).

6.  **Output information**: A simple step to echo the `MONGODB_USERNAME` to the log for debugging purposes.

### 2. `deploy` Job

This job is intended for deploying the application to a production or staging environment. It runs only after the `test` job has completed successfully.

#### Dependencies

- **`needs: test`**: This ensures that deployment only occurs if all tests have passed.

#### Steps

1.  **Output information**: This is currently a placeholder step that demonstrates how to access environment variables. It can be replaced with actual deployment commands (e.g., `scp`, `ssh`, or a cloud provider's CLI tool).

> **Note**: As currently configured, this job does not have an `environment` specified, so it cannot access the secrets from the `testing` environment. For a real deployment, you would typically define a `production` environment and grant this job access to it.
