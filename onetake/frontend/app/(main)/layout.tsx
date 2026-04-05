import { GlassLayout } from '@/components/GlassLayout';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <GlassLayout>{children}</GlassLayout>;
}
