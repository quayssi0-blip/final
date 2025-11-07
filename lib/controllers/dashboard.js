import supabaseServer from "../supabaseServer";

export class DashboardController {
  static async getStats() {
    try {
      // Récupérer le nombre d'articles/blogs
      const { count: articlesCount, error: articlesError } =
        await supabaseServer
          .from("blog_posts")
          .select("*", { count: "exact", head: true });

      if (articlesError) {
        console.error("Error fetching articles count:", articlesError);
      }

      // Récupérer le nombre de projets
      const { count: projectsCount, error: projectsError } =
        await supabaseServer
          .from("projects")
          .select("*", { count: "exact", head: true });

      if (projectsError) {
        console.error("Error fetching projects count:", projectsError);
      }

      // Récupérer le nombre de messages
      const { count: messagesCount, error: messagesError } =
        await supabaseServer
          .from("messages")
          .select("*", { count: "exact", head: true });

      if (messagesError) {
        console.error("Error fetching messages count:", messagesError);
      }

      // Récupérer le nombre d'admins
      const { count: adminsCount, error: adminsError } = await supabaseServer
        .from("admins")
        .select("*", { count: "exact", head: true });

      if (adminsError) {
        console.error("Error fetching admins count:", adminsError);
      }

      // Récupérer le total des vues (somme des vues de tous les articles)
      const { data: viewsData, error: viewsError } = await supabaseServer
        .from("blog_posts")
        .select("views");

      let totalViews = 0;
      if (viewsData && !viewsError) {
        totalViews = viewsData.reduce(
          (sum, article) => sum + (article.views || 0),
          0,
        );
      }

      // Récupérer les messages non lus
      const { count: unreadMessagesCount, error: unreadError } =
        await supabaseServer
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("status", "unread");

      if (unreadError) {
        console.error("Error fetching unread messages count:", unreadError);
      }

      // Récupérer les messages lus
      const { count: readMessagesCount, error: readError } =
        await supabaseServer
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("status", "read");

      if (readError) {
        console.error("Error fetching read messages count:", readError);
      }

      return {
        articles: articlesCount || 0,
        projects: projectsCount || 0,
        messages: messagesCount || 0,
        admins: adminsCount || 0,
        totalViews: totalViews,
        unreadMessages: unreadMessagesCount || 0,
        readMessages: readMessagesCount || 0,
      };
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw new Error("Failed to fetch dashboard statistics");
    }
  }

  static async getRecentActivity() {
    try {
      const activities = [];

      // Récupérer les 3 derniers messages
      const { data: recentMessages, error: messagesError } = await supabaseServer
        .from("messages")
        .select("id, first_name, last_name, email, message, type, status, created_at")
        .order("created_at", { ascending: false })
        .limit(3);

      if (!messagesError && recentMessages) {
        recentMessages.forEach((message) => {
          const fullName = `${message.first_name || ''} ${message.last_name || ''}`.trim();
          activities.push({
            id: `message-${message.id}`,
            type: 'message',
            title: `Nouveau message reçu de ${fullName}`,
            description: message.message?.substring(0, 100) + (message.message?.length > 100 ? '...' : ''),
            status: message.status,
            time: message.created_at,
            icon: 'message',
            color: message.status === 'unread' ? 'blue' : 'gray'
          });
        });
      }

      // Récupérer les 3 derniers projets
      const { data: recentProjects, error: projectsError } = await supabaseServer
        .from("projects")
        .select("id, title, slug, status, created_at, updated_at")
        .order("updated_at", { ascending: false })
        .limit(3);

      if (!projectsError && recentProjects) {
        recentProjects.forEach((project) => {
          activities.push({
            id: `project-${project.id}`,
            type: 'project',
            title: `Projet ${project.title}`,
            description: `Statut: ${project.status}`,
            status: project.status,
            time: project.updated_at || project.created_at,
            icon: 'project',
            color: project.status === 'published' ? 'green' : 'yellow'
          });
        });
      }

      // Récupérer les 3 derniers articles
      const { data: recentArticles, error: articlesError } = await supabaseServer
        .from("blog_posts")
        .select("id, title, slug, published, created_at, updated_at")
        .order("updated_at", { ascending: false })
        .limit(3);

      if (!articlesError && recentArticles) {
        recentArticles.forEach((article) => {
          activities.push({
            id: `article-${article.id}`,
            type: 'article',
            title: `Article ${article.title}`,
            description: article.published ? 'Publié' : 'Brouillon',
            status: article.published ? 'published' : 'draft',
            time: article.updated_at || article.created_at,
            icon: 'article',
            color: article.published ? 'green' : 'gray'
          });
        });
      }

      // Trier toutes les activités par date (plus récent en premier)
      activities.sort((a, b) => new Date(b.time) - new Date(a.time));

      // Retourner les 6 activités les plus récentes
      return activities.slice(0, 6);
    } catch (error) {
      console.error("Error fetching recent activity:", error);
      return [];
    }
  }
}
