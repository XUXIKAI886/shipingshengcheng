import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * 合并 Tailwind CSS 类名的工具函数
 * 用于处理条件类名和避免样式冲突
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
