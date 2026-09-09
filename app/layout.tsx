import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Routlaws | Built Different",
  description: "A responsible road-culture community for vehicle builds, lawful meets, merchandise, and real backup when the road wins.",
  icons: {
    icon: "/routlaws-logo.png",
    shortcut: "/routlaws-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
