import "./globals.css";
import Providers from "../components/Providers";
import Navbar from "../components/Navbar";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export const metadata = {
  title: "Algo Insight",
  description: "Log mistakes, analyze complexity, and master algorithms.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col">
        <NuqsAdapter>
          <Providers>
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <footer className="py-6 text-center text-slate-500 text-sm">
              Algo Insight © {new Date().getFullYear()}
            </footer>
          </Providers>
        </NuqsAdapter>
      </body>
    </html>
  );
}
