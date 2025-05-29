import { useEffect, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnFiltersState,
  type VisibilityState,
} from "@tanstack/react-table";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { useStudentTableColumns } from "./student-table-columns";
import StudentTableHeader from "./student-table-header";
import { fetchStudentsData } from "../../lib/api/student";
import { cn, generatePages } from "../../lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";

interface StudentTableProps {
  searchParams: URLSearchParams;
}

export default function StudentTable({ searchParams }: StudentTableProps) {
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [studentList, setStudentList] = useState([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const columns = useStudentTableColumns();

  const table = useReactTable({
    data: studentList ?? [],
    columns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  useEffect(() => {
    const value = new URLSearchParams(searchParams).get("value");
    if (value) {
      setPage(1);
    }
  }, [searchParams]);

  useEffect(() => {
    async function fetch() {
      const params = new URLSearchParams(searchParams);
      const filters: Record<string, string> = {
        value: params.get("value") || "",
      };

      const value = params.get("value");
      if (value) {
        filters.value = value;
        filters.search = "";
      }

      const search = params.get("search");
      if (search) {
        filters.search = search;
        filters.value = "";
      }

      const response = await fetchStudentsData({
        page: page,
        limit: 10,
        filters,
      });

      setStudentList(response?.data);
      setTotalPages(response?.totalPages);
    }

    fetch();
  }, [page, searchParams]);

  const pages = generatePages(page, totalPages);
  const formatPageNumber = (num: number) => (num < 10 ? `0${num}` : `${num}`);

  return (
    <>
      <div className="flex w-full flex-col items-center gap-3">
        <StudentTableHeader {...searchParams} />

        <div className="w-full overflow-x-scroll rounded-md border max-md:max-w-md max-sm:max-w-sm">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="h-12">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="text-nowrap bg-layout-tableheader px-5 py-0 dark:bg-muted"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="h-10 "
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-5 py-0">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex w-full flex-col items-start justify-between gap-2.5 md:flex-row md:items-center">
          <div className="flex-1 text-sm w-full text-left text-muted-foreground">
            Show {table.getFilteredRowModel().rows.length} Students per page
          </div>
          {totalPages > 0 && (
            <div className="flex flex-wrap gap-2.5">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
                className="flex h-10 items-center gap-1 px-3 "
              >
                <ChevronLeftIcon className="size-4" />
                <span className="text-base font-medium">Previous</span>
              </Button>

              {pages.map((p, i) =>
                typeof p === "number" ? (
                  <Button
                    key={i}
                    size="sm"
                    variant={p === page ? "default" : "outline"}
                    onClick={() => setPage(p)}
                    className={cn(
                      "text-base font-medium flex h-10 items-center gap-1 px-3",
                      p === page && "primary-button"
                    )}
                  >
                    {formatPageNumber(p)}
                  </Button>
                ) : (
                  <span key={i} className="px-2 text-muted-foreground">
                    ...
                  </span>
                )
              )}

              <Button
                size="sm"
                variant="outline"
                onClick={() => setPage(page + 1)}
                disabled={totalPages === page}
                className="flex h-10 items-center gap-1 px-3"
              >
                <span className="primary-text">Next</span>
                <ChevronRightIcon className="size-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
