import { useLocation } from "react-router-dom";

import StudentTable from "./table/student-table";
import { Header } from "../components/header";

function useQueryParams() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

export const Students = () => {
  const params = useQueryParams();

  return (
    <>
      <div className="flex flex-col gap-10">
        <div className="flex flex-col justify-between gap-5 md:flex-row">
          <Header heading="Students" />
        </div>

        <StudentTable searchParams={params} />
      </div>
    </>
  );
};
