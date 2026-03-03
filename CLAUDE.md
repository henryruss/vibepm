# VibePM

Personal project lifecycle command center. Tracks projects through stages: Idea → Planned → In Progress → Complete.

## Tech Stack
- **Framework:** Next.js 15 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS v4 + custom "Void Luxe" dark theme
- **Drag & Drop:** @dnd-kit/core + @dnd-kit/sortable
- **Backend:** Supabase (Postgres + Auth + RLS)
- **Auth:** GitHub OAuth via Supabase Auth
- **Deployment:** Vercel (planned)

## Project Structure
```
src/
├── app/
│   ├── auth/callback/route.ts   # OAuth callback handler
│   ├── login/page.tsx           # GitHub OAuth login page
│   ├── page.tsx                 # Auth-gated home page
│   ├── layout.tsx               # Root layout with AuthProvider
│   └── globals.css              # Theme + animations
├── components/
│   ├── AuthProvider.tsx          # Auth context + useAuth hook
│   ├── Dashboard.tsx             # Main layout (sidebar + kanban)
│   ├── kanban/                   # Board, Column, Card, AddCardForm
│   ├── projects/
│   │   └── ProjectDetailView.tsx # Slide-out detail panel
│   ├── todos/                    # TodoList, TodoItem
│   └── notes/                    # NoteEditor
├── hooks/
│   ├── useProjects.ts            # Supabase projects (replaces useKanban)
│   ├── useSupabaseTodos.ts       # Supabase todos
│   └── useSupabaseNotes.ts       # Supabase notes (500ms debounce)
├── lib/
│   ├── types.ts                  # Project, ProjectStage, TodoItem, NoteData
│   ├── database.types.ts         # Supabase generated types
│   ├── parseProjectLog.ts        # Markdown log parser for import
│   └── supabase/
│       ├── client.ts             # Browser client (singleton)
│       ├── server.ts             # Server client for API routes
│       └── middleware.ts         # Session refresh helper
├── utils/
│   └── id.ts                     # UUID generator
scripts/
│   └── import-logs.ts            # Import from claude-project-logs repo
supabase/
│   └── schema.sql                # Full DB schema with RLS
middleware.ts                      # Next.js middleware (auth session refresh)
```

## Commands
- `npm run dev` — dev server
- `npm run build` — production build
- `npm run lint` — ESLint
- `npx tsx scripts/import-logs.ts` — import project logs (needs IMPORT_USER_ID env var)

## Design System
- Fonts: Syne (display), DM Sans (body), DM Mono (mono)
- Colors: Gold accent (#f5a623), dark surfaces (#07080a → #252937)
- Column colors: Idea (purple #a882ff), Planned (indigo #7c83f7), In Progress (amber #f5a623), Complete (green #3ecf8e)
- All hooks use optimistic updates with Supabase persistence and rollback on error

## Key Patterns
- Auth gating: page.tsx redirects to /login if no user
- Supabase client is a singleton (created once in browser)
- AuthProvider initializes in useEffect to avoid SSR issues with Supabase URL validation
- All data hooks take user from useAuth() context
- ProjectDetailView uses debounced updates (500ms) for text fields
- KanbanBoard supports 4 columns with drag-and-drop across all stages
