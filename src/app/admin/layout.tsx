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
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  return (
    <SidebarLayout
      defaultOpen={defaultOpen}
      user={{
        name: session?.user.name ?? '',
        email: session?.user.email ?? '',
        avatar:
          session?.user.image ??
          // eslint-disable-next-line max-len
          `https://api.dicebear.com/9.x/thumbs/svg?seed=${Math.floor(Math.random() * 100000) + 1}&randomizeIds=true`,
      }}
    >
      <Header />
      <div className="flex flex-1 flex-col gap-4 p-4 w-full">{children}</div>
    </SidebarLayout>
  );
}
