"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes"; // ThemeProvider là một component của next-themes, dùng để quản lý việc thay đổi theme
import type { ThemeProviderProps } from "next-themes"; // ThemeProviderProps là một type của next-themes, dùng để quản lý việc thay đổi theme

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // children: nội dung nằm giữa cặp thẻ <ThemeProvider> ... </ThemeProvider>
  // props: các thuộc tính của component ThemeProvider
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
  // spread props: {...props} là một cách viết tắt để truyền tất cả các thuộc tính của props vào component NextThemesProvider
}
