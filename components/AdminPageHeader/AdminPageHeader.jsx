import Link from "next/link";
import { Home } from "lucide-react";

const AdminPageHeader = ({ title, subtitle, actionButton }) => (
  <div className="flex justify-between items-center mb-10 scroll-reveal">
    <div>
      <h1 className="text-4xl font-bold mb-1" style={{ color: "#333333" }}>
        {title}
      </h1>
      <p className="text-lg text-gray-600">{subtitle}</p>
    </div>
    <div className="flex items-center space-x-4">
      {actionButton}
      <Link
        href="/"
        className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200 font-medium"
      >
        <Home className="h-5 w-5 mr-2" />
        Retour à l'accueil
      </Link>
    </div>
  </div>
);

export default AdminPageHeader;
