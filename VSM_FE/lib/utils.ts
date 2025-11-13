import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge" 
// Đây là "người hòa giải" của Tailwind.
//lỡ viết trùng class hoặc mâu thuẫn class, nó sẽ lấy cái ưu tiên cuối cùng và xóa cái thừa:
// twMerge("p-4 p-2") → "p-2"  // p-2 thắng
// twMerge("bg-red-500 bg-blue-500") → "bg-blue-500"  

// kết hợp 2 thằng trên lại thành 1 hàm
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
