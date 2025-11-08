import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

/**
 * Featured Post - Modern design inspired by the provided code
 */
const FeaturedPost = ({ post }) => {
  if (!post) return null;
  
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden group scroll-reveal mb-16 animate-pulse-gentle">
      <div className="md:flex">
        <div className="md:w-1/2">
          <div className="overflow-hidden image-hover">
            <Image
              src={post.image || "/placeholder.svg?height=800&width=1200"}
              alt={post.title}
              width={800}
              height={600}
              className="h-64 w-full object-cover md:h-full"
              priority
            />
          </div>
        </div>
        <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center">
          <div className="animate-scale-fade-in">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider category-filter-item">
              {post.category}
            </span>
          </div>
          <h1 className="mt-4 text-2xl md:text-3xl font-bold text-slate-900 leading-tight line-clamp-3 animate-slide-in-left">
            <Link
              href={`/blogs/${post.slug}`}
              className="hover:text-blue-600 transition-colors duration-300 text-reveal"
            >
              {post.title}
            </Link>
          </h1>
          <p className="mt-4 text-slate-600 text-lg animate-slide-in-right">
            {post.excerpt}
          </p>
          <Link
            href={`/blogs/${post.slug}`}
            className="mt-8 inline-flex items-center font-bold text-blue-600 group-hover:text-blue-800 transition-colors duration-300 btn-hover animate-scale-fade-in"
          >
            <span>Lire l'article complet</span>
            <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedPost;
