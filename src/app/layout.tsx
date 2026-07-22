import type { Metadata } from "next";
import { Inter, Chivo, Chivo_Mono, Familjen_Grotesk, Doto } from "next/font/google";
import CustomCursor from "@/components/CustomCursor";
import PageTransition from "@/components/PageTransition";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const chivo = Chivo({ subsets: ["latin"], variable: "--font-chivo" });
const chivoMono = Chivo_Mono({ subsets: ["latin"], variable: "--font-chivo-mono" });
const familjenGrotesk = Familjen_Grotesk({ subsets: ["latin"], variable: "--font-familjen-grotesk" });
const doto = Doto({ subsets: ["latin"], variable: "--font-doto" });

export const metadata: Metadata = {
  title: "The Misfits",
  description: "A webring for people who build things.",
  icons: {
    icon: "/assets/Favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${chivo.variable} ${chivoMono.variable} ${familjenGrotesk.variable} ${doto.variable}`}>
        <CustomCursor />
        <PageTransition />
        {children}
      </body>
    </html>
  );
}
