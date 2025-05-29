/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Check, ChevronsUpDown } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Button } from "../../components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../components/ui/command";
import { cn } from "../../lib/utils";
import { fetchStudentsData } from "../../lib/api/student";

type Student = {
  name: string;
  rollNumber: number;
  class: number;
};

function debounce<Func extends (...args: any[]) => void>(
  func: Func,
  waitFor: number
) {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<Func>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), waitFor);
  };
}

export function StudentDropDownList() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [studentList, setStudentList] = useState<Student[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();

  // Fetch full list initially and also when dropdown opens
  const fetchFullList = useCallback(async () => {
    const response = await fetchStudentsData({
      page: 1,
      limit: 1000,
      filters: {},
    });
    setStudentList(response?.data || []);
  }, []);

  // Fetch filtered students based on search value >= 3 chars
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchFiltered = useCallback(
    debounce(async (query: string) => {
      if (query.length < 2) {
        fetchFullList();
        return;
      }

      const response = await fetchStudentsData({
        page: 1,
        limit: 100,
        filters: { value: query },
      });
      setStudentList(response?.data || []);
    }, 300),
    [fetchFullList]
  );

  // Handle user selecting a student
  const handleSelect = (selectedValue: string) => {
    const newValue = selectedValue === value ? "" : selectedValue;
    if (newValue) {
      searchParams.set("search", newValue);
      searchParams.set("value", "");
    } else {
      searchParams.delete("search");
    }
    setSearchParams(searchParams);
    setValue(newValue);
    setOpen(false);
  };

  // When dropdown opens, fetch full list if not already loaded
  useEffect(() => {
    if (open) {
      fetchFullList();
    }
  }, [open, fetchFullList]);

  // When searchValue changes, fetch filtered or full list accordingly
  useEffect(() => {
    if (open) {
      fetchFiltered(searchValue);
    }
  }, [searchValue, open, fetchFiltered]);

  // Sync selected value with URL param on mount and param changes
  useEffect(() => {
    const paramValue = searchParams.get("search") || "";
    setValue(paramValue);
    setSearchValue(paramValue);
  }, [searchParams]);

  return (
    <>
      <div className="flex flex-col gap-3">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="h-10 lg:w-80 justify-between"
            >
              {value || "Select student..."}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="lg:w-80 p-0">
            <Command>
              <CommandInput
                placeholder="Search student..."
                value={searchValue}
                onValueChange={setSearchValue}
              />
              <CommandList>
                <CommandEmpty>
                  {searchValue.length > 0 && searchValue.length < 3
                    ? "Type at least 3 characters to search"
                    : "No student found."}
                </CommandEmpty>
                <CommandGroup>
                  {studentList.map((student) => (
                    <CommandItem
                      key={student.rollNumber}
                      value={student.name}
                      onSelect={handleSelect}
                    >
                      {student.name}
                      <Check
                        className={cn(
                          "ml-auto",
                          value === student.name ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
