// This layout is intentionally a passthrough.
// Route protection lives in app/admin/(cms)/layout.tsx, which only wraps
// CMS pages — keeping app/admin/login/page.tsx outside the auth guard
// and preventing the infinite-redirect loop.
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
