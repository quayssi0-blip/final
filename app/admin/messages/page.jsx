"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Trash2, Search, Mail } from "lucide-react";
import { useMessages } from "../../../hooks/useMessages";
import AdminTable from "@/components/AdminTable/AdminTable";
import AdminBadge from "@/components/AdminBadge/AdminBadge";
import AdminCard from "@/components/AdminCard/AdminCard";
import AdminInput from "@/components/AdminInput/AdminInput";
import AdminButton from "@/components/AdminButton/AdminButton";

export default function MessagesPage() {
  const { messages, isLoading, isError, deleteMessage } = useMessages();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // Messages per page

  const filteredMessages = messages?.filter(
    (message) => {
      const fullName = `${message.first_name || ''} ${message.last_name || ''}`.trim();
      return (
        fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.message?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    },
  ) || [];

  // Pagination logic
  const totalMessages = filteredMessages.length;
  const totalPages = Math.ceil(totalMessages / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedMessages = filteredMessages.slice(startIndex, startIndex + pageSize);

  // Reset to page 1 when search changes
  useState(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleDelete = async (id) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) {
      await deleteMessage(id);
    }
  };

  const markAsRead = async (id) => {
    // Mark as read functionality would be handled by updateMessage if needed
    // For now, keeping the UI functionality
  };

  if (isLoading) {
    return (
      <AdminCard className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-[var(--admin-text-muted)]">Chargement des messages...</p>
        </div>
      </AdminCard>
    );
  }

  if (isError) {
    return (
      <AdminCard className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erreur lors du chargement des messages</p>
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
            <h1 className="text-3xl font-bold text-[var(--admin-text-primary)] mb-2">Gestion des Messages</h1>
            <p className="text-[var(--admin-text-muted)] text-lg">Gérez les soumissions de formulaires de contact et les demandes</p>
          </div>
        </div>
      </AdminCard>

      {/* Search and Filter Section */}
      <AdminCard>
        <div className="search-filter-section">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <AdminInput
              type="text"
              placeholder="Rechercher dans les messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="filter-buttons flex space-x-3 mt-4">
            <AdminButton variant="secondary" size="sm">
              Tous les messages
            </AdminButton>
            <AdminButton variant="secondary" size="sm">
              Non lus
            </AdminButton>
            <AdminButton variant="secondary" size="sm">
              Lus
            </AdminButton>
          </div>
        </div>
      </AdminCard>

      {/* Messages List */}
      <AdminTable
        columns={[
          {
            key: 'subject',
            label: 'Sujet',
            render: (value, message) => (
              <div>
                <p className={`font-medium truncate ${message.status === "unread" ? "text-[var(--admin-text-primary)]" : "text-[var(--admin-text-secondary)]"}`}>
                  {value || message.message?.substring(0, 100)}{message.message?.length > 100 ? '...' : ''}
                </p>
                <p className="text-sm text-[var(--admin-text-muted)] truncate">
                  De: {`${message.first_name || ''} ${message.last_name || ''}`.trim()} ({message.email})
                </p>
                <p className="text-xs text-[var(--admin-text-muted)]">
                  {new Date(message.created_at).toLocaleString()}
                </p>
              </div>
            )
          },
          {
            key: 'type',
            label: 'Type',
            render: (value) => <span className="text-[var(--admin-text-muted)]">{value}</span>
          },
          {
            key: 'status',
            label: 'Statut',
            render: (value) => {
              if (value === "unread") {
                return <AdminBadge variant="info">Nouveau</AdminBadge>;
              }
              return <AdminBadge variant="success">Lu</AdminBadge>;
            }
          }
        ]}
        data={paginatedMessages}
        renderActions={(message) => (
          <div className="flex justify-end space-x-2">
            <Link
              href={`/admin/messages/${message.id}`}
              onClick={() => markAsRead(message.id)}
              className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <Eye className="h-5 w-5" />
            </Link>
            <AdminButton
              variant="danger"
              size="sm"
              onClick={() => handleDelete(message.id)}
              className="p-2"
            >
              <Trash2 className="h-4 w-4" />
            </AdminButton>
          </div>
        )}
        loading={isLoading}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <AdminCard className="mt-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-[var(--admin-text-secondary)]">
              Affichage de {startIndex + 1} à {Math.min(startIndex + pageSize, totalMessages)} sur {totalMessages} messages
            </div>
            <div className="flex justify-center">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <AdminButton
                  variant="secondary"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="rounded-l-md px-3 py-2"
                >
                  Précédent
                </AdminButton>
                {/* Page numbers */}
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <AdminButton
                      key={pageNum}
                      variant={currentPage === pageNum ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="px-4 py-2 border-l-0 border-r-0"
                    >
                      {pageNum}
                    </AdminButton>
                  );
                })}
                <AdminButton
                  variant="secondary"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="rounded-r-md px-3 py-2 border-l-0"
                >
                  Suivant
                </AdminButton>
              </nav>
            </div>
          </div>
        </AdminCard>
      )}
    </div>
  );
}
