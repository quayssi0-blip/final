"use client";

import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// Custom hooks
import { useBlogs } from "@/hooks/useBlogs.js";
import { Calendar, User, Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import Container from "@/components/Container/Container";
import BlogHero from "@/components/BlogHero/BlogHero";

export default function BlogPost({ params }) {
  const { slug } = React.use(params);
  const { blogs: allBlogs, isLoading, isError } = useBlogs();

  // Find blog by slug
  const blog = allBlogs?.find((b) => b.slug === slug);

  if (!isLoading && !blog) {
    notFound();
  }

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="min-h-screen mt-10 flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erreur de chargement</p>
          <Link href="/blogs" className="text-blue-600 hover:underline">
            Retour aux articles
          </Link>
        </div>
      </main>
    );
  }

  // Get related blogs (same category, excluding current blog)
  const relatedBlogs = allBlogs?.filter((b) =>
    b.category === blog.category && b.slug !== slug
  ).slice(0, 3) || [];

  const handleShare = (platform) => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const title = blog.title;
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  return (
    <>
      {/* Blog Hero Section - Unique for individual blog pages */}
      <BlogHero
        title={blog.title}
        excerpt={blog.excerpt}
        image={blog.image}
        author={blog.author}
        category={blog.category}
        date={blog.created_at}
        tags={blog.tags ? blog.tags.split(',') : []}
        onBackUrl="/blogs"
      />
      
      {/* Main Content Below Hero */}
      <main className="bg-white min-h-screen">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <article className="w-full">
            {/* Blog Meta Information - simplified for better reading flow */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-gray-600 mb-12 pb-8 border-b border-gray-200">
              {blog.category && (
                <span className="px-3 py-1 bg-gray-100 rounded-full whitespace-nowrap">
                  {blog.category}
                </span>
              )}
              
              {blog.created_at && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <time dateTime={blog.created_at} className="whitespace-nowrap">
                    {new Date(blog.created_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </div>
              )}
              
              {blog.author && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 flex-shrink-0" />
                  <span className="whitespace-nowrap">{blog.author.name}</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="mb-8">
              <div
                className="prose prose-lg max-w-none prose-img:max-w-full prose-img:h-auto break-words overflow-hidden"
                dangerouslySetInnerHTML={{
                  __html: blog.content?.replace(/<p>/g, '<p class="mb-6 text-gray-800 leading-relaxed break-words overflow-hidden">') || ''
                }}
              />
            </div>

            {/* Tags */}
            {blog.tags && (
              <div className="mb-8 pb-8 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.split(',').map((tag, idx) => (
                    <Link
                      key={idx}
                      href={`/blogs?tag=${tag.trim()}`}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors"
                    >
                      {tag.trim()}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Share */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h3 className="text-sm font-semibold text-gray-900">Partager cet article</h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleShare('facebook')}
                    className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                    title="Partager sur Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="p-2 text-gray-600 hover:text-blue-400 transition-colors"
                    title="Partager sur Twitter"
                  >
                    <Twitter className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="p-2 text-gray-600 hover:text-blue-700 transition-colors"
                    title="Partager sur LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Author */}
            {blog.author && (
              <div className="mb-8 pb-8 border-b border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={blog.author.avatar || '/placeholder.svg?height=64&width=64'}
                      alt={blog.author.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 break-words">
                      {blog.author.name}
                    </h3>
                    {blog.author.role && (
                      <p className="text-sm text-gray-600 mb-2 break-words">
                        {blog.author.role}
                      </p>
                    )}
                    {blog.author.bio && (
                      <p className="text-sm text-gray-700 break-words">
                        {blog.author.bio}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Related Articles */}
            {relatedBlogs.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 break-words">
                  Articles similaires
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {relatedBlogs.map((post) => (
                    <Link
                      key={post.id}
                      href={`/blogs/${post.slug}`}
                      className="group block"
                    >
                      <article className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors">
                        {post.image && (
                          <div className="aspect-video bg-gray-100 overflow-hidden">
                            <Image
                              src={post.image}
                              alt={post.title}
                              width={300}
                              height={200}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors break-words">
                            {post.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2 break-words">
                            {post.excerpt}
                          </p>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </article>
        </div>
      </main>
    </>
  );
}
