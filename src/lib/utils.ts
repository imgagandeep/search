import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generatePages = (page: number, totalPages: number) => {
  const pages: (number | string)[] = [];

  for (let i = 1; i <= Math.min(2, totalPages); i++) {
    pages.push(i);
  }

  if (page > 4) {
    pages.push("...");
  }

  for (
    let i = Math.max(3, page - 1);
    i <= Math.min(totalPages - 2, page + 1);
    i++
  ) {
    if (!pages.includes(i)) pages.push(i);
  }

  if (page < totalPages - 3) {
    pages.push("...");
  }

  for (let i = totalPages - 1; i <= totalPages; i++) {
    if (i > 2 && !pages.includes(i)) pages.push(i);
  }

  return pages;
};
