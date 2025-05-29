/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";

export const useStudentTableColumns = (): ColumnDef<any>[] => {
  return useMemo(() => {
    const columns: ColumnDef<any>[] = [
      {
        accessorKey: "name",
        header: "Student Name",
        cell: ({ row }) => (
          <span className="text-base font-semibold text-primary flex w-full text-left">
            {row.original.name}
          </span>
        ),
      },
      {
        accessorKey: "class",
        header: "Class",
        cell: ({ row }) => (
          <span className="text-base font-semibold text-primary flex w-full text-left">
            {row.original.class}
          </span>
        ),
      },
      {
        accessorKey: "rollNumber",
        header: "Roll Number",
        cell: ({ row }) => (
          <span className="text-base font-semibold text-primary flex w-full text-left">
            {row.original.rollNumber}
          </span>
        ),
      },
    ];

    return columns;
  }, []);
};
