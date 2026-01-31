import { Nav } from '@/components/layout/nav';

export default function ProducerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
