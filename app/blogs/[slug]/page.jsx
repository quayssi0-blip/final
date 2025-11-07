"use client";

import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// Custom hooks
import { useBlogs } from "@/hooks/useBlogs.js";
import {
  Calendar,
  Clock,
  User,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Tag,
} from "lucide-react";
import Container from "@/components/Container/Container";
import Button from "@/components/Button/Button";
import UnifiedHero from "@/components/UnifiedHero";
import ContentCard from "@/components/ContentCard/ContentCard";
import ShareButton from "@/components/ShareButton/ShareButton";

// --- Design System Configuration (Minimalist Light Blue) ---
const ACCENT = "#6495ED"; // Cornflower Blue
const PRIMARY_LIGHT = "#B0E0E6"; // Powder Blue
const DARK_TEXT = "#333333"; // Dark Gray
const BACKGROUND = "#FAFAFA"; // Off-White

export default function BlogPost({ params }) {
  const { slug } = params;
  const { blogs: allBlogs, isLoading, isError } = useBlogs();

  // Find blog by slug
  const blog = allBlogs?.find((b) => b.slug === slug);

  if (!isLoading && !blog) {
    notFound();
  }

  if (isLoading) {
    return (
      <main
        style={{ backgroundColor: "#FAFAFA" }}
        className="min-h-screen flex items-center justify-center"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Chargement de l'article...</p>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main
        style={{ backgroundColor: "#FAFAFA" }}
        className="min-h-screen flex items-center justify-center"
      >
        <div className="text-center">
          <p className="text-red-600 mb-4">
            Erreur lors du chargement de l'article
          </p>
          <Link href="/blogs" className="text-blue-600 hover:underline">
            Retour aux articles
          </Link>
        </div>
      </main>
    );
  }

  // Get related blogs (same category, excluding current blog)
  const relatedBlogs =
    allBlogs
      ?.filter((b) => b.category === blog.category && b.slug !== slug)
      .slice(0, 2) || [];

  return (
    <main style={{ backgroundColor: BACKGROUND }}>
      <Container className="py-16">
        <article>
          {/* Hero Section - Uses UnifiedHero */}
          <UnifiedHero
            title={blog.title}
            subtitle={blog.excerpt}
            images={[
              blog.image || "/projects/foundation1.jpg",
              "/projects/foundation2.jpg",
              "/projects/foundation3.jpg",
            ]}
          />

          {/* Featured Image */}
          <div className="h-96 relative rounded-xl overflow-hidden mb-12 shadow-2xl">
            <Image
              src={blog.image || `/placeholder.svg?height=800&width=1200`}
              alt={blog.title}
              fill
              sizes="(max-width: 768px) 100vw, 80vw"
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div className="grid md:grid-cols-4 gap-12">
            {/* Left Sidebar - Share & Categories */}
            <div className="hidden md:block">
              <div className="sticky top-12 space-y-8">
                <div>
                  <h4
                    className="text-lg font-semibold mb-4"
                    style={{ color: ACCENT }}
                  >
                    Partager ce Récit de Solidarité
                  </h4>{" "}
                  {/* Enhanced Content */}
                  <div className="flex flex-col gap-3">
                    <ShareButton
                      platform="facebook"
                      slug={slug}
                      title={blog.title}
                    />
                    <ShareButton
                      platform="twitter"
                      slug={slug}
                      title={blog.title}
                      excerpt={blog.excerpt}
                    />
                    <ShareButton platform="linkedin" slug={slug} />
                    <ShareButton platform="instagram" slug={slug} />
                  </div>
                </div>

                <div>
                  <h4
                    className="text-lg font-semibold mb-4"
                    style={{ color: ACCENT }}
                  >
                    Domaines d'Action
                  </h4>{" "}
                  {/* Enhanced Content */}
                  <div className="flex flex-col gap-2">
                    {[
                      "Éducation",
                      "Santé",
                      "Environnement",
                      "Culture",
                      "Solidarité",
                    ].map((cat, idx) => (
                      <Link
                        key={idx}
                        href={`/blogs?category=${cat}`}
                        className="hover:underline transition-colors"
                        style={{ color: DARK_TEXT }}
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              {/* Main Content */}
              <div className="md:col-span-2">
                <div className="bg-white rounded-xl shadow-2xl p-8 border border-gray-100 relative overflow-hidden card-lift">
                  <div className="relative z-10">
                    {/* Blog content styles - Moved to globals.css */}
                    <div
                      className="blog-content mb-6 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: blog.content?.replace(
                          /<p>/g,
                          '<p class="mb-6">',
                        ),
                      }}
                    />
                  </div>
                  {/* Tags */}
                  {blog.tags && (
                    <div className="mt-12 flex flex-wrap gap-2">
                      {blog.tags.split(",").map((tag, idx) => (
                        <Link
                          key={idx}
                          href={`/blogs?tag=${tag.trim()}`}
                          className="hover:opacity-80 transition-colors px-3 py-1 rounded-md text-sm"
                          style={{
                            backgroundColor: PRIMARY_LIGHT,
                            color: DARK_TEXT,
                          }}
                        >
                          <Tag
                            className="inline w-3 h-3 mr-1"
                            style={{ color: ACCENT }}
                          />
                          {tag.trim()}
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Author Info - Refactored for inline colors */}
                  {blog.author && (
                    <div
                      className="mt-12 p-6 rounded-xl shadow-md"
                      style={{
                        backgroundColor: PRIMARY_LIGHT,
                        borderLeft: `4px solid ${ACCENT}`,
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden relative shadow-inner">
                          <Image
                            src={
                              blog.author.avatar ||
                              `/placeholder.svg?height=100&width=100`
                            }
                            alt={blog.author.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3
                            className="font-bold text-lg"
                            style={{ color: DARK_TEXT }}
                          >
                            {blog.author.name}
                          </h3>
                          <p className="text-sm" style={{ color: ACCENT }}>
                            {blog.author.role}
                          </p>
                        </div>
                      </div>
                      <p
                        className="mt-4 text-sm"
                        style={{ color: `${DARK_TEXT}D9` }}
                      >
                        {blog.author.bio}
                      </p>
                    </div>
                  )}

                  {/* Mobile Share - Refactored for inline colors */}
                  <div className="mt-12 md:hidden">
                    <h4
                      className="text-lg font-semibold mb-4"
                      style={{ color: DARK_TEXT }}
                    >
                      Partager cet article
                    </h4>
                    <div className="flex gap-4">
                      {["facebook", "twitter", "linkedin", "instagram"].map(
                        (platform) => {
                          const Icon =
                            platform === "facebook"
                              ? Facebook
                              : platform === "twitter"
                                ? Twitter
                                : platform === "linkedin"
                                  ? Linkedin
                                  : Instagram;
                          const color =
                            platform === "facebook"
                              ? "#1877F2"
                              : platform === "twitter"
                                ? "#1DA1F2"
                                : platform === "linkedin"
                                  ? "#0A66C2"
                                  : "#E4405F";
                          return (
                            <a
                              key={platform}
                              href={
                                new ShareButton({
                                  platform,
                                  slug,
                                  title: blog.title,
                                }).props.href
                              } // Accessing URL from a temporary instance
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-3 rounded-full text-white shadow-md hover:opacity-90 transition-opacity"
                              style={{ backgroundColor: color }}
                            >
                              <Icon className="w-5 h-5" />
                            </a>
                          );
                        },
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Related Articles */}
            <div>
              <div className="sticky top-12">
                <h4
                  className="text-lg font-semibold mb-6"
                  style={{ color: ACCENT }}
                >
                  Plus de Récits d'Espoir et d'Impact
                </h4>{" "}
                {/* Enhanced Content */}
                <div className="space-y-6">
                  {relatedBlogs.map((post, idx) => (
                    <Link
                      href={`/blogs/${post.slug}`}
                      key={idx}
                      className="block"
                    >
                      <ContentCard
                        title={post.title}
                        excerpt={post.excerpt}
                        image={post.image}
                      />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </article>
      </Container>
    </main>
  );
}
