import { getPageCount } from "@/lib/actions/getPageCount";
import PageSwitch from "./PageSwitch";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hardik Jain's Blog | Explore Insights and Projects",
  description: "Dive into the world of Android and Web development with Hardik Jain's blog. Discover in-depth articles, project showcases, and insights into the latest technologies.",
};

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