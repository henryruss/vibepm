# VibePM

A personal project dashboard that tracks every project and AI agent 
in one place. Auto-syncs via GitHub webhook whenever you push — 
no manual updates needed.

Live at [vibepm-six.vercel.app](https://vibepm-six.vercel.app)  
Public portfolio mode — no login required to view.

## What it does

- Tracks all active projects with status, todos, and notes per project
- Auto-updates via GitHub webhook on every push — commit messages 
  feed directly into the project timeline
- Organized by category (Websites & Webapps, Agents, etc.)
- PDF export of the full project portfolio
- Public read-only portfolio mode for sharing
- Auth-gated write mode via Supabase for personal use

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Styling | Tailwind CSS |
| Hosting | Vercel |

## How the webhook works

A GitHub webhook fires on every push to any of my repos. A Next.js 
API route receives the payload, parses the commit message and repo 
name, and logs the update to the relevant project in Supabase. The 
dashboard reflects the change immediately — no manual entry.

The `/log` slash command in Claude Code generates a structured 
session summary and pushes it via the same pipeline, so every 
coding session ends with an automatic log entry.

## Running locally
```bash
git clone https://github.com/henryruss/vibepm
cd vibepm
npm install
cp .env.example .env.local  # add your Supabase credentials
npm run dev
```

You'll need a Supabase project with the schema from `supabase/`.
