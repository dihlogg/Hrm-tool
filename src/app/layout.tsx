import "@ant-design/v5-patch-for-react-19";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "./globals.css";
import { AuthProvider } from "@/contexts/authContext";
import { NotificationProvider } from "@/contexts/notificationContext";

export const metadata = {
  title: "HRM App",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="h-full">
        <AntdRegistry>
          <AuthProvider>
            <NotificationProvider>
              <div className="h-full">{children}</div>
            </NotificationProvider>
          </AuthProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
