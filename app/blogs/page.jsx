"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container/Container";
import Button from "@/components/Button/Button";
import UnifiedHero from "@/components/UnifiedHero/UnifiedHero";
import FeaturedPost from "@/components/FeaturedPost/FeaturedPost";
import ContentCard from "@/components/ContentCard/ContentCard";
import CategoryFilter from "@/components/CategoryFilter/CategoryFilter";
import ContentGrid from "@/components/ContentGrid/ContentGrid";
import BlogSidebar from "@/components/BlogSidebar/BlogSidebar";
import ShareButton from "@/components/ShareButton/ShareButton";
import Pagination from "@/components/Pagination/Pagination";
import { ChevronUp } from "lucide-react";

// Custom hooks
import { useBlogs } from "@/hooks/useBlogs.js";

// --- Design System Configuration (Minimalist Light Blue) ---
const ACCENT = "#6495ED"; // Cornflower Blue
const PRIMARY_LIGHT = "#B0E0E6"; // Powder Blue
const DARK_TEXT = "#333333"; // Dark Gray
const BACKGROUND = "#FAFAFA"; // Off-White

export default function Blogs({ searchParams }) {
  // Use custom hook for data fetching
  const { blogs: allBlogs, isLoading, isError } = useBlogs();
  
  // Scroll to top button state
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Unwrap searchParams in Client Component using React.use()
  const params = React.use(searchParams) || {};
  const category = params.category || null;
  const page = parseInt(params.page || "1", 10);
  const blogsPerPage = 6;

  // Transform blogs data for consistent format
  const transformedBlogs =
    allBlogs?.map((blog) => ({
      id: blog.id,
      title: blog.title,
      excerpt: blog.excerpt,
      image: blog.image || "/placeholder-blog.jpg",
      slug: blog.slug,
      category: blog.category,
      createdAt: new Date(blog.created_at).toISOString().split("T")[0],
    })) || [];

  // Filter blogs by category if a category is selected
  const filteredBlogs = category
    ? transformedBlogs.filter((blog) => blog.category === category)
    : transformedBlogs;

  // Paginate blogs
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const paginatedBlogs = filteredBlogs.slice(
    (page - 1) * blogsPerPage,
    page * blogsPerPage,
  );

  const categories = [
    ...new Set(transformedBlogs.map((blog) => blog.category)),
  ];

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main style={{ backgroundColor: BACKGROUND }} className="min-h-screen">
      {/* Header Section */}
        <UnifiedHero
          title="Récits d'Impact et Actualités"
          subtitle="Explorez les histoires d'espoir, les actualités et les avancées de la Fondation Assalam à travers le Maroc."
        />
  
        <Container className="py-12">
          {/* Main Layout: 2/3 content, 1/3 sidebar */}
          <div className="lg:flex lg:gap-12">
            {/* Main Content Area */}
            <div className="lg:w-2/3">
              <div className="relative">
                {/* Decorative background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl"></div>
  
                <div className="relative py-20 px-8 rounded-3xl border border-white/50">
                  <div className="text-center mb-12 scroll-reveal">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900 mb-4 border-b-4 border-blue-200 pb-4 animate-fade-in">
                      Récents Récits d'Impact
                    </h2>
                    <p className="max-w-2xl mx-auto animate-slide-in-left" style={{ color: DARK_TEXT }}>
                      Découvrez les histoires d'espoir, les actualités et les avancées
                      de la Fondation Assalam à travers le Maroc.
                    </p>
                  </div>
  
                  {/* Featured Post */}
                  {paginatedBlogs[0] && (
                    <div className="animate-scale-fade-in">
                      <FeaturedPost post={paginatedBlogs[0]} />
                    </div>
                  )}
  
                  {/* Categories */}
                  <div className="scroll-reveal">
                    <CategoryFilter
                      categories={categories}
                      activeCategory={category}
                      basePath="/blogs"
                    />
                  </div>
  
                  {/* All Posts */}
                  <section className="mt-16">
                    {paginatedBlogs.length > 1 && ( // Only show sub-grid if there are more than 1 post (to avoid featuring the same one twice)
                      <div className="grid md:grid-cols-2 gap-8">
                        {paginatedBlogs.slice(1).map((blog, index) => (
                          <div
                            key={blog.id}
                            className="animate-fade-in"
                            style={{ animationDelay: `${index * 0.2}s` }}
                          >
                            <ContentCard
                              title={blog.title}
                              excerpt={blog.excerpt}
                              image={blog.image}
                              link={`/blogs/${blog.slug}`}
                              category={blog.category}
                              date={blog.createdAt}
                              className="h-full"
                            />
                          </div>
                        ))}
                      </div>
                    )}
  
                    {paginatedBlogs.length === 0 && (
                      <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg mx-auto max-w-xl scroll-reveal">
                        <h3
                          className="text-2xl font-semibold mb-2"
                          style={{ color: ACCENT }}
                        >
                          Oups, rien ici.
                        </h3>
                        <p>
                          Aucun récit ne correspond à cette catégorie pour le moment.
                          Revenez bientôt !
                        </p>{" "}
                        {/* Enhanced Content */}
                      </div>
                    )}
  
                    {/* Load More Button */}
                    {totalPages > 1 && (
                      <div className="mt-12 text-center scroll-reveal">
                        <button
                          className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105 shadow-lg btn-hover"
                          onClick={() => {
                            // This would typically trigger loading more content
                            // For now, it's a placeholder for the load more functionality
                            console.log("Load more articles");
                          }}
                        >
                          Charger Plus d'Articles
                        </button>
                      </div>
                    )}
  
                    {/* Pagination */}
                    <div className="scroll-reveal">
                      <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        basePath="/blogs"
                        activeCategory={category}
                      />
                    </div>
                  </section>
                </div>
              </div>
            </div>
  
            {/* Sidebar - Sticky positioning */}
            <aside className="lg:w-1/3 mt-12 lg:mt-0 lg:sticky top-28 h-fit">
              <div className="animate-slide-in-right">
                <BlogSidebar
                  categories={categories}
                  activeCategory={category}
                  allBlogs={transformedBlogs}
                />
              </div>
            </aside>
          </div>
        </Container>
  
        {/* Loading Skeleton for better UX */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des récits d'impact...</p>
            </div>
          </div>
        )}
  
        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-110 z-40"
          >
            <ChevronUp className="w-6 h-6" />
          </button>
        )}
      </main>
    );
}
