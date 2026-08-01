import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { RoleProvider } from "./context/RoleContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Class Attendance",
  description: "Effortless School Attendance. Built for Modern Education.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased bg-white text-surface-900 selection:bg-brand-100 selection:text-brand-700`}
      >
        <RoleProvider>
          {children}
        </RoleProvider>
      </body>
    </html>
  );
}
