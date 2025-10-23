import "@/app/styles/globals.css";
import Layout from "@/app/components/Layout.jsx";

export default function RootLayout({ children }) {
  // Detect the path for conditional layout
  const path = typeof window !== "undefined" ? window.location.pathname : "";

  // Pages that should not have Layout (login, MFA)
  const noLayoutPages = ["/", "/login", "/mfa"];

  const useLayout = !noLayoutPages.includes(path);

  return (
    <html lang="en">
      <body>
        {useLayout ? <Layout>{children}</Layout> : children}
      </body>
    </html>
  );
}