import fs from 'node:fs';
import path from 'node:path';
import { minify } from 'html-minifier-next';

export default function(eleventyConfig) {
  const isProduction = process.env.ELEVENTY_ENV === "production";

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

  console.log("Eleventy production mode:", isProduction);

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

  //eleventyConfig.addPassthroughCopy({ "static": "." });
  eleventyConfig.addPassthroughCopy({ "static/robots.txt": "robots.txt" });
  eleventyConfig.addPassthroughCopy({ "static/images/favicon.ico": "favicon.ico" });

  return {
    dir: {
      input: "src",
      output: "public",
      includes: "."
    },
    templateFormats: ["html"]
  };
}
