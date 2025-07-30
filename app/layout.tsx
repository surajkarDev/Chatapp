'use client';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./ThemeContext"; // ✅ not ThemeContext directly
import Navbar from "./components/Navbar/page";
import { useState } from "react";
import { Counter } from "./Counter";
import { store } from "./redux/store/page";
import { Provider } from "react-redux";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [counterNumber,setCounterNumber] = useState(0)
  
  
  const counterfun = ()=>{
    setCounterNumber(counterNumber+1);
  }
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Provider store={store}>
        <ThemeProvider>
          <Counter.Provider value={counterNumber}>
          <Navbar />
          </Counter.Provider>
          <main className="p-4">{children}</main>
        </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
