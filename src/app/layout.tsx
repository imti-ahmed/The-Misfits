import type { Metadata } from "next";
import { Inter, Chivo_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const chivoMono = Chivo_Mono({ subsets: ["latin"], variable: "--font-chivo-mono" });

export const metadata: Metadata = {
  title: "The Makers Guild",
  description: "A webring for people who build things.",
  icons: {
    icon: "/assets/Webring Logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${chivoMono.variable}`}>{children}</body>
    </html>
  );
}
