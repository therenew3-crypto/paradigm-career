import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "취업자서전 — 세모를 동그라미로",
  description:
    "공통 자소서로 '세모'가 되지 말고, 자서전 하나로 회사마다 '동그라미'가 되는 것. 미친 브레인스토밍으로 진짜 강점을 찾아 회사마다 최적화하는 취업 도구.",
};

function GlobalNav() {
  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        height: 44,
        background: "#000000",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 22px",
      }}
    >
      <Link
        href="/"
        style={{
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: "-0.01em",
          color: "#f5f5f7",
          textDecoration: "none",
        }}
      >
        취업자서전
      </Link>
      <Link
        href="/brainstorm"
        style={{
          fontSize: 12,
          fontWeight: 400,
          letterSpacing: "-0.012em",
          color: "#ffffff",
          opacity: 0.9,
          textDecoration: "none",
        }}
      >
        미친 브레인스토밍 →
      </Link>
    </nav>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={inter.variable}>
      <body>
        <GlobalNav />
        {children}
      </body>
    </html>
  );
}
