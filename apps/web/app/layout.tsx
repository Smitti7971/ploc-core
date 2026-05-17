import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ploc - Sua Produtividade Inteligente",
  description: "Gerencie sua vida e seus projetos com a ajuda do Ploc, seu mascote inteligente.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&family=Outfit:wght@300;500;700;900&family=Roboto:wght@300;400;700&family=Caveat:wght@400;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400;1,600&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
