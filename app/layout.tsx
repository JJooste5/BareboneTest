import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ModalProvider from "@/components/ModalProvider";
import ToasterProvider from "@/components/toast-provider";
import CrispProvider from "@/components/crispProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Barebone",
  description: "AI Startup",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <CrispProvider />
        <body className={inter.className}>
          <ModalProvider />
          <ToasterProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
