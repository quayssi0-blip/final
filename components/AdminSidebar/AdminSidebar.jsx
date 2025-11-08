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

  return (
    <aside
      className="admin-sidebar w-64 shadow-lg h-screen sticky top-0 border-r border-gray-100"
      style={{ backgroundColor: "white" }}
    >
      <div
        className="p-8 border-b border-gray-100"
        style={{ backgroundColor: "white" }}
      >
        <Link
          href="/admin/dashboard"
          className="text-2xl font-bold hover:text-accent"
          style={{ color: "#333333" }}
        >
          Admin Assalam
        </Link>
        <p className="text-sm text-gray-500 mt-1">
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
                  className={`group relative flex items-center px-4 py-3 rounded-lg font-medium text-base
                    focus:outline-none focus:ring-4 focus:ring-accent focus:ring-opacity-50
                    ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-full"></div>
                  )}
                  <span
                    className={`mr-4 ${
                      isActive
                        ? "text-white"
                        : "text-blue-500"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}

          <li className="pt-8 border-t border-gray-100 mt-8">
            <Link
              href="/"
              className="group flex items-center px-4 py-3 hover:bg-gray-100 rounded-lg font-medium focus:outline-none focus:ring-4 focus:ring-accent focus:ring-opacity-50"
              style={{ color: "#6495ED" }}
            >
              <Home className="h-5 w-5 mr-4" />
              <span className="text-base">Retour à l'accueil</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="pt-4 mt-4 border-t border-gray-100 px-4">
        <Link
          href="/api/auth/logout"
          className="flex items-center p-3 rounded-xl text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span className="text-sm font-medium">Déconnexion</span>
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
