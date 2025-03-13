#!/usr/bin/env node

import { Command } from "commander";
import { chromium } from "playwright";

const program = new Command();

async function getPageContent(url: string): Promise<string> {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(url, { waitUntil: "networkidle" });

    // Wait for the main content to be loaded
    await page.waitForLoadState("domcontentloaded");

    // Simulate Ctrl+A (Select All) and get the selected text
    await page.keyboard.press("Control+A");
    const selectedText = await page.evaluate(() => {
      const selection = window.getSelection();
      if (!selection) return "";

      // Get all selected ranges
      const ranges = [];
      for (let i = 0; i < selection.rangeCount; i++) {
        ranges.push(selection.getRangeAt(i));
      }

      // Create temporary elements to handle the selection properly
      const container = document.createElement("div");
      ranges.forEach((range) => {
        const clonedContent = range.cloneContents();

        // Process the cloned content to maintain structure
        const fragment = document.createDocumentFragment();
        Array.from(clonedContent.childNodes).forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;

            // Handle block elements
            if (getComputedStyle(element).display === "block") {
              if (fragment.lastChild?.nodeType === Node.TEXT_NODE) {
                fragment.appendChild(document.createElement("br"));
              }
              fragment.appendChild(node);
              fragment.appendChild(document.createElement("br"));
            }
            // Handle headings with extra spacing
            else if (element.tagName.match(/^H[1-6]$/)) {
              fragment.appendChild(document.createElement("br"));
              fragment.appendChild(node);
              fragment.appendChild(document.createElement("br"));
              fragment.appendChild(document.createElement("br"));
            }
            // Handle lists
            else if (element.tagName === "LI") {
              fragment.appendChild(document.createTextNode("• "));
              fragment.appendChild(node);
              fragment.appendChild(document.createElement("br"));
            }
            // Handle other inline elements
            else {
              fragment.appendChild(node);
            }
          } else {
            fragment.appendChild(node);
          }
        });

        container.appendChild(fragment);
      });

      // Clean up the text
      return container.innerText
        .replace(/[\t ]+/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .replace(/^\s+|\s+$/g, "")
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line)
        .join("\n");
    });

    return selectedText;
  } finally {
    await browser.close();
  }
}

program
  .name("doc-fetch")
  .description(
    "Extract readable content from web pages by simulating browser selection"
  )
  .argument("<url>", "URL to fetch content from")
  .action(async (url) => {
    try {
      const content = await getPageContent(url);
      process.stdout.write(content);
    } catch (error) {
      console.error("Error:", error);
      process.exit(1);
    }
  });

program.parse();
