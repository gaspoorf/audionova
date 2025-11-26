import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.scss";

const lausanne = localFont({
  src: [
    {
      path: "../fonts/TWKLausanne-300.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/TWKLausanne-350.woff2",
      weight: "350", // Using 350 as provided, often treated as Book/Regular
      style: "normal",
    },
    {
      path: "../fonts/TWKLausanne-500.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-lausanne",
});

export const metadata: Metadata = {
  title: "Audionova Hearing Test",
  description: "Test your hearing with Audionova",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={lausanne.variable}>
        {children}
      </body>
    </html>
  );
}
