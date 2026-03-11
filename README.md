# Denbase — Peer Learning Platform

Exchange skills with peers or connect with professional tutors. AI-powered matching for the perfect learning partner.

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + shadcn/ui
- **Backend:** Lovable Cloud (Supabase)
- **State:** TanStack React Query

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)

## Getting Started

### 1. Clone the repository

```bash
git clone <YOUR_GIT_URL>
cd denbase
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL="your-supabase-url"
VITE_SUPABASE_PUBLISHABLE_KEY="your-supabase-anon-key"
VITE_SUPABASE_PROJECT_ID="your-project-id"
```

> **Where to find these values:**
> - Go to your Lovable project → Settings → Cloud to find your backend credentials.
> - The publishable key is safe to use in frontend code (it's not a secret).

### 4. Start the development server

```bash
npm run dev
```

The app will be available at **http://localhost:8080**

### 5. Build for production

```bash
npm run build
npm run preview
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |

## Project Structure

```
src/
├── assets/          # Static assets (images, icons)
├── components/      # Reusable UI components
│   ├── admin/       # Admin panel components
│   ├── landing/     # Landing page sections
│   └── ui/          # shadcn/ui components
├── contexts/        # React context providers
├── hooks/           # Custom React hooks
├── integrations/    # Backend client & types
├── lib/             # Utility functions
├── pages/           # Route page components
│   ├── admin/       # Admin pages
│   └── legal/       # Legal pages
└── test/            # Test setup & utilities
```

## Deployment

### Via Lovable
Click **Publish** in the Lovable editor to deploy instantly.

### Self-hosted
1. Run `npm run build` to generate the `dist/` folder
2. Deploy the `dist/` folder to any static hosting (Vercel, Netlify, Cloudflare Pages, etc.)
3. Set the environment variables on your hosting platform

## License

Private — All rights reserved.
