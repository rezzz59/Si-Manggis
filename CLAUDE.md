# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Si-Manggis** — Web Layanan Desa Digital yang modern dan ramah warga. A village digital services portal built with Next.js and Tailwind CSS.

## Commands

```bash
npm run dev      # Start development server at http://localhost:3000
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19
- **Styling:** Tailwind CSS v4 (uses `@import "tailwindcss"` — no tailwind.config.js)
- **Icons:** Lucide React
- **Language:** TypeScript strict mode

## Project Structure

```
app/                    # Next.js App Router pages
  layout.tsx            # Root layout (Navbar lives here)
  page.tsx              # Home page
  globals.css           # Global styles + Tailwind import
  favicon.ico
src/components/         # Reusable React components ("use client" if interactive)
public/                 # Static assets (served from /)
reference/              # Design reference images (do not use directly in code)
```

## Coding Conventions

- **Components:** Always create in `src/components/`
- **Path alias:** `@/*` maps to project root — use `import Foo from "@/src/components/Foo"`
- **Interactive components:** Add `"use client"` directive (e.g., Navbar with useState)
- **Responsive:** Always mobile-first, use Tailwind breakpoints (sm/md/lg)
- **Locale:** Always `lang="id"` on `<html>` — Indonesian content
- **Color palette:** Emerald/Teal dark (from `reference/referensihome.jpg` design reference)

## Design Reference

Design images are in `reference/`. Do not use these as direct image assets — they are reference only. Export/extract colors and layout from them.

## Important Notes

- This is **not** standard Next.js — check `node_modules/next/dist/docs/` for breaking changes before writing code
- Images for the web should go in `public/` and referenced via absolute path (e.g., `/images/foo.png`)
