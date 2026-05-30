import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Montserrat, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider"
import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Fonts
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


// Static metadata (can be localized later if needed)
export const metadata: Metadata = {
  title: "MSKTH",
  description: "Mskth, a muslim student community at KTH",
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

// Enable static generation
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  // Get messages for the current locale
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning={true} className={`${montserrat.variable} ${geistMono.variable}`}>
      <body>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
        <NextIntlClientProvider messages={messages} locale={locale}>
          <main>{children}</main>      
        </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
