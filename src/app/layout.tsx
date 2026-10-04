import type { Metadata } from "next";
import { Exo_2 } from "next/font/google";

import "../styles/globals.css";
import "react-quill-new/dist/quill.snow.css";

import BrowserErrorReporter from "@/components/BrowserErrorReporter";
import QueryProvider from "@/components/QueryProvider";
import { Providers } from "@/store/provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const exo2 = Exo_2({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-exo2",
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Admin | WalletWise",
  description:
    "Walletwise Admin Panel - Manage and oversee all services, users, and user activities with ease.",
  openGraph: {
    title: "Walletwise Admin - Manage services",
    description: "Walletwise Admin Panel - Your hub for managing services",
    images: [
      {
        url: "/hero-preview.jpg",
        width: 1200,
        height: 630,
        alt: "Walletwise Admin Preview Image",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${exo2.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <QueryProvider>
          <Providers>
            <ThemeProvider>
              {children}
              <Toaster />
              <BrowserErrorReporter />
            </ThemeProvider>
          </Providers>
        </QueryProvider>
      </body>
    </html>
  );
}
