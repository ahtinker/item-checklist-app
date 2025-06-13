import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.scss";
import PageTransition from "@/components/PageTransition"; // Adjust the path as needed
import NavBar from "@/components/navbar";

// Load the Nunito font
const nunito = Nunito({
  variable: "--font-nunito", // CSS variable for the font
  subsets: ["latin"], // Include Latin characters
  weight: ["300", "400", "600", "700"], // Specify font weights to include
});

export const metadata: Metadata = {
  title: "Pakkausmuistilista",
  description: "Verkkokehitys Ankeriasniemi",
};
export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  width: 'device-width',
  userScalable: false
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="has-navbar-fixed-bottom" data-theme="light">
      <head>
        <meta name="theme-color" content="#fff"/>
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
          rel="stylesheet"
        />
      </head>
      
      <body className={`${nunito.variable}`} style={{zoom: "75%"}}>
        <div className="root">
          <PageTransition>          
            {children}
            <section style={{height: "400px"}}></section>

          </PageTransition>

          <NavBar/>
        </div>
      </body>
    </html>
  );
}
