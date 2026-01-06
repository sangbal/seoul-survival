# Playwright E2E Test Environment Setup for WSL

## Issue

Playwright browsers (Chromium, Firefox, WebKit) require system libraries that are not installed by default in WSL (Windows Subsystem for Linux). When you try to run tests, you'll see errors like:

```
error while loading shared libraries: libnspr4.so: cannot open shared object file
```

or

```
Host system is missing dependencies to run browsers.
```

## Solution

### Option 1: Automatic Setup (Recommended)

Run the provided setup script with sudo:

```bash
sudo bash setup-playwright-wsl.sh
```

This will install all required system dependencies for Chromium and Firefox browsers.

### Option 2: Manual Installation

Install dependencies manually:

```bash
sudo apt-get update
sudo apt-get install -y \
  libnspr4 \
  libnss3 \
  libatk1.0-0 \
  libatk-bridge2.0-0 \
  libcups2 \
  libdrm2 \
  libdbus-1-3 \
  libxkbcommon0 \
  libxcomposite1 \
  libxdamage1 \
  libxfixes3 \
  libxrandr2 \
  libgbm1 \
  libpango-1.0-0 \
  libcairo2 \
  libasound2 \
  libatspi2.0-0 \
  libxshmfence1
```

### Option 3: Use Playwright's Built-in Command

```bash
sudo npx playwright install-deps firefox
```

## Verification

After installing dependencies, verify the setup by running:

```bash
npx playwright test --reporter=list
```

All tests should now execute successfully without dependency errors.

## Current Browser Configuration

The project is configured to use **Firefox** for E2E testing (see `playwright.config.js`). Firefox generally has fewer dependency requirements than Chromium in WSL environments.

## Notes

- This setup is only required once per WSL instance
- If you reset or reinstall WSL, you'll need to run the setup again
- The script installs standard system libraries and is safe to run
