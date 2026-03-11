import "./globals.css";
import AppGuard from "@/components/guards/AppGuard";

export const metadata = {
  title: {
    default: "REFUND ACCOUNT",
    template: "%s | REFUND ACCOUNT",
  },
  description: "Premium digital banking experience",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f7f6f2] text-[#111111] antialiased">
        <AppGuard>{children}</AppGuard>
      </body>
    </html>
  );
}