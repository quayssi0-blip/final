import {
  Newspaper,
  FolderOpen,
  Mail,
  Eye,
  Users,
  CheckCircle,
  FileText,
  TrendingUp,
  MessageSquare,
} from "lucide-react";

const AdminStatsCard = ({ title, value, type }) => {
  let Icon = Mail;

  switch (type) {
    case "articles":
      Icon = Newspaper;
      break;
    case "projects":
      Icon = FolderOpen;
      break;
    case "messages":
    case "total":
      Icon = Mail;
      break;
    case "views":
      Icon = Eye;
      break;
    case "admins":
      Icon = Users;
      break;
    case "unread":
      Icon = MessageSquare;
      break;
    case "read":
      Icon = CheckCircle;
      break;
    case "blogs":
      Icon = FileText;
      break;
    default:
      Icon = TrendingUp;
  }

  return (
    <div className="admin-card p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-blue-300">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="admin-heading-3 mb-2 text-blue-600">{value}</p>
          <h3 className="admin-body-small font-semibold text-gray-700 uppercase tracking-wide">
            {title}
          </h3>
        </div>
        <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 bg-blue-100 rounded-lg">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
      </div>
    </div>
  );
};

export default AdminStatsCard;
