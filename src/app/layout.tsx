import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SocialFloat from "@/components/SocialFloat";
import { ToastProvider } from "@/components/Toast";
import { AuthProvider } from "@/components/AuthProvider";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Mozini - Watches & Gifts Kenya",
  description: "Kenya's finest watches & gifts collection. Premium timepieces and fragrances.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body>
        <AuthProvider initialUser={user}>
          <ToastProvider>
            <Header />
            <main>{children}</main>
            <Footer />
            <SocialFloat />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
