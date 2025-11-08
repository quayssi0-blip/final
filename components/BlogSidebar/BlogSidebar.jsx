import React from "react";
import Link from "next/link";
import { Mail, Folder, Tag, Rss } from "lucide-react";

const SidebarSection = ({ title, icon, children, className = "" }) => (
    <div className={`bg-white rounded-2xl shadow-lg p-6 mb-8 ${className}`}>
        <h3 className="flex items-center text-xl font-bold text-blue-900 mb-4">
            {icon}
            <span className="ml-3">{title}</span>
        </h3>
        {children}
    </div>
);

const BlogSidebar = ({ categories = [], activeCategory, allBlogs = [], tags = [] }) => {
    // Default tags - in real app this would come from props
    const defaultTags = [
        'Solidarité', 'Éducation', 'Santé', 'Environnement',
        'Maroc', 'Communauté', 'Enfants', 'Développement', 'Innovation', 'Esperance'
    ];

    // Calculate real counts from actual blog data
    const calculateCategoryCounts = (blogs) => {
        const categoryCounts = {};
        blogs.forEach(blog => {
            if (blog.category) {
                categoryCounts[blog.category] = (categoryCounts[blog.category] || 0) + 1;
            }
        });
        return Object.entries(categoryCounts).map(([name, count]) => ({ name, count }));
    };

    // Use real data if blogs are available, otherwise show default categories
    const realCategoryCounts = allBlogs.length > 0 ? calculateCategoryCounts(allBlogs) : [
        { name: 'Impact Social', count: 0 },
        { name: 'Éducation', count: 0 },
        { name: 'Santé', count: 0 },
        { name: 'Environnement', count: 0 },
        { name: 'Développement Communautaire', count: 0 },
        { name: 'Success Stories', count: 0 }
    ];

    const displayCategories = categories.length > 0 ? categories.map(cat => ({
        name: cat,
        count: realCategoryCounts.find(rc => rc.name === cat)?.count || 0
    })) : realCategoryCounts;

    return (
        <div>
            {/* Newsletter Section - Inspired by the blue section in the inspiration */}
            <div className="bg-blue-600 rounded-2xl shadow-lg p-6 mb-8 text-white">
                <h3 className="flex items-center text-xl font-bold mb-4">
                    <Mail className="w-5 h-5" />
                    <span className="ml-3">Newsletter</span>
                </h3>
                <p className="text-blue-100 mb-4">
                    Restez informé de nos dernières actions et histoires d'impact.
                </p>
                <form className="flex flex-col space-y-3">
                    <input
                        type="email"
                        placeholder="votre.email@example.com"
                        className="w-full px-4 py-2 rounded-md border-0 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-300"
                    />
                    <button
                        type="submit"
                        className="w-full bg-white text-blue-600 font-bold py-2 px-4 rounded-md hover:bg-blue-50 transition-colors duration-200"
                    >
                        S'abonner
                    </button>
                </form>
            </div>

            {/* Categories Section */}
            <SidebarSection
                title="Catégories"
                icon={<Folder className="w-5 h-5" />}
            >
                <ul className="space-y-2">
                    {displayCategories.map(category => {
                        const isActive = category.name === activeCategory;
                        return (
                            <li key={category.name}>
                                <Link
                                    href={`/blogs?category=${encodeURIComponent(category.name)}`}
                                    className={`flex justify-between items-center transition-colors duration-200 ${
                                        isActive
                                            ? 'text-blue-600 font-bold'
                                            : 'text-slate-600 hover:text-blue-600 font-medium'
                                    }`}
                                >
                                    <span>{category.name}</span>
                                    <span className="text-xs bg-slate-100 text-slate-500 rounded-full px-2 py-0.5">
                                        {category.count}
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </SidebarSection>
            
            {/* Tags Section */}
            <SidebarSection
                title="Mots-clés"
                icon={<Tag className="w-5 h-5" />}
            >
                <div className="flex flex-wrap gap-2">
                    {defaultTags.map(tag => (
                        <Link
                            key={tag}
                            href={`/blogs?tag=${encodeURIComponent(tag)}`}
                            className="text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 font-semibold px-3 py-1 rounded-full transition-colors duration-200"
                        >
                            #{tag}
                        </Link>
                    ))}
                </div>
            </SidebarSection>
        </div>
    );
};

export default BlogSidebar;