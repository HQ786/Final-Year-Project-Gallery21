'use client'
import "../styles/globals.css";
import Provider from "@components/Provider";
import DashboardLayout from "@components/DashboardLayout";
import { usePathname } from "next/navigation";

const metadata = {
  title: "Gallery21",
  description: "Discover and share Art",
};

const Layout = ({ children }) => {
  const pathname = usePathname(); // Get the current route
  const noDashboardLayoutPages = ["/login", "/signup"]; // Pages without layout

  const isNoLayoutPage = noDashboardLayoutPages.includes(pathname);

  return (
    <html lang="en" draggable="false">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body>
        <Provider>
          <main draggable="false">
            {!isNoLayoutPage ? (
              <DashboardLayout>{children}</DashboardLayout>
            ) : (
              children
            )}
          </main>
        </Provider>
      </body>
    </html>
  );
};

export default Layout;
