import { Playfair_Display } from "next/font/google";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/Toaster";
import { Providers } from "@/components/Providers";
import NextTopLoader from "nextjs-toploader";
export const metadata = {
  title: "Literary Loom",
};

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const inter = Playfair_Display({ subsets: ["latin"] });
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        "bg-primary-colour text-slate-900 antialiased light",
        inter.className
      )}
    >
      <link rel="icon" href="/logo.png" type="image/icon type" />
      <body className="min-h-screen pt-12 bg-primary-colour antialiased">
        <NextTopLoader showSpinner={false} crawl={false} />
        <Providers>
          <Navbar />

          <div className="container max-w-7xl mx-auto h-full pt-12">
            {children}{" "}
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
