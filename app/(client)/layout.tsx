import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import SalesTabs from "@/components/SalesTabs";
import { CurrencyProvider } from "@/contexts/CurrencyContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <CurrencyProvider>
        <div className="flex flex-col min-h-screen font-poppins">
          <SalesTabs />
          <Header />
          <main>{children}</main>
        </div>
        <Footer />
      </CurrencyProvider>
    </ClerkProvider>
  );
}
