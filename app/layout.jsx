import "./globals.css";

export const metadata = {
  title: "Zhuofan Li — AI Field Notes",
  description:
    "李卓凡的 AI 实验现场：从 PyTorch 模型与计算机视觉，到有证据、可运行的 AI 产品。",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#07110f",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
