# VibePM

AI project portfolio headquarters. Organizes projects into two categories — **Websites/Webapps** and **Agents** — with a togglable Pipeline (kanban) view and PDF export.

## Tech Stack
- **Framework:** Next.js 15 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS v4 + "Alpine to Ocean" light theme
- **Drag & Drop:** @dnd-kit/core + @dnd-kit/sortable
- **PDF Export:** jspdf
- **Backend:** Supabase (Postgres + Auth + RLS)
- **Auth:** GitHub OAuth via Supabase Auth
- **Deployment:** Vercel (live at https://vibepm-six.vercel.app/)

## Project Structure
```
src/
├── app/
│   ├── api/webhook/github/route.ts # GitHub webhook (auto-import logs)
│   ├── auth/callback/route.ts   # OAuth callback handler
│   ├── login/page.tsx           # GitHub OAuth login page
│   ├── page.tsx                 # Auth-gated home page
│   ├── layout.tsx               # Root layout with AuthProvider
│   └── globals.css              # Theme + animations
├── components/
│   ├── AuthProvider.tsx          # Auth context + useAuth hook
│   ├── Dashboard.tsx             # Main layout (Portfolio/Pipeline toggle)
│   ├── kanban/                   # Board, Column, Card, AddCardForm
│   ├── portfolio/
│   │   ├── PortfolioGrid.tsx     # Category-grouped project grid (primary view)
│   │   ├── PortfolioCard.tsx     # Rich project card with status, tech, links
│   │   └── AddProjectModal.tsx   # New project modal with category/stage
│   ├── projects/
│   │   └── ProjectDetailView.tsx # Expanded detail panel (max-w-2xl)
│   ├── todos/                    # TodoList, TodoItem (per-project)
│   └── notes/                    # NoteEditor (per-project)
├── hooks/
│   ├── useProjects.ts            # Supabase projects with category support
│   ├── useSupabaseTodos.ts       # Supabase todos (optional projectId filter)
│   └── useSupabaseNotes.ts       # Supabase notes (optional projectId, 500ms debounce)
├── lib/
│   ├── types.ts                  # Project, ProjectStage, ProjectCategory, TodoItem, NoteData
│   ├── projectUtils.ts           # isDeployed, getStatusLabel, getStatusColor, getRelativeTime
│   ├── exportPdf.ts              # PDF generation (single project + full portfolio)
│   ├── parseProjectLog.ts        # Markdown log parser (stage, category, GitHub URL)
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
- Fonts: Outfit (display), DM Sans (body), DM Mono (mono)
- Theme: Alpine to Ocean warm light (sandy cream, evergreen, sunset orange)
- Category colors: Website (teal #2a9d8f), Agent (purple #7c5cbf)
- Stage colors: Idea (blue #6bb5d9), Planned (green #2e7d4f), In Progress (orange #e8763a), Complete (teal #1a8a8a)
- All hooks use optimistic updates with Supabase persistence and rollback on error

## Key Patterns
- Auth gating: page.tsx redirects to /login if no user
- Supabase client is a singleton (created once in browser)
- AuthProvider initializes in useEffect to avoid SSR issues
- Dashboard has Portfolio (default) and Pipeline view toggle
- Todos and notes are per-project (project_id FK), rendered inside detail panel
- ProjectDetailView uses debounced updates (500ms) for text fields
- PDF export uses dynamic import to lazy-load jspdf
- KanbanBoard supports 4 columns with drag-and-drop across all stages
