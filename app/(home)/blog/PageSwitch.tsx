"use client"

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink
} from "@/components/ui/pagination"

const PageSwitch = ({ pageCount }: { pageCount: number }) => {
  const [numbers, setNumbers] = useState<number[]>([]);
  const pathname = usePathname();
  const [currentPage, setCurrentPage] = useState<number>(1);
  useEffect(() => {
    const nums = []
    for (let i = 1; i <= pageCount; i++) {
      nums.push(i);
    }
    setNumbers(nums);
  }, [pageCount])
  useEffect(() => {
    const paths = pathname.split('/')
    const pageNumber = paths[paths.length - 1];
    setCurrentPage(parseInt(pageNumber))
  }, [pathname])
  return (
    <div>
      <Pagination>
        <PaginationContent>
          {
            numbers.map((number) => {
              return (
                <>
                  <PaginationItem>
                    <PaginationLink href={`/blog/${number}`} isActive={number === currentPage}>
                      {number}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )
            })
          }
        </PaginationContent>
      </Pagination>
    </div>
  )
}

export default PageSwitch