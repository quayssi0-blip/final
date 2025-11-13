"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar/AdminSidebar";
import AdminThemeProvider, { AdminThemeToggle } from "@/components/AdminThemeProvider";
import { useAuth } from "@/hooks/useAuth";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Centralized redirect logic based on auth state
  useEffect(() => {
    console.log("DEBUG: AdminLayout useEffect - isLoading:", isLoading, "user exists:", !!user, "pathname:", pathname);

    // Only execute redirection logic when NOT loading
    if (!isLoading) {
      const isProtected = pathname !== "/admin/login";

      // Case 1: Unauthenticated user on protected route
      if (isProtected && !user) {
        console.log("DEBUG: AdminLayout - No user, redirecting to login via useEffect.");
        router.replace("/admin/login");
      }

      // Case 2: Authenticated user on login page
      if (user && pathname === "/admin/login") {
        console.log("DEBUG: AdminLayout - User authenticated on login page, redirecting to dashboard via useEffect.");
        router.replace("/admin/dashboard");
      }
    }
  }, [user, isLoading, router, pathname]);

  console.log("DEBUG: AdminLayout render - isLoading:", isLoading, "user exists:", !!user, "pathname:", pathname);

  // Show loading spinner during auth state resolution to prevent flicker
  if (isLoading) {
    console.log("DEBUG: AdminLayout showing loading spinner");
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--admin-bg-primary)]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[var(--admin-primary-600)]"></div>
      </div>
    );
  }

  // 2. Afficher la page de connexion ou le contenu normal
  console.log("DEBUG: AdminLayout proceeding to render main layout");

  // Nouvelle logique de rendu
  if (pathname === "/admin/login" && !user) {
      // Si nous sommes sur la page de login ET que l'utilisateur n'est PAS connecté
      // (le useEffect ne l'a pas encore redirigé)
      return children;
  }

  // If user is null (not authenticated) AND NOT on login page,
  // the useEffect should have already redirected. We should never hit this,
  // but it's a safety net.
  if (!user) {
      // Si le user est null, nous devrions être sur /admin/login (géré ci-dessus)
      // ou en train de rediriger. Ce 'return null' n'est plus nécessaire si le useEffect
      // fonctionne, mais le garder peut être une sécurité.
      return null;
  }

  return (
    <AdminThemeProvider>
      <div className="admin-panel flex h-screen">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-[var(--admin-bg-secondary)] shadow-lg lg:translate-x-0 lg:static lg:inset-0 lg:w-64 md:w-56 sm:w-48 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <AdminSidebar user={user} />
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main content */}
        <div key={user ? (user.id || user.email) : 'no-user'} className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="admin-header">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-[var(--admin-text-secondary)] hover:text-[var(--admin-text-primary)] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--admin-primary-500)]"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center px-3 py-2 text-[var(--admin-text-secondary)] hover:text-[var(--admin-text-primary)] hover:bg-[var(--admin-bg-hover)] rounded-lg transition duration-150 font-medium"
              >
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Accueil
              </Link>
              <AdminThemeToggle />
              <div className="flex items-center space-x-2">
                <div className="hidden sm:flex w-8 h-8 bg-[var(--admin-primary-500)] rounded-full items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.name?.charAt(0).toUpperCase() ||
                      user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-[var(--admin-text-secondary)] hidden sm:inline">
                  {user.name || user.email}
                </span>
              </div>
              <button
                onClick={logout}
                className="text-sm text-[var(--admin-text-secondary)] hover:text-[var(--admin-text-primary)] px-3 py-1 rounded-md hover:bg-[var(--admin-bg-hover)] transition duration-150"
              >
                Déconnexion
              </button>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto bg-[var(--admin-bg-primary)] p-4 lg:p-6 md:p-5 sm:p-4">
            {children}
          </main>
        </div>
      </div>
    </AdminThemeProvider>
  );
}
