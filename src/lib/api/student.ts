import type { APIFiltersProps } from "./utils";

export async function fetchStudentsData(filters: APIFiltersProps) {
  try {
    const response = await fetch("/data/student_data.json");

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    // Apply filtering
    const searchValue = filters?.filters?.value?.toLowerCase();
    const searchValueByName = filters?.filters?.search?.toLowerCase();

    let filteredData = data;

    if (searchValue) {
      filteredData = data.filter(
        (student: { name: string; rollNumber: string | number }) =>
          student.name.toLowerCase().includes(searchValue) ||
          student.rollNumber.toString().includes(searchValue)
      );
    }

    if (searchValueByName) {
      filteredData = data.filter((student: { name: string }) =>
        student.name.toLowerCase().includes(searchValueByName)
      );
    }

    // Apply pagination
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    // Calculate total pages
    const totalPages = Math.ceil(filteredData.length / limit);

    return {
      data: paginatedData,
      totalPages,
    };
  } catch (error) {
    console.error("Failed to fetch students data:", error);
    throw error;
  }
}
