import "@radix-ui/themes/styles.css"
import { WidthIndicator } from "@/components/WidthIndicator"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { Theme } from "@radix-ui/themes"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Phantom Interview App",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "min-h-screen")}>
        <Theme>
          {children}
          <WidthIndicator />
        </Theme>
      </body>
    </html>
  )
}
