# The Daily Gay — Culture, Style & Stories

A full-stack Next.js 15 editorial publication platform celebrating LGBTQ+ culture, style, and stories with a modern, elegant design.

**Website:** [BerlinStclair.com](https://berlinstclair.com)

---

## Badges

[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

## Features

### Frontend
- **5-Column NYT-Style Grid** — Hero article spans 3 columns with secondary articles filling remaining space
- **CSS Multi-Column Layout** — Article text flows across 3 newspaper-style columns with elegant dividers
- **GSAP Horizontal Scroll** — Pinned "Trending Stories" section with smooth ScrollTrigger animations
- **3D Page Flip** — Interactive skeuomorphic book reader using react-pageflip
- **Dropcap Typography** — Print-era initial caps on article bodies
- **Schema.org JSON-LD** — Structured data for NewsArticle SEO
- **Open Graph & Twitter Cards** — Optimized social sharing metadata
- **Custom 404 Page** — On-brand "article archived" not-found page
- **Responsive Design** — Mobile-first Tailwind CSS for all screen sizes

### CMS & Admin
- **Tiptap WYSIWYG Editor** — Rich text editing with Bold, Italic, Headings, Lists, Blockquote, Code, Links, and Images
- **Drag-and-Drop Image Upload** — URL entry or file upload; stores to Vercel Blob
- **Publish/Unpublish Toggle** — Instant cache revalidation with `revalidatePath`
- **Role-Based Access Control** — ADMIN and EDITOR roles enforced at middleware and server action levels
- **Article CRUD** — Create, read, update, delete with publishing workflows
- **CMS Dashboard** — Overview of all articles with filtering and search

### Typography (NYT-Inspired)
| Element | Font | NYT Equivalent |
|---|---|---|
| Masthead | UnifrakturMaguntia | Engravers' Old English |
| Headlines | Playfair Display | Cheltenham |
| Body Text | Merriweather | Imperial |
| UI/Captions | Montserrat | Franklin Gothic |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 App Router |
| **Language** | TypeScript 5.7 |
| **Styling** | Tailwind CSS v3 |
| **Database** | PostgreSQL via Vercel Postgres |
| **ORM** | Prisma |
| **Authentication** | Auth.js v5 (NextAuth) |
| **Rich Text Editor** | Tiptap (ProseMirror) |
| **Animations** | GSAP + ScrollTrigger, Framer Motion |
| **Page Flip** | react-pageflip |
| **Image Storage** | Vercel Blob |
| **Deployment** | Vercel |

---

## Prerequisites

- **Node.js** 18.x or later
- **npm** 9.x or later (or yarn/pnpm)
- **PostgreSQL** 12.x or later (or use Vercel Postgres)
- GitHub OAuth application credentials
- Vercel Blob token

---

## Environment Variables

Create a `.env.local` file in the root directory. All variables below are required:

```env
# PostgreSQL Database
# Standard PostgreSQL connection string
DATABASE_URL="postgresql://user:password@localhost:5432/the_daily_gay?sslmode=require"

# Direct PostgreSQL URL (non-pooled, required for Prisma migrations)
DIRECT_URL="postgresql://user:password@localhost:5432/the_daily_gay?sslmode=require"

# Auth.js v5 Secret
# Generate with: npx auth secret
AUTH_SECRET="your-generated-secret-here"

# GitHub OAuth Application
# Create at: https://github.com/settings/developers/apps or https://github.com/settings/applications/new
AUTH_GITHUB_ID="your-github-oauth-app-id"
AUTH_GITHUB_SECRET="your-github-oauth-app-secret"

# Vercel Blob Storage Token
# Get from: https://vercel.com/docs/storage/vercel-blob
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"

# Application URL
# Change to your Vercel URL or custom domain in production
NEXTAUTH_URL="http://localhost:3000"
```

**Note:** For production on Vercel, set these in the Vercel project dashboard under Settings → Environment Variables.

---

## Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/the-daily-gay.git
cd the-daily-gay
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env.local
# Edit .env.local with your actual values
```

### 4. Set up the database
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# (Optional) Seed with sample articles
npm run db:seed
```

### 5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Access the CMS
Navigate to [http://localhost:3000/admin/login](http://localhost:3000/admin/login) and sign in with GitHub.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production (generates Prisma, then Next.js build) |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Sync Prisma schema to database (creates/alters tables) |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:studio` | Open Prisma Studio (GUI database explorer) |
| `npm run db:seed` | Seed database with sample articles |

---

## Project Structure

```
├── app/
│   ├── layout.tsx                    # Root layout (fonts, header, nav, footer)
│   ├── page.tsx                      # Homepage (5-column NYT grid)
│   ├── not-found.tsx                 # Custom 404 page
│   ├── globals.css                   # Global styles
│   ├── robots.ts                     # robots.txt generation
│   ├── sitemap.ts                    # sitemap.xml generation
│   ├── article/[slug]/
│   │   └── page.tsx                  # Article detail page with page flip
│   ├── section/[category]/
│   │   └── page.tsx                  # Category/section pages
│   ├── admin/
│   │   ├── layout.tsx                # Admin layout wrapper
│   │   ├── login/
│   │   │   └── page.tsx              # GitHub OAuth login page
│   │   └── (cms)/
│   │       ├── page.tsx              # Dashboard overview
│   │       ├── layout.tsx            # CMS layout
│   │       └── articles/
│   │           ├── page.tsx          # Articles list
│   │           ├── new/page.tsx      # Create new article
│   │           └── [id]/edit/page.tsx # Edit article
│   ├── api/
│   │   ├── auth/[...nextauth]/
│   │   │   └── route.ts              # Auth.js route handlers
│   │   └── upload/
│   │       └── route.ts              # Image upload to Vercel Blob
│   └── middleware.ts                  # Auth middleware for /admin routes
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx                # Site header/masthead
│   │   ├── Navigation.tsx            # Main navigation
│   │   └── Footer.tsx                # Site footer
│   ├── home/
│   │   ├── HeroGrid.tsx              # 5-column NYT-style grid
│   │   ├── ArticleCard.tsx           # Article preview card
│   │   └── HorizontalScroll.tsx      # Trending stories horizontal scroll
│   ├── article/
│   │   ├── ArticleMeta.tsx           # Title, author, date, category
│   │   ├── ArticleBody.tsx           # Multi-column article content
│   │   ├── PageFlipReader.tsx        # 3D page flip component
│   │   └── ArticleNav.tsx            # Next/previous article navigation
│   ├── cms/
│   │   ├── TiptapEditor.tsx          # Rich text editor component
│   │   ├── ArticleForm.tsx           # Article create/edit form
│   │   ├── ImageUpload.tsx           # Image upload component
│   │   └── ArticleList.tsx           # CMS article list
│   └── ui/
│       ├── SchemaMarkup.tsx          # JSON-LD structured data
│       ├── ColumnDivider.tsx         # Multi-column divider
│       └── Loading.tsx               # Loading skeleton
│
├── lib/
│   ├── auth.ts                       # Auth.js configuration
│   ├── db.ts                         # Prisma client singleton
│   ├── types.ts                      # Shared TypeScript types
│   ├── utils.ts                      # Utility functions (formatDate, readingTime, etc.)
│   ├── tiptap-renderer.tsx           # Tiptap AST to React elements converter
│   └── actions/
│       ├── articles.ts               # Server actions for articles
│       └── upload.ts                 # Server actions for image upload
│
├── prisma/
│   ├── schema.prisma                 # Database schema (User, Article, etc.)
│   └── seed.ts                       # Sample data seeder
│
├── public/
│   ├── images/                       # Static images
│   └── fonts/                        # Custom fonts (if any)
│
├── .env.local                        # Environment variables (git-ignored)
├── next.config.ts                    # Next.js configuration
├── tailwind.config.ts                # Tailwind CSS configuration
├── tsconfig.json                     # TypeScript configuration
├── package.json                      # Dependencies and scripts
└── README.md                         # This file
```

---

## Database Setup (Prisma)

### Viewing the Schema
```bash
# Interactive database explorer
npm run db:studio
```

### Making Schema Changes

1. Update `prisma/schema.prisma`
2. Push changes to database:
   ```bash
   npm run db:push
   ```
3. Prisma will auto-generate the client

### Example: Adding a New Field to Article
```prisma
// In prisma/schema.prisma
model Article {
  id          String    @id @default(cuid())
  title       String
  slug        String    @unique
  excerpt     String
  content     Json      // Tiptap editor format
  category    String
  coverImage  String?
  author      User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
  authorId    String
  published   Boolean   @default(false)
  publishedAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

### Seeding Sample Data
```bash
npm run db:seed
```

---

## Admin Access & CMS

### Granting CMS Access

After a user signs in via GitHub, promote them to admin:

**Option 1: Using SQL**
```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your@email.com';
```

**Option 2: Using Prisma Studio**
```bash
npm run db:studio
# Navigate to User table and update the role column
```

### Available Roles
- `ADMIN` — Full CMS access (create, edit, publish articles)
- `EDITOR` — Can create and edit, but cannot publish
- `USER` — Reader-only (default for new sign-ups)

### CMS Features
- Create articles with rich text (Tiptap editor)
- Upload cover images directly to Vercel Blob
- Preview articles before publishing
- Publish/unpublish articles (triggers cache revalidation)
- Edit published articles (ISR updates on-demand)
- Delete articles (soft or hard delete via middleware)

---

## Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select your GitHub repo
   - Click "Import"

3. **Set Environment Variables**
   - In Vercel Dashboard → Settings → Environment Variables
   - Add all variables from `.env.local`
   - Ensure `DATABASE_URL`, `DIRECT_URL`, and `AUTH_SECRET` are set

4. **Deploy**
   - Vercel will auto-build and deploy on every push to `main`

### Post-Deployment
- Update `NEXTAUTH_URL` and `NEXTAUTH_CALLBACK_URL` to your Vercel domain
- Update GitHub OAuth redirect URI to `https://yourdomain.vercel.app/api/auth/callback/github`
- Test admin login at `https://yourdomain.vercel.app/admin/login`

### Database on Vercel
- Use [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- Connection string provided automatically after creation
- ISR (Incremental Static Regeneration) enabled by default

### Image Storage on Vercel Blob
- Token auto-provided if you connect Blob storage to your Vercel project
- Images are edge-cached and automatically optimized
- No size limits per upload

---

## Performance & Optimization

### Incremental Static Regeneration (ISR)
- Published articles are statically generated at build time
- Edits trigger on-demand revalidation via `revalidatePath()`
- Cache is invalidated instantly; no waiting for next rebuild

### Image Optimization
- All images served via Vercel Blob with CDN caching
- Automatic format conversion and compression
- `<Image />` component for Next.js optimization

### Font Loading
- Custom fonts (Playfair, Merriweather, Montserrat, etc.) are self-hosted
- Zero CLS (Cumulative Layout Shift) with `font-display: swap`

### GSAP Animations
- ScrollTrigger optimized for 60fps
- Hardware-accelerated transforms
- Minimal repaints on scroll

---

## Development Tips

### Hot Reload
The dev server supports both Next.js and Tailwind hot reload. Changes to `app/`, `components/`, `lib/`, and CSS appear instantly.

### Prisma Studio
```bash
npm run db:studio
```
Opens a GUI to browse and edit database records in real-time. Useful for debugging.

### TypeScript Checking
```bash
npx tsc --noEmit
```
Full type checking without building.

### Debugging Articles
Articles are stored as JSON (Tiptap format) in the database. Use Prisma Studio to inspect the `content` field, or add debugging logs in `lib/tiptap-renderer.tsx`.

---

## License

MIT License — See [LICENSE](./LICENSE) for details.

---

## Author

Designed and developed by **St. Clair Design Co.**

---

## Support

For issues, feature requests, or questions:
- Check the [Vercel Docs](https://vercel.com/docs)
- Review [Next.js 15 Documentation](https://nextjs.org/docs)
- See [Prisma Docs](https://www.prisma.io/docs)
- Visit [Auth.js Documentation](https://authjs.dev/)
