import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Secure Azure File Dashboard",
  description: "A free-tier Azure-style JSON file dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
