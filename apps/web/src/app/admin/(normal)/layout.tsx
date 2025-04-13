export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="flex flex-1 flex-col gap-4 w-full p-4">{children}</div>;
}
