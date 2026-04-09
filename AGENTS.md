# AGENTS.md

This file gives coding agents working rules for `static-site`.

## Scope and hard limits

- Only read or edit files inside this repository.
- Never edit files outside this project, even if a tool makes that possible.
- Git inspection commands are allowed when useful, such as `git status`, `git diff`, and `git log`.
- Never use Git to modify the repository state. Do not run commands such as `git pull`, `git push`, `git commit`, `git checkout`, `git merge`, `git rebase`, `git reset`, `git stash`, or branch/tag creation or deletion commands.
- Do not add new npm/node packages unless the user explicitly asks for that.
- Keep the project simple. This is a personal site, not a general-purpose product platform.

## Project purpose

- This is a basic static personal website built with Eleventy/11ty.
- It is deployed to Cloudflare Pages using Wrangler.
- The main content focus is Juniper networking certification study material.
- Additional content may cover general networking knowledge and related notes.
- Changes should favor clarity, maintainability, and straightforward authoring over abstraction.

## Stack

- Static site generator: `@11ty/eleventy`
- Bundling: `esbuild`
- Deployment target: Cloudflare Pages via `wrangler`
- Search: `lunr`
- Syntax highlighting: `highlight.js`
- Site source: `src/`
- Static passthrough assets: `static/`
- Generated output: `public/`

## Repository layout

- `src/` contains page source files.
- `src/templates/` contains Eleventy layouts and shared template partials.
- `src/juniper/` contains Juniper certification content.
- `src/networking/` contains broader networking content.
- `src/paloalto/` currently exists and should be preserved unless the user asks otherwise.
- `src/projects/` contains project pages.
- `src/css/` contains CSS entry points bundled into `public/css/`.
- `src/js/` contains browser JS entry points bundled into `public/js/`.
- `static/` contains passthrough files such as `robots.txt` and `favicon.ico`.
- `docs/` contains supporting documentation and image source material, not primary site content.
- `scripts/` contains the esbuild helper scripts used by the Eleventy build process.
- `public/` is generated output. Do not hand-edit generated files unless the user explicitly asks for that.

## How the site works

- Eleventy input is `src/` and output is `public/`.
- Includes/layouts live under `src/templates/`.
- The site currently uses HTML templates with front matter, not Markdown content pipelines.
- `base.html` provides the main shared page structure, navigation, footer, and search/highlight script loading.
- `.eleventy.js` also generates `public/index.json` for search by extracting text from rendered HTML pages.
- CSS and JS bundles are built into `public/` from the `eleventy.before` hooks.

## Content conventions

- Prefer adding content as simple HTML pages with front matter:

```html
---
title: Example Title
layout: base.html
---
```

- Keep information dense, accurate, and easy to scan.
- Favor study-note structure: requirements, concepts, terminology, links, and concise explanations.
- Use stable, descriptive page titles because titles feed the site search index.
- Preserve the existing URL and folder structure unless the user asks for a reorganization.
- Keep navigation and internal links explicit and simple.
- For external links, always use the Eleventy paired shortcode format `{% ext_link "https://example.com/" %}Label{% endext_link %}` instead of a raw `<a>` tag so the external-link icon and new-tab behavior stay consistent.
- Do not introduce CMS-like complexity, dynamic backends, or client-heavy UI patterns.

## Editing guidance

- Prefer small, direct changes that match the current architecture.
- Reuse existing layouts, styling patterns, and page structure before adding new abstractions.
- Keep HTML semantic and readable.
- Preserve the lightweight nature of the site.
- If adding a new content section, make sure it is linked from the relevant index page.
- If a change affects searchability, remember that rendered page content is indexed into `index.json`.

## Build and verification

- Safe project scripts are defined in `package.json`:
  - `npm run serve`
  - `npm run dev`
  - `npm run build`
  - `npm run preview`
  - `npm run deploy`
- Prefer `npm run build` to verify that structural changes still compile.
- Do not change deployment configuration unless the user asks.
- Do not run deployment commands unless the user explicitly asks for deployment work.

## What to avoid

- Do not add frameworks, client routers, databases, or server-side runtime features.
- Do not convert the site into a larger app architecture.
- Do not replace simple HTML pages with unnecessary generated systems.
- Do not hand-edit `public/` as the source of truth.
- Do not add dependencies to solve problems that can be handled with the current toolchain.
- Do not remove existing sections just because they are currently sparse.

## Decision standard

- When unsure, choose the option that keeps the site easy to maintain by one person.
- Favor explicit content files over clever abstractions.
- Favor correctness and readability over novelty.
