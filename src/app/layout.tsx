import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter",
});

export const metadata: Metadata = {
    title: {
        template: "%s | Mirantes Project Management",
        default: "Mirantes Project Management",
    },
    description:
        "Aplicação completa de gerenciamento de projetos com autenticação Firebase e interface moderna",
    keywords: [
        "gestão de projetos",
        "project management",
        "produtividade",
        "colaboração",
    ],
    authors: [{ name: "Epifanio Francisco" }],
    creator: "Epifanio Francisco",
    openGraph: {
        title: "Mirantes Project Management",
        description: "Aplicação completa de gerenciamento de projetos",
        type: "website",
        locale: "pt_PT",
        siteName: "Mirantes Project Management",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
};

export const viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-PT" className={inter.variable} suppressHydrationWarning>
            <body
                className={`${inter.className} antialiased min-h-screen bg-background font-sans`}
            >
                <main className="relative flex min-h-screen flex-col">
                    <div className="flex-1">{children}</div>
                </main>
            </body>
        </html>
    );
}
