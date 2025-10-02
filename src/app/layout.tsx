import "@ant-design/v5-patch-for-react-19";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "./globals.css";
import { AuthProvider } from "@/contexts/authContext";
import { NotificationProvider } from "@/contexts/notificationContext";

export const metadata = {
  title: "HRM App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <AuthProvider>
            <NotificationProvider>{children}</NotificationProvider>
          </AuthProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
