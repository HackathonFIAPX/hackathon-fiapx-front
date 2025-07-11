import { DashboardClient } from '@/components/dashboard/DashboardClient';
import { Header } from '@/components/dashboard/Header';

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <DashboardClient />
      </main>
    </div>
  );
}
