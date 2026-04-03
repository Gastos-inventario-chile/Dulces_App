import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/store/authContext";

// Firebase Auth requiere el browser — desactivar prérender estático
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "DulcesApp - Sistema de Ventas",
  description: "Sistema de inventario y ventas de dulces",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#ec4899",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
