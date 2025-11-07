"use client";

/**
 * Composant badge de statut réutilisable
 * @param {Object} props - Propriétés du composant
 * @param {string} props.status - Le statut à afficher
 * @param {string} props.type - Le type de statut ('status', 'role', 'message', etc.)
 * @param {string} props.size - Taille du badge ('sm', 'md', 'lg') - optionnel
 * @param {string} props.className - Classes CSS additionnelles - optionnel
 */
export default function StatusBadge({
  status,
  type = "status",
  size = "sm",
  className = "",
}) {
  // Fonction interne pour obtenir les couleurs selon le type
  const getBadgeClasses = (status, type) => {
    const baseClasses = "inline-flex font-semibold rounded-full";
    const sizeClasses = {
      sm: "px-2 py-1 text-xs",
      md: "px-3 py-1.5 text-sm",
      lg: "px-4 py-2 text-base",
    };

    let statusClasses = "";

    // Gestion des couleurs selon le type
    switch (type) {
      case "role":
        switch (status) {
          case "super_admin":
            statusClasses = "bg-red-100 text-red-800";
            break;
          case "content_manager":
            statusClasses = "bg-blue-100 text-blue-800";
            break;
          case "message_manager":
            statusClasses = "bg-green-100 text-green-800";
            break;
          case "admin":
            statusClasses = "bg-purple-100 text-purple-800";
            break;
          default:
            statusClasses = "bg-gray-100 text-gray-800";
        }
        break;

      case "status":
        switch (status) {
          case "published":
            statusClasses = "bg-green-100 text-green-800";
            break;
          case "draft":
            statusClasses = "bg-yellow-100 text-yellow-800";
            break;
          case "archived":
            statusClasses = "bg-gray-100 text-gray-800";
            break;
          case "active":
            statusClasses = "bg-green-100 text-green-800";
            break;
          case "inactive":
            statusClasses = "bg-red-100 text-red-800";
            break;
          case "pending":
            statusClasses = "bg-yellow-100 text-yellow-800";
            break;
          default:
            statusClasses = "bg-gray-100 text-gray-800";
        }
        break;

      case "message":
        switch (status) {
          case "read":
            statusClasses = "bg-green-100 text-green-800";
            break;
          case "unread":
            statusClasses = "bg-blue-100 text-blue-800";
            break;
          case "replied":
            statusClasses = "bg-purple-100 text-purple-800";
            break;
          case "archived":
            statusClasses = "bg-gray-100 text-gray-800";
            break;
          default:
            statusClasses = "bg-gray-100 text-gray-800";
        }
        break;

      case "project":
        switch (status) {
          case "completed":
            statusClasses = "bg-green-100 text-green-800";
            break;
          case "in_progress":
            statusClasses = "bg-blue-100 text-blue-800";
            break;
          case "planning":
            statusClasses = "bg-yellow-100 text-yellow-800";
            break;
          case "on_hold":
            statusClasses = "bg-orange-100 text-orange-800";
            break;
          default:
            statusClasses = "bg-gray-100 text-gray-800";
        }
        break;

      default:
        // Comportement par défaut pour les statuts génériques
        switch (status) {
          case "published":
          case "active":
          case "completed":
          case "read":
            statusClasses = "bg-green-100 text-green-800";
            break;
          case "draft":
          case "pending":
          case "in_progress":
            statusClasses = "bg-yellow-100 text-yellow-800";
            break;
          case "inactive":
          case "archived":
          case "on_hold":
            statusClasses = "bg-gray-100 text-gray-800";
            break;
          default:
            statusClasses = "bg-gray-100 text-gray-800";
        }
    }

    return `${baseClasses} ${sizeClasses[size]} ${statusClasses} ${className}`.trim();
  };

  // Fonction pour formater l'affichage du statut
  const formatStatus = (status) => {
    return status
      .replace(/_/g, " ") // Remplace les underscores par des espaces
      .replace(/\b\w/g, (l) => l.toUpperCase()); // Première lettre en majuscule
  };

  return (
    <span className={getBadgeClasses(status, type)}>
      {formatStatus(status)}
    </span>
  );
}
