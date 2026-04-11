import AdminLayoutView from '@/view/admin/adminLayoutView';

export default function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutView>{children}</AdminLayoutView>;
}
