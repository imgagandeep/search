/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLocation, useNavigate } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import { Search } from "lucide-react";
import { StudentDropDownList } from "./student-dropdown-list";

export default function StudentTableHeader(searchParams: URLSearchParams) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = useDebouncedCallback((value: any) => {
    const params = new URLSearchParams(searchParams);
    params.set("value", value);
    params.set("search", "");
    if ((value && value.length >= 3) || !value) {
      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    }
  }, 500);

  return (
    <>
      <div className="flex w-full">
        <div className="flex w-full flex-col justify-between gap-2.5 lg:flex-row">
          <div className="flex w-full flex-col items-center justify-start gap-2.5 md:flex-row">
            <div className="flex h-10 w-full items-center rounded-md border border-input bg-white pl-3 text-sm ring-offset-background focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-2 dark:bg-muted lg:w-80">
              <Search className="size-4 text-muted-foreground dark:bg-muted" />
              <input
                type="text"
                placeholder="Search"
                className="mr-1 w-full p-2 placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-muted"
                onChange={(event) => handleSearch(event.target.value)}
              />
            </div>
          </div>
          <StudentDropDownList />
        </div>
      </div>
    </>
  );
}
