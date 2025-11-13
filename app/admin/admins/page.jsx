"use client";

import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import StatusBadge from "@/components/StatusBadge";
import { useAdmins } from "@/hooks/useAdmins";
import AdminTable from "@/components/AdminTable/AdminTable";
import AdminButton from "@/components/AdminButton/AdminButton";
import AdminBadge from "@/components/AdminBadge/AdminBadge";
import AdminCard from "@/components/AdminCard/AdminCard";
import AdminInput from "@/components/AdminInput/AdminInput";

export default function AdminsPage() {
  const { admins, isLoading, deleteAdmin } = useAdmins();
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const filteredAdmins =
    admins?.filter(
      (admin) =>
        admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.role.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this admin?")) {
      try {
        setDeletingId(id);
        await deleteAdmin(id);
      } catch (error) {
        console.error("Failed to delete admin:", error);
        alert("Failed to delete admin. Please try again.");
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (isLoading) {
    return (
      <AdminCard className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-[var(--admin-text-muted)]">Chargement des administrateurs...</p>
        </div>
      </AdminCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminCard className="page-header-card mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--admin-text-primary)] mb-2">Gestion des Administrateurs</h1>
            <p className="text-[var(--admin-text-muted)] text-lg">Gérez les comptes administrateur et les permissions</p>
          </div>
          <AdminButton variant="primary" size="lg">
            <Plus className="h-5 w-5 mr-2" />
            <Link href="/admin/admins/new" className="text-white">Nouvel Admin</Link>
          </AdminButton>
        </div>
      </AdminCard>

      {/* Search and Filter Section */}
      <AdminCard>
        <div className="search-filter-section">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <AdminInput
              type="text"
              placeholder="Rechercher des administrateurs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="filter-buttons flex space-x-3 mt-4">
            <AdminButton variant="secondary" size="sm">
              Tous les rôles
            </AdminButton>
            <AdminButton variant="secondary" size="sm">
              Super Admin
            </AdminButton>
            <AdminButton variant="secondary" size="sm">
              Admin
            </AdminButton>
          </div>
        </div>
      </AdminCard>

      {/* Table */}
      <AdminTable
        columns={[
          {
            key: 'email',
            label: 'Email',
            render: (value) => <span className="font-medium text-[var(--admin-text-primary)]">{value}</span>
          },
          {
            key: 'role',
            label: 'Rôle',
            render: (value) => {
              const variant = value === 'superadmin' ? 'error' : value === 'admin' ? 'info' : 'warning';
              return <AdminBadge variant={variant}>{value}</AdminBadge>;
            }
          },
          {
            key: 'createdAt',
            label: 'Créé le',
            render: (value) => new Date(value).toLocaleDateString()
          }
        ]}
        data={filteredAdmins}
        renderActions={(admin) => (
          <div className="flex justify-end space-x-2">
            <Link
              href={`/admin/admins/${admin.id}`}
              className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <Pencil className="h-5 w-5" />
            </Link>
            <AdminButton
              variant="danger"
              size="sm"
              onClick={() => handleDelete(admin.id)}
              disabled={deletingId === admin.id}
              className="p-2"
            >
              <Trash2 className="h-4 w-4" />
            </AdminButton>
          </div>
        )}
        loading={isLoading}
      />

      {/* Pagination placeholder */}
      <AdminCard className="mt-6">
        <div className="flex justify-center">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <AdminButton variant="secondary" size="sm" disabled className="rounded-l-md px-3 py-2">
              Précédent
            </AdminButton>
            <AdminButton variant="primary" size="sm" className="px-4 py-2 border-l-0 border-r-0">
              1
            </AdminButton>
            <AdminButton variant="secondary" size="sm" disabled className="rounded-r-md px-3 py-2 border-l-0">
              Suivant
            </AdminButton>
          </nav>
        </div>
      </AdminCard>
    </div>
  );
}
