"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container/Container";
import Button from "@/components/Button/Button";
import UnifiedHero from "@/components/UnifiedHero/UnifiedHero";
import FeaturedPost from "@/components/FeaturedPost/FeaturedPost";
import ContentCard from "@/components/ContentCard/ContentCard";
import CategoryFilter from "@/components/CategoryFilter/CategoryFilter";
import ContentGrid from "@/components/ContentGrid/ContentGrid";
import ShareButton from "@/components/ShareButton/ShareButton";
import Pagination from "@/components/Pagination/Pagination";

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

  return (
    <main style={{ backgroundColor: BACKGROUND }} className="space-y-16">
      {/* Header Section */}
      <UnifiedHero
        title="Récits d'Impact et Actualités"
        subtitle="Explorez les histoires d'espoir, les actualités et les avancées de la Fondation Assalam à travers le Maroc."
      />

      <Container className="py-16 px-6 space-y-16">
        {/* Main Blogs Section */}
        <div className="relative">
          {/* Decorative background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl"></div>

          <div className="relative py-20 px-8 rounded-3xl border border-white/50">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold mb-4" style={{ color: ACCENT }}>
                Récits d'Impact et Actualités
              </h2>
              <p className="max-w-2xl mx-auto" style={{ color: DARK_TEXT }}>
                Découvrez les histoires d'espoir, les actualités et les avancées
                de la Fondation Assalam à travers le Maroc.
              </p>
            </div>

            {/* Featured Post */}
            {paginatedBlogs[0] && <FeaturedPost post={paginatedBlogs[0]} />}

            {/* Categories */}
            <CategoryFilter
              categories={categories}
              activeCategory={category}
              basePath="/blogs"
            />

            {/* All Posts */}
            <section className="mt-16">
              {paginatedBlogs.length > 1 && ( // Only show sub-grid if there are more than 1 post (to avoid featuring the same one twice)
                <ContentGrid
                  // Use slice(1) to skip the featured post if it was the first one on the page
                  items={paginatedBlogs.slice(1)}
                  columns={{ default: 1, md: 2, lg: 3 }}
                  renderItem={(blog, index) => (
                    <div
                      key={blog.id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
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
                  )}
                />
              )}

              {paginatedBlogs.length === 0 && (
                <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg mx-auto max-w-xl">
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

              {/* Pagination */}
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                basePath="/blogs"
                activeCategory={category}
              />
            </section>
          </div>
        </div>
      </Container>
    </main>
  );
}
