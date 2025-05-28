import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { auth } from "@/lib/auth";
import { Navbar } from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Oil Management System",
  description: "Manage oil resources with ease",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" className="root-html">
      <body className={`root-body ${inter.className}`}>
        <Providers>
          <div className="app-wrapper min-h-screen bg-background relative">
            {session && <Navbar userEmail={session.user?.email} roles={session.roles} />}
            <main className="main-content relative z-10">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
