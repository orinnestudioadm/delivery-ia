import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider, Show, SignInButton, UserButton } from "@clerk/nextjs";
import { Truck } from "lucide-react";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DeliveryIA",
  description: "DeliveryIA — projeto estruturado com Spec-Driven Development.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html
        lang="pt-BR"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">
          <header className="flex items-center justify-between border-b border-black/10 px-6 py-4 dark:border-white/10">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Truck className="size-5" aria-hidden />
              DeliveryIA
            </Link>
            <nav className="flex items-center gap-4">
              <Show when="signed-in">
                <Link href="/dashboard" className="text-sm hover:underline">
                  Dashboard
                </Link>
                <UserButton />
              </Show>
              <Show when="signed-out">
                <SignInButton>
                  <button className="rounded-full bg-foreground px-4 py-1.5 text-sm text-background hover:opacity-90">
                    Entrar
                  </button>
                </SignInButton>
              </Show>
            </nav>
          </header>
          <main className="flex-1">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
