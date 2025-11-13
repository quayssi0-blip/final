"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "../../styles/sidebar-no-animation.css";
import {
  Newspaper,
  MessageSquare,
  Users,
  LayoutDashboard,
  FolderOpen,
  Home,
  LogOut,
  ChevronRight,
  MessageCircle,
  Settings,
} from "lucide-react";

const AdminSidebar = ({ user }) => {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Tableau de Bord",
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      permission: ["super_admin", "content_manager", "message_manager"],
    },
    {
      name: "Articles",
      href: "/admin/blogs",
      icon: <Newspaper className="h-5 w-5" />,
      permission: ["super_admin", "content_manager"],
    },
    {
      name: "Commentaires",
      href: "/admin/comments",
      icon: <MessageCircle className="h-5 w-5" />,
      permission: ["super_admin", "content_manager"],
    },
    {
      name: "Projets",
      href: "/admin/projects",
      icon: <FolderOpen className="h-5 w-5" />,
      permission: ["super_admin", "content_manager"],
    },
    {
      name: "Messages",
      href: "/admin/messages",
      icon: <MessageSquare className="h-5 w-5" />,
      permission: ["super_admin", "message_manager"],
    },
    {
      name: "Paramètres",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
      permission: ["super_admin"],
    },
    {
      name: "Administrateurs",
      href: "/admin/admins",
      icon: <Users className="h-5 w-5" />,
      permission: ["super_admin"],
    },
  ];

  const currentPath = pathname.split("/").slice(0, 3).join("/");

  const filteredNavItems = navItems.filter((item) => {
    return item.permission.includes(user?.role);
  });

  // Code de débogage temporaire
  console.log("Rôle de l'utilisateur:", user?.role);
  console.log("Éléments filtrés:", filteredNavItems.map(item => item.name));

  return (
    <aside className="admin-sidebar w-64 shadow-lg h-screen fixed top-0">
      <div className="p-8 border-b border-[var(--admin-border-light)]">
        <Link
          href="/admin/dashboard"
          className="admin-heading-4 hover:text-[var(--admin-primary-600)] transition-colors"
        >
          Admin Assalam
        </Link>
        <p className="admin-body-small text-[var(--admin-text-muted)] mt-1">
          Bonjour, {user?.name || "Admin"}
        </p>
      </div>

      <nav className="mt-8">
        <ul className="space-y-1 px-4">
          {filteredNavItems.map((item) => {
            const isActive =
              currentPath === item.href ||
              (item.href === "/admin/blogs" &&
                pathname.startsWith("/admin/blogs"));

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`group relative flex items-center px-4 py-3 rounded-lg admin-body font-medium
                    focus:outline-none focus:ring-4 focus:ring-[var(--admin-primary-500)] focus:ring-opacity-50
                    transition-all duration-200
                    ${
                      isActive
                        ? "bg-gradient-to-r from-[var(--admin-primary-600)] to-[var(--admin-primary-700)] text-[var(--admin-text-inverse)] shadow-md"
                        : "text-[var(--admin-sidebar-text)] hover:bg-[var(--admin-sidebar-hover)] hover:text-[var(--admin-primary-700)]"
                    }`}
                >
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--admin-text-inverse)] rounded-full"></div>
                  )}
                  <span
                    className={`mr-4 transition-colors ${
                      isActive
                        ? "text-[var(--admin-text-inverse)]"
                        : "text-[var(--admin-primary-500)] group-hover:text-[var(--admin-primary-700)]"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}

          <li className="pt-8 border-t border-[var(--admin-border-light)] mt-8">
            <Link
              href="/"
              className="group flex items-center px-4 py-3 hover:bg-[var(--admin-bg-hover)] rounded-lg admin-body font-medium focus:outline-none focus:ring-4 focus:ring-[var(--admin-primary-500)] focus:ring-opacity-50 text-[var(--admin-primary-600)] hover:text-[var(--admin-primary-700)] transition-colors"
            >
              <Home className="h-5 w-5 mr-4" />
              <span>Retour à l'accueil</span>
            </Link>
          </li>
        </ul>
      </nav>

    </aside>
  );
};

export default AdminSidebar;
