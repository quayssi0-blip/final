"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Trash2, Search, MessageCircle, Check, X, CheckCheck, Edit } from "lucide-react";
import { useComments } from "../../../hooks/useComments";
import AdminTable from "@/components/AdminTable/AdminTable";
import AdminBadge from "@/components/AdminBadge/AdminBadge";
import AdminCard from "@/components/AdminCard/AdminCard";
import AdminInput from "@/components/AdminInput/AdminInput";
import AdminButton from "@/components/AdminButton/AdminButton";

export default function CommentsPage() {
  const {
    data: comments,
    isLoading,
    isError,
    deleteComment,
    approveComment,
    publishComment
  } = useComments();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all, pending, approved, published

  const filteredComments = comments?.filter((comment) => {
    const matchesSearch = 
      comment.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.message?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filter === "all" ||
      (filter === "pending" && !comment.is_approved) ||
      (filter === "approved" && comment.is_approved && !comment.is_published) ||
      (filter === "published" && comment.is_published);

    return matchesSearch && matchesFilter;
  }) || [];

  const handleDelete = async (id) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?")) {
      await deleteComment(id);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveComment(id);
      // Optionnel: Afficher un message de succès
      console.log('Commentaire approuvé avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error);
      // Optionnel: Afficher un message d'erreur à l'utilisateur
      alert('Erreur lors de l\'approbation du commentaire');
    }
  };

  const handlePublish = async (id) => {
    try {
      await publishComment(id);
      // Optionnel: Afficher un message de succès
      console.log('Commentaire publié avec succès');
    } catch (error) {
      console.error('Erreur lors de la publication:', error);
      // Optionnel: Afficher un message d'erreur à l'utilisateur
      alert('Erreur lors de la publication du commentaire');
    }
  };

  const getStatusBadge = (comment) => {
    if (comment.is_published) {
      return <AdminBadge variant="success"><CheckCheck className="w-3 h-3 mr-1" />Publié</AdminBadge>;
    } else if (comment.is_approved) {
      return <AdminBadge variant="info"><Check className="w-3 h-3 mr-1" />Approuvé</AdminBadge>;
    } else {
      return <AdminBadge variant="warning"><X className="w-3 h-3 mr-1" />En attente</AdminBadge>;
    }
  };

  if (isLoading) {
    return (
      <AdminCard className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des commentaires...</p>
        </div>
      </AdminCard>
    );
  }

  if (isError) {
    return (
      <AdminCard className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erreur lors du chargement des commentaires</p>
          <AdminButton variant="primary" onClick={() => window.location.reload()}>
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
            <h1 className="text-3xl font-bold text-[var(--admin-text-primary)] mb-2">Gestion des Commentaires</h1>
            <p className="text-[var(--admin-text-muted)] text-lg">Gérez les commentaires des articles de blog</p>
          </div>
        </div>
      </AdminCard>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <AdminCard>
          <div className="flex items-center">
            <MessageCircle className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total</p>
              <p className="text-2xl font-semibold text-gray-900">{comments?.length || 0}</p>
            </div>
          </div>
        </AdminCard>
        <AdminCard>
          <div className="flex items-center">
            <X className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">En attente</p>
              <p className="text-2xl font-semibold text-gray-900">
                {comments?.filter(c => !c.is_approved).length || 0}
              </p>
            </div>
          </div>
        </AdminCard>
        <AdminCard>
          <div className="flex items-center">
            <Check className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Approuvés</p>
              <p className="text-2xl font-semibold text-gray-900">
                {comments?.filter(c => c.is_approved && !c.is_published).length || 0}
              </p>
            </div>
          </div>
        </AdminCard>
        <AdminCard>
          <div className="flex items-center">
            <CheckCheck className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Publiés</p>
              <p className="text-2xl font-semibold text-gray-900">
                {comments?.filter(c => c.is_published).length || 0}
              </p>
            </div>
          </div>
        </AdminCard>
      </div>

      {/* Search and Filter */}
      <AdminCard>
        <div className="search-filter-section">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <AdminInput
              type="text"
              placeholder="Rechercher dans les commentaires..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="filter-buttons flex space-x-3 mt-4">
            <AdminButton variant={filter === 'all' ? 'primary' : 'secondary'} size="sm" onClick={() => setFilter('all')}>
              Tous
            </AdminButton>
            <AdminButton variant={filter === 'pending' ? 'primary' : 'secondary'} size="sm" onClick={() => setFilter('pending')}>
              En attente
            </AdminButton>
            <AdminButton variant={filter === 'approved' ? 'primary' : 'secondary'} size="sm" onClick={() => setFilter('approved')}>
              Approuvés
            </AdminButton>
            <AdminButton variant={filter === 'published' ? 'primary' : 'secondary'} size="sm" onClick={() => setFilter('published')}>
              Publiés
            </AdminButton>
          </div>
        </div>
      </AdminCard>

      {/* Comments List */}
      <AdminTable
        columns={[
          {
            key: 'message',
            label: 'Commentaire',
            render: (value, comment) => (
              <div>
                <p className="font-medium text-gray-900 truncate" title={value}>
                  {value?.substring(0, 100)}{value?.length > 100 ? '...' : ''}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  Par: {comment.name} {comment.email ? `(${comment.email})` : ''}
                </p>
                {comment.blogs && (
                  <p className="text-xs text-blue-600">
                    Article: {comment.blogs.title}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  {new Date(comment.created_at).toLocaleString('fr-FR')}
                </p>
              </div>
            )
          },
          {
            key: 'status',
            label: 'Statut',
            render: (value, comment) => getStatusBadge(comment)
          }
        ]}
        data={filteredComments}
        renderActions={(comment) => (
          <div className="flex justify-end space-x-2">
            {!comment.is_approved && (
              <AdminButton
                variant="primary"
                size="sm"
                onClick={() => handleApprove(comment.id)}
                title="Approuver"
                className="p-2"
              >
                <Check className="h-4 w-4" />
              </AdminButton>
            )}

            {comment.is_approved && !comment.is_published && (
              <AdminButton
                variant="success"
                size="sm"
                onClick={() => handlePublish(comment.id)}
                title="Publier"
                className="p-2"
              >
                <CheckCheck className="h-4 w-4" />
              </AdminButton>
            )}

            <Link
              href={`/admin/comments/${comment.id}`}
              className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors"
              title="Voir détails"
            >
              <Eye className="h-5 w-5" />
            </Link>

            <Link
              href={`/admin/comments/${comment.id}?edit=true`}
              className="text-green-600 hover:text-green-700 p-2 rounded-lg hover:bg-green-50 transition-colors"
              title="Modifier"
            >
              <Edit className="h-5 w-5" />
            </Link>

            <AdminButton
              variant="danger"
              size="sm"
              onClick={() => handleDelete(comment.id)}
              className="p-2"
              title="Supprimer"
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