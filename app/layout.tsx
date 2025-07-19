import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="font-poppins antialiased">
          <div className="flex flex-col min-h-screen">
            <Header />
            <main>{children}</main>
          </div>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
