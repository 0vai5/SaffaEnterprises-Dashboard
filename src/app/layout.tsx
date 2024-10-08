import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/ThemeProvider";

const nunito = Nunito({ subsets: ["latin"], weight: ["400"] });

export const metadata: Metadata = {
  title: "SaffaEnterPrises Invoice Manager",
  description:
    "A ideal invoice and task management software for small buisnesses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="shortcut icon"
          href="/saffaenterprises.png"
          type="image/x-icon"
        />
      </head>
      <Analytics />
      <SpeedInsights />
      <body className={`${nunito.className} dark:bg-[#09090B]`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
