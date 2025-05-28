export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="admin-layout-wrapper min-h-screen flex flex-col">
      {children}
    </div>
  )
}