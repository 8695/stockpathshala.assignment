import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })
  import { ToastContainer } from 'react-toastify';

export const metadata = {
  title: "StockPathshala - Live Trading Classes",
  description: "Professional trading education platform",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}
         <ToastContainer />
      </body>
      
    </html>
  )
}
