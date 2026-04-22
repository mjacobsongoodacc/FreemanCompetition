import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import "./globals.css";
import { shepherdTheme } from "@/lib/mantine-theme";

// To swap Chalet back in:
// import localFont from 'next/font/local';
// const display = localFont({ src: '../public/fonts/chalet/Chalet.woff2',
//   variable: '--font-display' });
const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shepherd",
  description: "Personal disaster companion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="dark" forceColorScheme="dark" />
      </head>
      <body
        className={`${display.variable} ${jetbrainsMono.variable} bg-bg text-text-1`}
      >
        <MantineProvider theme={shepherdTheme} defaultColorScheme="dark">
          <Notifications position="top-center" zIndex={10000} />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
