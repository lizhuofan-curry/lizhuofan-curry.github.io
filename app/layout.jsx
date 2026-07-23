import "./globals.css";

export const metadata = {
  title: "r=a(1-sinθ) | AI Developer in Progress",
  description:
    "有目标的人才会迷路，我只是来地球散步的。记录机器学习、深度学习与 LLM 全栈开发的学习旅程。",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#eef9ff",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
