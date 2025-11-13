"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Plus, Search, Eye } from "lucide-react";
import { useProjects } from "../../../hooks/useProjects";
import AdminTable from "@/components/AdminTable/AdminTable";
import AdminButton from "@/components/AdminButton/AdminButton";
import AdminBadge from "@/components/AdminBadge/AdminBadge";
import AdminCard from "@/components/AdminCard/AdminCard";
import AdminInput from "@/components/AdminInput/AdminInput";

export default function ProjectsPage() {
  const { projects, isLoading, isError, deleteProject } = useProjects();
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrer les projets si les données sont disponibles
  const filteredProjects = projects?.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.slug.toLowerCase().includes(searchTerm.toLowerCase()),
  ) || [];

  const handleDelete = async (id) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
      try {
        await deleteProject(id);
        // La revalidation se fait automatiquement via le hook mutate()
      } catch (error) {
        console.error("Failed to delete project:", error);
        alert("Échec de la suppression du projet. Veuillez réessayer.");
      }
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "published":
        return "bg-[var(--admin-success)]/10 text-[var(--admin-success)]";
      case "draft":
        return "bg-[var(--admin-warning)]/10 text-[var(--admin-warning)]";
      case "archived":
        return "bg-[var(--admin-text-secondary)]/10 text-[var(--admin-text-secondary)]";
      default:
        return "bg-[var(--admin-text-secondary)]/10 text-[var(--admin-text-secondary)]";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 bg-[var(--admin-primary-600)]"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-[var(--admin-error)] mb-4">Erreur lors du chargement des projets</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[var(--admin-primary-600)] text-[var(--admin-text-inverse)] rounded-lg hover:bg-[var(--admin-primary-700)]"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminCard className="page-header-card mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--admin-text-primary)] mb-2">Gestion des Projets</h1>
            <p className="text-[var(--admin-text-secondary)] text-lg">Gérez vos projets et leur contenu</p>
          </div>
          <AdminButton variant="primary" size="lg">
            <Plus className="h-5 w-5 mr-2" />
            <Link href="/admin/projects/new" className="text-[var(--admin-text-inverse)]">Nouveau Projet</Link>
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
              placeholder="Rechercher des projets..."
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
            render: (value) => <span className="font-medium text-[var(--admin-text-primary)]">{value}</span>
          },
          {
            key: 'slug',
            label: 'Slug',
            render: (value) => <span className="text-[var(--admin-text-secondary)]">{value}</span>
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
            key: 'createdAt',
            label: 'Créé le',
            render: (value) => new Date(value).toLocaleDateString()
          }
        ]}
        data={filteredProjects}
        renderActions={(project) => (
          <div className="flex justify-end space-x-2">
            <Link
              href={`/projects/${project.slug}`}
              target="_blank"
              className="text-[var(--admin-primary-600)] hover:text-[var(--admin-primary-700)] p-2 rounded-lg hover:bg-[var(--admin-primary-50)] transition-colors"
            >
              <Eye className="h-5 w-5" />
            </Link>
            <Link
              href={`/admin/projects/${project.id}`}
              className="text-[var(--admin-primary-600)] hover:text-[var(--admin-primary-700)] p-2 rounded-lg hover:bg-[var(--admin-primary-50)] transition-colors"
            >
              <Pencil className="h-5 w-5" />
            </Link>
            <AdminButton
              variant="danger"
              size="sm"
              onClick={() => handleDelete(project.id)}
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
