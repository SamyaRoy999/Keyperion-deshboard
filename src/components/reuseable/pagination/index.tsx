"use client";
import ResponsivePagination from "react-responsive-pagination";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pagination({
  current_page = 1,
  onPageChange,
  total = 10,
  per_page,
  className,
  activeStyle,
  itemStyle,
  childStyle,
}: any) {
  const totalCount = Math.ceil(total / per_page);
  // if (total <= per_page) return null;

  return (
    <div className={cn(`flex flex-wrap justify-end`, className)}>
      <div className="lg:w-[320px]">
        <div className={cn("flex  justify-end", childStyle)}>
          <ResponsivePagination
            previousLabel={<ChevronsLeft className="size-5" />}
            nextLabel={<ChevronsRight className="size-5" />}
            className="flex flex-row gap-1 w-fit"
            pageItemClassName={cn(
              "h-10 border rounded-full w-10 flex items-center justify-center whitespace-nowrap text-sm font-medium  hover:text-white",
              itemStyle,
            )}
            pageLinkClassName="h-10 w-10 flex items-center justify-center rounded-full"
            activeItemClassName={cn(
              `!bg-black border-none !text-white hover:!text-white rounded-full`,
              activeStyle,
            )}
            disabledItemClassName="hover:!bg-transparent"
            current={current_page}
            total={totalCount}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </div>
  );
}
