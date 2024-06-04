import { getPageCount } from "@/app/actions/getPageCount";
import PageSwitch from "./pageswtich";

export default async function BlogLayout({ children }: { children: React.ReactNode }) {
  const pageCount = await getPageCount();
  return (
    <>
      <div className="mx-auto max-w-4xl">
        {children}
        <div className="mt-4">
          <PageSwitch pageCount={pageCount} />
        </div>
      </div>
    </>
  )
}