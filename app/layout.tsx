import type { Metadata } from "next";
import { Geist, Geist_Mono, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
// Navigation responsive : barre d'onglets en bas (mobile) + sidebar (desktop)
import Navigation from "@/components/Navigation";
import { createClient } from "@/lib/supabase/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Titres : Bricolage Grotesque — chaleureuse, contemporaine, jamais corporate.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Scolaria",
  description: "Apprends, teste-toi, progresse — de la 6e à la Terminale.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Utilisateur courant pour l'affichage du lien compte dans la navigation.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userLabel = user?.user_metadata?.full_name || user?.email || null;

  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} antialiased`}
      >
        {/* Mobile first : contenu entre la barre du haut (compte) et la barre
            d'onglets du bas ; sur desktop la sidebar sticky passe à gauche et
            le contenu est centré en largeur de lecture confortable */}
        <div className="flex min-h-screen">
          <Navigation userLabel={userLabel} />
          <main className="flex-1 px-4 pt-16 pb-24 md:px-8 md:py-10">
            <div className="mx-auto w-full max-w-4xl">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
