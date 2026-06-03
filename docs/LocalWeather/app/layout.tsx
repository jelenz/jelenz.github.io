import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Local Weather",
  description: "A simple weather app"
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={"h-full antialiased"}>
      <body>{children}</body>
    </html>
  );
}
