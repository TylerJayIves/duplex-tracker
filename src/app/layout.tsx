import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/components/layout/AppShell";
import { FunShell } from "@/components/layout/fun/FunShell";
import { getLayoutChoice } from "@/lib/layout-choice";
import "./globals.css";

// Only the fun layout uses these. preload: false keeps the classic layout
// from downloading them: the browser fetches a font file only once some CSS
// on the page actually asks for it.
const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka", preload: false });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito", preload: false });

export const metadata: Metadata = {
  title: "The Duplex",
  description: "Renovation and rental tracker for a two-unit duplex.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const layout = await getLayoutChoice();
  const Shell = layout === "fun" ? FunShell : AppShell;

  return (
    <html
      lang="en"
      data-layout={layout}
      className={`${fredoka.variable} ${nunito.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-full antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>
            <Shell>{children}</Shell>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
