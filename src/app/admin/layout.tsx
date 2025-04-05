import { cookies } from 'next/headers';

import Header from '@/components/sidebar/sidebar-header';
import { SidebarLayout } from '@/components/sidebar/sidebar-layout';
import { auth } from '@/server/auth';

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): Promise<JSX.Element> {
  const session = await auth();
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar:state')?.value !== 'false';
  return (
    <SidebarLayout defaultOpen={defaultOpen} user={session?.user ?? null}>
      <Header />
      <div className="flex flex-col h-screen w-full flex-1 mt-16">{children}</div>
    </SidebarLayout>
  );
}
