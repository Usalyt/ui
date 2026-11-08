import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "tu-ui";

const TOTAL = 7;

type PageItem = number | "ellipsis";

function getPageItems(current: number, total: number): PageItem[] {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages]
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b);

  const items: PageItem[] = [];
  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) {
      items.push("ellipsis");
    }
    items.push(page);
  });
  return items;
}

export function PaginationDemo() {
  const [page, setPage] = React.useState(1);
  const pageItems = getPageItems(page, TOTAL);

  return (
    <div className="w-full max-w-lg space-y-2">
      <Pagination>
        <PaginationContent className="flex-wrap justify-center gap-1">
          <PaginationItem>
            <PaginationPrevious
              href="#previous"
              aria-disabled={page === 1}
              className="[&>span]:hidden sm:[&>span]:inline"
              onClick={(e) => {
                e.preventDefault();
                setPage((p) => Math.max(1, p - 1));
              }}
            />
          </PaginationItem>

          {pageItems.map((item, index) =>
            item === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={item}>
                <PaginationLink
                  href={`#page-${item}`}
                  isActive={page === item}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(item);
                  }}
                >
                  {item}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <PaginationNext
              href="#next"
              aria-disabled={page === TOTAL}
              className="[&>span]:hidden sm:[&>span]:inline"
              onClick={(e) => {
                e.preventDefault();
                setPage((p) => Math.min(TOTAL, p + 1));
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <p className="text-center text-xs text-muted-foreground">
        Page {page} of {TOTAL}
      </p>
    </div>
  );
}
