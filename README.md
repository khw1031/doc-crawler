# doc-fetch

[![Publish Package](https://github.com/khw1031/doc-fetch/actions/workflows/publish.yml/badge.svg)](https://github.com/khw1031/doc-fetch/actions/workflows/publish.yml)
[![npm version](https://badge.fury.io/js/doc-fetch.svg)](https://badge.fury.io/js/doc-fetch)

A command-line tool that extracts readable content from web pages by simulating browser text selection behavior.

## Overview

This tool uses Playwright to simulate a real browser environment and extracts content in a way that closely resembles how users would select and copy text from a webpage. It maintains document structure, formatting, and readability while removing unnecessary elements.

## Installation

You can install the package globally using npm:

```bash
npm install -g doc-fetch
```

Or install it locally in your project:

```bash
npm install doc-fetch
```

Make sure to install the required system dependencies for Playwright browsers:

```bash
sudo apt-get install -y libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 libcups2 \
    libxcomposite1 libxdamage1 libxrandr2 libgbm1 libxkbcommon0 libpango-1.0-0 \
    libcairo2 libasound2 libatspi2.0-0
```

## Usage

After installing globally, you can use the command directly:

```bash
doc-fetch <url>
```

If installed locally, use npx:

```bash
npx doc-fetch <url>
```

Example:

```bash
doc-fetch https://example.com > output.txt
```

## How It Works

The tool follows these steps to extract content:

1. **Browser Initialization**

   - Launches a headless Chromium browser using Playwright
   - Creates a new browser context and page

2. **Page Loading**

   - Navigates to the specified URL
   - Waits for network activity to settle
   - Ensures DOM content is fully loaded

3. **Content Selection**

   - Simulates Ctrl+A (Select All) keyboard shortcut
   - Captures the selected content using the browser's Selection API

4. **Content Processing**

   - Clones the selected content while maintaining structure
   - Processes different types of elements:
     - Block elements: Adds line breaks before and after
     - Headings (h1-h6): Adds extra spacing for hierarchy
     - List items: Adds bullet points (•)
     - Inline elements: Preserves as-is

5. **Text Cleanup**
   - Normalizes whitespace
   - Removes excessive line breaks
   - Trims empty lines
   - Maintains proper spacing and structure

## Code Structure

The main logic is implemented in `src/index.ts`:

1. **Main Function: `getPageContent`**

   ```typescript
   async function getPageContent(url: string): Promise<string>;
   ```

   - Takes a URL as input
   - Returns the processed content as a string
   - Handles browser initialization and cleanup

2. **Browser Context**

   - Uses Playwright's Chromium browser
   - Runs in headless mode for efficiency
   - Ensures proper cleanup of browser resources

3. **Text Processing**

   - Maintains document structure
   - Preserves semantic meaning
   - Enhances readability with proper spacing
   - Cleans up formatting inconsistencies

4. **CLI Interface**
   - Built using Commander
   - Provides a simple command-line interface
   - Handles errors gracefully

## Features

- Simulates real browser text selection
- Maintains document structure and hierarchy
- Preserves semantic meaning of content
- Handles different types of elements appropriately
- Cleans and formats output for readability
- Runs in headless mode for efficiency

## Error Handling

The tool includes error handling for:

- Invalid URLs
- Network issues
- Browser initialization problems
- Content extraction failures

## Dependencies

- Playwright: For browser automation
- Commander: For CLI interface
- TypeScript: For type safety and modern JavaScript features

## Development

### Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/doc-fetch.git
cd doc-fetch
```

2. Install dependencies:

```bash
pnpm install
```

3. Build the project:

```bash
pnpm build
```

### Publishing

This package is automatically published to npm through GitHub Actions when a new version tag is pushed.

To publish a new version:

1. Update the version:

```bash
pnpm version patch  # for bug fixes
pnpm version minor  # for new features
pnpm version major  # for breaking changes
```

2. Push the new tag to GitHub:

```bash
git push --follow-tags
```

The GitHub Actions workflow will automatically:

- Install dependencies
- Run tests and linting
- Build the project
- Publish to npm

#### Setup for Publishing

Before you can publish:

1. Create an NPM account if you don't have one
2. Add your NPM token to your GitHub repository:
   - Go to npm (https://www.npmjs.com)
   - Generate an access token
   - In your GitHub repository, go to Settings > Secrets and variables > Actions
   - Add a new secret named `NPM_TOKEN` with your npm access token
