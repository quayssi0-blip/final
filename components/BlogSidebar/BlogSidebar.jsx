import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Folder, Tag, Rss, Clock, TrendingUp } from "lucide-react";

const SidebarSection = ({ title, icon, children, className = "" }) => (
    <div className={`bg-white rounded-2xl shadow-lg p-6 mb-8 ${className}`}>
        <h3 className="flex items-center text-xl font-bold text-blue-900 mb-4">
            {icon}
            <span className="ml-3">{title}</span>
        </h3>
        {children}
    </div>
);

const BlogSidebar = ({ categories = [], activeCategory, allBlogs = [], tags = [], currentBlogSlug, currentBlogCategory }) => {
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

    // Get similar blogs based on category (excluding current blog)
    const similarBlogs = allBlogs?.filter(blog =>
        blog.category === currentBlogCategory && blog.slug !== currentBlogSlug
    ).slice(0, 4) || [];

    // Get trending/popular blogs (simplified: sort by id or add view count later)
    const trendingBlogs = allBlogs?.sort((a, b) => b.id - a.id).slice(0, 4) || [];

    return (
        <div>
            {/* Similar Blogs Section */}
            {similarBlogs.length > 0 && (
                <SidebarSection
                    title="Articles similaires"
                    icon={<TrendingUp className="w-5 h-5" />}
                >
                    <div className="space-y-4">
                        {similarBlogs.map(blog => (
                            <Link
                                key={blog.id}
                                href={`/blogs/${blog.slug}`}
                                className="group block"
                            >
                                <div className="flex gap-3">
                                    {blog.image && (
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                            <Image
                                                src={blog.image}
                                                alt={blog.title}
                                                width={64}
                                                height={64}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                            />
                                        </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                            {blog.title}
                                        </h4>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {blog.created_at && new Date(blog.created_at).toLocaleDateString('fr-FR', {
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </SidebarSection>
            )}

            {/* Trending Blogs Section */}
            {trendingBlogs.length > 0 && (
                <SidebarSection
                    title="Tendances"
                    icon={<Clock className="w-5 h-5" />}
                >
                    <div className="space-y-3">
                        {trendingBlogs.slice(0, 5).map(blog => (
                            <Link
                                key={blog.id}
                                href={`/blogs/${blog.slug}`}
                                className="group flex items-start gap-3"
                            >
                                <span className="text-sm font-bold text-gray-400 mt-0.5 flex-shrink-0">
                                    {trendingBlogs.indexOf(blog) + 1}
                                </span>
                                <div className="min-w-0 flex-1">
                                    <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                        {blog.title}
                                    </h4>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {blog.category}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </SidebarSection>
            )}

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