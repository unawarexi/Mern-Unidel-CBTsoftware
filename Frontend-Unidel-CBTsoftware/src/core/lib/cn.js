import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines clsx and tailwind-merge for optimal class merging
 * Use this everywhere instead of raw clsx to avoid Tailwind class conflicts
 *
 * @example
 * cn("px-4 py-2", isActive && "bg-blue-500", className)
 * cn("text-red-500", "text-blue-500") // → "text-blue-500" (no conflicts)
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default cn;
