# The Daily Gay — Culture, Style & Stories

A full-stack Next.js 15 publication platform celebrating queer joy, pride, and the fabulous everyday.

**Website:** [BerlinStclair.com](https://berlinstclair.com)

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 App Router |
| Database | PostgreSQL via Vercel Postgres |
| ORM | Prisma |
| Auth | Auth.js v5 (NextAuth) |
| Styling | Tailwind CSS v3 |
| Rich Text | Tiptap (ProseMirror) |
| Animations | GSAP + ScrollTrigger, Framer Motion |
| Page Flip | react-pageflip |
| Media | Vercel Blob |
| Typography | Playfair Display, Merriweather, Montserrat, UnifrakturMaguntia |

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env.local
```

Fill in `.env.local`:
- `DATABASE_URL` — PostgreSQL connection string
- `DIRECT_URL` — Direct (non-pooled) PostgreSQL URL
- `AUTH_SECRET` — Generate with `npx auth secret`
- `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` — [GitHub OAuth App](https://github.com/settings/applications/new)
- `BLOB_READ_WRITE_TOKEN` — [Vercel Blob](https://vercel.com/docs/vercel-blob)

### 3. Set up database
```bash
npm run db:push      # Push schema to database
npm run db:seed      # Seed with sample articles
```

### 4. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout (fonts, header, nav, footer)
│   ├── page.tsx                # Homepage (5-col grid + horizontal scroll)
│   ├── article/[slug]/         # Article detail page
│   ├── section/[category]/     # Category section pages
│   ├── admin/                  # Protected CMS dashboard
│   │   ├── page.tsx            # Dashboard overview
│   │   ├── login/              # GitHub OAuth sign-in
│   │   └── articles/           # Article CRUD
│   └── api/
│       ├── auth/[...nextauth]/ # Auth.js handlers
│       └── upload/             # Image upload endpoint
├── components/
│   ├── layout/                 # Header, Navigation, Footer
│   ├── home/                   # HeroGrid, ArticleCard, HorizontalScroll
│   ├── article/                # ArticleMeta, ArticleBody, PageFlipReader
│   ├── cms/                    # TiptapEditor, ArticleForm, ImageUpload
│   └── ui/                     # SchemaMarkup, ColumnDivider
├── lib/
│   ├── auth.ts                 # Auth.js config
│   ├── db.ts                   # Prisma client singleton
│   ├── types.ts                # Shared TypeScript types
│   ├── utils.ts                # formatDate, readingTime, cn, generateSlug
│   ├── tiptap-renderer.tsx     # Tiptap AST → React elements
│   └── actions/                # Server actions (articles, upload)
└── prisma/
    ├── schema.prisma           # Database schema
    └── seed.ts                 # Sample data seeder
```

## Features

### Frontend
- **5-column NYT grid** — Hero article spans 3 columns, secondary articles fill remaining 2
- **CSS Multi-column body** — Article text flows across 3 newspaper-style columns with vertical rules
- **GSAP Horizontal Scroll** — "Trending Stories" section pins and translates horizontally via ScrollTrigger
- **3D Page Flip** — react-pageflip renders articles as an interactive skeuomorphic book
- **Dropcap** — First letter of article body styled as a large print-era initial cap
- **Schema.org JSON-LD** — Structured data for NewsArticle SEO
- **Open Graph + Twitter Cards** — Social sharing metadata on all pages
- **404 page** — On-brand "article archived" not-found page

### CMS
- **Tiptap WYSIWYG editor** — Rich text with Bold, Italic, Headings, Lists, Blockquote, Code, Links, Images
- **Image upload** — Drag-and-drop or URL entry; uploads to Vercel Blob
- **Publish / Unpublish toggle** — Instant cache revalidation via `revalidatePath`
- **Role-based access** — ADMIN and EDITOR roles enforced at middleware and server action level

### Typography (NYT-Inspired)
| Role | Font | NYT Equivalent |
|---|---|---|
| Masthead | UnifrakturMaguntia | Engravers' Old English |
| Headlines | Playfair Display | Cheltenham |
| Body text | Merriweather | Imperial |
| Captions / UI | Montserrat | Franklin Gothic |

## Granting CMS Access

After a user signs in via GitHub, update their role in the database:

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your@email.com';
```

Or via Prisma Studio:
```bash
npm run db:studio
```

## Deployment

Deploy to Vercel with one click. Ensure all environment variables are set in the Vercel dashboard.

The app uses:
- **ISR** — Published articles are statically generated; edits trigger `revalidatePath`
- **Vercel Blob** — Edge-distributed image storage
- **Vercel Postgres** — Managed PostgreSQL with connection pooling
