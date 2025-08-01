import '@ant-design/v5-patch-for-react-19';
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "./globals.css";

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
          {children}
        </AntdRegistry>
      </body>
    </html>
  );
}
