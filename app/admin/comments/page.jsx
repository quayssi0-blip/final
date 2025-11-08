"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Trash2, Search, MessageCircle, Check, X, CheckCheck } from "lucide-react";
import { useComments } from "../../../hooks/useComments";

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
    await approveComment(id);
  };

  const handlePublish = async (id) => {
    await publishComment(id);
  };

  const getStatusBadge = (comment) => {
    if (comment.is_published) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCheck className="w-3 h-3 mr-1" />
          Publié
        </span>
      );
    } else if (comment.is_approved) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <Check className="w-3 h-3 mr-1" />
          Approuvé
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <X className="w-3 h-3 mr-1" />
          En attente
        </span>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600">Erreur lors du chargement des commentaires. Veuillez réessayer.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Commentaires</h1>
          <p className="text-gray-600">
            Gérer les commentaires des articles de blog
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <MessageCircle className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total</p>
              <p className="text-2xl font-semibold text-gray-900">{comments?.length || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <X className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">En attente</p>
              <p className="text-2xl font-semibold text-gray-900">
                {comments?.filter(c => !c.is_approved).length || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Check className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Approuvés</p>
              <p className="text-2xl font-semibold text-gray-900">
                {comments?.filter(c => c.is_approved && !c.is_published).length || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <CheckCheck className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Publiés</p>
              <p className="text-2xl font-semibold text-gray-900">
                {comments?.filter(c => c.is_published).length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher dans les commentaires..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les commentaires</option>
              <option value="pending">En attente</option>
              <option value="approved">Approuvés</option>
              <option value="published">Publiés</option>
            </select>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="divide-y divide-gray-200">
          {filteredComments.map((comment) => (
            <div key={comment.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="h-5 w-5 text-blue-600" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {comment.message?.substring(0, 150)}{comment.message?.length > 150 ? '...' : ''}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        Par: {comment.name} {comment.email && `(${comment.email})`}
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
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  {getStatusBadge(comment)}
                  
                  {!comment.is_approved && (
                    <button
                      onClick={() => handleApprove(comment.id)}
                      className="text-blue-600 hover:text-blue-900 p-1"
                      title="Approuver"
                    >
                      <Check className="h-5 w-5" />
                    </button>
                  )}
                  
                  {comment.is_approved && !comment.is_published && (
                    <button
                      onClick={() => handlePublish(comment.id)}
                      className="text-green-600 hover:text-green-900 p-1"
                      title="Publier"
                    >
                      <CheckCheck className="h-5 w-5" />
                    </button>
                  )}
                  
                  <Link
                    href={`/admin/comments/${comment.id}`}
                    className="text-blue-600 hover:text-blue-900 p-1"
                    title="Voir détails"
                  >
                    <Eye className="h-5 w-5" />
                  </Link>
                  
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-red-600 hover:text-red-900 p-1"
                    title="Supprimer"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredComments.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Aucun commentaire
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filter !== "all" 
                ? "Aucun commentaire ne correspond à vos critères de recherche." 
                : "Les commentaires apparaîtront ici une fois publiés par les visiteurs."
              }
            </p>
          </div>
        )}
      </div>

      {/* Pagination placeholder */}
      <div className="flex justify-center">
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
          <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            Précédent
          </button>
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
            1
          </button>
          <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            Suivant
          </button>
        </nav>
      </div>
    </div>
  );
}