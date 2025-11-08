"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2, Check, X, CheckCheck, Edit, ExternalLink } from "lucide-react";
import { useComments } from "../../../../hooks/useComments";

export default function CommentDetailPage({ params }) {
  const router = useRouter();
  const { id } = params;
  const { 
    data: allComments, 
    isLoading, 
    isError, 
    deleteComment, 
    approveComment, 
    publishComment 
  } = useComments();
  
  const [comment, setComment] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    if (allComments && allComments.length > 0) {
      const foundComment = allComments.find(c => c.id === id);
      setComment(foundComment || null);
    }
  }, [allComments, id]);

  const handleDelete = async () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ? Cette action est irréversible.")) {
      setIsDeleting(true);
      try {
        await deleteComment(id);
        router.push('/admin/comments');
      } catch (error) {
        console.error('Error deleting comment:', error);
        alert('Erreur lors de la suppression du commentaire');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      await approveComment(id);
      setComment(prev => prev ? { ...prev, is_approved: true } : null);
    } catch (error) {
      console.error('Error approving comment:', error);
      alert('Erreur lors de l\'approbation du commentaire');
    } finally {
      setIsApproving(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await publishComment(id);
      setComment(prev => prev ? { ...prev, is_published: true } : null);
    } catch (error) {
      console.error('Error publishing comment:', error);
      alert('Erreur lors de la publication du commentaire');
    } finally {
      setIsPublishing(false);
    }
  };

  const getStatusBadge = (comment) => {
    if (comment.is_published) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <CheckCheck className="w-4 h-4 mr-1" />
          Publié
        </span>
      );
    } else if (comment.is_approved) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          <Check className="w-4 h-4 mr-1" />
          Approuvé
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
          <X className="w-4 h-4 mr-1" />
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
          <p className="text-red-600">Erreur lors du chargement du commentaire.</p>
        </div>
      </div>
    );
  }

  if (!comment) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-600">Commentaire non trouvé.</p>
          <Link href="/admin/comments" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
            Retour à la liste
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/comments"
            className="text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Détail du Commentaire</h1>
            <p className="text-gray-600">ID: {comment.id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {getStatusBadge(comment)}
        </div>
      </div>

      {/* Comment Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Comment Text */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Message</h2>
            <div className="prose max-w-none">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {comment.message}
              </p>
            </div>
          </div>

          {/* Blog Reference */}
          {comment.blogs && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Article associé</h2>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{comment.blogs.title}</h3>
                  <p className="text-sm text-gray-500">Slug: {comment.blogs.slug}</p>
                </div>
                <Link
                  href={`/blogs/${comment.blogs.slug}`}
                  target="_blank"
                  className="text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Voir l'article
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Comment Info */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Nom</label>
                <p className="text-gray-900">{comment.name}</p>
              </div>
              {comment.email && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{comment.email}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-500">Créé le</label>
                <p className="text-gray-900">
                  {new Date(comment.created_at).toLocaleString('fr-FR')}
                </p>
              </div>
              {comment.updated_at !== comment.created_at && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Modifié le</label>
                  <p className="text-gray-900">
                    {new Date(comment.updated_at).toLocaleString('fr-FR')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
            <div className="space-y-3">
              {!comment.is_approved && (
                <button
                  onClick={handleApprove}
                  disabled={isApproving}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <Check className="h-4 w-4 mr-2" />
                  {isApproving ? 'Approbation...' : 'Approuver'}
                </button>
              )}

              {comment.is_approved && !comment.is_published && (
                <button
                  onClick={handlePublish}
                  disabled={isPublishing}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  <CheckCheck className="h-4 w-4 mr-2" />
                  {isPublishing ? 'Publication...' : 'Publier'}
                </button>
              )}

              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Statut</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Commentaire créé</span>
              </div>
              {comment.is_approved && (
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Approuvé par l'administrateur</span>
                </div>
              )}
              {comment.is_published && (
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  <span className="text-sm text-gray-600">Publié et visible</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}