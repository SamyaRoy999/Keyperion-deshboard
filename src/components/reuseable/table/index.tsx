import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { cn } from "@/lib";
import React from "react";

interface TableProps {
  className?: string;
  headers?: string[];
  children: React.ReactNode;
  pagination?: React.ReactNode;
  paginateStyle?: string
}

export const CustomTable = ({
  className,
  headers = [],
  children,
  pagination,
  paginateStyle,
}: TableProps) => {
  return (
    <div
      className={cn(
        "bg-transparent",
        className
      )}
    >
      <Table className="border-separate  border-spacing-y-3 my-0">
        {headers && headers.length > 0 && (
          <TableHeader>
            <TableRow className="text-base  text-center font-medium border-2">
              {headers?.map((header, index) => (
                <TableHead key={index} className="text-center text-[#00003A] *:font-semibold *:!text-base">
                  <h1
                    className={
                      index === headers.length - 1
                        ? "w-max capitalize  inline-block"
                        : "w-max capitalize"
                    }
                  >
                    {header}
                  </h1>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
        )}
        <TableBody>{children}</TableBody>
      </Table>
      {pagination && <div className={paginateStyle}>{pagination}</div>}
    </div>
  );
};
