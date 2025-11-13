"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Plus, Search, Eye } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { useBlogs } from "@/hooks/useBlogs";
import AdminTable from "@/components/AdminTable/AdminTable";
import AdminButton from "@/components/AdminButton/AdminButton";
import AdminBadge from "@/components/AdminBadge/AdminBadge";
import AdminCard from "@/components/AdminCard/AdminCard";
import AdminInput from "@/components/AdminInput/AdminInput";

export default function BlogsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { blogs, isLoading, isError, deleteBlog } = useBlogs();

  // Fonction pour tronquer le texte à 20 caractères
  const truncateText = (text, maxLength = 20) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  // Filtrage côté client pour la recherche
  const filteredBlogs = blogs?.filter(
    (blog) =>
      blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.slug?.toLowerCase().includes(searchTerm.toLowerCase()),
  ) || [];

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      try {
        await deleteBlog(id);
      } catch (error) {
        console.error("Error deleting blog:", error);
        alert("Failed to delete blog post. Please try again.");
      }
    }
  };

  if (isLoading) {
    return (
      <AdminCard className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 bg-[var(--admin-primary-600)] mx-auto mb-4"></div>
          <p className="text-[var(--admin-text-secondary)]">Chargement des articles...</p>
        </div>
      </AdminCard>
    );
  }

  if (isError) {
    return (
      <AdminCard className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-[var(--admin-error)] mb-4">Erreur lors du chargement des articles</p>
          <AdminButton
            variant="primary"
            onClick={() => window.location.reload()}
          >
            Réessayer
          </AdminButton>
        </div>
      </AdminCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminCard className="page-header-card mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--admin-text-primary)] mb-2">Gestion des Articles</h1>
            <p className="text-[var(--admin-text-secondary)] text-lg">Gérez votre contenu et vos articles</p>
          </div>
          <AdminButton variant="primary" size="lg">
            <Plus className="h-5 w-5 mr-2" />
            <Link href="/admin/blogs/new" className="text-[var(--admin-text-inverse)]">Nouvel Article</Link>
          </AdminButton>
        </div>
      </AdminCard>

      {/* Search and Filter Section */}
      <AdminCard>
        <div className="search-filter-section">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-[var(--admin-text-muted)]" />
            <AdminInput
              type="text"
              placeholder="Rechercher des articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-[var(--admin-border-medium)] focus:border-[var(--admin-primary-500)] focus:ring-[var(--admin-primary-500)]"
            />
          </div>
          <div className="filter-buttons flex space-x-3 mt-4">
            <AdminButton variant="secondary" size="sm">
              Tous les statuts
            </AdminButton>
            <AdminButton variant="secondary" size="sm">
              Publiés
            </AdminButton>
            <AdminButton variant="secondary" size="sm">
              Brouillons
            </AdminButton>
          </div>
        </div>
      </AdminCard>

      {/* Table */}
      <AdminTable
        columns={[
          {
            key: 'title',
            label: 'Titre',
            render: (value) => <span className="font-medium text-[var(--admin-text-primary)]" title={value}>{truncateText(value)}</span>
          },
          {
            key: 'slug',
            label: 'Slug',
            render: (value) => <span className="text-[var(--admin-text-secondary)]" title={value}>{truncateText(value)}</span>
          },
          {
            key: 'status',
            label: 'Statut',
            render: (value) => {
              const variant = value === 'published' ? 'success' : value === 'draft' ? 'warning' : 'info';
              return <AdminBadge variant={variant}>{value}</AdminBadge>;
            }
          },
          {
            key: 'created_at',
            label: 'Créé le',
            render: (value) => value ? new Date(value).toLocaleDateString() : "N/A"
          },
          {
            key: 'views',
            label: 'Vues',
            render: (value) => <span className="text-[var(--admin-text-secondary)]">{value}</span>
          }
        ]}
        data={filteredBlogs}
        renderActions={(blog) => (
          <div className="flex justify-end space-x-2">
            <Link
              href={`/blogs/${blog.slug}`}
              target="_blank"
              className="text-[var(--admin-primary-600)] hover:text-[var(--admin-primary-700)] p-2 rounded-lg hover:bg-[var(--admin-primary-50)] transition-colors"
            >
              <Eye className="h-5 w-5" />
            </Link>
            <Link
              href={`/admin/blogs/${blog.id}`}
              className="text-[var(--admin-primary-600)] hover:text-[var(--admin-primary-700)] p-2 rounded-lg hover:bg-[var(--admin-primary-50)] transition-colors"
            >
              <Pencil className="h-5 w-5" />
            </Link>
            <AdminButton
              variant="danger"
              size="sm"
              onClick={() => handleDelete(blog.id)}
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
