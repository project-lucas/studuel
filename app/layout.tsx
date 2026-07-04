import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// Navigation responsive : barre d'onglets en bas (mobile) + sidebar (desktop)
import Navigation from "@/components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Scolaria",
  description: "Application Scolaria",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Mobile first : contenu plein écran + padding bas pour la barre d'onglets ;
            sur desktop la sidebar passe à gauche */}
        <div className="flex min-h-screen">
          <Navigation />
          <main className="flex-1 p-4 pb-24 md:p-6 md:pb-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}