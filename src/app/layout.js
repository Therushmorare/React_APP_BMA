import "@/app/styles/globals.css";
import Layout from "@/app/components/Layout.jsx";

export default function RootLayout({ children, params }) {
  // Check the current path
  const path = typeof window !== "undefined" ? window.location.pathname : "";

  const noLayoutPages = ["/login", "/mfa"];

  const useLayout = !noLayoutPages.includes(path);

  return (
    <html lang="en">
      <body>
        {useLayout ? <Layout>{children}</Layout> : children}
      </body>
    </html>
  );
}
