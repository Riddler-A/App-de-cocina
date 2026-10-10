import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { NavInferior } from "@/components/NavInferior";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Toppers — mi meal prep",
  description: "Recetas para cocinar el domingo y llevar topper toda la semana",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#c2410c",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-MX" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        <main className="mx-auto w-full max-w-xl px-4 pt-6 pb-28">{children}</main>
        <NavInferior />
      </body>
    </html>
  );
}
