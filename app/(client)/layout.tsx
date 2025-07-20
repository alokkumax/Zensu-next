import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import FooterTop from "@/components/FooterTop";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main>{children}</main>
          </div>
          <Footer />
    </ClerkProvider>
  );
}
