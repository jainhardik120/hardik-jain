import { getPageCount } from "@/lib/actions/getPageCount";
import PageSwitch from "./PageSwitch";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hardik Jain's Blog | Android & Web Dev Insights",
  description: "Explore in-depth articles, project showcases, and tech insights from Hardik Jain, an experienced Android & Web Developer.",
};

export default async function BlogLayout({ children }: { children: React.ReactNode }) {
  const pageCount = await getPageCount();
  return (
    <>
      {children}
      <PageSwitch pageCount={pageCount} />
    </>
  )
}