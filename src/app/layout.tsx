import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "The Battle of Pennsylvania",
  description: "A cinematic one-page rivalry archive for Flyers vs Penguins.",
  metadataBase: new URL("https://example.com")
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>{children}</body>
    </html>
  );
}
