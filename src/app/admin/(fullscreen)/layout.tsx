export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): Promise<JSX.Element> {
  return <div className="h-full w-full flex-1">{children}</div>;
}
