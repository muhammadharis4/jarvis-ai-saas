import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/** Merge class tokens and let tailwind-merge win on conflicting utilities (standard shadcn helper). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
