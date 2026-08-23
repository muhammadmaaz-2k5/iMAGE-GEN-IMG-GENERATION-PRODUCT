import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ThumbnailAI Studio — Multi-Platform AI Thumbnail & Ratio Studio",
  description: "Generate high-converting thumbnails and social media assets for YouTube, Instagram, TikTok, LinkedIn, and more with AI, Cloudinary hosting, and Neon DB.",
  keywords: ["AI Thumbnail Generator", "YouTube Thumbnail AI", "Cloudinary Image Gen", "Neon Postgres", "Social Media Aspect Ratio"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-[#07090e] text-slate-100 antialiased ambient-bg selection:bg-purple-500/30 selection:text-purple-200`}>
        {children}
      </body>
    </html>
  );
}
