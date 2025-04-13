'use client';

import { Button } from '@repo/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useQueryStates } from 'nuqs';

import { tagsParser } from './tagsparser';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;
  const [params, setParams] = useQueryStates(tagsParser);

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 2) {
        end = Math.min(totalPages - 1, maxPagesToShow - 1);
      }

      if (currentPage >= totalPages - 1) {
        start = Math.max(2, totalPages - maxPagesToShow + 2);
      }

      if (start > 2) {
        pages.push('...');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center mt-12">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          disabled={prevPage === null}
          asChild={prevPage !== null}
          onClick={() => {
            void setParams({ ...params, page: prevPage }, { shallow: false });
          }}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {getPageNumbers().map((page, index) =>
          typeof page === 'number' ? (
            <Button
              key={index}
              variant={currentPage === page ? 'default' : 'outline'}
              size="icon"
              asChild={currentPage !== page}
              onClick={() => {
                void setParams({ ...params, page: page }, { shallow: false });
              }}
            >
              {page}
            </Button>
          ) : (
            <span key={index} className="px-2">
              {page}
            </span>
          ),
        )}

        <Button
          variant="outline"
          size="icon"
          disabled={nextPage === null}
          asChild={nextPage !== null}
          onClick={() => {
            void setParams({ ...params, page: nextPage }, { shallow: false });
          }}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
