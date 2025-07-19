import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";
import {ClerkProvider} from "@clerk/nextjs"



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider  > 
    <html lang="en">
      <body className="font-poppins antialiased">
        <Header/>
        {children}</body>
        <Footer/>
    </html>
    </ClerkProvider>
  )
}
