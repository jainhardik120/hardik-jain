export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div >
      <div className="fixed top-0 left-0 w-full h-16 bg-black">

      </div>
      <div className="mt-16">
        {children}
      </div>
    </div>
  );
}
