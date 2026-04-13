import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const PlaceholderImg = (
  width: number = 600,
  height: number = 400,
): string => {
  return `https://placehold.co/${width}x${height}.png`;
};

export function buildResponse(item: any) {
  const { current_page, total, per_page, data } = item?.data || {};
  return {
    data: data,
    meta: {
      current_page,
      per_page,
      total,
    },
  };
}
