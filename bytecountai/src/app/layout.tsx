import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ByteCount AI",
  description: "The AI-powered pain-free calorie tracker",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="icon" type="image/png" href="/favicons/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicons/favicon.svg" />
        <link rel="shortcut icon" href="/favicons/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="ByteCount" />
        <link rel="manifest" href="/favicons/site.webmanifest" />

        <meta name="theme-color" content="#000000" />
        <meta name="description" content={String(metadata.description)} />
        <title>{String(metadata.title)}</title>
      </head>
      <body
        className={"h-lvh"}
      >
        {children}
      </body>
    </html>
  );
}
