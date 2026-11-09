import type { Metadata } from "next";
import "./globals.css";

// 한글이 잘 보이도록 기기 기본 글꼴을 쓴다 (외부 글꼴 다운로드 없음)
export const metadata: Metadata = {
  title: "식물 기록",
  description: "개인 식물 급수·무게·관찰 기록",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
