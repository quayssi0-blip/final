"use client";

import { useEffect, useState } from "react";
import AdminStatsCard from "@/components/AdminStatsCard/AdminStatsCard";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import Alert from "@/components/Alert/Alert";
import { MessageCircle, FileText, FolderOpen, User } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    articles: 0,
    projects: 0,
    messages: 0,
    admins: 0,
    totalViews: 0,
    unreadMessages: 0,
    readMessages: 0,
  });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Récupérer les statistiques
        const statsResponse = await fetch("/api/dashboard/stats");
        if (!statsResponse.ok) {
          throw new Error(
            `Erreur lors de la récupération des statistiques: ${statsResponse.status}`,
          );
        }
        const statsData = await statsResponse.json();
        setStats(statsData);

        // Récupérer l'activité récente
        const activityResponse = await fetch("/api/dashboard/activity");
        if (activityResponse.ok) {
          const activityData = await activityResponse.json();
          setActivities(activityData.activities || []);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError(
          err.message ||
            "Une erreur est survenue lors du chargement des données",
        );

        // Garder les valeurs par défaut en cas d'erreur
        setStats({
          articles: 0,
          projects: 0,
          messages: 0,
          admins: 0,
          totalViews: 0,
          unreadMessages: 0,
          readMessages: 0,
        });
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fonction pour formater le temps relatif
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
      return "À l'instant";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    }
  };

  // Fonction pour obtenir l'icône selon le type
  const getActivityIcon = (type, color) => {
    const iconClass = `h-5 w-5 ${color === 'blue' ? 'text-blue-600' : color === 'green' ? 'text-green-600' : color === 'yellow' ? 'text-yellow-600' : 'text-gray-600'}`;
    
    switch (type) {
      case 'message':
        return <MessageCircle className={iconClass} />;
      case 'project':
        return <FolderOpen className={iconClass} />;
      case 'article':
        return <FileText className={iconClass} />;
      default:
        return <User className={iconClass} />;
    }
  };

  // Fonction pour obtenir la couleur du badge selon le statut
  const getStatusColor = (status) => {
    switch (status) {
      case 'unread':
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'read':
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'replied':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Affichage de l'erreur */}
      {error && <Alert type="error" message={`Erreur: ${error}`} />}

      {/* Affichage du chargement */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner />
          <span className="ml-3 text-gray-600">
            Chargement des statistiques...
          </span>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <AdminStatsCard
              title="Articles"
              value={stats.articles}
              type="articles"
            />
            <AdminStatsCard
              title="Projets"
              value={stats.projects}
              type="projects"
            />
            <AdminStatsCard
              title="Messages"
              value={stats.messages}
              type="messages"
            />
            <AdminStatsCard title="Administrateurs" value={stats.admins} type="admins" />
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            <AdminStatsCard
              title="Vues Totales"
              value={stats.totalViews}
              type="views"
            />
            <AdminStatsCard
              title="Messages Non Lus"
              value={stats.unreadMessages}
              type="unread"
            />
            <AdminStatsCard
              title="Messages Lus"
              value={stats.readMessages}
              type="read"
            />
          </div>

          {/* Recent Activity Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Activité Récente
            </h2>
            <div className="space-y-3">
              {activities.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Aucune activité récente</p>
                </div>
              ) : (
                activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0"
                  >
                    <div className="flex items-center space-x-3">
                      {getActivityIcon(activity.type, activity.color)}
                      <div>
                        <p className="font-medium text-gray-900">
                          {activity.title}
                        </p>
                        <p className="text-sm text-gray-600">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {getTimeAgo(activity.time)}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                        activity.status,
                      )}`}
                    >
                      {activity.status === 'unread' && 'Nouveau'}
                      {activity.status === 'read' && 'Lu'}
                      {activity.status === 'replied' && 'Répondu'}
                      {activity.status === 'published' && 'Publié'}
                      {activity.status === 'draft' && 'Brouillon'}
                      {activity.status && !['unread', 'read', 'replied', 'published', 'draft'].includes(activity.status) && activity.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
