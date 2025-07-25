import fs from 'node:fs';
import path from 'node:path';
import { minify } from 'html-minifier-next';
import matter from 'gray-matter';
import { buildJS, buildCSS } from './scripts/eleventy-hooks.js';

const ExternalLink = `<svg class="lucide icon" aria-hidden="true"><use href="#icon-external-link" /></svg>`;

export default function(eleventyConfig) {
  const isProduction = process.env.ELEVENTY_ENV === "production";

  eleventyConfig.addPairedShortcode("ext_link", function(content, href) {
    return `<a href="${href}" target="_blank" rel="noopener noreferrer">${content}${ExternalLink}</a>`;
  });

  eleventyConfig.setServerOptions({
    watch: [
      "src/css/**/*.css",
      "src/js/**/*.js"
    ]
  });

  eleventyConfig.on("eleventy.before", async () => {
    await buildCSS(false);
    await buildJS(false);
  });

  eleventyConfig.on("eleventy.beforeWatch", async () => {
    await buildCSS(true);
    await buildJS(true);
  });
  
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready(err, browserSync) {
        const content404 = fs.readFileSync(path.join('public', '404.html'));
        browserSync.addMiddleware("*", (req, res) => {
          res.writeHead(404, { "Content-Type": "text/html; charset=UTF-8" });
          res.write(content404);
          res.end();
        });
      }
    }
  });

  eleventyConfig.addPassthroughCopy({ "static": "." });

  eleventyConfig.on("eleventy.after", async ({ dir, results }) => {
    const outputPath = path.join(dir.output, "index.json");

    const entries = [];

    for (const entry of results) {
      if (
        !entry.outputPath ||
        !entry.outputPath.endsWith(".html") ||
        entry.url === "/404.html"
      ) continue;

      const inputFile = entry.inputPath;
      let front = {};
      try {
        const raw = fs.readFileSync(inputFile, "utf8");
        const parsed = matter(raw);
        front = parsed.data;
      } catch (err) {
        console.warn(`Failed to read front matter from ${inputFile}:`, err.message);
      }

      entries.push({
        title: front.title || "",
        href: entry.url,
        body: entry.content
          ? entry.content
              .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
              .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
              .replace(/<[^>]+>/g, "")
              .replace(/\|\s*rannday\.com/g, "")
              .replace(/Unlicense\s+\|\s+About/g, "")
              .replace(/Public domain\. No rights reserved\./gi, "")
              .replace(/\s+/g, " ")
              .trim()
          : ""
      });
    }

    fs.writeFileSync(outputPath, JSON.stringify(entries, null, 2));
  });

  if (isProduction) {
    
    eleventyConfig.addTransform("htmlmin", async function(content, outputPath) {
      if (outputPath && outputPath.endsWith(".html")) {
        return await minify(content, {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeEmptyAttributes: true,
          useShortDoctype: true,
          sortAttributes: true,
          sortClassName: true,
          minifyCSS: true,
          minifyJS: true
        });
      }
      return content;
    });
  }
  
  return {
    dir: {
      input: "src",
      output: "public",
      includes: "templates"
    },
    templateFormats: ["html"]
  };
}
