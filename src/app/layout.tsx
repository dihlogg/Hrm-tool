// app/layout.tsx
import MainLayout from '@/components/common/main-layout'
import './globals.css'

export const metadata = {
  title: 'HRM App',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  )
}
