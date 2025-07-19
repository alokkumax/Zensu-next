import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-poppins antialiased">
        <Header/>
        {children}</body>
        <Footer/>
    </html>
  );
}
